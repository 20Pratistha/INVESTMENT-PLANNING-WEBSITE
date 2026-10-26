import { RiskProfile, InvestmentAllocation } from '../types';

/**
 * Format numbers in the Indian Numbering System (Lakhs & Crores)
 * e.g., ₹1,25,000 or ₹12.50 Lakhs
 */
export function formatINR(val: number, options?: { compact?: boolean; precision?: number }): string {
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  const rounded = Math.round(val);
  const precision = options?.precision ?? 2;

  if (options?.compact) {
    if (Math.abs(rounded) >= 10000000) {
      return `₹${(rounded / 10000000).toFixed(precision)} Cr`;
    }
    if (Math.abs(rounded) >= 100000) {
      return `₹${(rounded / 100000).toFixed(precision)} L`;
    }
    if (Math.abs(rounded) >= 1000) {
      return `₹${(rounded / 1000).toFixed(1)}k`;
    }
  }

  return '₹' + rounded.toLocaleString('en-IN');
}

/**
 * Calculate Mutual Fund SIP compounding with optional annual step-up
 */
export function calculateSip(
  monthlyInvestment: number,
  expectedReturnAnnualPct: number,
  years: number,
  stepUpAnnualPct: number = 0
) {
  const monthlyRate = expectedReturnAnnualPct / 12 / 100;
  const totalMonths = Math.round(years * 12);

  let totalInvested = 0;
  let totalValue = 0;
  let currentMonthlyInvestment = monthlyInvestment;

  const yearlyBreakdown: {
    year: number;
    invested: number;
    wealthGain: number;
    totalValue: number;
  }[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    // If Step-Up is enabled, increase monthly investment every 12 months
    if (stepUpAnnualPct > 0 && m > 1 && (m - 1) % 12 === 0) {
      currentMonthlyInvestment *= 1 + stepUpAnnualPct / 100;
    }

    totalInvested += currentMonthlyInvestment;
    totalValue = (totalValue + currentMonthlyInvestment) * (1 + monthlyRate);

    if (m % 12 === 0 || m === totalMonths) {
      yearlyBreakdown.push({
        year: Math.ceil(m / 12),
        invested: Math.round(totalInvested),
        wealthGain: Math.round(Math.max(0, totalValue - totalInvested)),
        totalValue: Math.round(totalValue),
      });
    }
  }

  const wealthGained = Math.round(Math.max(0, totalValue - totalInvested));
  const inflationAdjusted = Math.round(totalValue / Math.pow(1 + 0.06, years)); // 6% Indian inflation benchmark

  return {
    investedAmount: Math.round(totalInvested),
    wealthGained,
    maturityValue: Math.round(totalValue),
    inflationAdjustedMaturity: inflationAdjusted,
    yearlyBreakdown,
  };
}

/**
 * Calculate Bank Fixed Deposit with quarterly compounding
 * Formula: A = P * (1 + r / 4)^(4 * t)
 */
export function calculateBankFd(
  principal: number,
  annualRatePct: number,
  years: number,
  isSeniorCitizen: boolean = false
) {
  const effectiveRate = isSeniorCitizen ? annualRatePct + 0.5 : annualRatePct;
  const n = 4; // Quarterly compounding standard in Indian banks
  const t = years;
  const r = effectiveRate / 100;

  const maturityValue = Math.round(principal * Math.pow(1 + r / n, n * t));
  const totalInterest = maturityValue - principal;
  const annualInterest = totalInterest / years;

  // Indian Income Tax Sec 194A: TDS applies if interest > 40,000 (50,000 for seniors)
  const tdsThreshold = isSeniorCitizen ? 50000 : 40000;
  const isTdsApplicable = annualInterest > tdsThreshold;

  return {
    principal,
    effectiveRate,
    maturityValue,
    totalInterest,
    annualInterest: Math.round(annualInterest),
    isTdsApplicable,
    tdsThreshold,
  };
}

/**
 * Calculate Post Office PPF (Public Provident Fund)
 * 7.1% compounded annually, 15-year statutory period
 */
export function calculatePpf(annualDeposit: number, years: number = 15, annualRate: number = 7.1) {
  const r = annualRate / 100;
  let totalInvested = 0;
  let corpus = 0;
  const clampedYears = Math.min(30, Math.max(1, years));

  const yearlyBreakdown: { year: number; invested: number; interest: number; balance: number }[] = [];

  for (let y = 1; y <= clampedYears; y++) {
    totalInvested += annualDeposit;
    corpus = (corpus + annualDeposit) * (1 + r);
    yearlyBreakdown.push({
      year: y,
      invested: totalInvested,
      interest: Math.round(corpus - totalInvested),
      balance: Math.round(corpus),
    });
  }

  return {
    totalInvested,
    interestEarned: Math.round(corpus - totalInvested),
    maturityValue: Math.round(corpus),
    isTaxFree: true, // EEE status
    yearlyBreakdown,
  };
}

