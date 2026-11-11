import { Request, Response } from 'express';
import { BUS_STOPS } from '../src/data/singaporeTransitData';

export async function busStopsHandler(req: Request, res: Response) {
  const skip = parseInt((req.query.$skip as string) || (req.query.skip as string) || '0', 10);
  const busStopCode = (req.query.BusStopCode as string) || '';

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
        return res.json({
          isLive: true,
          source: 'LTA DataMall BusStops API',
          skip,
          ...data,
        });
      }

      console.warn(`[LTA BusStops Warning] Status ${ltaResponse.status}. Using fallback stops.`);
    } catch (err: any) {
      console.error('[LTA BusStops Error]', err.message);
    }
  }

  // 2. Structured fallback if AccountKey is not set
  let results = BUS_STOPS.map((s) => ({
    BusStopCode: s.code,
    RoadName: s.road,
    Description: s.name,
    Latitude: s.coordinates[0],
    Longitude: s.coordinates[1],
  }));

  if (busStopCode.trim()) {
    results = results.filter((s) => s.BusStopCode === busStopCode.trim());
  }

  return res.json({
    isLive: false,
    source: 'Local Singapore Bus Stops Registry (Configure LTA_DATAMALL_API_KEY for live feed)',
    accountKeyConfigured: Boolean(accountKey.trim()),
    value: results,
  });
}
