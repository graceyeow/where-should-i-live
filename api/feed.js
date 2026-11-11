import { fetchBusArrivals, getSimulatedBusServices, STOP_04121_SERVICES } from './bus.js';
import { getDefaultHdbReading } from '../src/data/hdbService.ts';

/**
 * Escapes &, <, > and quotes for safe XML inclusion
 */
export function escapeXml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Computes Singapore time (UTC+8) and quarter-hour rounded stamps
 */
export function getSingaporeTimeDetails(date = new Date()) {
  const SGT_OFFSET_MS = 8 * 60 * 60 * 1000;
  const utcMs = date.getTime();
  const sgtDate = new Date(utcMs + SGT_OFFSET_MS);

  const year = sgtDate.getUTCFullYear();
  const month = String(sgtDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(sgtDate.getUTCDate()).padStart(2, '0');
  const hours = String(sgtDate.getUTCHours()).padStart(2, '0');
  const minutes = sgtDate.getUTCMinutes();
  const roundedMinutesNum = Math.floor(minutes / 15) * 15;
  const roundedMinutes = String(roundedMinutesNum).padStart(2, '0');

  // Rounded down to quarter hour in UTC+8: e.g. "2026-11-11T14:15+08:00"
  const roundedIso = `${year}-${month}-${day}T${hours}:${roundedMinutes}+08:00`;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const sgtDayIndex = sgtDate.getUTCDay();
  const monthName = months[sgtDate.getUTCMonth()];
  // RFC 822 format: e.g. "Wed, 11 Nov 2026 14:15:00 +0800"
  const rfc822 = `${days[sgtDayIndex]}, ${day} ${monthName} ${year} ${hours}:${roundedMinutes}:00 +0800`;

  const currentSeconds = String(sgtDate.getUTCSeconds()).padStart(2, '0');
  const currentMinutes = String(minutes).padStart(2, '0');
  const readingTimeSgt = `${year}-${month}-${day} ${hours}:${currentMinutes}:${currentSeconds} SGT (UTC+8)`;

  return {
    roundedIso,
    rfc822,
    readingTimeSgt,
    guid: `g6-hdb-${roundedIso}`,
  };
}

/**
 * Builds the site address from request Host and protocol headers
 * Never fetches the site's own address from inside the function
 */
export function getSiteAddress(req) {
  const host =
    req.headers?.['x-forwarded-host'] ||
    req.headers?.host ||
    process.env.APP_URL?.replace(/^https?:\/\//, '') ||
    'localhost:3000';

  const rawProto = req.headers?.['x-forwarded-proto'];
  const proto = rawProto
    ? String(rawProto).split(',')[0].trim()
    : host.startsWith('localhost') || host.startsWith('127.0.0.1')
    ? 'http'
    : 'https';

  return `${proto}://${host}`;
}

/**
 * Serverless & Express handler for GET /api/feed
 * Produces an RSS 2.0 feed of the app's own live reading for Zapier
 */
export default async function feedHandler(req, res) {
  try {
    const timeDetails = getSingaporeTimeDetails();
    const siteUrl = getSiteAddress(req);

    // 1. Fetch HDB affordability data from shared module
    let hdbReading;
    let hdbCheckFailed = null;
    try {
      hdbReading = getDefaultHdbReading();
    } catch (err) {
      hdbCheckFailed = {
        source: 'Data.gov.sg Collection 189',
        statusCode: 500,
      };
    }

    // 2. Fetch Bus Arrival data from LTA DataMall v3 stop 04121
    const busResult = await fetchBusArrivals('04121');

    // Check for source failure or missing API key
    let sourceCheckFailed = hdbCheckFailed;
    if (!sourceCheckFailed && !busResult.success) {
      // Missing API key or LTA HTTP error
      sourceCheckFailed = {
        source: busResult.source || 'LTA DataMall',
        statusCode: busResult.statusCode || 401,
      };
    }

    // Check if simulation preview is explicitly requested via query parameter
    const urlObj = new URL(req.url || '', siteUrl);
    const forceSimulate =
      urlObj.searchParams.get('simulate') === 'true' ||
      urlObj.searchParams.get('mock') === 'true';

    // Services data to display
    const services =
      busResult.isLive && Array.isArray(busResult.services) && busResult.services.length > 0
        ? busResult.services
        : busResult.fallbackServices || getSimulatedBusServices('04121');

    // Earliest arriving bus at stop 04121
    const sortedServices = [...services].sort((a, b) => (a.nextBusMins ?? 999) - (b.nextBusMins ?? 999));
    const earliestBus = sortedServices[0] || { serviceNo: '7', nextBusMins: 4 };

    // 3. Format Title according to Requirement 3 & Requirement 6
    let itemTitle = '';
    if (sourceCheckFailed && !forceSimulate) {
      // Requirement 6: "The item title then starts with 'Check failed:' and names the source and its HTTP status"
      itemTitle = `Check failed: ${sourceCheckFailed.source} ${sourceCheckFailed.statusCode}`;
    } else {
      // Requirement 3: "S$650,000 buys Woodlands, Jurong West, Yishun; bus 7 in 4 min"
      const topTownsStr = hdbReading?.topAffordableTowns
        ?.map((t) => t.name)
        .join(', ') || 'Woodlands, Jurong West, Yishun';

      const budgetStr = hdbReading?.formattedBudget || 'S$703,000';
      itemTitle = `${budgetStr} buys ${topTownsStr}; bus ${earliestBus.serviceNo} in ${earliestBus.nextBusMins} min`;
    }

    // 4. Format Description (plain text only, no HTML)
    const budgetSection = `Default budget: ${hdbReading?.formattedBudget || 'S$703,000'} (Targeting ${hdbReading?.flatType || '4-Room'} flat, Income: S$8,500/mo, Cash: S$60,000, CPF OA: S$80,000)`;

    const townsSectionHeader = `\nHDB Resale Prices (${hdbReading?.dataSource || 'Data.gov.sg Collection 189'} - Month: ${hdbReading?.dataMonth || '2026-02'}):`;
    const townsLines = (hdbReading?.affordableTowns || [])
      .map((t) => `- ${t.name}: ${t.formattedPrice} (Month: ${t.month})`)
      .join('\n');

    const busSectionHeader = `\nBus Stop 04121 (SMU - Bras Basah Rd) next 2 arrivals per service:`;
    const busLines = services
      .map((s) => {
        const next1Str = s.nextBusMins !== null && s.nextBusMins !== 999 ? `${s.nextBusMins} min` : 'N/A';
        const next2Str = s.nextBus2Mins !== null && s.nextBus2Mins !== undefined ? `${s.nextBus2Mins} min` : 'N/A';
        return `- Bus ${s.serviceNo}: Next in ${next1Str}, 2nd in ${next2Str}`;
      })
      .join('\n');

    const readingTimeSection = `\nReading time: ${timeDetails.readingTimeSgt}`;

    const plainTextDescription = `${budgetSection}\n${townsSectionHeader}\n${townsLines}\n${busSectionHeader}\n${busLines}\n${readingTimeSection}`;

    // Item link changes only when the guid changes (rounded quarter-hour time)
    const itemLink = `${siteUrl}?reading=${timeDetails.roundedIso}`;

    // 5. Build RSS 2.0 XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml('Where should I live? Singapore HDB Affordability')}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml('Live Singapore HDB affordability and bus arrival feed for stop 04121')}</description>
    <lastBuildDate>${escapeXml(timeDetails.rfc822)}</lastBuildDate>
    <item>
      <title>${escapeXml(itemTitle)}</title>
      <description>${escapeXml(plainTextDescription)}</description>
      <link>${escapeXml(itemLink)}</link>
      <guid isPermaLink="false">${escapeXml(timeDetails.guid)}</guid>
      <pubDate>${escapeXml(timeDetails.rfc822)}</pubDate>
    </item>
  </channel>
</rss>`;

    // Set Required Response Headers
    res.statusCode = 200;
    if (typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');
    }

    if (typeof res.send === 'function') {
      return res.send(rssXml);
    } else {
      return res.end(rssXml);
    }
  } catch (err) {
    // If unexpected internal error occurs, still answer 200 with valid RSS
    const fallbackTime = getSingaporeTimeDetails();
    const siteUrl = getSiteAddress(req);
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml('Where should I live? Singapore HDB Affordability')}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml('Live Singapore HDB affordability feed')}</description>
    <lastBuildDate>${escapeXml(fallbackTime.rfc822)}</lastBuildDate>
    <item>
      <title>${escapeXml('Check failed: Internal Server 500')}</title>
      <description>${escapeXml('Error reading live data feed')}</description>
      <link>${escapeXml(`${siteUrl}?reading=${fallbackTime.roundedIso}`)}</link>
      <guid isPermaLink="false">${escapeXml(fallbackTime.guid)}</guid>
      <pubDate>${escapeXml(fallbackTime.rfc822)}</pubDate>
    </item>
  </channel>
</rss>`;

    res.statusCode = 200;
    if (typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');
    }
    return res.end(errorXml);
  }
}
