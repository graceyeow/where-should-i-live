import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TownData, FlatType, AffordabilityResult, TransitDestination } from '../types/hdb';
import { HDB_TOWNS_DATA } from '../data/hdbResaleData';
import { BUS_STOPS, MRT_LINES, LANDMARK_DESTINATIONS, getSimulatedArrivals } from '../data/singaporeTransitData';
import { getAffordabilityStatus } from '../utils/affordabilityCalculator';
import { formatSGD } from '../utils/transitRouter';
import { Search, Layers, Bus, Train, Filter, Navigation, Info, Building2, Map as MapIcon } from 'lucide-react';

export type OneMapStyle = 'Default' | 'Grey' | 'Night' | 'Original';

interface InteractiveMapProps {
  selectedTown: TownData | null;
  onSelectTown: (town: TownData) => void;
  selectedFlatType: FlatType;
  affordabilityResult: AffordabilityResult;
  onPlanCommuteFromTown: (townId: string) => void;
  onSelectDestinationLandmark?: (landmarkId: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedTown,
  onSelectTown,
  selectedFlatType,
  affordabilityResult,
  onPlanCommuteFromTown,
  onSelectDestinationLandmark,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const townMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const busStopsLayerRef = useRef<L.LayerGroup | null>(null);
  const landmarksLayerRef = useRef<L.LayerGroup | null>(null);
  const mrtLinesLayerRef = useRef<L.LayerGroup | null>(null);

  const [onemapStyle, setOnemapStyle] = useState<OneMapStyle>('Default');
  const [showBusStops, setShowBusStops] = useState<boolean>(true);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [showMrtLines, setShowMrtLines] = useState<boolean>(true);
  const [filterAffordableOnly, setFilterAffordableOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRegion, setActiveRegion] = useState<string>('All');

  // Initialize Leaflet map with OneMap API tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center of Singapore
    const map = L.map(mapContainerRef.current, {
      center: [1.3521, 103.8198],
      zoom: 12,
      minZoom: 11,
      maxZoom: 19,
      zoomControl: false,
    });

    // Official Singapore Land Authority (SLA) OneMap Map Tiles
    const onemapAttribution =
      '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:16px;width:16px;vertical-align:middle;display:inline-block;margin-right:4px;"/> <a href="https://www.onemap.gov.sg" target="_blank" rel="noopener noreferrer">OneMap</a> &copy; contributors | <a href="https://www.sla.gov.sg" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>';

    const tileLayer = L.tileLayer(
      'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png',
      {
        attribution: onemapAttribution,
        minZoom: 11,
        maxZoom: 19,
        detectRetina: true,
      }
    ).addTo(map);

    tileLayerRef.current = tileLayer;

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Create layer groups
    const townGroup = L.layerGroup().addTo(map);
    const busGroup = L.layerGroup().addTo(map);
    const landmarkGroup = L.layerGroup().addTo(map);
    const mrtGroup = L.layerGroup().addTo(map);

    townMarkersLayerRef.current = townGroup;
    busStopsLayerRef.current = busGroup;
    landmarksLayerRef.current = landmarkGroup;
    mrtLinesLayerRef.current = mrtGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Dynamically update OneMap tile style (Default, Grey, Night, Original)
  useEffect(() => {
    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(
        `https://www.onemap.gov.sg/maps/tiles/${onemapStyle}/{z}/{x}/{y}.png`
      );
    }
  }, [onemapStyle]);

  // Render MRT lines
  useEffect(() => {
    if (!mrtLinesLayerRef.current || !mapInstanceRef.current) return;
    mrtLinesLayerRef.current.clearLayers();

    if (!showMrtLines) return;

    MRT_LINES.forEach((line) => {
      const polyline = L.polyline(line.path, {
        color: line.color,
        weight: 3.5,
        opacity: 0.85,
        dashArray: undefined,
      });

      polyline.bindTooltip(
        `<div class="text-xs font-semibold px-1">${line.name} (${line.code})</div>`,
        { sticky: true }
      );

      polyline.addTo(mrtLinesLayerRef.current!);
    });
  }, [showMrtLines]);

