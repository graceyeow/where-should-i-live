export type FlatType = '2-Room' | '3-Room' | '4-Room' | '5-Room' | 'Executive';

export type TownRegion = 'Central' | 'East' | 'West' | 'North' | 'North-East';

export interface FlatPriceDetail {
  medianPrice: number;
  minPrice: number;
  maxPrice: number;
  avgSqm: number;
  pricePerSqm: number;
  transactionCount: number;
}

export interface TownData {
  id: string;
  name: string;
  region: TownRegion;
  isMature: boolean;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  prices: Partial<Record<FlatType, FlatPriceDetail>>;
  overallMedian: number;
  avgRemainingLeaseYears: number;
  mrtStations: string[];
  majorBusInterchange: string;
  nearbyBusServices: string[];
  keyAmenities: string[];
  commuteTimeToRafflesPlaceMins: number;
  commuteTimeToJurongEastMins: number;
  commuteTimeToChangiMins: number;
}

export interface AffordabilityInput {
  householdIncome: number;
  cashSavings: number;
  cpfOaSavings: number;
  applicantType: 'first_timer_family' | 'second_timer_family' | 'first_timer_single';
  nearParents: boolean; // For Proximity Housing Grant
  loanType: 'hdb' | 'bank';
  interestRate: number; // e.g., 2.6 for HDB, 3.1 for Bank
  tenureYears: number; // e.g., 25 years
  otherMonthlyDebt: number; // Car loans, personal loans, etc.
  selectedFlatType: FlatType;
}

export interface AffordabilityResult {
  maxAffordablePrice: number;
  maxLoanAmount: number;
  monthlyMortgage: number;
  msrRatio: number; // Percentage of income spent on mortgage
  totalDownpaymentRequired: number;
  cpfGrantEligible: {
    ehg: number; // Enhanced CPF Housing Grant
    cpfFamilyGrant: number; // Core CPF Housing Grant
    phg: number; // Proximity Housing Grant
    totalGrants: number;
  };
  cashRequired: number;
  cpfOaUsed: number;
  isBudgetSafe: boolean;
}

export type AffordabilityStatus = 'affordable' | 'stretch' | 'over_budget';

export interface BusArrivalInfo {
  serviceNo: string;
  destination: string;
  nextBusMins: number;
  subsequentBusMins: number;
  thirdBusMins: number;
  load: 'seats_available' | 'standing_available' | 'limited_standing';
  type: 'Single Deck' | 'Double Deck' | 'Bendy';
  wheelchair: boolean;
  frequencyPeakMins: number;
  frequencyOffPeakMins: number;
  operatingHours: string;
}

export interface BusStopLocation {
  code: string;
  name: string;
  road: string;
  townId: string;
  coordinates: [number, number];
  services: string[];
}

export interface TransitRouteStep {
  mode: 'walk' | 'bus' | 'mrt';
  serviceOrLine?: string;
  from: string;
  to: string;
  durationMins: number;
  stopsCount?: number;
  headwayMins?: number;
  departureTime?: string;
  arrivalTime?: string;
  instructions: string;
}

export type DestinationCategory =
  | 'Universities & Education'
  | 'CBD & Commercial Towers'
  | 'Tech, Science & Innovation'
  | 'Hospitals & Medical'
  | 'Transport Hubs & Retail';

export interface TransitDestination {
  id: string;
  name: string;
  landmark: string;
  busStopCode: string;
  busStopName: string;
  road: string;
  category: DestinationCategory;
  coordinates: [number, number];
  mrtStation: string;
  popularBusServices: string[];
}

export interface TransitJourneyPlan {
  originName: string;
  destinationName: string;
  destinationLandmark: string;
  destinationBusStopCode: string;
  destinationBusStopName: string;
  departureTime: string;
  totalDurationMins: number;
  totalWalkTimeMins: number;
  fareEstimate: number;
  steps: TransitRouteStep[];
  primaryBusServices: string[];
  co2SavingsKg: number;
}

