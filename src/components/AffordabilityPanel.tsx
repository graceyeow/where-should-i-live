import React from 'react';
import { AffordabilityInput, AffordabilityResult, FlatType } from '../types/hdb';
import { FLAT_TYPES } from '../data/hdbResaleData';
import { formatSGD } from '../utils/transitRouter';
import { ShieldCheck, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';

interface AffordabilityPanelProps {
  input: AffordabilityInput;
  onChangeInput: (newInput: AffordabilityInput) => void;
  result: AffordabilityResult;
  affordableTownsCount: number;
  totalTownsCount: number;
  onOpenGrantInfo: () => void;
}

export const AffordabilityPanel: React.FC<AffordabilityPanelProps> = ({
  input,
  onChangeInput,
  result,
  affordableTownsCount,
  totalTownsCount,
  onOpenGrantInfo,
}) => {
  const handleIncomeChange = (val: number) => {
    onChangeInput({ ...input, householdIncome: Math.max(0, val) });
  };

  const handleCashChange = (val: number) => {
    onChangeInput({ ...input, cashSavings: Math.max(0, val) });
  };

  const handleCpfChange = (val: number) => {
    onChangeInput({ ...input, cpfOaSavings: Math.max(0, val) });
  };

  const handleLoanType = (type: 'hdb' | 'bank') => {
    onChangeInput({
      ...input,
      loanType: type,
      interestRate: type === 'hdb' ? 2.6 : 3.0,
      tenureYears: type === 'hdb' ? Math.min(25, input.tenureYears) : input.tenureYears,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
      {/* Header section with budget KPI banner */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-t-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <span>HDB Affordability Ceiling</span>
              <span aria-hidden="true">·</span>
              <span>MSR 30% Compliant</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight text-white">
              {formatSGD(result.maxAffordablePrice)}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Estimated Max Monthly Mortgage:</span>
              <strong className="text-slate-200 font-mono tabular-nums">{formatSGD(result.monthlyMortgage)}/mo</strong>
              <span className="text-slate-500">({result.msrRatio}% of income)</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg p-3 text-right">
            <div className="text-xs text-slate-400">Town Matches</div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-400">
              {affordableTownsCount} <span className="text-xs font-normal text-slate-400">/ {totalTownsCount} Towns</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              for {input.selectedFlatType} flats
            </div>
          </div>
        </div>
      </div>

      {/* Target Flat Type Selector */}
      <div className="p-4 sm:p-5">
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Target Flat Type
        </label>
        <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-lg">
          {FLAT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChangeInput({ ...input, selectedFlatType: type })}
              className={`py-2 px-2 text-xs font-medium rounded-md transition-all cursor-pointer truncate ${
                input.selectedFlatType === type
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Form */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Household Monthly Income */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Gross Monthly Household Income
            </label>
            <span className="text-xs font-mono font-semibold text-slate-900 tabular-nums">
              {formatSGD(input.householdIncome)}/mo
            </span>
          </div>
          <input
            type="range"
            min={2000}
            max={25000}
            step={250}
            value={input.householdIncome}
            onChange={(e) => handleIncomeChange(Number(e.target.value))}
            className="w-full accent-slate-900 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>$2,000</span>
            <span>Median ($8,500)</span>
            <span>$25,000</span>
          </div>
        </div>

        {/* Liquid Savings Row: Cash & CPF OA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Cash Savings for Downpayment
              </label>
              <span className="text-xs font-mono font-semibold text-slate-900 tabular-nums">
                {formatSGD(input.cashSavings)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={300000}
              step={5000}
              value={input.cashSavings}
              onChange={(e) => handleCashChange(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                CPF Ordinary Account (OA)
              </label>
              <span className="text-xs font-mono font-semibold text-slate-900 tabular-nums">
                {formatSGD(input.cpfOaSavings)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={400000}
              step={5000}
              value={input.cpfOaSavings}
              onChange={(e) => handleCpfChange(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
            />
          </div>
        </div>

        {/* Applicant Type & Proximity Grant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Buyer Category
            </label>
            <select
              value={input.applicantType}
              onChange={(e) =>
                onChangeInput({
                  ...input,
                  applicantType: e.target.value as AffordabilityInput['applicantType'],
                })
              }
              className="w-full text-xs font-medium py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="first_timer_family">First-Timer Couple / Family</option>
              <option value="first_timer_single">Single Citizen (Age 35+)</option>
              <option value="second_timer_family">Second-Timer Family</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Proximity Housing Grant (PHG)
            </label>
            <button
              type="button"
              onClick={() => onChangeInput({ ...input, nearParents: !input.nearParents })}
              className={`w-full py-2 px-3 text-xs font-medium rounded-lg border transition-all text-left flex items-center justify-between cursor-pointer ${
                input.nearParents
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span>{input.nearParents ? '✓ Within 4km of parents (+$20k)' : 'Not near parents ($0)'}</span>
              <span className="text-[11px] text-slate-500">{input.nearParents ? 'Eligible' : 'Toggle'}</span>
            </button>
          </div>
        </div>

        {/* Loan Type & Tenure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Financing Loan Type
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => handleLoanType('hdb')}
                className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  input.loanType === 'hdb'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                HDB Loan (2.6%)
              </button>
              <button
                type="button"
                onClick={() => handleLoanType('bank')}
                className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  input.loanType === 'bank'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bank Loan (3.0%)
              </button>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {input.loanType === 'hdb' ? '80% LTV · Max 25 yrs · No min cash' : '75% LTV · Max 30 yrs · 5% min cash'}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Loan Tenure
              </label>
              <span className="text-xs font-mono font-semibold text-slate-900">
                {input.tenureYears} Years
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={input.loanType === 'hdb' ? 25 : 30}
              step={1}
              value={input.tenureYears}
              onChange={(e) => onChangeInput({ ...input, tenureYears: Number(e.target.value) })}
              className="w-full accent-slate-900 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none mt-2"
            />
          </div>
        </div>
      </div>

      {/* Financial Breakdown & CPF Grants Summary */}
      <div className="p-5 sm:p-6 bg-slate-50 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 tracking-wide">
            Eligible Subsidies & Financing Structure
          </h4>
          <button
            type="button"
            onClick={onOpenGrantInfo}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Grant Details</span>
          </button>
        </div>

        {/* Grants Card */}
        <div className="p-3.5 bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-900 mb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Total CPF Housing Grants
            </span>
            <span className="font-mono text-emerald-600 tabular-nums font-bold">
              +{formatSGD(result.cpfGrantEligible.totalGrants)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
            <div>
              <span className="block text-slate-400">EHG:</span>
              <span className="font-mono font-semibold tabular-nums text-slate-800">
                {formatSGD(result.cpfGrantEligible.ehg)}
              </span>
            </div>
            <div>
              <span className="block text-slate-400">CPF Family:</span>
              <span className="font-mono font-semibold tabular-nums text-slate-800">
                {formatSGD(result.cpfGrantEligible.cpfFamilyGrant)}
              </span>
            </div>
            <div>
              <span className="block text-slate-400">Proximity (PHG):</span>
              <span className="font-mono font-semibold tabular-nums text-slate-800">
                {formatSGD(result.cpfGrantEligible.phg)}
              </span>
            </div>
          </div>
        </div>

        {/* Downpayment & Loan Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="block text-[11px] text-slate-500">Max Loan Amount</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-slate-900 tabular-nums">
              {formatSGD(result.maxLoanAmount)}
            </span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="block text-[11px] text-slate-500">Required Downpayment</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-slate-900 tabular-nums">
              {formatSGD(result.totalDownpaymentRequired)}
            </span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="block text-[11px] text-slate-500">CPF OA Deployed</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-slate-900 tabular-nums">
              {formatSGD(result.cpfOaUsed)}
            </span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="block text-[11px] text-slate-500">Min Cash Outflow</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-slate-900 tabular-nums">
              {formatSGD(result.cashRequired)}
            </span>
          </div>
        </div>

        {/* Regulatory Safeguard Notice */}
        <div className="flex items-start gap-2 text-xs text-slate-500 pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Calculated strictly under Singapore Monetary Authority of Singapore (MAS) and HDB guidelines: 30% MSR cap, 55% TDSR cap, and {input.loanType === 'hdb' ? '80%' : '75%'} Loan-to-Value limit.
          </span>
        </div>
      </div>
    </div>
  );
};