  // Render Building Landmarks (like SMU, NUS, NTU, CapitaSpring, SGH)
  useEffect(() => {
    if (!landmarksLayerRef.current || !mapInstanceRef.current) return;
    landmarksLayerRef.current.clearLayers();

    if (!showLandmarks) return;

    LANDMARK_DESTINATIONS.forEach((landmark) => {
      let iconEmoji = '🏛️';
      if (landmark.category === 'Universities & Education') iconEmoji = '🎓';
      else if (landmark.category === 'Hospitals & Medical') iconEmoji = '🏥';
      else if (landmark.category === 'Transport Hubs & Retail') iconEmoji = '🛍️';
      else if (landmark.category === 'Tech, Science & Innovation') iconEmoji = '⚡';

      const landmarkIcon = L.divIcon({
        className: 'custom-landmark-marker',
        html: `
          <div style="
            background: #0284c7;
            color: #ffffff;
            padding: 2px 6px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 4px;
            border: 2px solid #ffffff;
            box-shadow: 0 3px 8px rgba(0,0,0,0.25);
            white-space: nowrap;
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            <span>${iconEmoji}</span>
            <span>${landmark.name.split('(')[0].trim()}</span>
          </div>
        `,
        iconSize: [120, 26],
        iconAnchor: [60, 13],
      });

      const marker = L.marker(landmark.coordinates, { icon: landmarkIcon });

      const popupHtml = `
        <div style="padding: 12px 14px; min-width: 230px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div style="font-size: 11px; color: #0284c7; font-weight: 700; text-transform: uppercase;">
            ${landmark.category}
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">
            ${landmark.name}
          </div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 6px;">
            ${landmark.landmark}
          </div>

          <div style="background: #f1f5f9; padding: 6px 8px; border-radius: 6px; font-size: 11px; margin-bottom: 8px;">
            <div style="color: #334155; font-weight: 600;">🚏 Bus Stop #${landmark.busStopCode}</div>
            <div style="color: #64748b;">${landmark.busStopName} · ${landmark.road}</div>
          </div>

          <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
            🚇 <strong>Nearest MRT:</strong> ${landmark.mrtStation}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 10px;">
            🚌 <strong>Direct Buses:</strong> ${landmark.popularBusServices.slice(0, 8).join(', ')}
          </div>

          <button
            onclick="window.dispatchEvent(new CustomEvent('select-commute-landmark', { detail: '${landmark.id}' }))"
            style="
              width: 100%;
              padding: 6px 10px;
              background: #0f172a;
              color: #ffffff;
              font-size: 11px;
              font-weight: 600;
              border: none;
              border-radius: 6px;
              cursor: pointer;
            "
          >
            Plan Commute to ${landmark.name.split('(')[0].trim()} →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.addTo(landmarksLayerRef.current!);
    });
  }, [showLandmarks]);

  // Listen to window event for landmark selection inside Leaflet popup
  useEffect(() => {
    const handleLandmarkSelect = (e: any) => {
      const landmarkId = e.detail;
      if (onSelectDestinationLandmark) {
        onSelectDestinationLandmark(landmarkId);
      }
    };

    window.addEventListener('select-commute-landmark', handleLandmarkSelect);
    return () => window.removeEventListener('select-commute-landmark', handleLandmarkSelect);
  }, [onSelectDestinationLandmark]);

  // Render Bus Stops
  useEffect(() => {
    if (!busStopsLayerRef.current || !mapInstanceRef.current) return;
    busStopsLayerRef.current.clearLayers();

    if (!showBusStops) return;

    BUS_STOPS.forEach((stop) => {
      const busIcon = L.divIcon({
        className: 'custom-bus-marker',
        html: `
          <div style="
            background: #0f172a;
            color: #ffffff;
            width: 24px;
            height: 24px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.25);
            font-size: 11px;
            font-weight: bold;
          ">
            🚌
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(stop.coordinates, { icon: busIcon });

      const primaryService = stop.services[0] || '147';
      const secondService = stop.services[1] || '65';
      const arrival1 = getSimulatedArrivals(primaryService);
      const arrival2 = getSimulatedArrivals(secondService);

      const popupHtml = `
        <div style="padding: 12px 14px; min-width: 210px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div style="font-size: 11px; color: #64748b; font-weight: 600;">BUS STOP #${stop.code}</div>
          <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">${stop.name}</div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 8px;">${stop.road}</div>
          
          <div style="font-size: 11px; font-weight: 600; color: #1e293b; margin-bottom: 4px; border-top: 1px solid #f1f5f9; padding-top: 6px;">
            Live Bus Arrivals:
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; font-size: 12px;">
            <span style="font-weight: 700; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">Bus ${primaryService}</span>
            <span style="font-weight: 600; color: #16a34a;">${arrival1.nextBusMins} min</span>
            <span style="color: #64748b; font-size: 11px;">+${arrival1.subsequentBusMins}m</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; font-size: 12px;">
            <span style="font-weight: 700; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">Bus ${secondService}</span>
            <span style="font-weight: 600; color: #16a34a;">${arrival2.nextBusMins} min</span>
            <span style="color: #64748b; font-size: 11px;">+${arrival2.subsequentBusMins}m</span>
          </div>

          <div style="margin-top: 8px; font-size: 11px; color: #64748b;">
            All routes: ${stop.services.slice(0, 6).join(', ')}${stop.services.length > 6 ? '...' : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.addTo(busStopsLayerRef.current!);
    });
  }, [showBusStops]);

  // Render Town Markers with affordability color and pricing
  useEffect(() => {
    if (!townMarkersLayerRef.current || !mapInstanceRef.current) return;
    townMarkersLayerRef.current.clearLayers();

    const filteredTowns = HDB_TOWNS_DATA.filter((town) => {
      if (activeRegion !== 'All' && town.region !== activeRegion) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = town.name.toLowerCase().includes(query);
        const matchesMrt = town.mrtStations.some((m) => m.toLowerCase().includes(query));
        if (!matchesName && !matchesMrt) return false;
      }

      if (filterAffordableOnly) {
        const flatPrice = town.prices[selectedFlatType]?.medianPrice || town.overallMedian;
        const status = getAffordabilityStatus(flatPrice, affordabilityResult.maxAffordablePrice);
        if (status === 'over_budget') return false;
      }

      return true;
    });

    filteredTowns.forEach((town) => {
      const priceDetail = town.prices[selectedFlatType];
      const medianPrice = priceDetail?.medianPrice || town.overallMedian;
      const status = getAffordabilityStatus(medianPrice, affordabilityResult.maxAffordablePrice);
      const isSelected = selectedTown?.id === town.id;

      let badgeBg = '#10b981'; // Emerald (Affordable)
      let textColor = '#ffffff';

      if (status === 'stretch') {
        badgeBg = '#f59e0b'; // Amber (Stretch)
      } else if (status === 'over_budget') {
        badgeBg = '#ef4444'; // Red (Over budget)
      }

      const formattedPrice = `$${Math.round(medianPrice / 1000)}k`;

      const markerHtml = `
        <div style="
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        ">
          <div style="
            background: ${badgeBg};
            color: ${textColor};
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            box-shadow: 0 4px 10px rgba(0,0,0,0.18);
            border: 2px solid ${isSelected ? '#0f172a' : '#ffffff'};
            white-space: nowrap;
            transition: transform 0.15s ease;
            font-family: 'JetBrains Mono', monospace;
            ${isSelected ? 'transform: scale(1.12); outline: 2px solid #0f172a;' : ''}
          ">
            ${town.name} · ${formattedPrice}
          </div>
          <div style="
            width: 8px;
            height: 8px;
            background: ${badgeBg};
            transform: rotate(45deg);
            margin-top: -4px;
            border-right: 1px solid rgba(0,0,0,0.1);
            border-bottom: 1px solid rgba(0,0,0,0.1);
          "></div>
        </div>
      `;

      const townIcon = L.divIcon({
        className: 'custom-town-marker',
        html: markerHtml,
        iconSize: [110, 32],
        iconAnchor: [55, 16],
      });

      const marker = L.marker(town.coordinates, { icon: townIcon });

      marker.on('click', () => {
        onSelectTown(town);
      });

      marker.bindTooltip(
        `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; padding: 2px 4px;">
          <div style="font-weight: 700; color: #0f172a;">${town.name} (${town.isMature ? 'Mature' : 'Non-Mature'})</div>
          <div style="color: #475569; font-size: 11px;">${selectedFlatType} Median: <strong>${formatSGD(medianPrice)}</strong></div>
          <div style="color: #475569; font-size: 11px;">Avg $/sqm: $${priceDetail?.pricePerSqm || 'N/A'}</div>
          <div style="color: #0284c7; font-size: 11px; margin-top: 2px;">⚡ ${town.commuteTimeToRafflesPlaceMins} min bus/train to CBD</div>
        </div>
      `,
        { direction: 'top', offset: [0, -18], opacity: 0.95 }
      );

      marker.addTo(townMarkersLayerRef.current!);
    });
  }, [
    selectedTown,
    selectedFlatType,
    affordabilityResult,
    filterAffordableOnly,
    searchQuery,
    activeRegion,
  ]);

  // Center on selected town if changed from outside
  useEffect(() => {
    if (selectedTown && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedTown.coordinates, 13, { duration: 0.8 });
    }
  }, [selectedTown]);

  const handleSearchSelectTown = (town: TownData) => {
    onSelectTown(town);
    setSearchQuery('');
  };

  const handleSearchSelectLandmark = (landmark: TransitDestination) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(landmark.coordinates, 15, { duration: 0.8 });
    }
    if (onSelectDestinationLandmark) {
      onSelectDestinationLandmark(landmark.id);
    }
    setSearchQuery('');
  };

  return (
    <div className="relative w-full h-[600px] lg:h-[720px] rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-20 flex flex-col sm:flex-row gap-2 max-w-xl">
        {/* Search Input for Towns & Landmarks (e.g. SMU, NUS) */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search SMU, NUS, CapitaSpring, bus stop #, or town..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg shadow-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          />

          {/* Autocomplete Dropdown */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-72 overflow-y-auto z-30 divide-y divide-slate-100">
              {/* Landmark matches (like SMU) */}
              {LANDMARK_DESTINATIONS.filter(
                (l) =>
                  l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  l.landmark.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  l.busStopCode.includes(searchQuery) ||
                  l.busStopName.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleSearchSelectLandmark(l)}
                  className="w-full text-left p-2.5 hover:bg-sky-50 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-sky-600" />
                      <span>{l.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Bus Stop #{l.busStopCode} · {l.busStopName}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                    Landmark
                  </span>
                </button>
              ))}

              {/* Town matches */}
              {HDB_TOWNS_DATA.filter(
                (t) =>
                  t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  t.mrtStations.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))
              ).slice(0, 4).map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSearchSelectTown(t)}
                  className="w-full text-left p-2.5 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{t.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {t.mrtStations[0]} · {t.commuteTimeToRafflesPlaceMins}m to CBD
                    </div>
                  </div>
                  <div className="text-xs font-mono font-semibold text-slate-800">
                    {formatSGD(t.prices[selectedFlatType]?.medianPrice || t.overallMedian)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Region Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg shadow-sm overflow-x-auto">
          {['All', 'Central', 'East', 'West', 'North', 'North-East'].map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setActiveRegion(region)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeRegion === region
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Map Controls (Top Right) */}
      <div className="absolute top-3 right-3 z-20 hidden sm:flex flex-col gap-2 max-w-[210px]">
        {/* OneMap Basemap Style Selector */}
        <div className="bg-white/95 backdrop-blur-md p-2 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <img
                src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png"
                alt="OneMap"
                className="w-3.5 h-3.5 inline-block"
              />
              <span>OneMap Tiles</span>
            </span>
            <span className="text-[9px] text-slate-400 font-mono">SLA API</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {(['Default', 'Grey', 'Night', 'Original'] as OneMapStyle[]).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setOnemapStyle(style)}
                className={`px-2 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                  onemapStyle === style
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Map Layer Toggle Buttons */}
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              showLandmarks
                ? 'bg-sky-600 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Landmarks (SMU...)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBusStops(!showBusStops)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              showBusStops
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Bus Stops</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMrtLines(!showMrtLines)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              showMrtLines
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>MRT Lines</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterAffordableOnly(!filterAffordableOnly)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              filterAffordableOnly
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Affordable Only</span>
          </button>
        </div>
      </div>

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 shadow-sm max-w-xs text-xs">
        <div className="font-semibold text-slate-900 mb-1.5 text-[11px] uppercase tracking-wider">
          Map Layers & Pricing
        </div>
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-sky-500 shrink-0"></span>
            <span className="text-slate-700 font-medium">Landmarks & Bus Stops (e.g. SMU)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 shrink-0"></span>
            <span className="text-slate-700">Affordable HDB Town (MSR &lt; 30%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-amber-500 shrink-0"></span>
            <span className="text-slate-700">Moderate / Stretch Town</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-slate-500">
            <span>Click any landmark or bus stop to plan transport</span>
          </div>
        </div>
      </div>

      {/* The Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
