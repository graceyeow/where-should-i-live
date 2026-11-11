import React, { useState, useMemo } from 'react';
import { TownData, FlatType, AffordabilityResult } from '../types/hdb';
import { HDB_TOWNS_DATA } from '../data/hdbResaleData';
import { getAffordabilityStatus } from '../utils/affordabilityCalculator';
import { formatSGD } from '../utils/transitRouter';
import {
  Search,
  ArrowUpDown,
  Compass,
  Bus,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface TownComparisonTableProps {
  selectedFlatType: FlatType;
  affordabilityResult: AffordabilityResult;
  onSelectTown: (town: TownData) => void;
  onPlanCommute: (townId: string) => void;
}

type SortField = 'name' | 'medianPrice' | 'commute' | 'psqm';

export const TownComparisonTable: React.FC<TownComparisonTableProps> = ({
  selectedFlatType,
  affordabilityResult,
  onSelectTown,
  onPlanCommute,
}) => {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'affordable' | 'stretch' | 'over_budget'>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('medianPrice');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const processedTowns = useMemo(() => {
    return HDB_TOWNS_DATA.filter((town) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = town.name.toLowerCase().includes(q);
        const matchesMrt = town.mrtStations.some((m) => m.toLowerCase().includes(q));
        if (!matchesName && !matchesMrt) return false;
      }

      // Region filter
      if (regionFilter !== 'all' && town.region !== regionFilter) return false;

      // Status filter
      const price = town.prices[selectedFlatType]?.medianPrice || town.overallMedian;
      const status = getAffordabilityStatus(price, affordabilityResult.maxAffordablePrice);
      if (statusFilter !== 'all' && status !== statusFilter) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.prices[selectedFlatType]?.medianPrice || a.overallMedian;
      const priceB = b.prices[selectedFlatType]?.medianPrice || b.overallMedian;
      const psqmA = a.prices[selectedFlatType]?.pricePerSqm || 0;
      const psqmB = b.prices[selectedFlatType]?.pricePerSqm || 0;

      let diff = 0;
      if (sortField === 'name') {
        diff = a.name.localeCompare(b.name);
      } else if (sortField === 'medianPrice') {
        diff = priceA - priceB;
      } else if (sortField === 'commute') {
        diff = a.commuteTimeToRafflesPlaceMins - b.commuteTimeToRafflesPlaceMins;
      } else if (sortField === 'psqm') {
        diff = psqmA - psqmB;
      }

      return sortAsc ? diff : -diff;
    });
  }, [search, statusFilter, regionFilter, sortField, sortAsc, selectedFlatType, affordabilityResult]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header with Search and Filters */}
      <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Singapore HDB Resale Flat Prices Dataset
            </h3>
            <p className="text-xs text-slate-500">
              Official Data.gov.sg Collection 189 · Comparing all 26 towns for{' '}
              <strong className="text-slate-800 font-semibold">{selectedFlatType}</strong>
            </p>
          </div>

          <div className="text-xs font-mono tabular-nums text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            Showing <strong>{processedTowns.length}</strong> of 26 Towns
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by town or MRT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Region Filter */}
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="text-xs font-medium py-2 px-3 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          >
            <option value="all">All Regions (Singapore-wide)</option>
            <option value="Central">Central Region</option>
            <option value="East">East Region</option>
            <option value="West">West Region</option>
            <option value="North">North Region</option>
            <option value="North-East">North-East Region</option>
          </select>

          {/* Affordability Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs font-medium py-2 px-3 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          >
            <option value="all">All Affordability Levels</option>
            <option value="affordable">✓ Within Budget Only</option>
            <option value="stretch">Moderate Stretch Only</option>
            <option value="over_budget">Above Budget Only</option>
          </select>
        </div>
      </div>

      {/* Towns Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th
                onClick={() => toggleSort('name')}
                className="py-3 px-4 cursor-pointer hover:text-slate-950 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Town & Classification</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => toggleSort('medianPrice')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-950 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>{selectedFlatType} Median</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-3 px-4 text-right whitespace-nowrap">Price Range (Min-Max)</th>

              <th
                onClick={() => toggleSort('psqm')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-950 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Avg $/sqm</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => toggleSort('commute')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-950 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>CBD Commute</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-3 px-4 text-center whitespace-nowrap">Budget Fit</th>

              <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
            {processedTowns.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                  No towns matched your current filter criteria.
                </td>
              </tr>
            ) : (
              processedTowns.map((town) => {
                const priceDetail = town.prices[selectedFlatType];
                const medianPrice = priceDetail?.medianPrice || town.overallMedian;
                const status = getAffordabilityStatus(medianPrice, affordabilityResult.maxAffordablePrice);

                return (
                  <tr key={town.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Town name and tags */}
                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-slate-900 text-sm">{town.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span>{town.region}</span>
                        <span aria-hidden="true">·</span>
                        <span>{town.isMature ? 'Mature' : 'Non-Mature'}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate max-w-[140px]">{town.mrtStations[0]}</span>
                      </div>
                    </td>

                    {/* Median Price */}
                    <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm">
                      {formatSGD(medianPrice)}
                    </td>

                    {/* Price Range */}
                    <td className="py-3 px-4 text-right text-slate-600 text-[11px]">
                      {priceDetail ? (
                        <span>
                          ${Math.round(priceDetail.minPrice / 1000)}k - ${Math.round(priceDetail.maxPrice / 1000)}k
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* $/sqm */}
                    <td className="py-3 px-4 text-right text-slate-600 font-medium">
                      ${priceDetail?.pricePerSqm || '—'}
                    </td>

                    {/* CBD Commute */}
                    <td className="py-3 px-4 text-right text-slate-700 font-sans">
                      <div className="flex items-center justify-end gap-1 font-mono font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{town.commuteTimeToRafflesPlaceMins} min</span>
                      </div>
                    </td>

                    {/* Affordability Tag */}
                    <td className="py-3 px-4 text-center font-sans">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                          status === 'affordable'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : status === 'stretch'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {status === 'affordable'
                          ? 'Affordable'
                          : status === 'stretch'
                          ? 'Stretch'
                          : 'Above Budget'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectTown(town)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="View on Map"
                        >
                          <Compass className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onPlanCommute(town.id)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Plan Bus Commute"
                        >
                          <Bus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
