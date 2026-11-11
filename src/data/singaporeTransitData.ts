import { BusStopLocation, BusArrivalInfo, TransitDestination, DestinationCategory } from '../types/hdb';

export const DESTINATION_CATEGORIES: DestinationCategory[] = [
  'Universities & Education',
  'CBD & Commercial Towers',
  'Tech, Science & Innovation',
  'Hospitals & Medical',
  'Transport Hubs & Retail',
];

/**
 * Authentic Singapore Building Landmarks & Bus Stop Destinations
 * Including SMU (Singapore Management University), NUS, NTU, CapitaSpring, SGH, etc.
 */
export const LANDMARK_DESTINATIONS: TransitDestination[] = [
  {
    id: 'smu-bras-basah',
    name: 'Singapore Management University (SMU)',
    landmark: 'SMU Li Ka Shing Library / City Campus',
    busStopCode: '04121',
    busStopName: 'SMU (Bras Basah Rd)',
    road: 'Bras Basah Rd',
    category: 'Universities & Education',
    coordinates: [1.2963, 103.8502],
    mrtStation: 'Bras Basah (CC2) / Bencoolen (DT21) / City Hall (EW13/NS25)',
    popularBusServices: ['7', '14', '16', '36', '77', '106', '111', '124', '131', '147', '166', '167', '174', '175', '190', '857'],
  },
  {
    id: 'smu-stamford',
    name: 'SMU School of Economics & Social Sciences',
    landmark: 'SMU Connexion / Stamford Road Campus',
    busStopCode: '04179',
    busStopName: 'Opp SMU (Stamford Rd)',
    road: 'Stamford Rd',
    category: 'Universities & Education',
    coordinates: [1.2954, 103.8508],
    mrtStation: 'Bras Basah (CC2) / City Hall (EW13/NS25)',
    popularBusServices: ['7', '14', '16', '36', '77', '106', '111', '124', '131', '147', '166', '167', '174', '190'],
  },
  {
    id: 'nus-utown',
    name: 'National University of Singapore (NUS UTown)',
    landmark: 'NUS University Town & Central Library',
    busStopCode: '16189',
    busStopName: 'NUS Central Library (Kent Ridge Cres)',
    road: 'Kent Ridge Cres',
    category: 'Universities & Education',
    coordinates: [1.2966, 103.7764],
    mrtStation: 'Kent Ridge (CC24)',
    popularBusServices: ['95', '96', '151', '151e'],
  },
  {
    id: 'ntu-north-spine',
    name: 'Nanyang Technological University (NTU)',
    landmark: 'NTU North Spine & The Hive',
    busStopCode: '27211',
    busStopName: 'NTU North Spine (Nanyang Dr)',
    road: 'Nanyang Dr',
    category: 'Universities & Education',
    coordinates: [1.3483, 103.6831],
    mrtStation: 'Pioneer (EW28) / Boon Lay (EW27)',
    popularBusServices: ['179', '179A', '199'],
  },
  {
    id: 'sp-dover',
    name: 'Singapore Polytechnic (SP)',
    landmark: 'Singapore Poly Campus Plaza & School of Business',
    busStopCode: '19029',
    busStopName: 'SP Dover Stn Exit A (Commonwealth Ave West)',
    road: 'Commonwealth Ave West',
    category: 'Universities & Education',
    coordinates: [1.3115, 103.7780],
    mrtStation: 'Dover (EW22)',
    popularBusServices: ['14', '74', '105', '106', '147', '166', '196'],
  },
  {
    id: 'np-clementi',
    name: 'Ngee Ann Polytechnic (NP)',
    landmark: 'Ngee Ann Poly Convention Centre & Sports Complex',
    busStopCode: '12109',
    busStopName: 'Ngee Ann Poly (Clementi Rd)',
    road: 'Clementi Rd',
    category: 'Universities & Education',
    coordinates: [1.3325, 103.7758],
    mrtStation: 'King Albert Park (DT6) / Beauty World (DT5)',
    popularBusServices: ['52', '61', '74', '75', '151', '154', '184'],
  },
  {
    id: 'sutd-changi',
    name: 'Singapore University of Technology & Design (SUTD)',
    landmark: 'SUTD Academic Building 1 & Campus Hub',
    busStopCode: '96449',
    busStopName: 'Opp SUTD (Somapah Rd)',
    road: 'Somapah Rd',
    category: 'Universities & Education',
    coordinates: [1.3413, 103.9634],
    mrtStation: 'Upper Changi (DT34) / Expo (CG1/DT35)',
    popularBusServices: ['20', '24', '118'],
  },
  {
    id: 'capitaspring-market-st',
    name: 'CapitaSpring & Market Street',
    landmark: 'CapitaSpring Sky Garden & Food Centre',
    busStopCode: '03059',
    busStopName: 'OCBC Ctr (Chulia St)',
    road: 'Chulia St',
    category: 'CBD & Commercial Towers',
    coordinates: [1.2848, 103.8496],
    mrtStation: 'Raffles Place (EW14/NS26) / Telok Ayer (DT18)',
    popularBusServices: ['186', '970'],
  },
  {
    id: 'raffles-place-republic',
    name: 'One Raffles Place & Republic Plaza',
    landmark: 'Republic Plaza & Raffles Place Park (CBD Heart)',
    busStopCode: '03019',
    busStopName: 'Raffles Place Stn Exit F (Cecil St)',
    road: 'Cecil St',
    category: 'CBD & Commercial Towers',
    coordinates: [1.2838, 103.8515],
    mrtStation: 'Raffles Place (EW14/NS26)',
    popularBusServices: ['10', '70', '100', '107', '130', '167', '196', '970'],
  },
  {
    id: 'marina-bay-mbfc',
    name: 'Marina Bay Financial Centre (MBFC)',
    landmark: 'MBFC Towers 1, 2, 3 & Marina Bay Waterfront',
    busStopCode: '03509',
    busStopName: 'Marina Bay Financial Ctr (Marina Blvd)',
    road: 'Marina Blvd',
    category: 'CBD & Commercial Towers',
    coordinates: [1.2792, 103.8545],
    mrtStation: 'Downtown (DT17) / Marina Bay (NS27/CC32/TE20)',
    popularBusServices: ['97', '106', '133', '400', '502', '513'],
  },
  {
    id: 'guoco-tower-tanjong-pagar',
    name: 'Guoco Tower (Tanjong Pagar Centre)',
    landmark: 'Guoco Tower & Tanjong Pagar Urban Park',
    busStopCode: '05429',
    busStopName: 'Tanjong Pagar Stn Exit C (Anson Rd)',
    road: 'Anson Rd',
    category: 'CBD & Commercial Towers',
    coordinates: [1.2764, 103.8458],
    mrtStation: 'Tanjong Pagar (EW15) / Maxwell (TE18)',
    popularBusServices: ['10', '75', '97', '100', '130', '167', '196'],
  },
  {
    id: 'suntec-city',
    name: 'Suntec City & Convention Centre',
    landmark: 'Suntec Tower Two & Fountain of Wealth',
    busStopCode: '02089',
    busStopName: 'Suntec Tower Two (Temasek Blvd)',
    road: 'Temasek Blvd',
    category: 'CBD & Commercial Towers',
    coordinates: [1.2935, 103.8572],
    mrtStation: 'Promenade (CC4/DT15) / Esplanade (CC3)',
    popularBusServices: ['36', '70M', '97', '106', '111', '133', '502', '518'],
  },
  {
    id: 'paya-lebar-plq',
    name: 'Paya Lebar Quarter (PLQ Mall & Towers)',
    landmark: 'PLQ Grade A Office Towers & Commercial Hub',
    busStopCode: '81111',
    busStopName: 'Paya Lebar Stn Exit B (Paya Lebar Rd)',
    road: 'Paya Lebar Rd',
    category: 'CBD & Commercial Towers',
    coordinates: [1.3178, 103.8924],
    mrtStation: 'Paya Lebar (EW8/CC9)',
    popularBusServices: ['24', '28', '43', '70', '76', '135', '154', '155'],
  },
  {
    id: 'biopolis-fusionopolis',
    name: 'Biopolis & Fusionopolis (One-North)',
    landmark: 'Fusionopolis Matrix & Symbiosis Tech Towers',
    busStopCode: '18079',
    busStopName: 'one-north Stn Exit A (Fusionopolis Way)',
    road: 'Fusionopolis Way',
    category: 'Tech, Science & Innovation',
    coordinates: [1.2996, 103.7874],
    mrtStation: 'one-north (CC23) / Buona Vista (EW21/CC22)',
    popularBusServices: ['91', '92', '95', '196', '198', '200'],
  },
  {
    id: 'mapletree-business-city',
    name: 'Mapletree Business City (MBC)',
    landmark: 'Mapletree Business City Corporate Campus',
    busStopCode: '15159',
    busStopName: 'Mapletree Business City (Pasir Panjang Rd)',
    road: 'Pasir Panjang Rd',
    category: 'Tech, Science & Innovation',
    coordinates: [1.2750, 103.7997],
    mrtStation: 'Pasir Panjang (CC26) / Labrador Park (CC27)',
    popularBusServices: ['10', '30', '51', '143', '175', '176', '188'],
  },
  {
    id: 'changi-business-park',
    name: 'Changi Business Park (CBP Plaza 8)',
    landmark: 'Plaza 8 Tech Park & Financial Back-Office Hub',
    busStopCode: '96381',
    busStopName: 'Plaza 8 (Changi South Ave 3)',
    road: 'Changi South Ave 3',
    category: 'Tech, Science & Innovation',
    coordinates: [1.3340, 103.9660],
    mrtStation: 'Expo (CG1/DT35)',
    popularBusServices: ['20', '47', '118'],
  },
  {
    id: 'sgh-campus',
    name: 'Singapore General Hospital (SGH Campus)',
    landmark: 'SGH Outram Community Hospital & Medical Centre',
    busStopCode: '06011',
    busStopName: 'SGH Block 3 (Outram Rd)',
    road: 'Outram Rd',
    category: 'Hospitals & Medical',
    coordinates: [1.2798, 103.8349],
    mrtStation: 'Outram Park (EW16/NE3/TE17)',
    popularBusServices: ['147', '166', '167', '196', '197'],
  },
  {
    id: 'ttsh-novena',
    name: 'Tan Tock Seng Hospital (TTSH & Novena)',
    landmark: 'TTSH & HealthCity Novena Medical Center',
    busStopCode: '50131',
    busStopName: 'Tan Tock Seng Hosp (Moulmein Rd)',
    road: 'Moulmein Rd',
    category: 'Hospitals & Medical',
    coordinates: [1.3214, 103.8458],
    mrtStation: 'Novena (NS20)',
    popularBusServices: ['21', '124', '518', '851'],
  },
  {
    id: 'nuh-kent-ridge',
    name: 'National University Hospital (NUH)',
    landmark: 'NUH Main Building & Kent Ridge Wing',
    busStopCode: '18331',
    busStopName: 'NUH Main Bldg (Lower Kent Ridge Rd)',
    road: 'Lower Kent Ridge Rd',
    category: 'Hospitals & Medical',
    coordinates: [1.2941, 103.7831],
    mrtStation: 'Kent Ridge (CC24)',
    popularBusServices: ['95', '97', '197', '198'],
  },
  {
    id: 'marina-bay-sands',
    name: 'Marina Bay Sands (MBS Hotel & Expo)',
    landmark: 'MBS Towers & Sands Expo Convention Centre',
    busStopCode: '03509',
    busStopName: 'Marina Bay Sands Hotel (Bayfront Ave)',
    road: 'Bayfront Ave',
    category: 'Transport Hubs & Retail',
    coordinates: [1.2834, 103.8607],
    mrtStation: 'Bayfront (CE1/DT16)',
    popularBusServices: ['97', '106', '133', '502', '518'],
  },
  {
    id: 'ion-orchard',
    name: 'ION Orchard & Wisma Atria',
    landmark: 'ION Orchard Shopping Belt & MRT Concourse',
    busStopCode: '09023',
    busStopName: 'Orchard Stn / Tangs (Orchard Blvd)',
    road: 'Orchard Blvd',
    category: 'Transport Hubs & Retail',
    coordinates: [1.3040, 103.8318],
    mrtStation: 'Orchard (NS22/TE14)',
    popularBusServices: ['36', '65', '77', '106', '111', '124', '143', '167', '174', '190', '502'],
  },
  {
    id: 'changi-airport-jewel',
    name: 'Changi Airport Terminal 3 & Jewel',
    landmark: 'Jewel Changi Rain Vortex & Terminal 3 PTB',
    busStopCode: '95109',
    busStopName: 'Changi Airport PTB3 (Airport Blvd)',
    road: 'Airport Blvd',
    category: 'Transport Hubs & Retail',
    coordinates: [1.3575, 103.9890],
    mrtStation: 'Changi Airport (CG2)',
    popularBusServices: ['24', '27', '34', '36', '53', '110', '858'],
  },
  {
    id: 'vivocity-harbourfront',
    name: 'VivoCity & HarbourFront Centre',
    landmark: 'VivoCity Mall & Sentosa Boardwalk Concourse',
    busStopCode: '14141',
    busStopName: 'VivoCity (Telok Blangah Rd)',
    road: 'Telok Blangah Rd',
    category: 'Transport Hubs & Retail',
    coordinates: [1.2644, 103.8220],
    mrtStation: 'HarbourFront (NE1/CC29)',
    popularBusServices: ['10', '30', '57', '61', '65', '80', '97', '100', '131', '143', '145', '166', '855'],
  },
  {
    id: 'jem-westgate',
    name: 'JEM & Westgate (Jurong Gateway)',
    landmark: 'JEM Shopping Mall & Jurong East Regional Hub',
    busStopCode: '28009',
    busStopName: 'Jurong East Int (Jurong Gateway Rd)',
    road: 'Jurong Gateway Rd',
    category: 'Transport Hubs & Retail',
    coordinates: [1.3338, 103.7428],
    mrtStation: 'Jurong East (NS1/EW24)',
    popularBusServices: ['49', '51', '52', '66', '78', '97', '105', '143', '160', '183', '197', '333', '334', '502'],
  },
];

