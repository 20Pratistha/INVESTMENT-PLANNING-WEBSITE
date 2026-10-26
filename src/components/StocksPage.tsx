import React, { useState } from 'react';
import { 
  TrendingUp, 
  IndianRupee, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  Percent, 
  Clock, 
  BarChart3,
  Layers
} from 'lucide-react';
import { UserProfile } from '../types';
import { formatINR } from '../utils/financeCalculators';

interface StocksPageProps {
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenAiBot: () => void;
}

export const StocksPage: React.FC<StocksPageProps> = ({ userProfile, onOpenProfile, onOpenAiBot }) => {
  const surplus = Math.max(0, userProfile.monthlyIncome - userProfile.monthlyExpenses);
  const defaultMonthly = surplus > 0 ? Math.round(surplus * 0.2) : 3000;

  // Stocks Calculator State
  const [initialLumpSum, setInitialLumpSum] = useState<number>(25000);
  const [monthlyDca, setMonthlyDca] = useState<number>(defaultMonthly);
  const [cagr, setCagr] = useState<number>(15);
  const [years, setYears] = useState<number>(7);
  const [dividendYield, setDividendYield] = useState<number>(1.2);

  // Calculate stocks compounding
  const totalMonths = years * 12;
  const monthlyRate = cagr / 12 / 100;

  let totalInvested = initialLumpSum;
  let portfolioValue = initialLumpSum;

  for (let m = 1; m <= totalMonths; m++) {
    totalInvested += monthlyDca;
    portfolioValue = (portfolioValue + monthlyDca) * (1 + monthlyRate);
  }

  const capitalGains = Math.max(0, portfolioValue - totalInvested);
  const totalEstimatedDividends = Math.round(portfolioValue * (dividendYield / 100) * (years * 0.6));
  const finalCorpus = Math.round(portfolioValue + totalEstimatedDividends);

  const stockBrokers = [
    {
      name: 'Zerodha Kite',
      rating: '4.9★',
      accountOpening: '₹200',
      brokerageDelivery: '₹0 (Free Equity Delivery)',
      intraday: '₹20 or 0.03% per executed order',
      features: ['Kite web & mobile with TradingView', 'Console tax P&L report', 'Streak & Sensibull integration', 'Zero debt, profitable company'],
      url: 'https://zerodha.com',
    },
    {
      name: 'Groww',
      rating: '4.8★',
      accountOpening: '₹0 (Free)',
      brokerageDelivery: '₹20 or 0.05% per trade',
      intraday: '₹20 flat',
      features: ['100% paperless 5-min onboarding', 'Beginner-friendly clean interface', 'Direct UPI order execution', 'Stocks & US Stocks'],
      url: 'https://groww.in',
    },
    {
      name: 'Angel One',
      rating: '4.7★',
      accountOpening: '₹0 (Free)',
      brokerageDelivery: '₹0 on delivery',
      intraday: '₹20 flat',
      features: ['ARQ AI smart stock recommendations', 'Comprehensive research reports', 'Smart API access for algorithmic trading', 'Branch network across 18,000+ pin codes'],
      url: 'https://angelone.in',
    },
    {
      name: 'Upstox',
      rating: '4.6★',
      accountOpening: '₹0 (Free)',
      brokerageDelivery: '₹20 or 2.5% per trade',
      intraday: '₹20 flat',
      features: ['Backed by Ratan Tata', 'Pro Web trading workspace', 'Option chain analytics & Greeks', 'Instant withdrawal to bank'],
      url: 'https://upstox.com',
    },
  ];

  const sectorTrends = [
    { name: 'Indian Banking & Finance (Nifty Bank)', change: '+14.2% 1Y', status: 'Strong Credit Growth & low NPAs' },
    { name: 'Information Technology (Nifty IT)', change: '+22.5% 1Y', status: 'AI enterprise adoption & cloud contracts' },
    { name: 'Automobile & EV (Nifty Auto)', change: '+38.4% 1Y', status: 'Premiumization, SUV surge & EV transition' },
    { name: 'Infrastructure & Capital Goods', change: '+41.2% 1Y', status: 'Govt capex push in railways, defense & roads' },
    { name: 'Pharmaceuticals & Healthcare', change: '+18.6% 1Y', status: 'Domestic formulation & US FDA approvals' },
  ];

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-indigo-950/70 border border-purple-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
              High Growth Equity
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              NSE & BSE
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Indian Stocks & Direct Equity
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Invest directly into India’s corporate champions. As India drives toward a $5 Trillion and $10 Trillion economy, equities offer unmatched inflation-beating long-term compounding, corporate dividends, and fractional ownership in market leaders.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 bg-purple-950/60 px-3 py-1.5 rounded-lg border border-purple-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Regulated strictly by SEBI</span>
            </div>
            <button
              onClick={onOpenAiBot}
              className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1.5 bg-indigo-950/50 hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI: How to start stock investing safely?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stocks Compounding & CAGR Calculator */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              Indian Stock Returns & Dividend Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Calculate the combined power of capital appreciation (CAGR) and corporate dividend payouts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Initial Lump Sum (Starting Capital):
                </label>
                <span className="font-mono font-bold text-purple-400 text-base">
                  {formatINR(initialLumpSum)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={500000}
                step={5000}
                value={initialLumpSum}
                onChange={(e) => setInitialLumpSum(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Monthly Stock SIP (Direct Equity Accumulation):
                </label>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  {formatINR(monthlyDca)} / mo
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={50000}
                step={500}
                value={monthlyDca}
                onChange={(e) => setMonthlyDca(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Expected Long-Term CAGR:
                </label>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {cagr}% p.a.
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={25}
                step={0.5}
                value={cagr}
                onChange={(e) => setCagr(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>12% (Nifty Index)</span>
                <span>15% (Bluechip Stalwarts)</span>
                <span>20%+ (High Growth)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Tenure: {years} Years
                </label>
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

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Est. Dividend Yield: {dividendYield}%
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={3.5}
                  step={0.1}
                  value={dividendYield}
                  onChange={(e) => setDividendYield(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Equity Wealth Creation Projection
                </span>
                <span className="text-xs text-purple-400 font-semibold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                  {years} Years Horizon
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Total Invested</span>
                  <span className="text-xl font-bold font-mono text-slate-200">
                    {formatINR(totalInvested)}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40">
                  <span className="text-xs text-purple-400 font-semibold block mb-1">
                    Capital Appreciation
                  </span>
                  <span className="text-xl font-extrabold font-mono text-purple-400">
                    +{formatINR(capitalGains)}
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/50 shadow-inner">
                <span className="text-xs text-slate-300 font-semibold block mb-1">
                  Total Projected Portfolio Value (including dividends)
                </span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                  {formatINR(finalCorpus)}
                </div>
                <span className="text-xs text-amber-300/90 mt-2 block">
                  Estimated cumulative dividends received: <strong>{formatINR(totalEstimatedDividends)}</strong>
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Delivery holdings stored safely in NSDL / CDSL depository</span>
              <span className="text-purple-400 font-semibold">Zero Demat risk of broker default</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Indian Stock Broking Platforms */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Top SEBI-Registered Indian Stock Brokers
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Open a Demat & Trading account in 5 minutes with Aadhaar e-KYC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stockBrokers.map((broker) => (
            <div
              key={broker.name}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-white text-base group-hover:text-purple-400 transition-colors">
                    {broker.name}
                  </h4>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {broker.rating}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Equity Delivery:</span>
                    <span className="font-bold text-emerald-400">{broker.brokerageDelivery}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Intraday Brokerage:</span>
                    <span className="font-bold text-slate-200">{broker.intraday}</span>
                  </div>
                </div>

                <ul className="space-y-1 mb-4 text-xs text-slate-300">
                  {broker.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={broker.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-700"
              >
                <span>Open Demat on {broker.name.split(' ')[0]}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Indian Sector Trends Pulse */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          Indian Market Sector Trends & Opportunities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {sectorTrends.map((sec, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-xs">{sec.name}</span>
                <span className="text-emerald-400 font-mono font-bold text-[11px]">{sec.change}</span>
              </div>
              <p className="text-slate-400 text-[11px]">{sec.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Government Regulations & SEBI Investor Protection */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-400" />
          Government Regulations & SEBI Retail Investor Protection
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <h5 className="font-bold text-emerald-400 text-sm">SEBI Investor Protection Fund</h5>
            <p className="text-slate-300">
              National Stock Exchange (NSE) and BSE maintain an Investor Protection Fund (IPF) that compensates retail investors up to <strong>₹25 Lakhs per investor</strong> in case of stock broker default or insolvency.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <h5 className="font-bold text-purple-400 text-sm">Direct Demat Holding (NSDL / CDSL)</h5>
            <p className="text-slate-300">
              Your purchased shares never stay with the broker. They are credited directly to your government-licensed central depository account (CDSL or NSDL) tied to your PAN and Aadhaar.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <h5 className="font-bold text-amber-400 text-sm">SEBI SCORES Grievance Redressal</h5>
            <p className="text-slate-300">
              If any broker or listed company fails to resolve an issue within 21 days, you can lodge a formal complaint on the SEBI SCORES portal (scores.gov.in) with mandatory regulatory resolution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
