import { Request, Response } from 'express';

interface LTABusArrival {
  ServiceNo: string;
  Operator: string;
  NextBus: {
    OriginCode: string;
    DestinationCode: string;
    EstimatedArrival: string;
    Latitude: string;
    Longitude: string;
    VisitNumber: string;
    Load: 'SEA' | 'SDA' | 'LSD'; // Seats Available, Standing Available, Limited Standing
    Feature: string; // 'WAB' (Wheelchair Accessible Bus)
    Type: 'SD' | 'DD' | 'BD'; // Single Deck, Double Deck, Bendy
  };
  NextBus2?: {
    EstimatedArrival: string;
    Load: 'SEA' | 'SDA' | 'LSD';
    Feature: string;
    Type: 'SD' | 'DD' | 'BD';
  };
  NextBus3?: {
    EstimatedArrival: string;
    Load: 'SEA' | 'SDA' | 'LSD';
    Feature: string;
    Type: 'SD' | 'DD' | 'BD';
  };
}

export async function busArrivalHandler(req: Request, res: Response) {
  const busStopCode = (req.query.BusStopCode as string) || (req.query.busStopCode as string) || '04121';
  const serviceNo = (req.query.ServiceNo as string) || (req.query.serviceNo as string) || '';

  const accountKey = process.env.LTA_DATAMALL_API_KEY || process.env.LTA_ACCOUNT_KEY || '';

  // 1. If AccountKey is configured, query official LTA DataMall v3 API
  if (accountKey.trim()) {
    try {
      let targetUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
      if (serviceNo.trim()) {
        targetUrl += `&ServiceNo=${encodeURIComponent(serviceNo.trim())}`;
      }

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
          busStopCode,
          source: 'LTA DataMall v3 Live API',
          timestamp: new Date().toISOString(),
          ...data,
        });
      }

      console.warn(`[LTA API Warning] Status ${ltaResponse.status} ${ltaResponse.statusText}. Using structured fallback.`);
    } catch (err: any) {
      console.error('[LTA API Error]', err.message);
    }
  }

  // 2. Structured fallback if AccountKey is not yet supplied or API is unreachable
  const defaultServices = serviceNo ? [serviceNo] : ['7', '14', '16', '36', '77', '106', '111', '124', '147', '166', '174', '190'];
  const now = Date.now();

  const servicesPayload: LTABusArrival[] = defaultServices.map((svc) => {
    const seed = svc.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) + parseInt(busStopCode, 10);
    const min1 = (seed % 6) + 1;
    const min2 = min1 + (seed % 7) + 5;
    const min3 = min2 + 8;

    const loads: Array<'SEA' | 'SDA' | 'LSD'> = ['SEA', 'SDA', 'LSD'];
    const load1 = loads[seed % 3];
    const load2 = loads[(seed + 1) % 3];
    const load3 = loads[(seed + 2) % 3];

    const types: Array<'SD' | 'DD' | 'BD'> = ['DD', 'SD', 'DD'];
    const type1 = types[seed % 3];

    return {
      ServiceNo: svc,
      Operator: 'SBST',
      NextBus: {
        OriginCode: '04121',
        DestinationCode: '16189',
        EstimatedArrival: new Date(now + min1 * 60 * 1000).toISOString(),
        Latitude: '1.2963',
        Longitude: '103.8502',
        VisitNumber: '1',
        Load: load1,
        Feature: 'WAB',
        Type: type1,
      },
      NextBus2: {
        EstimatedArrival: new Date(now + min2 * 60 * 1000).toISOString(),
        Load: load2,
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus3: {
        EstimatedArrival: new Date(now + min3 * 60 * 1000).toISOString(),
        Load: load3,
        Feature: 'WAB',
        Type: 'SD',
      },
    };
  });

  return res.json({
    isLive: false,
    busStopCode,
    source: 'Structured Simulation (Configure LTA_DATAMALL_API_KEY in .env to enable live LTA v3 feed)',
    accountKeyConfigured: Boolean(accountKey.trim()),
    timestamp: new Date().toISOString(),
    Services: servicesPayload,
  });
}
