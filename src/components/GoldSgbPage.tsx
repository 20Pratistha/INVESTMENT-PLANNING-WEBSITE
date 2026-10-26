import React, { useState } from 'react';
import { 
  Coins, 
  ShieldCheck, 
  IndianRupee, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  Percent, 
  Clock, 
  Flame
} from 'lucide-react';
import { UserProfile } from '../types';
import { formatINR } from '../utils/financeCalculators';

interface GoldSgbPageProps {
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenAiBot: () => void;
}

export const GoldSgbPage: React.FC<GoldSgbPageProps> = ({ userProfile, onOpenProfile, onOpenAiBot }) => {
  const currentGoldPer10g = 78450;
  const currentGoldPerGram = currentGoldPer10g / 10; // ~₹7,845/gram

  // SGB Calculator State
  const [grams, setGrams] = useState<number>(20); // 20 grams
  const [goldCagr, setGoldCagr] = useState<number>(9.5); // Historical 9-10% gold CAGR in INR
  const [tenureYears, setTenureYears] = useState<number>(8); // Statutory 8 years for full tax exemption

  const purchaseCost = grams * currentGoldPerGram;
  const futureGoldPricePerGram = currentGoldPerGram * Math.pow(1 + goldCagr / 100, tenureYears);
  const futureGoldCorpus = Math.round(grams * futureGoldPricePerGram);
  
  // RBI pays 2.5% simple interest per year on initial investment value
  const annualRbiInterest = Math.round(purchaseCost * 0.025);
  const totalRbiInterest = annualRbiInterest * tenureYears;
  const totalMaturityWithInterest = futureGoldCorpus + totalRbiInterest;

  const comparisonData = [
    {
      feature: 'Annual Interest Paid',
      physicalGold: '0% (Nil)',
      digitalGold: '0% (Nil)',
      sgb: '2.50% p.a. paid semi-annually by RBI',
    },
    {
      feature: 'GST & Making Charges',
      physicalGold: '3% GST + 8% to 20% making loss',
      digitalGold: '3% GST on purchase',
      sgb: '0% GST (Zero charges)',
    },
    {
      feature: 'Capital Gains Tax at 8 Yrs',
      physicalGold: 'Taxed at 12.5% (post Budget 2024)',
      digitalGold: 'Taxed at 12.5%',
      sgb: '100% TAX FREE under Sec 47(viic)',
    },
    {
      feature: 'Storage & Theft Risk',
      physicalGold: 'High risk (Bank locker rent ₹2k-₹8k/yr)',
      digitalGold: 'Held in partner vault',
      sgb: 'Stored digitally in RBI Demat/Cert',
    },
    {
      feature: 'Purity Guarantee',
      physicalGold: 'BIS Hallmark required',
      digitalGold: '24K 99.9% pure',
      sgb: '999 Purity benchmarked by RBI',
    },
  ];

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-yellow-950/70 border border-amber-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
              Reserve Bank of India (RBI)
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Inflation & Currency Hedge
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Sovereign Gold Bonds (SGB) & Digital Gold
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Gold is deeply rooted in Indian households as an auspicious store of value. Sovereign Gold Bonds issued by the <strong>Reserve Bank of India</strong> are superior to physical jewellery in every way: you earn gold appreciation PLUS <strong>2.50% annual interest</strong>, pay <strong>zero GST</strong>, and enjoy <strong>100% tax-free capital gains</strong> at 8 years.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Sovereign backing by Government of India</span>
            </div>
            <button
              onClick={onOpenAiBot}
              className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1.5 bg-indigo-950/50 hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI: How much gold should I hold?</span>
            </button>
          </div>
        </div>
      </div>

      {/* SGB Compounding & Interest Calculator */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Coins className="w-6 h-6 text-amber-400" />
              Sovereign Gold Bond (SGB) Returns Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Calculates gold price appreciation plus RBI's 2.5% annual guaranteed interest.
            </p>
          </div>
          <div className="text-xs font-semibold text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-500/30">
            Gold Benchmark: {formatINR(currentGoldPer10g)} / 10g
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Gold Quantity to Buy (Grams):
                </label>
                <span className="font-mono font-bold text-amber-400 text-base sm:text-lg">
                  {grams} Grams ({formatINR(purchaseCost)})
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                step={1}
                value={grams}
                onChange={(e) => setGrams(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>1g (Min ₹7,845)</span>
                <span>10g (~1 Tola)</span>
                <span>50g</span>
                <span>100g</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Expected Gold Annual Price Growth (CAGR):
                </label>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {goldCagr}% p.a.
                </span>
              </div>
              <input
                type="range"
                min={6.0}
                max={14.0}
                step={0.5}
                value={goldCagr}
                onChange={(e) => setGoldCagr(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>6% (Conservative)</span>
                <span>9.5% (Historical 20-yr CAGR)</span>
                <span>14% (High Inflation)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Tenure:
                </label>
                <span className="font-mono font-bold text-slate-200 text-base">
                  {tenureYears} Years (Statutory 8-Year RBI Period)
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={8}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-slate-400 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Premature exit option is available after 5th year on RBI interest payout dates. Full tax exemption applies at 8 years.
              </span>
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  SGB 8-Year Maturity Value
                </span>
                <span className="text-xs text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  100% Tax Free at 8Y
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Initial Cost ({grams}g)</span>
                  <span className="text-xl font-bold font-mono text-slate-200">
                    {formatINR(purchaseCost)}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40">
                  <span className="text-xs text-amber-400 font-semibold block mb-1">
                    RBI 2.5% Cash Interest
                  </span>
                  <span className="text-xl font-extrabold font-mono text-amber-400">
                    +{formatINR(totalRbiInterest)}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    ({formatINR(annualRbiInterest)}/yr in your bank)
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-yellow-950/60 border border-amber-500/50 shadow-inner">
                <span className="text-xs text-slate-300 font-semibold block mb-1">
                  Total Gold Corpus + RBI Interest at 8 Years
                </span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                  {formatINR(totalMaturityWithInterest)}
                </div>
                <span className="text-xs text-emerald-400 font-medium mt-2 block">
                  ✓ Capital gains at maturity are completely exempt from Income Tax
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Can be held in Demat or paper certificate</span>
              <span className="text-amber-400 font-semibold">Accepted as loan collateral</span>
            </div>
          </div>
        </div>
      </div>

      {/* SGB vs Physical Gold vs Digital Gold Comparison Table */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Comparison: SGB vs Physical Jewellery vs Digital Gold
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Why financial advisors recommend allocating 5% to 10% in Sovereign Gold Bonds instead of physical ornaments.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-md">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Feature / Metric</th>
                <th className="p-4 text-amber-400">Sovereign Gold Bond (SGB)</th>
                <th className="p-4">Physical Gold Ornaments</th>
                <th className="p-4">Digital Gold / Gold ETF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-semibold text-white">{row.feature}</td>
                  <td className="p-4 font-bold text-amber-300 bg-amber-950/20">{row.sgb}</td>
                  <td className="p-4 text-slate-400">{row.physicalGold}</td>
                  <td className="p-4 text-slate-300">{row.digitalGold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Where to buy SGB in India */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-400" />
          Where to Buy Sovereign Gold Bonds in India
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h5 className="font-bold text-white text-sm">1. RBI Retail Direct Portal</h5>
            <p className="text-slate-300">
              Direct access portal from Reserve Bank of India with 0 fees and 0 commission.
            </p>
            <a
              href="https://rbiretaildirect.org.in"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Visit RBI Retail Direct</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h5 className="font-bold text-white text-sm">2. Your Existing Bank NetBanking</h5>
            <p className="text-slate-300">
              SBI, HDFC, ICICI, PNB offer 1-click digital SGB application during RBI tranche issue windows.
            </p>
            <span className="text-emerald-400 font-semibold text-[11px] block">
              ₹50 discount per gram on online payment
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h5 className="font-bold text-white text-sm">3. Stock Brokers (Secondary Market)</h5>
            <p className="text-slate-300">
              Buy existing tranches anytime on Zerodha, Groww, or Angel One under the SGB ticker on NSE/BSE.
            </p>
            <span className="text-purple-400 font-semibold text-[11px] block">
              Often trade at 2-5% discount to spot gold!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
