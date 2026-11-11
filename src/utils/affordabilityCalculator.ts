import { AffordabilityInput, AffordabilityResult, AffordabilityStatus, FlatType } from '../types/hdb';

/**
 * Calculates Enhanced CPF Housing Grant (EHG) based on gross monthly income
 */
export function calculateEHG(income: number, isSingle: boolean): number {
  const maxIncome = isSingle ? 4500 : 9000;
  if (income > maxIncome) return 0;

  // Brackets for Family (half for single)
  const brackets = [
    { max: 1500, amount: 80000 },
    { max: 2000, amount: 75000 },
    { max: 2500, amount: 70000 },
    { max: 3000, amount: 65000 },
    { max: 3500, amount: 60000 },
    { max: 4000, amount: 55000 },
    { max: 4500, amount: 50000 },
    { max: 5000, amount: 45000 },
    { max: 5500, amount: 40000 },
    { max: 6000, amount: 35000 },
    { max: 6500, amount: 30000 },
    { max: 7000, amount: 25000 },
    { max: 7500, amount: 20000 },
    { max: 8000, amount: 15000 },
    { max: 8500, amount: 10000 },
    { max: 9000, amount: 5000 },
  ];

  const compareIncome = isSingle ? income * 2 : income;
  const match = brackets.find(b => compareIncome <= b.max);
  const baseGrant = match ? match.amount : 0;
  return isSingle ? baseGrant / 2 : baseGrant;
}

/**
 * Calculates CPF Housing Grant (Family Grant or Singles Grant)
 */
export function calculateCPFCoreGrant(income: number, applicantType: string, flatType: FlatType): number {
  if (applicantType === 'second_timer_family') {
    return 0; // Second-timers generally not eligible for first-timer grants
  }

  const isSmallOrMidFlat = flatType === '2-Room' || flatType === '3-Room' || flatType === '4-Room';

  if (applicantType === 'first_timer_single') {
    if (income > 7000) return 0;
    return isSmallOrMidFlat ? 40000 : 25000;
  }

  // First-timer Family
  if (income > 14000) return 0;
  return isSmallOrMidFlat ? 80000 : 50000;
}

/**
 * Calculates Proximity Housing Grant (PHG)
 */
export function calculatePHG(nearParents: boolean, isSingle: boolean): number {
  if (!nearParents) return 0;
  return isSingle ? 10000 : 20000;
}

/**
 * Comprehensive Singapore HDB Affordability Calculator
 */
export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const isSingle = input.applicantType === 'first_timer_single';
  const isSecondTimer = input.applicantType === 'second_timer_family';

  // 1. Calculate Grants
  const ehg = isSecondTimer ? 0 : calculateEHG(input.householdIncome, isSingle);
  const cpfFamilyGrant = calculateCPFCoreGrant(input.householdIncome, input.applicantType, input.selectedFlatType);
  const phg = calculatePHG(input.nearParents, isSingle);
  const totalGrants = ehg + cpfFamilyGrant + phg;

  // 2. MSR (30%) & TDSR (55%) regulatory caps
  // MSR applies to HDB: maximum 30% of gross monthly income for mortgage
  const maxMonthlyMSR = input.householdIncome * 0.30;
  // TDSR cap: 55% minus other non-mortgage monthly debts
  const maxMonthlyTDSR = Math.max(0, (input.householdIncome * 0.55) - (input.otherMonthlyDebt || 0));

  // Actual permissible monthly mortgage payment
  const permissibleMonthlyPayment = Math.min(maxMonthlyMSR, maxMonthlyTDSR);

  // 3. Loan sizing based on monthly permissible payment
  const monthlyRate = (input.interestRate / 100) / 12;
  const numPayments = Math.min(input.loanType === 'hdb' ? 25 : 30, input.tenureYears) * 12;

  // Present Value formula: PV = PMT * [1 - (1 + r)^(-n)] / r
  let maxLoan = 0;
  if (monthlyRate > 0 && numPayments > 0) {
    maxLoan = permissibleMonthlyPayment * (1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate;
  }

  // Round max loan to nearest $1,000
  maxLoan = Math.round(maxLoan / 1000) * 1000;

  // 4. LTV and Downpayment calculations
  const maxLTV = input.loanType === 'hdb' ? 0.80 : 0.75;
  const minCashDownpaymentPercent = input.loanType === 'hdb' ? 0.0 : 0.05;

  const availableLiquidFunds = input.cashSavings + input.cpfOaSavings + totalGrants;

  // Affordable purchase price derived from:
  // Price <= Loan + Downpayment funds
  // Price <= Loan / maxLTV
  // Price <= Downpayment funds / (1 - maxLTV)
  const priceByFundsAndLoan = availableLiquidFunds + maxLoan;
  const priceByLtvCeiling = maxLoan / maxLTV;
  const priceByDownpayment = availableLiquidFunds / (1 - maxLTV);

  const maxAffordablePrice = Math.min(priceByFundsAndLoan, priceByLtvCeiling, priceByDownpayment);

  // Actual monthly mortgage on the max loan amount
  const monthlyMortgage = permissibleMonthlyPayment;
  const msrRatio = input.householdIncome > 0 ? (monthlyMortgage / input.householdIncome) * 100 : 0;

  const totalDownpaymentRequired = maxAffordablePrice * (1 - maxLTV);
  const minCashRequired = maxAffordablePrice * minCashDownpaymentPercent;

  const cashUsed = Math.min(input.cashSavings, Math.max(minCashRequired, totalDownpaymentRequired - input.cpfOaSavings - totalGrants));
  const cpfOaUsed = Math.min(input.cpfOaSavings, Math.max(0, totalDownpaymentRequired - totalGrants - cashUsed));

  return {
    maxAffordablePrice: Math.max(0, Math.round(maxAffordablePrice / 1000) * 1000),
    maxLoanAmount: maxLoan,
    monthlyMortgage: Math.round(monthlyMortgage),
    msrRatio: Math.round(msrRatio * 10) / 10,
    totalDownpaymentRequired: Math.round(totalDownpaymentRequired),
    cpfGrantEligible: {
      ehg,
      cpfFamilyGrant,
      phg,
      totalGrants,
    },
    cashRequired: Math.max(0, Math.round(cashUsed)),
    cpfOaUsed: Math.max(0, Math.round(cpfOaUsed)),
    isBudgetSafe: msrRatio <= 28,
  };
}

/**
 * Determines whether a town's flat price is Affordable, Stretch, or Over Budget
 */
export function getAffordabilityStatus(flatPrice: number, maxAffordablePrice: number): AffordabilityStatus {
  if (flatPrice <= maxAffordablePrice * 0.95) {
    return 'affordable';
  } else if (flatPrice <= maxAffordablePrice * 1.10) {
    return 'stretch';
  } else {
    return 'over_budget';
  }
}
