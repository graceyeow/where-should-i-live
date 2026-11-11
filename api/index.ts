import { Router } from 'express';
import { healthHandler } from './health';
import { busArrivalHandler } from './bus-arrival';
import { busStopsHandler } from './bus-stops';
import { routeHandler } from './route';

const apiRouter = Router();

// 1. Health check endpoint (/api/health)
apiRouter.get('/health', healthHandler);

// 2. Next buses at a stop (/api/bus-arrival?BusStopCode=04121&ServiceNo=15)
apiRouter.get('/bus-arrival', busArrivalHandler);

// 3. Bus Stop information (/api/bus-stops)
apiRouter.get('/bus-stops', busStopsHandler);

// 4. Routing walk | drive | cycle | pt (/api/route?start=...&end=...&routeType=walk)
apiRouter.get('/route', routeHandler);
apiRouter.get('/onemap-route', routeHandler);

export { apiRouter };
export default apiRouter;
