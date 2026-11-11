import React, { useState, useMemo, useEffect } from 'react';
import { TownData, DestinationCategory } from '../types/hdb';
import { HDB_TOWNS_DATA } from '../data/hdbResaleData';
import {
  LANDMARK_DESTINATIONS,
  DESTINATION_CATEGORIES,
  getSimulatedArrivals,
} from '../data/singaporeTransitData';
import { planTransitJourney, formatSGD } from '../utils/transitRouter';
import {
  Clock,
  Bus,
  Navigation,
  ArrowRight,
  MapPin,
  Calendar,
  Footprints,
  ShieldAlert,
  Zap,
  Leaf,
  Timer,
  CheckCircle2,
  Building2,
  GraduationCap,
  Briefcase,
  Hospital,
  ShoppingBag,
  Search,
  Server,
  RefreshCw,
  Code,
  Terminal,
} from 'lucide-react';

interface TransportTimingsPlannerProps {
  selectedTown: TownData | null;
  onSelectTown: (town: TownData) => void;
  selectedLandmarkId?: string;
  onSelectLandmark?: (id: string) => void;
}

export const TransportTimingsPlanner: React.FC<TransportTimingsPlannerProps> = ({
  selectedTown,
  onSelectTown,
  selectedLandmarkId = 'smu-bras-basah',
  onSelectLandmark,
}) => {
  const [originTownId, setOriginTownId] = useState<string>(selectedTown ? selectedTown.id : 'tampines');
  // Default to SMU (Singapore Management University)
  const [destinationId, setDestinationId] = useState<string>(selectedLandmarkId);
  const [departureTime, setDepartureTime] = useState<string>('08:15');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stopViewMode, setStopViewMode] = useState<'destination' | 'origin'>('destination');
  const [showApiConsole, setShowApiConsole] = useState<boolean>(false);

  // Live API response state
  const [liveApiData, setLiveApiData] = useState<any>(null);
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  const [apiConsoleEndpoint, setApiConsoleEndpoint] = useState<string>('/api/bus-arrival?BusStopCode=04121');
  const [apiConsoleResponse, setApiConsoleResponse] = useState<string>('');

  // Keep synced if user selects a landmark from map or elsewhere
  useEffect(() => {
    if (selectedLandmarkId && selectedLandmarkId !== destinationId) {
      setDestinationId(selectedLandmarkId);
    }
  }, [selectedLandmarkId]);

  // Keep synced if user selects a town from the map
  useEffect(() => {
    if (selectedTown && selectedTown.id !== originTownId) {
      setOriginTownId(selectedTown.id);
    }
  }, [selectedTown]);

  const handleDestinationChange = (id: string) => {
    setDestinationId(id);
    if (onSelectLandmark) {
      onSelectLandmark(id);
    }
  };

  const currentOriginTown = useMemo(() => {
    return HDB_TOWNS_DATA.find((t) => t.id === originTownId) || HDB_TOWNS_DATA[0];
  }, [originTownId]);

  const currentDestination = useMemo(() => {
    return LANDMARK_DESTINATIONS.find((d) => d.id === destinationId) || LANDMARK_DESTINATIONS[0];
  }, [destinationId]);

  // Calculate transit route
  const journeyPlan = useMemo(() => {
    return planTransitJourney(originTownId, destinationId, departureTime);
  }, [originTownId, destinationId, departureTime]);

  // Active target bus stop code based on toggle
  const activeBusStopCode = stopViewMode === 'destination' ? currentDestination.busStopCode : '75009';
  const activeBusStopLabel =
    stopViewMode === 'destination'
      ? `${currentDestination.name} (Stop #${currentDestination.busStopCode})`
      : `${currentOriginTown.majorBusInterchange}`;

  // Fetch live bus arrivals from our serverless /api/bus-arrival endpoint
  const fetchLiveArrivals = async () => {
    setIsApiLoading(true);
    try {
      const res = await fetch(`/api/bus-arrival?BusStopCode=${activeBusStopCode}`);
      if (res.ok) {
        const data = await res.json();
        setLiveApiData(data);
      }
    } catch (e) {
      console.warn('API fetch warning, using fallback data:', e);
    } finally {
      setIsApiLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveArrivals();
    const interval = setInterval(fetchLiveArrivals, 20000); // 20-second LTA refresh interval
    return () => clearInterval(interval);
  }, [activeBusStopCode]);

  // Function to run API tester query
  const testApiEndpoint = async (endpoint: string) => {
    setApiConsoleEndpoint(endpoint);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setApiConsoleResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiConsoleResponse(JSON.stringify({ error: err.message }, null, 2));
    }
  };

  const handleOriginChange = (id: string) => {
    setOriginTownId(id);
    const matched = HDB_TOWNS_DATA.find((t) => t.id === id);
    if (matched) {
      onSelectTown(matched);
    }
  };

  const getCategoryIcon = (category: DestinationCategory) => {
    switch (category) {
      case 'Universities & Education':
        return <GraduationCap className="w-3.5 h-3.5 text-amber-500" />;
      case 'CBD & Commercial Towers':
        return <Briefcase className="w-3.5 h-3.5 text-sky-500" />;
      case 'Tech, Science & Innovation':
        return <Zap className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Hospitals & Medical':
        return <Hospital className="w-3.5 h-3.5 text-rose-500" />;
      case 'Transport Hubs & Retail':
        return <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  // Compute minutes from an ISO arrival string
  const getMinutesUntil = (isoDateStr?: string): number => {
    if (!isoDateStr) return 0;
    const diffMs = new Date(isoDateStr).getTime() - Date.now();
    return Math.max(1, Math.round(diffMs / 60000));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
      {/* Header & Main Destination Controls */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-t-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Bus className="w-4 h-4 text-emerald-400" />
            <span>SINGAPORE BUS TRANSIT & LIVE API CONNECTION</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowApiConsole(!showApiConsole);
              if (!apiConsoleResponse) {
                testApiEndpoint('/api/health');
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer self-start sm:self-auto border border-slate-700"
          >
            <Server className="w-3.5 h-3.5 text-sky-400" />
            <span>API Serverless Status</span>
          </button>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Find Bus Transport to Building Landmarks & Bus Stops
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Live-connected to LTA DataMall v3 (<code className="text-sky-300 font-mono">/api/bus-arrival</code>) and OneMap Routing (<code className="text-sky-300 font-mono">/api/route</code>).
          </p>
        </div>

        {/* Origin & Destination Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          {/* Origin Town Selector */}
          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Origin HDB Town / Estate</span>
            </label>
            <select
              value={originTownId}
              onChange={(e) => handleOriginChange(e.target.value)}
              className="w-full text-xs font-semibold py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-400 cursor-pointer"
            >
              {HDB_TOWNS_DATA.map((town) => (
                <option key={town.id} value={town.id}>
                  {town.name} ({town.region} · {town.isMature ? 'Mature' : 'Non-Mature'})
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
              <span>Board at: <strong>{currentOriginTown.majorBusInterchange}</strong></span>
              <span className="text-emerald-400 font-mono">Buses {currentOriginTown.nearbyBusServices.slice(0, 4).join(', ')}</span>
            </div>
          </div>

          {/* Destination Landmark / Bus Stop Selector */}
          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Destination Landmark or Bus Stop</span>
              </div>
              <span className="text-[11px] text-sky-400 font-mono">Stop #{currentDestination.busStopCode}</span>
            </label>

            <select
              value={destinationId}
              onChange={(e) => handleDestinationChange(e.target.value)}
              className="w-full text-xs font-semibold py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-hidden focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              <optgroup label="Universities & Education (SMU, NUS, NTU...)">
                {LANDMARK_DESTINATIONS.filter((d) => d.category === 'Universities & Education').map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name} · Bus Stop #{dest.busStopCode} ({dest.road})
                  </option>
                ))}
              </optgroup>
              <optgroup label="CBD & Commercial Towers (Raffles Place, CapitaSpring...)">
                {LANDMARK_DESTINATIONS.filter((d) => d.category === 'CBD & Commercial Towers').map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name} · Bus Stop #{dest.busStopCode} ({dest.road})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Tech & Innovation Hubs (One-North Biopolis, MBC...)">
                {LANDMARK_DESTINATIONS.filter((d) => d.category === 'Tech, Science & Innovation').map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name} · Bus Stop #{dest.busStopCode} ({dest.road})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Hospitals & Healthcare (SGH, TTSH, NUH...)">
                {LANDMARK_DESTINATIONS.filter((d) => d.category === 'Hospitals & Medical').map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name} · Bus Stop #{dest.busStopCode} ({dest.road})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Transport Hubs & Retail (MBS, Changi Jewel, VivoCity...)">
                {LANDMARK_DESTINATIONS.filter((d) => d.category === 'Transport Hubs & Retail').map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name} · Bus Stop #{dest.busStopCode} ({dest.road})
                  </option>
                ))}
              </optgroup>
            </select>

            <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
              <span className="truncate max-w-[260px]">
                {currentDestination.landmark}
              </span>
              <span className="text-slate-300 font-semibold">{currentDestination.busStopName}</span>
            </div>
          </div>
        </div>

        {/* Popular Landmark Quick Select Buttons */}
        <div className="pt-1">
          <div className="text-[11px] text-slate-400 mb-1.5">Quick Select Landmark:</div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'smu-bras-basah', label: 'SMU (Bras Basah #04121)' },
              { id: 'smu-stamford', label: 'SMU Connexion (#04179)' },
              { id: 'nus-utown', label: 'NUS UTown (#16189)' },
              { id: 'ntu-north-spine', label: 'NTU North Spine (#27211)' },
              { id: 'capitaspring-market-st', label: 'CapitaSpring (#03059)' },
              { id: 'raffles-place-republic', label: 'One Raffles Pl (#03019)' },
              { id: 'marina-bay-sands', label: 'MBS Hotel (#03509)' },
              { id: 'sgh-campus', label: 'SGH Campus (#06011)' },
              { id: 'biopolis-fusionopolis', label: 'One-North Biopolis (#18079)' },
            ].map((landmark) => (
              <button
                key={landmark.id}
                type="button"
                onClick={() => handleDestinationChange(landmark.id)}
                className={`py-1 px-2.5 rounded-md text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                  destinationId === landmark.id
                    ? 'bg-sky-400 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {landmark.label}
              </button>
            ))}
          </div>
        </div>

        {/* Departure Time & Quick Presets */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <label className="text-xs font-semibold text-slate-300 whitespace-nowrap">
              Depart Timing:
            </label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="text-xs font-mono font-bold py-1.5 px-2.5 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 mr-1">Time Presets:</span>
            {[
              { label: 'Morning Peak', time: '08:00' },
              { label: 'Lunch', time: '12:30' },
              { label: 'Evening Peak', time: '18:15' },
              { label: 'Night', time: '22:15' },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setDepartureTime(p.time)}
                className={`py-1 px-2 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  departureTime === p.time
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {p.label} ({p.time})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Serverless API Diagnostics Console (collapsible) */}
      {showApiConsole && (
        <div className="p-5 bg-slate-950 text-slate-100 border-b border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">Live Serverless API Tester (/api/*)</span>
            </div>
            <button
              onClick={() => setShowApiConsole(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-sans">
            Endpoints proxy to LTA DataMall (with <code className="text-amber-400">AccountKey</code> header) and OneMap (with <code className="text-amber-400">Authorization</code> token). No keys are hardcoded in the client.
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => testApiEndpoint('/api/health')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded cursor-pointer border border-slate-700"
            >
              GET /api/health
            </button>
            <button
              onClick={() => testApiEndpoint('/api/bus-arrival?BusStopCode=04121')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded cursor-pointer border border-slate-700"
            >
              GET /api/bus-arrival?BusStopCode=04121 (SMU)
            </button>
            <button
              onClick={() => testApiEndpoint('/api/bus-stops')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded cursor-pointer border border-slate-700"
            >
              GET /api/bus-stops
            </button>
            <button
              onClick={() => testApiEndpoint('/api/route?start=1.320981,103.844150&end=1.326762,103.8559&routeType=walk')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded cursor-pointer border border-slate-700"
            >
              GET /api/route (OneMap)
            </button>
          </div>

          {apiConsoleResponse && (
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 max-h-56 overflow-y-auto">
              <div className="text-[10px] text-slate-400 mb-1">
                Response for: <span className="text-white">{apiConsoleEndpoint}</span>
              </div>
              <pre className="text-[11px] text-emerald-300 leading-snug whitespace-pre-wrap">
                {apiConsoleResponse}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Selected Landmark Destination Overview Card */}
      <div className="p-4 sm:p-5 bg-sky-50/50 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 mb-1">
              {getCategoryIcon(currentDestination.category)}
              <span>{currentDestination.category}</span>
              <span aria-hidden="true">·</span>
              <span>Bus Stop #{currentDestination.busStopCode}</span>
            </div>
            <div className="text-base font-bold text-slate-900">{currentDestination.name}</div>
            <div className="text-xs text-slate-600 mt-0.5">
              Landmark: <strong>{currentDestination.landmark}</strong> · Stop: <strong>{currentDestination.busStopName}</strong> ({currentDestination.road})
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="text-[11px] text-slate-500">Nearest MRT Stations</div>
            <div className="text-xs font-semibold text-slate-800">{currentDestination.mrtStation}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Direct Bus Routes: {currentDestination.popularBusServices.slice(0, 7).join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* Live Bus Timings & Arrivals Feed */}
      <div className="p-5 sm:p-6 bg-slate-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900 tracking-wide flex items-center gap-1.5 uppercase">
                <Bus className="w-3.5 h-3.5 text-slate-700" />
                <span>LIVE BUS TIMINGS · {activeBusStopLabel}</span>
              </h4>
              {isApiLoading && <RefreshCw className="w-3 h-3 text-sky-600 animate-spin" />}
            </div>
            <p className="text-[11px] text-slate-500">
              {liveApiData?.isLive
                ? '🟢 Streaming live data from LTA DataMall v3 API'
                : '🟡 Serverless /api/bus-arrival active (LTA DataMall v3 schema)'}
            </p>
          </div>

          {/* Toggle between Landmark Stop vs Origin Interchange */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => setStopViewMode('destination')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                stopViewMode === 'destination' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stop #{currentDestination.busStopCode} ({currentDestination.name.split('(')[0].trim()})
            </button>
            <button
              onClick={() => setStopViewMode('origin')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                stopViewMode === 'origin' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Origin ({currentOriginTown.name})
            </button>
          </div>
        </div>

        {/* Bus Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {liveApiData?.Services && liveApiData.Services.length > 0 ? (
            liveApiData.Services.slice(0, 6).map((svc: any) => {
              const nextMins = getMinutesUntil(svc.NextBus?.EstimatedArrival);
              const next2Mins = getMinutesUntil(svc.NextBus2?.EstimatedArrival);
              const next3Mins = getMinutesUntil(svc.NextBus3?.EstimatedArrival);

              const loadText =
                svc.NextBus?.Load === 'SEA'
                  ? 'Seats Available'
                  : svc.NextBus?.Load === 'SDA'
                  ? 'Standing Available'
                  : 'Limited Standing';

              const loadColor =
                svc.NextBus?.Load === 'SEA'
                  ? 'text-emerald-700'
                  : svc.NextBus?.Load === 'SDA'
                  ? 'text-amber-700'
                  : 'text-rose-700';

              const typeText = svc.NextBus?.Type === 'DD' ? 'Double Deck' : svc.NextBus?.Type === 'BD' ? 'Bendy' : 'Single Deck';

              return (
                <div
                  key={svc.ServiceNo}
                  className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-md bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                        {svc.ServiceNo}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                          Bus #{svc.ServiceNo}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {typeText} {svc.NextBus?.Feature === 'WAB' ? '· WAB' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold font-mono text-emerald-600 tabular-nums">
                        {nextMins}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-0.5">min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <div className="text-slate-500 font-mono">
                      Next: <strong className="text-slate-700">+{next2Mins || nextMins + 7}m</strong>,{' '}
                      <strong className="text-slate-700">+{next3Mins || nextMins + 14}m</strong>
                    </div>
                    <div className={`${loadColor} font-semibold text-[11px]`}>{loadText}</div>
                  </div>
                </div>
              );
            })
          ) : (
            // Fallback grid
            currentDestination.popularBusServices.slice(0, 6).map((serviceNo) => {
              const arrival = getSimulatedArrivals(serviceNo, departureTime);
              return (
                <div
                  key={serviceNo}
                  className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-md bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                        {serviceNo}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                          To {arrival.destination}
                        </div>
                        <div className="text-[10px] text-slate-400">{arrival.type} · WAB</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold font-mono text-emerald-600 tabular-nums">
                        {arrival.nextBusMins}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-0.5">min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <div className="text-slate-500">
                      Next: <strong className="font-mono text-slate-700">+{arrival.subsequentBusMins}m</strong>,{' '}
                      <strong className="font-mono text-slate-700">+{arrival.thirdBusMins}m</strong>
                    </div>
                    <div className="text-emerald-700 font-semibold text-[11px]">Seats Available</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Planned Transit Route Journey Itinerary */}
      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-500 font-medium">Estimated Public Transit Journey</div>
            <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{journeyPlan.originName}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span>{journeyPlan.destinationName}</span>
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              Alighting at: <strong>Bus Stop #{journeyPlan.destinationBusStopCode} - {journeyPlan.destinationBusStopName}</strong>
            </div>
          </div>

          {/* Quick Route KPIs */}
          <div className="flex items-center gap-4 text-xs">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
              <span className="block text-[10px] text-slate-400">Total Commute</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums text-sm">
                ~{journeyPlan.totalDurationMins} mins
              </span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
              <span className="block text-[10px] text-slate-400">EZ-Link Bus Fare</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums text-sm">
                ${journeyPlan.fareEstimate.toFixed(2)} SGD
              </span>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 hidden sm:block">
              <span className="block text-[10px] text-emerald-700">CO2 Savings</span>
              <span className="font-mono font-bold text-emerald-800 tabular-nums text-sm">
                {journeyPlan.co2SavingsKg} kg
              </span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Itinerary Timeline */}
        <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 before:z-0">
          {journeyPlan.steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex items-start gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 bg-white ${
                  step.mode === 'walk'
                    ? 'border-slate-400 text-slate-600'
                    : 'border-emerald-600 text-emerald-700 bg-emerald-50'
                }`}
              >
                {step.mode === 'walk' ? (
                  <Footprints className="w-3.5 h-3.5" />
                ) : (
                  <Bus className="w-3.5 h-3.5" />
                )}
              </div>

              <div className="flex-1 bg-white p-3.5 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900 mb-1">
                  <span>{step.serviceOrLine || 'Walk'}</span>
                  <span className="font-mono text-slate-500 tabular-nums">
                    {step.departureTime} → {step.arrivalTime} ({step.durationMins} min)
                  </span>
                </div>
                <p className="text-xs text-slate-600">{step.instructions}</p>
                {step.stopsCount && (
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                    <span>{step.stopsCount} stops via expressway</span>
                    <span aria-hidden="true">·</span>
                    <span>Arrives directly at Bus Stop #{journeyPlan.destinationBusStopCode}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