// Re-export POPULAR_DESTINATIONS for backwards compatibility
export const POPULAR_DESTINATIONS = LANDMARK_DESTINATIONS;

export const BUS_STOPS: BusStopLocation[] = [
  { code: '04121', name: 'SMU (Bras Basah Rd)', road: 'Bras Basah Rd', townId: 'central-area', coordinates: [1.2963, 103.8502], services: ['7', '14', '16', '36', '77', '106', '111', '124', '131', '147', '166', '167', '174', '175', '190', '857'] },
  { code: '04179', name: 'Opp SMU (Stamford Rd)', road: 'Stamford Rd', townId: 'central-area', coordinates: [1.2954, 103.8508], services: ['7', '14', '16', '36', '77', '106', '111', '124', '131', '147', '166', '167', '174', '190'] },
  { code: '03019', name: 'Raffles Place Stn Exit F', road: 'Cecil St', townId: 'central-area', coordinates: [1.2838, 103.8515], services: ['10', '70', '100', '107', '130', '167', '196', '970'] },
  { code: '03509', name: 'Marina Bay Financial Ctr', road: 'Marina Blvd', townId: 'central-area', coordinates: [1.2792, 103.8545], services: ['97', '106', '133', '400', '502', '513'] },
  { code: '18079', name: 'one-north Stn Exit A', road: 'Fusionopolis Way', townId: 'queenstown', coordinates: [1.2996, 103.7874], services: ['91', '92', '95', '196', '198', '200'] },
  { code: '16189', name: 'NUS Central Library', road: 'Kent Ridge Cres', townId: 'clementi', coordinates: [1.2966, 103.7764], services: ['95', '96', '151', '151e'] },
  { code: '54009', name: 'Ang Mo Kio Int', road: 'AMK Ave 8', townId: 'ang-mo-kio', coordinates: [1.3698, 103.8496], services: ['25', '73', '86', '130', '133', '138', '166', '261', '269'] },
  { code: '84009', name: 'Bedok Int', road: 'Bedok North Ave 1', townId: 'bedok', coordinates: [1.3241, 103.9298], services: ['7', '9', '14', '16', '18', '28', '35', '60', '69', '87', '168', '222'] },
  { code: '53009', name: 'Bishan Int', road: 'Bishan Pl', townId: 'bishan', coordinates: [1.3508, 103.8497], services: ['52', '53', '54', '55', '56', '57', '58', '59', '410G'] },
  { code: '43009', name: 'Bukit Batok Int', road: 'Bt Batok Ctrl', townId: 'bukit-batok', coordinates: [1.3495, 103.7495], services: ['61', '77', '106', '173', '177', '189', '941', '945'] },
  { code: '10009', name: 'Bt Merah Int', road: 'Bt Merah Ctrl', townId: 'bukit-merah', coordinates: [1.2825, 103.8174], services: ['5', '16', '123', '131', '132', '145', '147', '196', '197', '851'] },
  { code: '44009', name: 'Bt Panjang Int', road: 'Jelebu Rd', townId: 'bukit-panjang', coordinates: [1.3789, 103.7634], services: ['67', '75', '176', '180', '184', '190', '920', '960', '970', '972'] },
  { code: '42009', name: 'Choa Chu Kang Int', road: 'Choa Chu Kang Loop', townId: 'choa-chu-kang', coordinates: [1.3853, 103.7444], services: ['67', '172', '188', '190', '300', '302', '307', '925', '983'] },
  { code: '17009', name: 'Clementi Int', road: 'Clementi Ave 3', townId: 'clementi', coordinates: [1.3150, 103.7650], services: ['52', '96', '99', '147', '156', '165', '166', '175', '196', '285'] },
  { code: '64009', name: 'Hougang Central Int', road: 'Hougang Ctrl', townId: 'hougang', coordinates: [1.3719, 103.8929], services: ['51', '72', '80', '87', '89', '112', '132', '153', '161', '165'] },
  { code: '28009', name: 'Jurong East Int / JEM', road: 'Jurong Gateway Rd', townId: 'jurong-east', coordinates: [1.3338, 103.7428], services: ['51', '52', '66', '78', '97', '105', '143', '160', '183', '197', '502'] },
  { code: '22009', name: 'Boon Lay Int', road: 'Jurong West Ctrl 3', townId: 'jurong-west', coordinates: [1.3392, 103.7056], services: ['30', '154', '174', '179', '180', '181', '198', '199', '240', '241'] },
  { code: '77009', name: 'Pasir Ris Int', road: 'Pasir Ris Dr 3', townId: 'pasir-ris', coordinates: [1.3725, 103.9493], services: ['3', '5', '6', '12', '15', '17', '21', '58', '88', '89', '358', '518'] },
  { code: '65009', name: 'Punggol Temp Int', road: 'Punggol Pl', townId: 'punggol', coordinates: [1.4039, 103.9022], services: ['34', '39', '43', '62', '82', '83', '85', '117', '118', '381', '382G'] },
  { code: '58009', name: 'Sembawang Int', road: 'Sembawang Vista', townId: 'sembawang', coordinates: [1.4478, 103.8202], services: ['117', '856', '858', '859', '882', '883', '962', '980'] },
  { code: '67009', name: 'Compassvale Int', road: 'Compassvale Rd', townId: 'sengkang', coordinates: [1.3934, 103.8978], services: ['27', '80', '83', '85', '86', '87', '102', '156', '159', '163', '372'] },
  { code: '66009', name: 'Serangoon Int', road: 'Serangoon Ave 2', townId: 'serangoon', coordinates: [1.3503, 103.8735], services: ['22', '43', '45', '53', '58', '70', '81', '82', '100', '101', '103', '105', '109', '147'] },
  { code: '75009', name: 'Tampines Int', road: 'Tampines Ctrl 1', townId: 'tampines', coordinates: [1.3533, 103.9452], services: ['3', '4', '8', '10', '18', '19', '20', '21', '22', '23', '27', '28', '29', '31', '37', '65', '67'] },
  { code: '52009', name: 'Toa Payoh Int', road: 'Lor 2 Toa Payoh', townId: 'toa-payoh', coordinates: [1.3328, 103.8475], services: ['8', '26', '28', '31', '73', '88', '90', '139', '141', '142', '143', '145', '155', '157', '159', '231'] },
  { code: '46009', name: 'Woodlands Int', road: 'Woodlands Sq', townId: 'woodlands', coordinates: [1.4369, 103.7865], services: ['161', '168', '169', '178', '187', '856', '858', '900', '901', '903', '912', '925', '960', '965', '969'] },
  { code: '59009', name: 'Yishun Int', road: 'Yishun Ave 2', townId: 'yishun', coordinates: [1.4294, 103.8350], services: ['39', '85', '171', '800', '804', '806', '807', '811', '851', '852', '853', '854', '855', '857', '858', '860'] },
];

