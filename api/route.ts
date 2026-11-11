import { Request, Response } from 'express';

export async function routeHandler(req: Request, res: Response) {
  const start = (req.query.start as string) || '1.320981,103.844150';
  const end = (req.query.end as string) || '1.326762,103.8559';
  const routeType = ((req.query.routeType as string) || 'walk').toLowerCase();

  const validTypes = ['walk', 'drive', 'cycle', 'pt'];
  const sanitizedType = validTypes.includes(routeType) ? routeType : 'walk';

  const oneMapToken = process.env.ONEMAP_API_TOKEN || '';

  // 1. If OneMap API token is configured, call official OneMap routing service
  if (oneMapToken.trim()) {
    try {
      const targetUrl = `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&routeType=${encodeURIComponent(sanitizedType)}`;
      const headers: Record<string, string> = {
        accept: 'application/json',
      };

      // Add Authorization token if bearer or raw token
      headers['Authorization'] = oneMapToken.startsWith('Bearer ') ? oneMapToken : `Bearer ${oneMapToken}`;

      const omResponse = await fetch(targetUrl, {
        method: 'GET',
        headers,
      });

      if (omResponse.ok) {
        const data = await omResponse.json();
        return res.json({
          isLive: true,
          source: 'OneMap Public Routing Service',
          start,
          end,
          routeType: sanitizedType,
          ...data,
        });
      }

      console.warn(`[OneMap Routing Warning] Status ${omResponse.status}. Using geometric estimation fallback.`);
    } catch (err: any) {
      console.error('[OneMap Routing Error]', err.message);
    }
  }

  // 2. Structured fallback if OneMap token is not set
  const [startLat, startLng] = start.split(',').map((v) => parseFloat(v) || 0);
  const [endLat, endLng] = end.split(',').map((v) => parseFloat(v) || 0);

  // Haversine approx distance
  const dLat = (endLat - startLat) * (Math.PI / 180);
  const dLon = (endLng - startLng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(startLat * (Math.PI / 180)) *
      Math.cos(endLat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distKm = Math.max(0.2, Math.round(6371 * c * 1.25 * 100) / 100);

  let speedKmH = 4.5; // Walking speed
  if (sanitizedType === 'cycle') speedKmH = 15;
  else if (sanitizedType === 'drive') speedKmH = 35;
  else if (sanitizedType === 'pt') speedKmH = 22;

  const durationMins = Math.max(2, Math.round((distKm / speedKmH) * 60));

  return res.json({
    isLive: false,
    source: 'Geometric Transit Estimator (Configure ONEMAP_API_TOKEN for live OneMap route geometry)',
    tokenConfigured: Boolean(oneMapToken.trim()),
    route_geometry: '',
    status: 0,
    route_status: 'fallback_estimate',
    route_summary: {
      start_point: [startLat, startLng],
      end_point: [endLat, endLng],
      total_distance: Math.round(distKm * 1000), // meters
      total_time: durationMins * 60, // seconds
      route_name: `${sanitizedType.toUpperCase()} route (${distKm} km)`,
    },
  });
}