/**
 * Comprehensive 50-30-20 Indian Financial Surplus & Allocation Engine
 */
export function analyzeBudgetAndAllocation(
  monthlyIncome: number,
  monthlyExpenses: number,
  riskProfile: RiskProfile,
  timeHorizonYears: number
) {
  const surplus = Math.max(0, monthlyIncome - monthlyExpenses);
  const expenseRatio = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0;
  const savingsRatio = monthlyIncome > 0 ? (surplus / monthlyIncome) * 100 : 0;

  // Emergency Fund benchmark: 6 months of living expenses in liquid FD/Savings
  const recommendedEmergencyFund = monthlyExpenses * 6;

  // Recommended Investment Allocation percentages based on risk and horizon
  let sipPercent = 40;
  let fdBachatPercent = 35;
  let stocksPercent = 15;
  let goldPercent = 10;

  if (riskProfile === 'Conservative') {
    sipPercent = 25;
    fdBachatPercent = 55;
    stocksPercent = 5;
    goldPercent = 15;
  } else if (riskProfile === 'Aggressive') {
    sipPercent = 55;
    fdBachatPercent = 15;
    stocksPercent = 25;
    goldPercent = 5;
  } else {
    // Moderate
    if (timeHorizonYears >= 7) {
      sipPercent = 50;
      fdBachatPercent = 25;
      stocksPercent = 15;
      goldPercent = 10;
    } else {
      sipPercent = 40;
      fdBachatPercent = 40;
      stocksPercent = 10;
      goldPercent = 10;
    }
  }

  const allocation: InvestmentAllocation = {
    sipPercent,
    sipAmount: Math.round((surplus * sipPercent) / 100),
    fdBachatPercent,
    fdBachatAmount: Math.round((surplus * fdBachatPercent) / 100),
    stocksPercent,
    stocksAmount: Math.round((surplus * stocksPercent) / 100),
    goldPercent,
    goldAmount: Math.round((surplus * goldPercent) / 100),
    emergencyFundAmount: recommendedEmergencyFund,
  };

  let healthStatus: 'Optimal' | 'Good' | 'Needs Attention' = 'Optimal';
  let healthMessage = 'Great financial health! Your savings surplus exceeds the ideal 20% mark.';

  if (savingsRatio < 10) {
    healthStatus = 'Needs Attention';
    healthMessage = 'Your current expenses consume over 90% of family income. Try trimming discretionary spending to boost savings.';
  } else if (savingsRatio < 20) {
    healthStatus = 'Good';
    healthMessage = 'Decent savings buffer. Strive to push your investment surplus closer to 20-30% of total income.';
  }

  return {
    monthlyIncome,
    monthlyExpenses,
    surplus,
    expenseRatio: Math.round(expenseRatio),
    savingsRatio: Math.round(savingsRatio),
    recommendedEmergencyFund,
    allocation,
    healthStatus,
    healthMessage,
  };
}

/**
 * Simulate Periodic (Weekly or Monthly) Investment Growth Timeline
 */
export function simulateTimeline(
  frequency: 'weekly' | 'monthly',
  amount: number,
  cagrRate: number = 13,
  periodsCount: number = 36 // e.g. 36 weeks or 36 months
) {
  const periodRate = frequency === 'weekly' ? cagrRate / 52 / 100 : cagrRate / 12 / 100;
  const savingsRate = frequency === 'weekly' ? 3.0 / 52 / 100 : 3.0 / 12 / 100; // Regular bank savings 3%

  let portfolioValue = 0;
  let savingsValue = 0;
  let totalInvested = 0;

  const points: {
    period: number;
    label: string;
    invested: number;
    portfolioValue: number;
    savingsValue: number;
    gain: number;
    milestone?: string;
  }[] = [];

  for (let p = 1; p <= periodsCount; p++) {
    totalInvested += amount;
    portfolioValue = (portfolioValue + amount) * (1 + periodRate);
    savingsValue = (savingsValue + amount) * (1 + savingsRate);

    let milestone: string | undefined = undefined;
    if (frequency === 'monthly') {
      if (p === 6) milestone = '6-Month Emergency Shield Built';
      if (p === 12) milestone = '1 Year of Discipline: 12 SIP installments';
      if (p === 24) milestone = '2-Year Compounding Milestone';
      if (p === 36) milestone = '3-Year Milestone: Growth Accelerating!';
    } else {
      if (p === 4) milestone = 'Month 1 completed!';
      if (p === 12) milestone = 'Quarter 1 achieved';
      if (p === 26) milestone = 'Half-Year Streak (26 weeks)';
      if (p === 52) milestone = '1 Full Year of Weekly Investing!';
    }

    points.push({
      period: p,
      label: frequency === 'weekly' ? `W${p}` : `M${p}`,
      invested: Math.round(totalInvested),
      portfolioValue: Math.round(portfolioValue),
      savingsValue: Math.round(savingsValue),
      gain: Math.round(portfolioValue - totalInvested),
      milestone,
    });
  }

  return points;
}
