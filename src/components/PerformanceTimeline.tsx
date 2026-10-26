import React, { useState } from 'react';
import { 
  History, 
  TrendingUp, 
  IndianRupee, 
  Sparkles, 
  Calendar, 
  Clock, 
  Award, 
  Zap, 
  ArrowUpRight, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';
import { simulateTimeline, formatINR } from '../utils/financeCalculators';

interface PerformanceTimelineProps {
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenAiBot: () => void;
}

export const PerformanceTimeline: React.FC<PerformanceTimelineProps> = ({
  userProfile,
  onOpenProfile,
  onOpenAiBot,
}) => {
  const surplus = Math.max(0, userProfile.monthlyIncome - userProfile.monthlyExpenses);
  const defaultMonthly = surplus > 0 ? Math.round(surplus * 0.5) : 5000;

  // Simulator state
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('monthly');
  const [amount, setAmount] = useState<number>(defaultMonthly);
  const [cagrRate, setCagrRate] = useState<number>(13);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number>(11); // e.g. Month 12 by default

  const periodsCount = frequency === 'weekly' ? 52 : 36; // 52 weeks (1 year) or 36 months (3 years)
  const timelinePoints = simulateTimeline(frequency, amount, cagrRate, periodsCount);
  const currentPoint = timelinePoints[Math.min(selectedPeriodIndex, timelinePoints.length - 1)] || timelinePoints[0];

  // SVG Chart Dimensions & scaling
  const chartWidth = 720;
  const chartHeight = 260;
  const padding = 36;

  const maxVal = Math.max(...timelinePoints.map((p) => p.portfolioValue), 1000);
  const minVal = 0;

  const getX = (index: number) => padding + (index / (timelinePoints.length - 1)) * (chartWidth - padding * 2);
  const getY = (val: number) => chartHeight - padding - (val / maxVal) * (chartHeight - padding * 2);

  // SVG Path strings
  const portfolioPath = timelinePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.portfolioValue)}`)
    .join(' ');

  const investedPath = timelinePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.invested)}`)
    .join(' ');

  const savingsPath = timelinePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.savingsValue)}`)
    .join(' ');

  const areaPath = `${portfolioPath} L ${getX(timelinePoints.length - 1)} ${chartHeight - padding} L ${getX(0)} ${chartHeight - padding} Z`;

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-rose-950/80 via-slate-900 to-indigo-950/70 border border-rose-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider">
              Compounding Growth Simulator
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Weekly / Monthly Tracker
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            What Happens After Every Period of Investing?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Beginners often wonder: <em>"If I invest every week or month, how does my money actually behave?"</em> This interactive simulator tracks the step-by-step evolution of your money over time—showing how small regular habits turn into massive financial freedom.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-500/30">
              <Zap className="w-4 h-4" />
              <span>See the power of Rupee Cost Averaging in action</span>
            </div>
            <button
              onClick={onOpenAiBot}
              className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1.5 bg-indigo-950/50 hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI: How to maintain regular investing discipline?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Controls & Graph Container */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <History className="w-6 h-6 text-rose-400" />
              Interactive Period-by-Period Wealth Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Drag the slider to inspect the exact portfolio value and milestone at any week or month.
            </p>
          </div>

          {/* Frequency Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => {
                setFrequency('weekly');
                setAmount(Math.round(defaultMonthly / 4) || 1000);
                setSelectedPeriodIndex(11);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                frequency === 'weekly'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weekly Investing (52 Weeks)
            </button>
            <button
              onClick={() => {
                setFrequency('monthly');
                setAmount(defaultMonthly);
                setSelectedPeriodIndex(11);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                frequency === 'monthly'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Investing (36 Months)
            </button>
          </div>
        </div>

        {/* Input Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Investment per {frequency === 'weekly' ? 'Week' : 'Month'}:
              </label>
              <span className="font-mono font-bold text-rose-400 text-base">
                {formatINR(amount)} / {frequency === 'weekly' ? 'wk' : 'mo'}
              </span>
            </div>
            <input
              type="range"
              min={frequency === 'weekly' ? 250 : 1000}
              max={frequency === 'weekly' ? 15000 : 50000}
              step={frequency === 'weekly' ? 250 : 1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>{frequency === 'weekly' ? '₹250' : '₹1,000'}</span>
              <span>{frequency === 'weekly' ? '₹5,000' : '₹25,000'}</span>
              <span>{frequency === 'weekly' ? '₹15,000' : '₹50,000'}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Expected Annualized Return (CAGR):
              </label>
              <span className="font-mono font-bold text-amber-400 text-base">
                {cagrRate}% p.a.
              </span>
            </div>
            <input
              type="range"
              min={8}
              max={18}
              step={0.5}
              value={cagrRate}
              onChange={(e) => setCagrRate(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>8% (Conservative Debt)</span>
              <span>13% (Nifty Index)</span>
              <span>18% (Midcap / Alpha)</span>
            </div>
          </div>
        </div>

        {/* Selected Period Spotlight Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/50 via-slate-900 to-indigo-950/50 border border-rose-500/40 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-slate-400 block mb-1">
              Active Milestone Period
            </span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-1.5">
              <span>{frequency === 'weekly' ? `Week ${currentPoint.period}` : `Month ${currentPoint.period}`}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-sans font-semibold">
                {frequency === 'weekly' ? `${Math.round(currentPoint.period / 4.33)} Months` : `${(currentPoint.period / 12).toFixed(1)} Years`}
              </span>
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1">
              Total Invested So Far
            </span>
            <span className="text-xl font-bold font-mono text-slate-200">
              {formatINR(currentPoint.invested)}
            </span>
          </div>

          <div>
            <span className="text-xs text-emerald-400 font-semibold block mb-1">
              Total Portfolio Value
            </span>
            <span className="text-2xl font-extrabold font-mono text-emerald-400">
              {formatINR(currentPoint.portfolioValue)}
            </span>
            <span className="text-[11px] text-emerald-300 font-medium block">
              (+{formatINR(currentPoint.gain)} profit)
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1">
              vs Idle Bank Savings (3%)
            </span>
            <span className="text-lg font-bold font-mono text-slate-400">
              {formatINR(currentPoint.savingsValue)}
            </span>
            <span className="text-[11px] text-amber-300 font-medium block">
              You gained +{formatINR(currentPoint.portfolioValue - currentPoint.savingsValue)} extra!
            </span>
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-emerald-400 rounded-full" />
                <span className="text-emerald-300 font-medium">Compounded Portfolio (13% CAGR)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-slate-400 rounded-full" />
                <span>Invested Capital</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-amber-400/60 rounded-full" />
                <span className="text-slate-400">Normal Bank Savings (3%)</span>
              </span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">Hover or drag slider</span>
          </div>

          <div className="w-full overflow-x-auto bg-slate-950/80 rounded-2xl border border-slate-800 p-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto select-none"
            >
              {/* Gradient defs */}
              <defs>
                <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#1e293b" strokeDasharray="4 4" />
              <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="#1e293b" strokeDasharray="4 4" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#334155" />

              {/* Shaded Area */}
              <path d={areaPath} fill="url(#portfolioGrad)" />

              {/* Lines */}
              <path d={savingsPath} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <path d={investedPath} fill="none" stroke="#94a3b8" strokeWidth="2" />
              <path d={portfolioPath} fill="none" stroke="#10b981" strokeWidth="3" />

              {/* Active point indicator line */}
              <line
                x1={getX(selectedPeriodIndex)}
                y1={padding}
                x2={getX(selectedPeriodIndex)}
                y2={chartHeight - padding}
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="2 2"
              />

              {/* Active point circle */}
              <circle
                cx={getX(selectedPeriodIndex)}
                cy={getY(currentPoint.portfolioValue)}
                r="6"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Scrubber slider */}
          <div className="pt-2">
            <input
              type="range"
              min={0}
              max={timelinePoints.length - 1}
              value={selectedPeriodIndex}
              onChange={(e) => setSelectedPeriodIndex(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>{frequency === 'weekly' ? 'Week 1' : 'Month 1'}</span>
              <span>{frequency === 'weekly' ? 'Week 26 (Half Year)' : 'Month 18 (1.5 Years)'}</span>
              <span>{frequency === 'weekly' ? 'Week 52 (1 Year)' : 'Month 36 (3 Years)'}</span>
            </div>
          </div>
        </div>

        {/* Milestone Insights: What Happens Chronologically? */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            The Investor Journey: What Changes Over Time
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Period 1: Months 1 to 6
              </span>
              <h5 className="font-bold text-white text-sm">Building Discipline & Emergency Armor</h5>
              <p className="text-slate-300 leading-relaxed">
                You stop keeping money idle in savings accounts. Automated UPI autopay mandates eliminate emotional second-guessing. Even during small market dips, you buy more units at lower NAVs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                Period 2: Months 7 to 24
              </span>
              <h5 className="font-bold text-white text-sm">The Tipping Point Begins</h5>
              <p className="text-slate-300 leading-relaxed">
                Interest and dividend reinvestment begin accelerating. Your profits now start generating their own profits. Market fluctuations no longer cause panic because your cost basis is deeply averaged.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Period 3: Months 25 to 36+
              </span>
              <h5 className="font-bold text-white text-sm">Exponential Compounding</h5>
              <p className="text-slate-300 leading-relaxed">
                Annual compounding returns often surpass your entire fresh yearly investment! This is where wealth generation becomes passive and outpaces inflation by 6% to 8%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
