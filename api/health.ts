import { Request, Response } from 'express';

const startTime = Date.now();

export function healthHandler(req: Request, res: Response) {
  const ltaKey = process.env.LTA_DATAMALL_API_KEY || process.env.LTA_ACCOUNT_KEY || '';
  const oneMapToken = process.env.ONEMAP_API_TOKEN || '';

  res.json({
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
          busArrival: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode={code}',
          busStops: 'https://datamall2.mytransport.sg/ltaodataservice/BusStops',
        },
      },
      oneMap: {
        configured: Boolean(oneMapToken.trim()),
        tokenPresent: Boolean(oneMapToken.trim()),
        endpoints: {
          routing: 'https://www.onemap.gov.sg/api/public/routingsvc/route?start={lat,lng}&end={lat,lng}&routeType={walk|drive|cycle|pt}',
        },
      },
    },
  });
}
