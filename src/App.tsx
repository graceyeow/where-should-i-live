import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { InteractiveMap } from './components/InteractiveMap';
import { AffordabilityPanel } from './components/AffordabilityPanel';
import { TransportTimingsPlanner } from './components/TransportTimingsPlanner';
import { TownComparisonTable } from './components/TownComparisonTable';
import { TownDetailDrawer } from './components/TownDetailDrawer';
import { GrantExplainerModal } from './components/GrantExplainerModal';
import { AffordabilityInput, TownData, FlatType } from './types/hdb';
import { HDB_TOWNS_DATA } from './data/hdbResaleData';
import { DEFAULT_AFFORDABILITY_INPUT } from './data/hdbService';
import { calculateAffordability, getAffordabilityStatus } from './utils/affordabilityCalculator';
import { formatSGD } from './utils/transitRouter';
import {
  Compass,
  Calculator,
  Bus,
  BarChart3,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Clock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'calculator' | 'transit' | 'data'>('map');
  const [selectedTown, setSelectedTown] = useState<TownData | null>(null);
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string>('smu-bras-basah');
  const [isGrantModalOpen, setIsGrantModalOpen] = useState<boolean>(false);

  // Financial inputs default state (from shared service module)
  const [affordabilityInput, setAffordabilityInput] = useState<AffordabilityInput>(DEFAULT_AFFORDABILITY_INPUT);

  // Calculate live financial eligibility
  const affordabilityResult = useMemo(() => {
    return calculateAffordability(affordabilityInput);
  }, [affordabilityInput]);

  // Compute how many towns are affordable under the current budget
  const affordableTownsCount = useMemo(() => {
    return HDB_TOWNS_DATA.filter((town) => {
      const price = town.prices[affordabilityInput.selectedFlatType]?.medianPrice || town.overallMedian;
      const status = getAffordabilityStatus(price, affordabilityResult.maxAffordablePrice);
      return status === 'affordable';
    }).length;
  }, [affordabilityInput.selectedFlatType, affordabilityResult.maxAffordablePrice]);

  const handlePlanCommuteFromTown = (townId: string) => {
    const matched = HDB_TOWNS_DATA.find((t) => t.id === townId);
    if (matched) {
      setSelectedTown(matched);
    }
    setActiveTab('transit');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCalculator={() => setActiveTab('calculator')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Top Summary Bar / KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-medium">Max Affordable Flat</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {formatSGD(affordabilityResult.maxAffordablePrice)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Targeting {affordabilityInput.selectedFlatType}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-medium">Affordable Towns</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 tabular-nums">
              {affordableTownsCount}{' '}
              <span className="text-xs font-normal text-slate-400">/ 26 Towns</span>
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              Within 30% MSR safety rule
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-medium">Eligible CPF Grants</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
              +{formatSGD(affordabilityResult.cpfGrantEligible.totalGrants)}
            </div>
            <button
              onClick={() => setIsGrantModalOpen(true)}
              className="text-[11px] text-slate-500 hover:text-slate-900 underline mt-0.5 block cursor-pointer"
            >
              EHG + Family + PHG breakdown
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-medium">Est. Monthly Mortgage</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {formatSGD(affordabilityResult.monthlyMortgage)}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {affordabilityResult.msrRatio}% MSR ratio
            </div>
          </div>
        </div>

        {/* Tab View 1: Interactive Map View */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Interactive Singapore HDB & Transit Map
                </h1>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                  Explore HDB resale median prices across all 26 towns color-coded by your calculated affordability. Click any town to view price distributions or click bus stops for live arrival intervals.
                </p>
              </div>

              {/* Flat Type Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg shadow-2xs self-start md:self-auto">
                {(['2-Room', '3-Room', '4-Room', '5-Room', 'Executive'] as FlatType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setAffordabilityInput({ ...affordabilityInput, selectedFlatType: type })
                    }
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      affordabilityInput.selectedFlatType === type
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Leaflet Map Component */}
            <InteractiveMap
              selectedTown={selectedTown}
              onSelectTown={setSelectedTown}
              selectedFlatType={affordabilityInput.selectedFlatType}
              affordabilityResult={affordabilityResult}
              onPlanCommuteFromTown={handlePlanCommuteFromTown}
              onSelectDestinationLandmark={(landmarkId) => {
                setSelectedLandmarkId(landmarkId);
                setActiveTab('transit');
              }}
            />

            {/* Quick Town Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
                  Most Affordable Towns ({affordabilityInput.selectedFlatType})
                </div>
                <div className="space-y-2 text-xs">
                  {HDB_TOWNS_DATA.filter((t) => t.prices[affordabilityInput.selectedFlatType])
                    .sort(
                      (a, b) =>
                        (a.prices[affordabilityInput.selectedFlatType]?.medianPrice || 0) -
                        (b.prices[affordabilityInput.selectedFlatType]?.medianPrice || 0)
                    )
                    .slice(0, 3)
                    .map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTown(t)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <span className="font-semibold text-slate-800">{t.name}</span>
                        <span className="font-mono text-emerald-600 font-bold tabular-nums">
                          {formatSGD(t.prices[affordabilityInput.selectedFlatType]!.medianPrice)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
                  Fastest Commute to CBD (Raffles Place)
                </div>
                <div className="space-y-2 text-xs">
                  {HDB_TOWNS_DATA.sort(
                    (a, b) => a.commuteTimeToRafflesPlaceMins - b.commuteTimeToRafflesPlaceMins
                  )
                    .slice(0, 3)
                    .map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTown(t)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <span className="font-semibold text-slate-800">{t.name}</span>
                        <span className="font-mono text-sky-700 font-bold tabular-nums">
                          {t.commuteTimeToRafflesPlaceMins} mins
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
                  Best Value Non-Mature Estates
                </div>
                <div className="space-y-2 text-xs">
                  {HDB_TOWNS_DATA.filter((t) => !t.isMature)
                    .slice(0, 3)
                    .map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTown(t)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <div>
                          <span className="font-semibold text-slate-800">{t.name}</span>
                          <span className="text-[10px] text-slate-400 block">
                            ~{t.avgRemainingLeaseYears} yrs lease
                          </span>
                        </div>
                        <span className="font-mono text-slate-900 font-bold tabular-nums">
                          {formatSGD(
                            t.prices[affordabilityInput.selectedFlatType]?.medianPrice ||
                              t.overallMedian
                          )}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab View 2: Affordability Calculator & Budget View */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Singapore HDB Affordability & CPF Grants Calculator
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Tune your household income, cash, CPF savings, loan preferences, and grants eligibility under official HDB and MAS MSR/TDSR rules.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AffordabilityPanel
                  input={affordabilityInput}
                  onChangeInput={setAffordabilityInput}
                  result={affordabilityResult}
                  affordableTownsCount={affordableTownsCount}
                  totalTownsCount={26}
                  onOpenGrantInfo={() => setIsGrantModalOpen(true)}
                />
              </div>

              {/* Side Guide & Towns matching sidebar */}
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Affordable Towns for {affordabilityInput.selectedFlatType}
                  </h3>

                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {HDB_TOWNS_DATA.map((town) => {
                      const price =
                        town.prices[affordabilityInput.selectedFlatType]?.medianPrice ||
                        town.overallMedian;
                      const status = getAffordabilityStatus(
                        price,
                        affordabilityResult.maxAffordablePrice
                      );

                      if (status !== 'affordable') return null;

                      return (
                        <div
                          key={town.id}
                          onClick={() => {
                            setSelectedTown(town);
                            setActiveTab('map');
                          }}
                          className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900">{town.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {town.commuteTimeToRafflesPlaceMins} min to CBD
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-emerald-700 tabular-nums">
                              {formatSGD(price)}
                            </span>
                            <span className="block text-[10px] text-slate-400">Median</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setActiveTab('map')}
                    className="w-full py-2 px-3 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-center block"
                  >
                    View Matching Towns on Map →
                  </button>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs text-slate-600">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>How Your Budget is Calculated</span>
                  </div>
                  <p>
                    <strong>1. MSR 30% Cap:</strong> Under MAS regulations, monthly repayments for HDB resale flats cannot exceed 30% of your combined gross monthly income.
                  </p>
                  <p>
                    <strong>2. Loan-to-Value (LTV):</strong> Up to 80% for HDB Concessionary Loan (2.6% p.a.) or 75% for commercial bank loans.
                  </p>
                  <p>
                    <strong>3. CPF Housing Grants:</strong> Up to $80,000 EHG + $80,000 Family Grant + $30,000 PHG are factored in to reduce your cash downpayment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab View 3: Bus Transport Timings & Journey Planner */}
        {activeTab === 'transit' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Singapore Bus Transport Timings & Commute Planner
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Check real-time style bus arrivals at town interchanges and plan public transit routes to key Singapore workplace hubs by departure timing.
              </p>
            </div>

            <TransportTimingsPlanner
              selectedTown={selectedTown}
              onSelectTown={setSelectedTown}
              selectedLandmarkId={selectedLandmarkId}
              onSelectLandmark={setSelectedLandmarkId}
            />
          </div>
        )}

        {/* Tab View 4: Complete Resale Prices Data Table */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Data.gov.sg HDB Resale Prices (Collection 189)
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Examine comprehensive resale prices, unit sizes, price-per-square-meter, and remaining leases across all 26 Singapore HDB estates.
              </p>
            </div>

            <TownComparisonTable
              selectedFlatType={affordabilityInput.selectedFlatType}
              affordabilityResult={affordabilityResult}
              onSelectTown={(town) => {
                setSelectedTown(town);
                setActiveTab('map');
              }}
              onPlanCommute={handlePlanCommuteFromTown}
            />
          </div>
        )}
      </main>

      {/* Side Slide-Over Drawer for Selected Town */}
      <TownDetailDrawer
        town={selectedTown}
        onClose={() => setSelectedTown(null)}
        selectedFlatType={affordabilityInput.selectedFlatType}
        affordabilityResult={affordabilityResult}
        onPlanCommute={handlePlanCommuteFromTown}
      />

      {/* CPF Housing Grants Explainer Modal */}
      <GrantExplainerModal
        isOpen={isGrantModalOpen}
        onClose={() => setIsGrantModalOpen(false)}
      />

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>Where should I live? Singapore HDB Affordability & Bus Transport</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Data source: Data.gov.sg (Collection 189) & LTA DataMall</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGrantModalOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              CPF Grants Guide
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              26 Towns Dataset
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