export interface BusRouteDetail {
  serviceNo: string;
  origin: string;
  destination: string;
  keyStops: string[];
  type: 'Single Deck' | 'Double Deck' | 'Bendy';
  wheelchair: boolean;
  frequencyPeakMins: number;
  frequencyOffPeakMins: number;
  firstBus: string;
  lastBus: string;
}

export const BUS_ROUTES: BusRouteDetail[] = [
  { serviceNo: '190', origin: 'Choa Chu Kang Int', destination: 'New Bridge Rd Ter', keyStops: ['Choa Chu Kang', 'Teck Whye', 'Bukit Panjang', 'Stevens', 'Orchard', 'SMU / Bras Basah', 'Clarke Quay', 'Chinatown'], type: 'Double Deck', wheelchair: true, frequencyPeakMins: 4, frequencyOffPeakMins: 8, firstBus: '05:45', lastBus: '23:30' },
  { serviceNo: '147', origin: 'Hougang Central Int', destination: 'Clementi Int', keyStops: ['Hougang', 'Serangoon', 'Potong Pasir', 'SMU / Bras Basah', 'Chinatown', 'Bukit Merah', 'Queenstown', 'Clementi'], type: 'Double Deck', wheelchair: true, frequencyPeakMins: 6, frequencyOffPeakMins: 10, firstBus: '05:40', lastBus: '23:30' },
  { serviceNo: '65', origin: 'Tampines Int', destination: 'HarbourFront Int', keyStops: ['Tampines', 'Bedok Reservoir', 'Ubi', 'MacPherson', 'Little India', 'Orchard', 'River Valley', 'HarbourFront'], type: 'Double Deck', wheelchair: true, frequencyPeakMins: 5, frequencyOffPeakMins: 9, firstBus: '05:30', lastBus: '23:45' },
  { serviceNo: '7', origin: 'Bedok Int', destination: 'Clementi Int', keyStops: ['Bedok', 'Geylang', 'Bugis', 'SMU (Bras Basah)', 'Dhoby Ghaut', 'Orchard', 'Holland Village', 'Clementi'], type: 'Double Deck', wheelchair: true, frequencyPeakMins: 6, frequencyOffPeakMins: 10, firstBus: '05:30', lastBus: '23:45' },
  { serviceNo: '174', origin: 'Boon Lay Int', destination: 'New Bridge Rd Ter', keyStops: ['Boon Lay', 'Jurong West', 'Bukit Batok', 'Bukit Timah', 'Orchard', 'SMU (Bras Basah)', 'Chinatown'], type: 'Double Deck', wheelchair: true, frequencyPeakMins: 7, frequencyOffPeakMins: 11, firstBus: '05:30', lastBus: '23:15' },
  { serviceNo: '857', origin: 'Yishun Int', destination: 'Suntec City / Loop', keyStops: ['Yishun', 'Khatib', 'Jalan Kayu', 'Little India', 'SMU (Bras Basah)', 'Suntec City'], type: 'Double Deck', wheelchair: true, frequencyPeakMins: 6, frequencyOffPeakMins: 10, firstBus: '05:30', lastBus: '23:15' },
  { serviceNo: '166', origin: 'Ang Mo Kio Int', destination: 'Clementi Int', keyStops: ['Ang Mo Kio', 'Thomson', 'Novena', 'SMU (Bras Basah)', 'Chinatown', 'Bukit Merah', 'Pasir Panjang', 'Clementi'], type: 'Double Deck', wheelchair: true, frequencyPeakMins: 6, frequencyOffPeakMins: 10, firstBus: '05:30', lastBus: '23:30' },
  { serviceNo: '502', origin: 'Pioneer / Jurong West', destination: 'Marina Bay / Bayfront', keyStops: ['Boon Lay', 'Jurong West', 'Jurong East', 'Orchard', 'Suntec City', 'Marina Bay Sands'], type: 'Single Deck', wheelchair: true, frequencyPeakMins: 8, frequencyOffPeakMins: 14, firstBus: '05:45', lastBus: '23:00' },
  { serviceNo: '851', origin: 'Yishun Int', destination: 'Bukit Merah Int', keyStops: ['Yishun', 'Khatib', 'Ang Mo Kio', 'Marymount', 'Novena', 'Bugis', 'Chinatown', 'Bukit Merah'], type: 'Double Deck', wheelchair: true, frequencyPeakMins: 6, frequencyOffPeakMins: 11, firstBus: '05:30', lastBus: '23:15' },
  { serviceNo: '960', origin: 'Woodlands Int', destination: 'Marina Centre Ter', keyStops: ['Woodlands', 'Marsiling', 'Bukit Panjang', 'Stevens', 'Little India', 'Bugis', 'Raffles Ave'], type: 'Double Deck', wheelchair: true, frequencyPeakMins: 6, frequencyOffPeakMins: 11, firstBus: '05:30', lastBus: '23:15' },
  { serviceNo: '10', origin: 'Tampines Int', destination: 'Kent Ridge Ter', keyStops: ['Tampines', 'Bedok South', 'Marine Parade', 'Nicoll Hwy', 'Raffles Place', 'Shenton Way', 'Pasir Panjang'], type: 'Double Deck', wheelchair: true, frequencyPeakMins: 5, frequencyOffPeakMins: 9, firstBus: '05:45', lastBus: '23:30' },
  { serviceNo: '36', origin: 'Changi Airport', destination: 'Tomlinson Rd (Orchard Loop)', keyStops: ['Changi Airport', 'Marine Parade', 'Marina Bay', 'Suntec', 'SMU (Bras Basah)', 'Orchard'], type: 'Single Deck', wheelchair: true, frequencyPeakMins: 7, frequencyOffPeakMins: 12, firstBus: '06:08', lastBus: '23:55' },
  { serviceNo: '197', origin: 'Bedok Int', destination: 'Jurong East Int', keyStops: ['Bedok', 'Marine Parade', 'Geylang', 'Bugis', 'Chinatown', 'Bukit Merah', 'Alexandra', 'Jurong East'], type: 'Double Deck', wheelchair: true, frequencyPeakMins: 7, frequencyOffPeakMins: 12, firstBus: '05:30', lastBus: '23:15' },
  { serviceNo: '168', origin: 'Bedok Int', destination: 'Woodlands Int', keyStops: ['Bedok', 'Tampines Ave 10', 'Seletar Expressway', 'Woodlands Ave 2'], type: 'Double Deck', wheelchair: true, frequencyPeakMins: 5, frequencyOffPeakMins: 9, firstBus: '05:45', lastBus: '23:40' },
  { serviceNo: '858', origin: 'Woodlands Int', destination: 'Changi Airport Loop', keyStops: ['Woodlands', 'Sembawang', 'Yishun', 'Khatib', 'TPE Expressway', 'Changi Airport'], type: 'Double Deck', wheelchair: true, frequencyPeakMins: 7, frequencyOffPeakMins: 12, firstBus: '05:30', lastBus: '23:30' },
  { serviceNo: '143', origin: 'Toa Payoh Int', destination: 'Jurong East Int', keyStops: ['Toa Payoh', 'Novena', 'Orchard', 'Chinatown', 'HarbourFront', 'Pasir Panjang', 'Jurong East'], type: 'Double Deck', wheelchair: true, frequencyPeakMins: 6, frequencyOffPeakMins: 10, firstBus: '05:45', lastBus: '23:30' },
];

