import { Router } from 'express';
import { healthHandler } from './health';
import { busArrivalHandler } from './bus-arrival';
import { busStopsHandler } from './bus-stops';
import { routeHandler } from './route';

// 1. Express Router instance for local / server.ts dev server
const apiRouter = Router();

apiRouter.get('/health', healthHandler);
apiRouter.get('/bus-arrival', busArrivalHandler);
apiRouter.get('/bus-stops', busStopsHandler);
apiRouter.get('/route', routeHandler);
apiRouter.get('/onemap-route', routeHandler);

// 2. Default export handler for Vercel Serverless Functions when hitting /api directly
export default function handler(req: any, res: any) {
  const payload = {
    service: 'Singapore HDB Affordability & Bus Transport API',
    status: 'online',
    endpoints: [
      { path: '/api/health', method: 'GET', description: 'API health and integration status' },
      { path: '/api/bus-arrival', method: 'GET', description: 'Next buses arrival from LTA DataMall v3' },
      { path: '/api/bus-stops', method: 'GET', description: 'Bus stops metadata from LTA DataMall' },
      { path: '/api/route', method: 'GET', description: 'OneMap public routing service' },
    ],
  };

  if (typeof res.json === 'function') {
    return res.status(200).json(payload);
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(payload));
  }
}

export { apiRouter };
