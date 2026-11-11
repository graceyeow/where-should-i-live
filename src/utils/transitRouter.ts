import { TransitJourneyPlan, TransitRouteStep } from '../types/hdb';
import { HDB_TOWNS_DATA } from '../data/hdbResaleData';
import { LANDMARK_DESTINATIONS, BUS_ROUTES, BUS_STOPS } from '../data/singaporeTransitData';

/**
 * Plans a journey from an origin HDB town or bus stop to a landmark destination
 * based on selected departure time
 */
export function planTransitJourney(
  originTownId: string,
  destinationId: string,
  departureTimeStr: string = '08:15'
): TransitJourneyPlan {
  const originTown = HDB_TOWNS_DATA.find(t => t.id === originTownId) || HDB_TOWNS_DATA[0];
  const dest =
    LANDMARK_DESTINATIONS.find(d => d.id === destinationId) ||
    LANDMARK_DESTINATIONS[0]; // Default to SMU

  // Parse time
  const [hourStr, minStr] = departureTimeStr.split(':');
  const hour = parseInt(hourStr || '8', 10);
  const min = parseInt(minStr || '15', 10);

  const isPeak = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20);
  const isNight = hour >= 23 || hour < 6;

  // Base travel minutes calculation tailored to landmark
  let baseMinutes = 26;
  if (dest.id.startsWith('smu')) {
    // SMU is centrally situated on Bras Basah Rd / Stamford Rd with direct bus express corridors
    baseMinutes = Math.max(12, Math.round(originTown.commuteTimeToRafflesPlaceMins * 0.9));
  } else if (dest.id.startsWith('nus') || dest.id === 'sp-dover') {
    baseMinutes = originTown.region === 'West'
      ? 12
      : Math.min(55, Math.round(originTown.commuteTimeToJurongEastMins * 0.8 + 15));
  } else if (dest.id.startsWith('ntu')) {
    baseMinutes = originTown.region === 'West'
      ? 16
      : Math.min(65, Math.round(originTown.commuteTimeToJurongEastMins + 20));
  } else if (dest.id.startsWith('sutd') || dest.id.includes('changi')) {
    baseMinutes = originTown.commuteTimeToChangiMins;
  } else if (dest.id.includes('biopolis') || dest.id.includes('fusionopolis')) {
    baseMinutes = Math.max(14, Math.round(originTown.commuteTimeToRafflesPlaceMins * 0.85));
  } else if (dest.id.includes('marina-bay') || dest.id.includes('raffles-place') || dest.id.includes('capitaspring')) {
    baseMinutes = originTown.commuteTimeToRafflesPlaceMins;
  } else if (dest.id.includes('jem') || dest.id.includes('westgate')) {
    baseMinutes = originTown.commuteTimeToJurongEastMins;
  } else if (dest.id.includes('sgh')) {
    baseMinutes = Math.max(10, Math.round(originTown.commuteTimeToRafflesPlaceMins * 0.95));
  } else if (dest.id.includes('ttsh')) {
    baseMinutes = Math.max(12, Math.round(originTown.commuteTimeToRafflesPlaceMins * 0.8));
  } else if (dest.id.includes('orchard')) {
    baseMinutes = Math.max(14, Math.round(originTown.commuteTimeToRafflesPlaceMins * 0.9));
  } else if (dest.id.includes('paya-lebar')) {
    baseMinutes = Math.max(12, Math.round(originTown.commuteTimeToChangiMins * 0.7));
  }

  // Traffic multiplier based on departure time
  const trafficMultiplier = isNight ? 0.85 : isPeak ? 1.18 : 1.0;
  const transitRideMins = Math.round(baseMinutes * trafficMultiplier);

  // Available buses from this town connecting to destination
  const townBuses = originTown.nearbyBusServices;
  const directMatch = dest.popularBusServices.find(b => townBuses.includes(b));
  const chosenBus = directMatch || townBuses[0] || '190';

  // Headway at departure time
  const waitMins = isNight ? 14 : isPeak ? 4 : 8;

  // Format timestamp helper
  const addMinutes = (startH: number, startM: number, addM: number): string => {
    let totalM = startH * 60 + startM + addM;
    const h = Math.floor(totalM / 60) % 24;
    const m = totalM % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const departFormatted = addMinutes(hour, min, 0);
  const boardTime = addMinutes(hour, min, 5 + waitMins);
  const alightingTime = addMinutes(hour, min, 5 + waitMins + transitRideMins);
  const finalArrivalTime = addMinutes(hour, min, 5 + waitMins + transitRideMins + 2);

  const steps: TransitRouteStep[] = [
    {
      mode: 'walk',
      from: `${originTown.name} Estate`,
      to: originTown.majorBusInterchange,
      durationMins: 5,
      departureTime: departFormatted,
      arrivalTime: addMinutes(hour, min, 5),
      instructions: `Walk ~350m along sheltered linkway to ${originTown.majorBusInterchange}`,
    },
    {
      mode: 'bus',
      serviceOrLine: `Bus ${chosenBus}`,
      from: originTown.majorBusInterchange,
      to: `Bus Stop #${dest.busStopCode} (${dest.busStopName})`,
      durationMins: transitRideMins,
      stopsCount: Math.max(5, Math.round(transitRideMins / 2.3)),
      headwayMins: waitMins,
      departureTime: boardTime,
      arrivalTime: alightingTime,
      instructions: `Board Bus ${chosenBus} (Departs in ~${waitMins} min). Ride ${Math.max(5, Math.round(transitRideMins / 2.3))} stops directly along express corridor to Bus Stop #${dest.busStopCode} on ${dest.road}.`,
    },
    {
      mode: 'walk',
      from: `Bus Stop #${dest.busStopCode} (${dest.busStopName})`,
      to: `${dest.name} (${dest.landmark})`,
      durationMins: 2,
      departureTime: alightingTime,
      arrivalTime: finalArrivalTime,
      instructions: `Alight at Bus Stop #${dest.busStopCode} and walk 90m directly into ${dest.landmark}`,
    },
  ];

  const totalDuration = 5 + waitMins + transitRideMins + 2;
  const fare = Math.min(2.37, Math.max(1.09, 0.99 + (totalDuration * 0.024)));

  return {
    originName: originTown.name,
    destinationName: dest.name,
    destinationLandmark: dest.landmark,
    destinationBusStopCode: dest.busStopCode,
    destinationBusStopName: dest.busStopName,
    departureTime: departFormatted,
    totalDurationMins: totalDuration,
    totalWalkTimeMins: 7,
    fareEstimate: Math.round(fare * 100) / 100,
    steps,
    primaryBusServices: [chosenBus, ...townBuses.filter(b => b !== chosenBus).slice(0, 3)],
    co2SavingsKg: Math.round((transitRideMins * 0.08) * 10) / 10,
  };
}

export function formatSGD(amount: number): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    maximumFractionDigits: 0,
  }).format(amount);
}