export function getSimulatedArrivals(serviceNo: string, departureTimeStr?: string): BusArrivalInfo {
  const now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();

  if (departureTimeStr) {
    const parts = departureTimeStr.split(':');
    if (parts.length >= 2) {
      hour = parseInt(parts[0], 10) || hour;
      minute = parseInt(parts[1], 10) || minute;
    }
  }

  const isPeak = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20);
  const matchedRoute = BUS_ROUTES.find(r => r.serviceNo === serviceNo);
  const headway = matchedRoute
    ? (isPeak ? matchedRoute.frequencyPeakMins : matchedRoute.frequencyOffPeakMins)
    : (isPeak ? 5 : 10);

  const charCodeSum = serviceNo.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const nextArrival = ((charCodeSum + minute) % headway) + 1;
  const subsequentArrival = nextArrival + headway + ((charCodeSum % 3) - 1);
  const thirdArrival = subsequentArrival + headway + 1;

  const loads: Array<'seats_available' | 'standing_available' | 'limited_standing'> = isPeak
    ? ['standing_available', 'limited_standing', 'seats_available']
    : ['seats_available', 'seats_available', 'standing_available'];
  const loadIndex = (charCodeSum + minute) % loads.length;

  return {
    serviceNo,
    destination: matchedRoute ? matchedRoute.destination : 'Interchange',
    nextBusMins: Math.max(1, nextArrival),
    subsequentBusMins: Math.max(nextArrival + 3, subsequentArrival),
    thirdBusMins: Math.max(subsequentArrival + 4, thirdArrival),
    load: loads[loadIndex],
    type: matchedRoute?.type || 'Double Deck',
    wheelchair: true,
    frequencyPeakMins: matchedRoute?.frequencyPeakMins || 6,
    frequencyOffPeakMins: matchedRoute?.frequencyOffPeakMins || 11,
    operatingHours: `${matchedRoute?.firstBus || '05:30'} - ${matchedRoute?.lastBus || '23:45'}`,
  };
}

