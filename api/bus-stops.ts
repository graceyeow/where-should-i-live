// Serverless LTA Bus Stops Handler for Vercel and Express

const DEFAULT_STOPS = [
  { BusStopCode: '04121', RoadName: 'Bras Basah Rd', Description: 'SMU (Bras Basah Rd)', Latitude: 1.2963, Longitude: 103.8502 },
  { BusStopCode: '04179', RoadName: 'Stamford Rd', Description: 'Opp SMU (Stamford Rd)', Latitude: 1.2954, Longitude: 103.8508 },
  { BusStopCode: '03019', RoadName: 'Cecil St', Description: 'Raffles Place Stn Exit F', Latitude: 1.2838, Longitude: 103.8515 },
  { BusStopCode: '03509', RoadName: 'Marina Blvd', Description: 'Marina Bay Financial Ctr', Latitude: 1.2792, Longitude: 103.8545 },
  { BusStopCode: '18079', RoadName: 'Fusionopolis Way', Description: 'one-north Stn Exit A', Latitude: 1.2996, Longitude: 103.7874 },
  { BusStopCode: '16189', RoadName: 'Kent Ridge Cres', Description: 'NUS Central Library', Latitude: 1.2966, Longitude: 103.7764 },
  { BusStopCode: '54009', RoadName: 'AMK Ave 8', Description: 'Ang Mo Kio Int', Latitude: 1.3698, Longitude: 103.8496 },
  { BusStopCode: '84009', RoadName: 'Bedok North Ave 1', Description: 'Bedok Int', Latitude: 1.3241, Longitude: 103.9298 },
  { BusStopCode: '53009', RoadName: 'Bishan Pl', Description: 'Bishan Int', Latitude: 1.3508, Longitude: 103.8497 },
  { BusStopCode: '43009', RoadName: 'Bt Batok Ctrl', Description: 'Bukit Batok Int', Latitude: 1.3495, Longitude: 103.7495 },
  { BusStopCode: '10009', RoadName: 'Bt Merah Ctrl', Description: 'Bt Merah Int', Latitude: 1.2825, Longitude: 103.8174 },
  { BusStopCode: '44009', RoadName: 'Jelebu Rd', Description: 'Bt Panjang Int', Latitude: 1.3789, Longitude: 103.7634 },
  { BusStopCode: '42009', RoadName: 'Choa Chu Kang Loop', Description: 'Choa Chu Kang Int', Latitude: 1.3853, Longitude: 103.7444 },
  { BusStopCode: '17009', RoadName: 'Clementi Ave 3', Description: 'Clementi Int', Latitude: 1.3150, Longitude: 103.7650 },
  { BusStopCode: '64009', RoadName: 'Hougang Ctrl', Description: 'Hougang Central Int', Latitude: 1.3719, Longitude: 103.8929 },
  { BusStopCode: '28009', RoadName: 'Jurong Gateway Rd', Description: 'Jurong East Int / JEM', Latitude: 1.3338, Longitude: 103.7428 },
  { BusStopCode: '22009', RoadName: 'Jurong West Ctrl 3', Description: 'Boon Lay Int', Latitude: 1.3392, Longitude: 103.7056 },
  { BusStopCode: '77009', RoadName: 'Pasir Ris Dr 3', Description: 'Pasir Ris Int', Latitude: 1.3725, Longitude: 103.9493 },
  { BusStopCode: '65009', RoadName: 'Punggol Pl', Description: 'Punggol Temp Int', Latitude: 1.4039, Longitude: 103.9022 },
  { BusStopCode: '58009', RoadName: 'Sembawang Vista', Description: 'Sembawang Int', Latitude: 1.4478, Longitude: 103.8202 },
  { BusStopCode: '67009', RoadName: 'Compassvale Rd', Description: 'Compassvale Int', Latitude: 1.3934, Longitude: 103.8978 },
  { BusStopCode: '66009', RoadName: 'Serangoon Ave 2', Description: 'Serangoon Int', Latitude: 1.3503, Longitude: 103.8735 },
  { BusStopCode: '75009', RoadName: 'Tampines Ctrl 1', Description: 'Tampines Int', Latitude: 1.3533, Longitude: 103.9452 },
  { BusStopCode: '52009', RoadName: 'Lor 2 Toa Payoh', Description: 'Toa Payoh Int', Latitude: 1.3328, Longitude: 103.8475 },
  { BusStopCode: '46009', RoadName: 'Woodlands Sq', Description: 'Woodlands Int', Latitude: 1.4369, Longitude: 103.7865 },
  { BusStopCode: '59009', RoadName: 'Yishun Ave 2', Description: 'Yishun Int', Latitude: 1.4294, Longitude: 103.8350 },
];

export default async function handler(req: any, res: any) {
  try {
    const url = new URL(req.url || '', `http://${req.headers?.host || 'localhost'}`);
    const skip = parseInt(
      req.query?.$skip || req.query?.skip || url.searchParams.get('$skip') || url.searchParams.get('skip') || '0',
      10
    );
    const busStopCode =
      req.query?.BusStopCode || req.query?.busStopCode || url.searchParams.get('BusStopCode') || '';

    const accountKey = process.env.LTA_DATAMALL_API_KEY || process.env.LTA_ACCOUNT_KEY || '';

    // 1. If AccountKey is configured, query official LTA DataMall BusStops endpoint
    if (accountKey.trim()) {
      try {
        const targetUrl = `https://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${skip}`;
        const ltaResponse = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            AccountKey: accountKey.trim(),
            accept: 'application/json',
          },
        });

        if (ltaResponse.ok) {
          const data = await ltaResponse.json();
          return sendJson(res, 200, {
            isLive: true,
            source: 'LTA DataMall BusStops API',
            skip,
            ...data,
          });
        }
      } catch (err: any) {
        console.warn('[LTA BusStops Notice]', err?.message);
      }
    }

    // 2. Self-contained fallback
    let results = DEFAULT_STOPS;
    if (busStopCode.trim()) {
      results = results.filter((s) => s.BusStopCode === busStopCode.trim());
    }

    return sendJson(res, 200, {
      isLive: false,
      source: 'Local Singapore Bus Stops Registry (Configure LTA_DATAMALL_API_KEY in Vercel for live feed)',
      accountKeyConfigured: Boolean(accountKey.trim()),
      value: results,
    });
  } catch (globalErr: any) {
    return sendJson(res, 500, {
      error: 'Failed to process bus stops request',
      message: globalErr?.message || 'Unknown error',
    });
  }
}

function sendJson(res: any, status: number, data: any) {
  if (typeof res.json === 'function') {
    return res.status(status).json(data);
  } else {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(data));
  }
}

export { handler as busStopsHandler };
