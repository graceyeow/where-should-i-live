import React from 'react';
import { Home, Compass, Calculator, Bus, BarChart3 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'calculator' | 'transit' | 'data';
  setActiveTab: (tab: 'map' | 'calculator' | 'transit' | 'data') => void;
  onOpenCalculator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCalculator,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            SG
          </div>
          <div>
            <a href="/" className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block">
              Where should I live?
            </a>
            <span className="text-xs text-slate-500 hidden sm:inline">Singapore HDB Affordability & Bus Transit</span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'map' ? 'text-slate-900 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>Interactive Map</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'calculator' ? 'text-slate-900 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4 text-slate-500" />
            <span>Budget & Grants</span>
          </button>

          <button
            onClick={() => setActiveTab('transit')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'transit' ? 'text-slate-900 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            <Bus className="w-4 h-4 text-slate-500" />
            <span>Bus Timings & Commute</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'data' ? 'text-slate-900 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>Resale Data (Data.gov.sg)</span>
          </button>
        </nav>

        {/* Zone 3: Primary CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenCalculator}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Adjust Budget</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50 px-2 py-2">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'map' ? 'text-slate-950 font-semibold' : 'text-slate-500'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span>Map</span>
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'calculator' ? 'text-slate-950 font-semibold' : 'text-slate-500'
          }`}
        >
          <Calculator className="w-4 h-4 mb-0.5" />
          <span>Affordability</span>
        </button>
        <button
          onClick={() => setActiveTab('transit')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'transit' ? 'text-slate-950 font-semibold' : 'text-slate-500'
          }`}
        >
          <Bus className="w-4 h-4 mb-0.5" />
          <span>Bus Timings</span>
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
            activeTab === 'data' ? 'text-slate-950 font-semibold' : 'text-slate-500'
          }`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span>Resale Prices</span>
        </button>
      </div>
    </header>
  );
};