export interface MRTLineInfo {
  name: string;
  code: string;
  color: string;
  path: [number, number][];
}

export const MRT_LINES: MRTLineInfo[] = [
  {
    name: 'North-South Line',
    code: 'NSL',
    color: '#e72a27',
    path: [
      [1.3329, 103.7436], // Jurong East
      [1.3590, 103.7637], // Bt Batok
      [1.3840, 103.7470], // CCK
      [1.4382, 103.7890], // Woodlands
      [1.4491, 103.8185], // Sembawang
      [1.4304, 103.8354], // Yishun
      [1.3691, 103.8454], // AMK
      [1.3526, 103.8352], // Bishan
      [1.3343, 103.8563], // Toa Payoh
      [1.3048, 103.8318], // Orchard
      [1.2963, 103.8502], // City Hall / SMU
      [1.2838, 103.8515], // Raffles Place
      [1.2760, 103.8610], // Marina South Pier
    ],
  },
  {
    name: 'East-West Line',
    code: 'EWL',
    color: '#009640',
    path: [
      [1.3404, 103.7090], // Boon Lay
      [1.3329, 103.7436], // Jurong East
      [1.3162, 103.7649], // Clementi
      [1.3115, 103.7780], // Dover (SP)
      [1.2942, 103.8058], // Queenstown
      [1.2819, 103.8239], // Redhill
      [1.2804, 103.8448], // Tanjong Pagar
      [1.2838, 103.8515], // Raffles Place
      [1.2963, 103.8502], // City Hall (SMU)
      [1.3000, 103.8580], // Bugis
      [1.3178, 103.8924], // Paya Lebar
      [1.3236, 103.9273], // Bedok
      [1.3524, 103.9447], // Tampines
      [1.3721, 103.9474], // Pasir Ris
    ],
  },
  {
    name: 'Downtown Line',
    code: 'DTL',
    color: '#005ec4',
    path: [
      [1.3774, 103.7719], // Bt Panjang
      [1.3294, 103.8021], // Beauty World
      [1.3100, 103.8400], // Newton
      [1.2985, 103.8510], // Bencoolen (SMU)
      [1.3000, 103.8580], // Bugis
      [1.2838, 103.8515], // Telok Ayer / Downtown
      [1.3178, 103.8924], // MacPherson
      [1.3236, 103.9273], // Bedok Reservoir
      [1.3524, 103.9447], // Tampines
    ],
  },
  {
    name: 'Circle Line',
    code: 'CCL',
    color: '#fa9e0d',
    path: [
      [1.2963, 103.8502], // Bras Basah (SMU)
      [1.2935, 103.8572], // Promenade / Suntec
      [1.3178, 103.8924], // Paya Lebar
      [1.3554, 103.8679], // Serangoon
      [1.3526, 103.8352], // Bishan
      [1.2996, 103.7874], // one-north
      [1.2750, 103.7997], // Pasir Panjang
      [1.2644, 103.8220], // HarbourFront
    ],
  },
  {
    name: 'North-East Line',
    code: 'NEL',
    color: '#8f1a95',
    path: [
      [1.2650, 103.8220], // HarbourFront
      [1.2830, 103.8440], // Chinatown
      [1.2990, 103.8460], // Dhoby Ghaut (near SMU)
      [1.3100, 103.8651], // Boon Keng
      [1.3554, 103.8679], // Serangoon
      [1.3713, 103.8925], // Hougang
      [1.3917, 103.8954], // Sengkang
      [1.4050, 103.9023], // Punggol
    ],
  },
];
