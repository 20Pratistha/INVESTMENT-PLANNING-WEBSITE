import React, { useState } from 'react';
import { 
  PieChart, 
  TrendingUp, 
  IndianRupee, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  Sliders, 
  Percent, 
  Clock,
  Layers
} from 'lucide-react';
import { UserProfile, IndianPlatform } from '../types';
import { calculateSip, formatINR } from '../utils/financeCalculators';
import { TOP_INDIAN_PLATFORMS } from '../data/indianFinanceData';

interface SipPageProps {
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenAiBot: () => void;
}

export const SipPage: React.FC<SipPageProps> = ({ userProfile, onOpenProfile, onOpenAiBot }) => {
  const surplus = Math.max(0, userProfile.monthlyIncome - userProfile.monthlyExpenses);
  const defaultSip = surplus > 0 ? Math.round(surplus * 0.5) : 5000;

  // Calculator state
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(defaultSip);
  const [expectedReturn, setExpectedReturn] = useState<number>(13);
  const [years, setYears] = useState<number>(10);
  const [stepUpPct, setStepUpPct] = useState<number>(10); // 10% annual step-up
  const [enableStepUp, setEnableStepUp] = useState<boolean>(true);
  const [adjustInflation, setAdjustInflation] = useState<boolean>(false);

  // Calculation output
  const sipResult = calculateSip(
    monthlyInvestment,
    expectedReturn,
    years,
    enableStepUp ? stepUpPct : 0
  );

  const displayMaturity = adjustInflation 
    ? sipResult.inflationAdjustedMaturity 
    : sipResult.maturityValue;

  const displayGain = Math.max(0, displayMaturity - sipResult.investedAmount);

  const sipPlatforms = TOP_INDIAN_PLATFORMS.filter(
    (p) => p.category === 'SIP & Mutual Funds' || p.name.includes('Zerodha') || p.name.includes('Groww')
  );

  // Live Daily Market Statistics for Indian Fund Categories
  const categoryBenchmarks = [
    {
      category: 'Nifty 50 Index Funds',
      risk: 'Moderate',
      cagr3y: '16.4%',
      cagr5y: '15.8%',
      description: 'Invests in top 50 bluechip companies in India. Lowest expense ratio (~0.10%). Best for beginners.',
      bestPickExample: 'UTI Nifty 50 / Navi Nifty 50 Index Fund',
    },
    {
      category: 'Flexi Cap Mutual Funds',
      risk: 'Moderate to High',
      cagr3y: '18.9%',
      cagr5y: '19.2%',
      description: 'Fund managers dynamically allocate between Large, Mid, and Small caps based on market valuation.',
      bestPickExample: 'Parag Parikh Flexi Cap / HDFC Flexi Cap',
    },
    {
      category: 'ELSS Tax Saver Funds',
      risk: 'Moderate',
      cagr3y: '17.2%',
      cagr5y: '16.5%',
      description: 'Qualifies for Section 80C tax deduction up to ₹1.5L. Shortest 3-year lock-in in India.',
      bestPickExample: 'Mirae Asset ELSS / Quant ELSS Tax Saver',
    },
    {
      category: 'Nifty Midcap 150 Index',
      risk: 'High',
      cagr3y: '26.8%',
      cagr5y: '22.4%',
      description: 'High-growth emerging Indian enterprises. Higher volatility but superior 7+ year compounding.',
      bestPickExample: 'Motilal Oswal Midcap / Nippon India Growth',
    },
  ];

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
              Systematic Investment Plan (SIP)
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              India Equities
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            SIP & Mutual Funds in India
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            A Systematic Investment Plan allows you to invest a fixed amount regularly (monthly or weekly) in Indian equity mutual funds. You never have to time the market—when markets fall, you get more units, and when they rise, your wealth compounds at 12% - 15% CAGR.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recommended for your profile: {formatINR(defaultSip)}/month</span>
            </div>
            <button
              onClick={onOpenAiBot}
              className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1.5 bg-indigo-950/50 hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI for Best Fund Recommendations</span>
            </button>
          </div>
        </div>
      </div>

      {/* SIP Compounding & Profit Calculator */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <PieChart className="w-6 h-6 text-emerald-400" />
              Interactive Indian SIP Profit Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Simulate wealth compounding and profits earned over time with step-up inflation options.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAdjustInflation(!adjustInflation)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                adjustInflation
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {adjustInflation ? 'Inflation Adjusted (6% benchmark)' : 'Nominal Returns'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Controls Sliders */}
          <div className="lg:col-span-6 space-y-6">
            {/* Monthly Investment Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  Monthly Investment Amount:
                </label>
                <span className="font-mono font-bold text-emerald-400 text-base sm:text-lg">
                  {formatINR(monthlyInvestment)} / mo
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={100000}
                step={500}
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>₹500 (Min)</span>
                <span>₹25,000</span>
                <span>₹50,000</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            {/* Expected Return Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-amber-400" />
                  Expected Annual Return (CAGR):
                </label>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {expectedReturn}% p.a.
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={20}
                step={0.5}
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>8% (Conservative)</span>
                <span>12-14% (Nifty Index)</span>
                <span>18-20% (Midcaps)</span>
              </div>
            </div>

            {/* Time Horizon Years */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  Investment Tenure:
                </label>
                <span className="font-mono font-bold text-blue-400 text-base">
                  {years} Years ({years * 12} installments)
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>1 Year</span>
                <span>10 Years</span>
                <span>20 Years</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Step-Up Toggle & Slider */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="stepup-toggle"
                    checked={enableStepUp}
                    onChange={(e) => setEnableStepUp(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="stepup-toggle" className="text-xs font-semibold text-slate-200 cursor-pointer">
                    Enable Annual Step-Up SIP (Recommended for salaried Indians)
                  </label>
                </div>
                {enableStepUp && (
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    +{stepUpPct}% / year
                  </span>
                )}
              </div>

              {enableStepUp && (
                <div>
                  <input
                    type="range"
                    min={5}
                    max={25}
                    step={1}
                    value={stepUpPct}
                    onChange={(e) => setStepUpPct(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Increases your monthly SIP by {stepUpPct}% every year in line with your annual salary increments.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Calculator Output Displays & Visualizer */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  SIP Wealth Projection Summary
                </span>
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {years} Years Result
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Total Amount Invested</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-slate-200">
                    {formatINR(sipResult.investedAmount)}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Your principal contributions
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
                  <span className="text-xs text-emerald-400 font-semibold block mb-1">
                    Estimated Profit / Wealth Gain
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400">
                    +{formatINR(displayGain)}
                  </span>
                  <span className="text-[11px] text-emerald-300/80 block mt-1">
                    Pure compounding returns
                  </span>
                </div>
              </div>

              {/* Total Maturity Value */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/50 shadow-inner">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-300 font-semibold">
                    Expected Total Portfolio Maturity Value
                  </span>
                  {adjustInflation && (
                    <span className="text-[10px] text-amber-300 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                      Purchasing Power Today
                    </span>
                  )}
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                  {formatINR(displayMaturity)}
                </div>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                  <span>Wealth multiple:</span>
                  <strong className="text-emerald-400 font-bold">
                    {(displayMaturity / Math.max(1, sipResult.investedAmount)).toFixed(1)}x of your invested capital
                  </strong>
                </div>
              </div>

              {/* Visual Proportion Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-medium text-slate-400">
                  <span>Invested: {Math.round((sipResult.investedAmount / Math.max(1, displayMaturity)) * 100)}%</span>
                  <span className="text-emerald-400 font-semibold">
                    Profit: {Math.round((displayGain / Math.max(1, displayMaturity)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    className="bg-slate-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(5, (sipResult.investedAmount / Math.max(1, displayMaturity)) * 100))}%`,
                    }}
                  />
                  <div
                    className="bg-emerald-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, (displayGain / Math.max(1, displayMaturity)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>SEBI Direct Mutual Funds (0% Agent Commission)</span>
              <a href="#platforms" className="text-emerald-400 hover:underline font-semibold flex items-center gap-1">
                <span>View Platforms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Statistics & Indian Market Categories */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Where to Invest: Best Mutual Fund Categories in India
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Historical returns, risk suitability, and recommended fund baskets for retail investors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryBenchmarks.map((cat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-base">{cat.category}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    cat.risk === 'Moderate'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {cat.risk}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {cat.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Historical 3Y / 5Y CAGR:</span>
                  <div className="flex gap-2 font-mono font-bold text-emerald-400">
                    <span>3Y: {cat.cagr3y}</span>
                    <span>•</span>
                    <span>5Y: {cat.cagr5y}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Popular Indian Funds:</span>
                  <span className="font-semibold text-slate-200 text-[11px] truncate">{cat.bestPickExample}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Indian Platforms to Start SIP */}
      <div id="platforms" className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Best Indian Platforms to Start SIP
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Regulated by SEBI & AMFI. Direct mutual funds with ₹0 commission.
            </p>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline-block">Click to visit official portal</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sipPlatforms.map((plat) => (
            <div
              key={plat.name}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-xs text-slate-950">
                      {plat.logoText.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                        {plat.name}
                      </h4>
                      <span className="text-[11px] text-slate-400">{plat.activeUsers}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {plat.rating}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800 text-xs">
                    <span className="text-slate-400 text-[11px] block">Charges:</span>
                    <span className="text-emerald-400 font-semibold">{plat.charges}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {plat.highlight}
                  </p>
                </div>
              </div>

              <a
                href={plat.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-700"
              >
                <span>Start SIP on {plat.name.split(' ')[0]}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Indian Government Policies & Tax Rules for Mutual Funds */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-400" />
          Government Policies & Tax Rules for Indian Mutual Funds (Budget 2024 / 2025 Updates)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <h5 className="font-bold text-emerald-400 text-sm">Long Term Capital Gains (LTCG)</h5>
            <p className="text-slate-300">
              Holding period: <strong>More than 12 months</strong>.
            </p>
            <p className="text-slate-400">
              Gains up to <strong>₹1.25 Lakh per financial year are 100% TAX FREE</strong>. Any profits above ₹1.25 Lakh are taxed at a flat rate of <strong>12.5%</strong> (without indexation).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <h5 className="font-bold text-amber-400 text-sm">Short Term Capital Gains (STCG)</h5>
            <p className="text-slate-300">
              Holding period: <strong>Less than 12 months</strong>.
            </p>
            <p className="text-slate-400">
              Taxed at a flat rate of <strong>20%</strong> under Section 111A. This is to discourage short-term speculation and encourage long-term compounding.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <h5 className="font-bold text-blue-400 text-sm">Section 80C Tax Deduction (ELSS)</h5>
            <p className="text-slate-300">
              Equity Linked Savings Scheme (ELSS).
            </p>
            <p className="text-slate-400">
              Save up to ₹46,800 in taxes under the Old Tax Regime with a <strong>₹1,50,000 deduction</strong>. Lowest lock-in of only <strong>3 years</strong> (vs PPF 15 yrs or Bank FD 5 yrs).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
