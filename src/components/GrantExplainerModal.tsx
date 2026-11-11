import React from 'react';
import { X, Sparkles, Check, HelpCircle, ShieldCheck } from 'lucide-react';
import { formatSGD } from '../utils/transitRouter';

interface GrantExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrantExplainerModal: React.FC<GrantExplainerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
              Official Singapore CPF Housing Grants
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              How HDB Resale Grants Work (Up to $190,000 Subsidies)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 leading-relaxed">
          {/* Grant 1: EHG */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                1. Enhanced CPF Housing Grant (EHG)
              </span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md text-xs">
                Up to $80,000
              </span>
            </div>
            <p>
              Means-tested grant for lower-to-middle income households. Income ceiling is $9,000/month for families ($4,500 for singles). The subsidy scales inversely with income: households earning $\le$ $1,500 receive the full $80,000.
            </p>
          </div>

          {/* Grant 2: CPF Housing Grant (Family Grant) */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                2. CPF Housing Grant (Resale Flats)
              </span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md text-xs">
                Up to $80,000
              </span>
            </div>
            <p>
              Available to first-timer Singapore Citizen couples/families purchasing a resale flat.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li><strong>2- to 4-Room flats:</strong> $80,000 (household income cap $14,000/mo)</li>
              <li><strong>5-Room or larger flats:</strong> $50,000</li>
              <li><strong>Singles:</strong> $40,000 (2- to 4-room) or $25,000 (5-room) with $7,000 income cap</li>
            </ul>
          </div>

          {/* Grant 3: Proximity Housing Grant (PHG) */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                3. Proximity Housing Grant (PHG)
              </span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md text-xs">
                Up to $30,000
              </span>
            </div>
            <p>
              Granted to resale flat buyers living with or near parents or children. No income ceiling and not restricted to first-timers!
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li><strong>Living near (within 4km):</strong> $20,000 for families ($10,000 for singles)</li>
              <li><strong>Living with parents/children:</strong> $30,000 for families ($15,000 for singles)</li>
            </ul>
          </div>

          {/* Summary Box */}
          <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-xs font-bold text-emerald-900">
                Grants are credited directly to your CPF Ordinary Account (OA)
              </strong>
              <span className="text-[11px] text-emerald-800">
                They count directly towards your flat purchase price and initial downpayment, drastically lowering the loan quantum and cash outlay needed.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
