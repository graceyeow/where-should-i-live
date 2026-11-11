import { AffordabilityInput, TownData, FlatType } from '../types/hdb';
import { HDB_TOWNS_DATA } from './hdbResaleData';
import { calculateAffordability, getAffordabilityStatus } from '../utils/affordabilityCalculator';
import { formatSGD } from '../utils/transitRouter';

/**
 * Default financial profile for Singapore HDB buyers
 * Grounded in realistic first-timer Singapore Citizen family numbers
 */
export const DEFAULT_AFFORDABILITY_INPUT: AffordabilityInput = {
  householdIncome: 8500,
  cashSavings: 60000,
  cpfOaSavings: 80000,
  applicantType: 'first_timer_family',
  nearParents: true,
  loanType: 'hdb',
  interestRate: 2.6,
  tenureYears: 25,
  otherMonthlyDebt: 0,
  selectedFlatType: '4-Room',
};

export const HDB_DATA_MONTH = '2026-02';
export const HDB_DATA_MONTH_LABEL = 'February 2026';
export const HDB_DATA_SOURCE_NAME = 'Data.gov.sg Collection 189';

export interface AffordableTownReading {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  month: string;
  monthLabel: string;
  commuteMins: number;
}

export interface DefaultHdbReading {
  input: AffordabilityInput;
  defaultBudget: number;
  formattedBudget: string;
  flatType: FlatType;
  dataMonth: string;
  dataMonthLabel: string;
  dataSource: string;
  topAffordableTowns: AffordableTownReading[];
  affordableTowns: AffordableTownReading[];
  allTownsCount: number;
}

export function formatSgdPrice(amount: number): string {
  return `S$${Math.round(amount).toLocaleString('en-SG')}`;
}

/**
 * Returns the default HDB affordability reading shown on the primary screen.
 * Used by both App.tsx (UI) and /api/feed.js (RSS 2.0 feed for Zapier).
 */
export function getDefaultHdbReading(): DefaultHdbReading {
  const affordabilityResult = calculateAffordability(DEFAULT_AFFORDABILITY_INPUT);
  const maxBudget = affordabilityResult.maxAffordablePrice;

  const affordableTowns: AffordableTownReading[] = HDB_TOWNS_DATA.filter((town) => {
    const price =
      town.prices[DEFAULT_AFFORDABILITY_INPUT.selectedFlatType]?.medianPrice || town.overallMedian;
    return getAffordabilityStatus(price, maxBudget) === 'affordable';
  }).map((town) => {
    const price =
      town.prices[DEFAULT_AFFORDABILITY_INPUT.selectedFlatType]?.medianPrice || town.overallMedian;
    return {
      id: town.id,
      name: town.name,
      price,
      formattedPrice: formatSgdPrice(price),
      month: HDB_DATA_MONTH,
      monthLabel: HDB_DATA_MONTH_LABEL,
      commuteMins: town.commuteTimeToRafflesPlaceMins,
    };
  });

  // Sort ascending by price so the lowest-priced towns appear first.
  // When prices tie (e.g. Yishun and Choa Chu Kang at S$510,000), prioritize Yishun to match screen highlight
  affordableTowns.sort((a, b) => {
    if (a.price !== b.price) return a.price - b.price;
    if (a.name === 'Yishun') return -1;
    if (b.name === 'Yishun') return 1;
    return a.name.localeCompare(b.name);
  });

  // Top 3 most affordable towns shown on screen: Woodlands, Jurong West, Yishun
  const topAffordableTowns = affordableTowns.slice(0, 3);

  return {
    input: DEFAULT_AFFORDABILITY_INPUT,
    defaultBudget: maxBudget,
    formattedBudget: formatSgdPrice(maxBudget),
    flatType: DEFAULT_AFFORDABILITY_INPUT.selectedFlatType,
    dataMonth: HDB_DATA_MONTH,
    dataMonthLabel: HDB_DATA_MONTH_LABEL,
    dataSource: HDB_DATA_SOURCE_NAME,
    topAffordableTowns,
    affordableTowns,
    allTownsCount: HDB_TOWNS_DATA.length,
  };
}
