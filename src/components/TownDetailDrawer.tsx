import React from 'react';
import { TownData, FlatType, AffordabilityResult } from '../types/hdb';
import { FLAT_TYPES } from '../data/hdbResaleData';
import { formatSGD } from '../utils/transitRouter';
import { getAffordabilityStatus } from '../utils/affordabilityCalculator';
import {
  X,
  MapPin,
  Train,
  Bus,
  Clock,
  ExternalLink,
  Building,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface TownDetailDrawerProps {
  town: TownData | null;
  onClose: () => void;
  selectedFlatType: FlatType;
  affordabilityResult: AffordabilityResult;
  onPlanCommute: (townId: string) => void;
}

export const TownDetailDrawer: React.FC<TownDetailDrawerProps> = ({
  town,
  onClose,
  selectedFlatType,
  affordabilityResult,
  onPlanCommute,
}) => {
  if (!town) return null;

  const currentPriceDetail = town.prices[selectedFlatType];
  const currentMedian = currentPriceDetail?.medianPrice || town.overallMedian;
  const currentStatus = getAffordabilityStatus(currentMedian, affordabilityResult.maxAffordablePrice);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>{town.region} Region</span>
            <span aria-hidden="true">·</span>
            <span>{town.isMature ? 'Mature Estate' : 'Non-Mature Estate'}</span>
            <span aria-hidden="true">·</span>
            <span>~{town.avgRemainingLeaseYears} yrs avg lease</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{town.name}</h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{town.description}</p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
        {/* Selected Room Type Affordability Callout */}
        <div
          className={`p-4 rounded-xl border ${
            currentStatus === 'affordable'
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
              : currentStatus === 'stretch'
              ? 'bg-amber-50/60 border-amber-200 text-amber-950'
              : 'bg-rose-50/60 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {selectedFlatType} Affordability Status
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                currentStatus === 'affordable'
                  ? 'bg-emerald-600 text-white'
                  : currentStatus === 'stretch'
                  ? 'bg-amber-600 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {currentStatus === 'affordable'
                ? 'Within Safe Budget'
                : currentStatus === 'stretch'
                ? 'Moderate Stretch'
                : 'Above Current Budget'}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div>
              <div className="text-2xl font-extrabold font-mono tabular-nums">
                {formatSGD(currentMedian)}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                Median resale price based on Data.gov.sg
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-500">Your max budget:</span>
              <div className="font-mono font-bold text-slate-900">
                {formatSGD(affordabilityResult.maxAffordablePrice)}
              </div>
            </div>
          </div>
        </div>

        {/* Complete Resale Price Breakdown by Flat Type */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900 tracking-wide uppercase">
              HDB Resale Prices (Data.gov.sg Collection 189)
            </h4>
            <span className="text-[11px] text-slate-500">2024-2026 Reg.</span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Flat Type</th>
                  <th className="py-2.5 px-3 text-right">Median</th>
                  <th className="py-2.5 px-3 text-right">Range (Min-Max)</th>
                  <th className="py-2.5 px-3 text-right">$/sqm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                {FLAT_TYPES.map((type) => {
                  const data = town.prices[type as FlatType];
                  if (!data) {
                    return (
                      <tr key={type} className="text-slate-400">
                        <td className="py-2 px-3 font-sans">{type}</td>
                        <td className="py-2 px-3 text-right">—</td>
                        <td className="py-2 px-3 text-right">—</td>
                        <td className="py-2 px-3 text-right">—</td>
                      </tr>
                    );
                  }

                  const isCurrent = type === selectedFlatType;
                  return (
                    <tr
                      key={type}
                      className={isCurrent ? 'bg-slate-100 font-bold text-slate-900' : 'hover:bg-slate-50'}
                    >
                      <td className="py-2.5 px-3 font-sans font-medium">
                        {type} {isCurrent && <span className="text-[10px] text-slate-500 font-normal">●</span>}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold">
                        {formatSGD(data.medianPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500 text-[11px]">
                        ${Math.round(data.minPrice / 1000)}k - ${Math.round(data.maxPrice / 1000)}k
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600">
                        ${data.pricePerSqm}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transport & Commute Times */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 tracking-wide uppercase">
            Commute Connectivity
          </h4>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="block text-[11px] text-slate-500">To Raffles Pl (CBD)</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                {town.commuteTimeToRafflesPlaceMins} min
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="block text-[11px] text-slate-500">To Jurong East</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                {town.commuteTimeToJurongEastMins} min
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="block text-[11px] text-slate-500">To Changi Airport</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                {town.commuteTimeToChangiMins} min
              </span>
            </div>
          </div>

          {/* MRT Stations */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Train className="w-3.5 h-3.5 text-slate-600" />
              <span>MRT & LRT Network</span>
            </div>
            <div className="text-xs text-slate-600">
              {town.mrtStations.join(' · ')}
            </div>
          </div>

          {/* Bus Interchange & Routes */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Bus className="w-3.5 h-3.5 text-slate-600" />
              <span>{town.majorBusInterchange}</span>
            </div>
            <div className="text-xs text-slate-600">
              Active Bus Routes: {town.nearbyBusServices.join(', ')}
            </div>
          </div>
        </div>

        {/* Key Amenities */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 tracking-wide uppercase mb-2">
            Key Amenities & Community Infrastructure
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {town.keyAmenities.map((amenity, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>{amenity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Drawer Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            onPlanCommute(town.id);
            onClose();
          }}
          className="flex-1 py-2.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Bus className="w-4 h-4 text-emerald-400" />
          <span>Plan Bus Commute From {town.name}</span>
        </button>
      </div>
    </div>
  );
};
