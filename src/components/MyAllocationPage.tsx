import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  IndianRupee, 
  ShieldCheck, 
  TrendingUp, 
  Landmark, 
  PieChart, 
  Coins, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  ExternalLink,
  Zap,
  Building2
} from 'lucide-react';
import { UserProfile, RiskProfile, ActivePage } from '../types';
import { analyzeBudgetAndAllocation, formatINR } from '../utils/financeCalculators';

interface MyAllocationPageProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onNavigate: (page: ActivePage) => void;
  onOpenProfile: () => void;
  onOpenAiBot: () => void;
}

export const MyAllocationPage: React.FC<MyAllocationPageProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigate,
  onOpenProfile,
  onOpenAiBot,
}) => {
  const [income, setIncome] = useState<number>(userProfile.monthlyIncome || 75000);
  const [expenses, setExpenses] = useState<number>(userProfile.monthlyExpenses || 40000);
  const [risk, setRisk] = useState<RiskProfile>(userProfile.riskProfile || 'Moderate');
  const [years, setYears] = useState<number>(userProfile.timeHorizonYears || 7);

  const budget = analyzeBudgetAndAllocation(income, expenses, risk, years);

  // Sync back to profile if changed
  const handleSave = () => {
    onUpdateProfile({
      monthlyIncome: income,
      monthlyExpenses: expenses,
      riskProfile: risk,
      timeHorizonYears: years,
    });
  };

  // Determine what investment user should be most inclined towards
  let primaryInclination = {
    title: 'Systematic Investment Plans (SIP) in Nifty 50 & Flexi Cap',
    reason: 'Your medium-to-long investment horizon and balanced risk appetite allow you to benefit most from compounding in India’s leading companies while riding out short-term market cycles.',
    targetPage: 'sip' as ActivePage,
    icon: PieChart,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40 border-emerald-500/40',
    share: budget.allocation.sipPercent,
    amount: budget.allocation.sipAmount,
  };

  if (risk === 'Conservative' || years <= 3) {
    primaryInclination = {
      title: 'Post Office Bachat Ghar & Bank Fixed Deposits',
      reason: 'With a shorter time horizon or conservative risk profile, protecting your hard-earned capital is paramount. Government-guaranteed schemes like PPF (7.1%), Sukanya Samriddhi (8.2%), and Bank FDs provide absolute security.',
      targetPage: 'fd-bachat' as ActivePage,
      icon: Landmark,
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/40 border-blue-500/40',
      share: budget.allocation.fdBachatPercent,
      amount: budget.allocation.fdBachatAmount,
    };
  } else if (risk === 'Aggressive' && years >= 10) {
    primaryInclination = {
      title: 'Equity SIP + Direct Bluechip Stocks (NSE/BSE)',
      reason: 'Your long investment runway (10+ years) and high risk tolerance make you an ideal candidate to harness maximum compounding through equity funds and direct shares.',
      targetPage: 'stocks' as ActivePage,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/40 border-purple-500/40',
      share: budget.allocation.sipPercent + budget.allocation.stocksPercent,
      amount: budget.allocation.sipAmount + budget.allocation.stocksAmount,
    };
  }

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-cyan-950/80 via-slate-900 to-indigo-950/70 border border-cyan-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
              Custom Financial Architecture
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              India 50:30:20 Model
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Your Tailored Investment Roadmap
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Based on your family monthly income of <strong>{formatINR(income)}</strong> and living expenses of <strong>{formatINR(expenses)}</strong>, you have a calculated investible surplus of <strong>{formatINR(budget.surplus)} every single month</strong>. Here is how it should be strategically divided.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenProfile}
              className="text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl border border-slate-700 transition-colors"
            >
              Edit Full Investor Profile
            </button>
            <button
              onClick={onOpenAiBot}
              className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1.5 bg-indigo-950/50 hover:bg-indigo-900/60 px-3.5 py-2 rounded-xl border border-indigo-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI Advisor to Review This Split</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Inclination Recommendation Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${primaryInclination.bgColor} shadow-xl relative overflow-hidden`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Strategic Investment Inclination for You
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded-full border border-slate-700">
            {primaryInclination.share}% of your surplus ({formatINR(primaryInclination.amount)}/mo)
          </span>
        </div>

        <div className="py-4 space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            You should be primarily inclined towards:{' '}
            <span className={primaryInclination.color}>{primaryInclination.title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            {primaryInclination.reason}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Based on your risk profile: <strong className="text-white capitalize">{risk}</strong> & timeline: <strong className="text-white">{years} Years</strong>
          </span>
          <button
            onClick={() => onNavigate(primaryInclination.targetPage)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
          >
            <span>Explore This Avenue Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Interactive Sliders to tweak budget */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
              Adjust Your Family Financial Parameters
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Change numbers below to instantly see how your surplus and allocation adapt.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow transition-colors"
          >
            Save Changes to Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          {/* Income Slider */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-slate-300 font-semibold">Monthly Income:</span>
              <span className="font-mono font-bold text-emerald-400">{formatINR(income)}</span>
            </div>
            <input
              type="range"
              min={25000}
              max={300000}
              step={5000}
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Expenses Slider */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-slate-300 font-semibold">Living Expenses:</span>
              <span className="font-mono font-bold text-rose-400">{formatINR(expenses)}</span>
            </div>
            <input
              type="range"
              min={15000}
              max={Math.max(income, 50000)}
              step={2000}
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Risk Selector */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-slate-300 font-semibold">Risk Appetite:</span>
              <span className="font-bold text-amber-400">{risk}</span>
            </div>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value as RiskProfile)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
            >
              <option value="Conservative">Conservative (Capital Safety)</option>
              <option value="Moderate">Moderate (Balanced)</option>
              <option value="Aggressive">Aggressive (High Equity)</option>
            </select>
          </div>

          {/* Horizon */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-slate-300 font-semibold">Horizon:</span>
              <span className="font-bold text-blue-400">{years} Years</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* 4-Pillar Recommended Monthly Basket */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* SIP */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 hover:border-emerald-500 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400">1. Equity SIP</span>
                <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {budget.allocation.sipPercent}%
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {formatINR(budget.allocation.sipAmount)}
                <span className="text-xs text-slate-400 font-sans font-normal"> / mo</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Nifty 50 Index + Flexi Cap funds. Long-term 12-15% CAGR.
              </p>
            </div>
            <button
              onClick={() => onNavigate('sip')}
              className="mt-4 w-full py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-800"
            >
              <span>Explore SIP Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* FD & Bachat */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/40 hover:border-blue-500 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400">2. FD & Bachat Ghar</span>
                <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {budget.allocation.fdBachatPercent}%
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {formatINR(budget.allocation.fdBachatAmount)}
                <span className="text-xs text-slate-400 font-sans font-normal"> / mo</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                PPF (7.1% tax-free) or Bank FD at {userProfile.existingBanks[0] || 'SBI'}.
              </p>
            </div>
            <button
              onClick={() => onNavigate('fd-bachat')}
              className="mt-4 w-full py-2 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-800"
            >
              <span>Explore FD & Bachat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Direct Stocks */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 hover:border-purple-500 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-400">3. Direct Stocks</span>
                <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {budget.allocation.stocksPercent}%
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {formatINR(budget.allocation.stocksAmount)}
                <span className="text-xs text-slate-400 font-sans font-normal"> / mo</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Bluechips on Zerodha Kite or Groww. Corporate dividends.
              </p>
            </div>
            <button
              onClick={() => onNavigate('stocks')}
              className="mt-4 w-full py-2 rounded-xl bg-slate-900 hover:bg-purple-600 hover:text-white text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-800"
            >
              <span>Explore Stocks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Gold / SGB */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 hover:border-amber-500 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400">4. Gold & SGB</span>
                <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {budget.allocation.goldPercent}%
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {formatINR(budget.allocation.goldAmount)}
                <span className="text-xs text-slate-400 font-sans font-normal"> / mo</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Sovereign Gold Bonds (2.5% RBI interest) or Digital Gold.
              </p>
            </div>
            <button
              onClick={() => onNavigate('gold-sgb')}
              className="mt-4 w-full py-2 rounded-xl bg-slate-900 hover:bg-amber-600 hover:text-slate-950 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-800"
            >
              <span>Explore Gold & SGB</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Emergency Cushion reminder */}
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-cyan-200 block">
              Emergency Cushion Requirement: {formatINR(budget.recommendedEmergencyFund)}
            </span>
            <p className="text-slate-300">
              Keep 6 months of living expenses in a sweep-in FD at {userProfile.existingBanks[0] || 'your primary bank'}. Never invest emergency money in the stock market.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
