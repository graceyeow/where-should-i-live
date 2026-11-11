// Serverless Health Check Handler for Vercel and Express

const startTime = Date.now();

export default function handler(req: any, res: any) {
  const ltaKey = process.env.LTA_DATAMALL_API_KEY || process.env.LTA_ACCOUNT_KEY || '';
  const oneMapToken = process.env.ONEMAP_API_TOKEN || '';

  const payload = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round((Date.now() - startTime) / 1000),
    service: 'Singapore HDB Affordability & Live Transport API',
    integrations: {
      ltaDataMall: {
        configured: Boolean(ltaKey.trim()),
        accountKeyPresent: Boolean(ltaKey.trim()),
        version: 'v3',
        endpoints: {
          busArrival: '/api/bus-arrival?BusStopCode={code}',
          busStops: '/api/bus-stops',
        },
      },
      oneMap: {
        configured: Boolean(oneMapToken.trim()),
        tokenPresent: Boolean(oneMapToken.trim()),
        endpoints: {
          routing: '/api/route?start={lat,lng}&end={lat,lng}&routeType={walk|drive|cycle|pt}',
        },
      },
    },
  };

  if (typeof res.json === 'function') {
    return res.status(200).json(payload);
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(payload));
  }
}

export { handler as healthHandler };
