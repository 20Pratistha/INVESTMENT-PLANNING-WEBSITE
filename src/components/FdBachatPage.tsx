import React, { useState } from 'react';
import { 
  Landmark, 
  ShieldCheck, 
  IndianRupee, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Sparkles, 
  Info,
  Clock,
  Percent,
  Calendar
} from 'lucide-react';
import { UserProfile } from '../types';
import { POST_OFFICE_SCHEMES, BANK_FD_RATES } from '../data/indianFinanceData';
import { calculateBankFd, calculatePpf, formatINR } from '../utils/financeCalculators';

interface FdBachatPageProps {
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenAiBot: () => void;
}

export const FdBachatPage: React.FC<FdBachatPageProps> = ({ userProfile, onOpenProfile, onOpenAiBot }) => {
  const surplus = Math.max(0, userProfile.monthlyIncome - userProfile.monthlyExpenses);
  const defaultLumpSum = surplus > 0 ? Math.round(surplus * 0.35 * 12) : 100000;

  // Calculator Mode: 'bank-fd' | 'ppf'
  const [calcMode, setCalcMode] = useState<'bank-fd' | 'ppf'>('bank-fd');
  const [principal, setPrincipal] = useState<number>(defaultLumpSum);
  const [fdRate, setFdRate] = useState<number>(7.25);
  const [fdTenureYears, setFdTenureYears] = useState<number>(3);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);

  // PPF inputs
  const [ppfAnnualDeposit, setPpfAnnualDeposit] = useState<number>(Math.min(150000, Math.max(10000, Math.round(surplus * 0.3 * 12) || 50000)));
  const [ppfYears, setPpfYears] = useState<number>(15);

  // Compute results
  const fdResult = calculateBankFd(principal, fdRate, fdTenureYears, isSeniorCitizen);
  const ppfResult = calculatePpf(ppfAnnualDeposit, ppfYears, 7.1);

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950/70 border border-blue-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase tracking-wider">
              100% Capital Safety & Fixed Income
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Govt & Banking
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Bank FD & Post Office Bachat Ghar
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            For capital preservation, risk-free compounding, and creating emergency liquidity. While Post Office schemes carry a direct <strong>100% Sovereign Guarantee from the Government of India</strong>, Bank Fixed Deposits are <strong>DICGC insured up to ₹5 Lakhs per bank</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero stock market volatility risk</span>
            </div>
            <button
              onClick={onOpenAiBot}
              className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1.5 bg-indigo-950/50 hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI: Should I choose PPF or FD?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive FD vs Bachat Ghar Calculator */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Landmark className="w-6 h-6 text-blue-400" />
              FD & Bachat Profit Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Calculate quarterly compounded Bank FD returns or 15-year Post Office PPF compounding.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCalcMode('bank-fd')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                calcMode === 'bank-fd'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bank Fixed Deposit (FD)
            </button>
            <button
              onClick={() => setCalcMode('ppf')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                calcMode === 'ppf'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Post Office PPF (7.1%)
            </button>
          </div>
        </div>

        {calcMode === 'bank-fd' ? (
          /* Bank FD Calculator */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            <div className="lg:col-span-6 space-y-6">
              {/* Principal Deposit */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    FD Principal Deposit Amount:
                  </label>
                  <span className="font-mono font-bold text-blue-400 text-base sm:text-lg">
                    {formatINR(principal)}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={2500000}
                  step={10000}
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>₹10,000</span>
                  <span>₹5 Lakhs</span>
                  <span>₹15 Lakhs</span>
                  <span>₹25 Lakhs</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Annual Interest Rate:
                  </label>
                  <span className="font-mono font-bold text-amber-400 text-base">
                    {isSeniorCitizen ? `${fdRate + 0.5}% (Senior +0.5%)` : `${fdRate}% p.a.`}
                  </span>
                </div>
                <input
                  type="range"
                  min={6.0}
                  max={9.0}
                  step={0.05}
                  value={fdRate}
                  onChange={(e) => setFdRate(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>6.5% (Short Term)</span>
                  <span>7.25% (SBI/HDFC avg)</span>
                  <span>8.25%+ (Small Finance)</span>
                </div>
              </div>

              {/* Tenure Years */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    FD Tenure (Years):
                  </label>
                  <span className="font-mono font-bold text-slate-200 text-base">
                    {fdTenureYears} Years ({fdTenureYears * 4} compounding quarters)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={fdTenureYears}
                  onChange={(e) => setFdTenureYears(Number(e.target.value))}
                  className="w-full accent-slate-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>1 Year</span>
                  <span>3 Years</span>
                  <span>5 Years (80C Tax Saver)</span>
                  <span>10 Years</span>
                </div>
              </div>

              {/* Senior Citizen Checkbox */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="senior-toggle"
                    checked={isSeniorCitizen}
                    onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                    className="accent-amber-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="senior-toggle" className="text-xs font-semibold text-slate-200 cursor-pointer">
                    Senior Citizen (60+ Years)
                  </label>
                </div>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  +0.50% Extra Interest
                </span>
              </div>
            </div>

            {/* Results Output */}
            <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Bank FD Maturity Breakdown
                  </span>
                  <span className="text-xs text-blue-400 font-semibold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                    Quarterly Compounded
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Principal Deposited</span>
                    <span className="text-xl font-bold font-mono text-slate-200">
                      {formatINR(fdResult.principal)}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/40">
                    <span className="text-xs text-blue-400 font-semibold block mb-1">
                      Total Interest Earned
                    </span>
                    <span className="text-xl font-extrabold font-mono text-blue-400">
                      +{formatINR(fdResult.totalInterest)}
                    </span>
                  </div>
                </div>

                {/* Total Maturity */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/50 shadow-inner">
                  <span className="text-xs text-slate-300 font-semibold block mb-1">
                    Total Amount on Maturity (Principal + Interest)
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                    {formatINR(fdResult.maturityValue)}
                  </div>
                  <span className="text-xs text-slate-400 mt-2 block">
                    Average annual interest generated: <strong>{formatINR(fdResult.annualInterest)} / year</strong>
                  </span>
                </div>

                {/* TDS Alert */}
                <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                  fdResult.isTdsApplicable 
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' 
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${fdResult.isTdsApplicable ? 'text-amber-400' : 'text-slate-500'}`} />
                  <div>
                    <span className="font-bold block">
                      TDS Alert (Section 194A):
                    </span>
                    {fdResult.isTdsApplicable ? (
                      <span>
                        Your annual interest (~{formatINR(fdResult.annualInterest)}) exceeds the statutory limit of {formatINR(fdResult.tdsThreshold)}. Bank will deduct 10% TDS unless Form 15G / 15H is submitted.
                      </span>
                    ) : (
                      <span>
                        Your annual interest is below {formatINR(fdResult.tdsThreshold)}. No TDS will be deducted by the bank.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>DICGC Insured up to ₹5,00,000</span>
                <span className="text-blue-400 font-medium">Auto-renew option available</span>
              </div>
            </div>
          </div>
        ) : (
          /* Post Office PPF Calculator */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Annual PPF Deposit (Max ₹1.5L per financial year):
                  </label>
                  <span className="font-mono font-bold text-amber-400 text-base sm:text-lg">
                    {formatINR(ppfAnnualDeposit)} / year
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={150000}
                  step={500}
                  value={ppfAnnualDeposit}
                  onChange={(e) => setPpfAnnualDeposit(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>₹500 (Min)</span>
                  <span>₹50,000</span>
                  <span>₹1,00,000</span>
                  <span>₹1,50,000 (Max 80C)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    PPF Tenure:
                  </label>
                  <span className="font-mono font-bold text-slate-200 text-base">
                    {ppfYears} Years
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={30}
                  step={5}
                  value={ppfYears}
                  onChange={(e) => setPpfYears(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>15 Years (Statutory)</span>
                  <span>20 Years</span>
                  <span>25 Years</span>
                  <span>30 Years</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs space-y-1.5 text-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Exempt-Exempt-Exempt (EEE) Triple Tax Exemption</span>
                </div>
                <p className="text-slate-300">
                  1. Investment qualifies for Section 80C deduction up to ₹1.5L.
                  <br />
                  2. Interest earned is 100% Tax Free.
                  <br />
                  3. Entire maturity amount is 100% Tax Free.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    PPF Compounding at 7.10% p.a.
                  </span>
                  <span className="text-xs text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                    Govt Sovereign Guarantee
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Total Invested</span>
                    <span className="text-xl font-bold font-mono text-slate-200">
                      {formatINR(ppfResult.totalInvested)}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40">
                    <span className="text-xs text-amber-400 font-semibold block mb-1">
                      Tax-Free Interest Earned
                    </span>
                    <span className="text-xl font-extrabold font-mono text-amber-400">
                      +{formatINR(ppfResult.interestEarned)}
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/60 border border-amber-500/50 shadow-inner">
                  <span className="text-xs text-slate-300 font-semibold block mb-1">
                    Total Tax-Free Maturity Corpus
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                    {formatINR(ppfResult.maturityValue)}
                  </div>
                  <span className="text-xs text-emerald-400 mt-2 block font-medium">
                    ✓ Zero Tax Payable on this entire amount
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Open via India Post IPPB or your existing bank</span>
                <span className="text-amber-400 font-semibold">Protected from court attachments</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Post Office Bachat Ghar Schemes Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            Post Office Bachat Ghar (National Savings Schemes)
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Backed directly by the Ministry of Finance, Government of India. Highest sovereign safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {POST_OFFICE_SCHEMES.map((scheme) => (
            <div
              key={scheme.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-amber-400">
                    {scheme.hindiName}
                  </span>
                  <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40">
                    {scheme.interestRate}% p.a.
                  </span>
                </div>

                <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors mb-2">
                  {scheme.name}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {scheme.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tenure:</span>
                    <span className="font-medium text-slate-200">{scheme.tenure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Compounding:</span>
                    <span className="font-medium text-slate-200">{scheme.compoundingFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tax Benefit:</span>
                    <span className="font-medium text-emerald-400 text-right max-w-[180px] truncate">
                      {scheme.taxBenefit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-2">
                  Ideal For: <strong className="text-slate-300 font-medium">{scheme.idealFor}</strong>
                </span>
                <a
                  href="https://ippbonline.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  <span>Apply via India Post IPPB</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bank Fixed Deposit Comparison Table */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Top Indian Bank Fixed Deposit Rates (2026 Comparison)
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Compare rates across Public Sector, Private, and Small Finance Banks.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-md">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Bank / Institution</th>
                <th className="p-4">Type</th>
                <th className="p-4">Regular Rate</th>
                <th className="p-4">Senior Citizen Rate</th>
                <th className="p-4">Popular Tenure</th>
                <th className="p-4">Safety Guarantee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {BANK_FD_RATES.map((bank, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <span>{bank.bankName}</span>
                    {userProfile.existingBanks.some((b) => b.includes(bank.bankName.slice(0, 4))) && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-semibold border border-emerald-500/30">
                        Your Bank
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400">{bank.type}</td>
                  <td className="p-4 font-mono font-bold text-slate-100">{bank.regularRate}%</td>
                  <td className="p-4 font-mono font-bold text-amber-400">{bank.seniorRate}%</td>
                  <td className="p-4 text-slate-300">{bank.popularTenure}</td>
                  <td className="p-4">
                    {bank.dicgcInsured ? (
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        DICGC Insured (₹5L)
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                        100% Sovereign Backed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
