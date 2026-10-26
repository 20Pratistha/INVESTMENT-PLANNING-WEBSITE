export type RiskProfile = 'Conservative' | 'Moderate' | 'Aggressive';

export type InvestmentHorizon = '1-3' | '3-5' | '5-10' | '10+';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  city: string;
  state: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  timeHorizonYears: number;
  riskProfile: RiskProfile;
  existingBanks: string[];
  primaryGoal: string;
  hasEmergencyFund: boolean;
  isLoggedIn: boolean;
}

export interface InvestmentAllocation {
  sipAmount: number;
  sipPercent: number;
  fdBachatAmount: number;
  fdBachatPercent: number;
  stocksAmount: number;
  stocksPercent: number;
  goldAmount: number;
  goldPercent: number;
  emergencyFundAmount: number;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: string;
  changePct: string;
  status: 'bullish' | 'bearish' | 'neutral';
}

export interface IndianPlatform {
  name: string;
  category: 'SIP & Mutual Funds' | 'Stocks & Demat' | 'Bank FD' | 'Government & Post Office';
  rating: string;
  activeUsers: string;
  charges: string;
  bestFor: string;
  highlight: string;
  url: string;
  logoText: string;
  themeColor: string;
}

export interface PostOfficeScheme {
  id: string;
  name: string;
  hindiName: string;
  interestRate: number;
  tenure: string;
  minDeposit: number;
  maxDeposit?: number;
  taxBenefit: string;
  compoundingFrequency: string;
  description: string;
  idealFor: string;
  sovereignGuarantee: boolean;
}

export interface BankFdRate {
  bankName: string;
  type: 'Public' | 'Private' | 'Post Office' | 'Small Finance';
  regularRate: number;
  seniorRate: number;
  popularTenure: string;
  dicgcInsured: boolean;
  features: string[];
}

export type ActivePage = 
  | 'home' 
  | 'sip' 
  | 'fd-bachat' 
  | 'stocks' 
  | 'gold-sgb' 
  | 'policies-tax' 
  | 'performance-tracker' 
  | 'my-allocation';
