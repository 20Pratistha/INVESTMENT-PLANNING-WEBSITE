import React from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  IndianRupee, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  HelpCircle, 
  ExternalLink,
  Info,
  Scale
} from 'lucide-react';
import { UserProfile } from '../types';

interface PoliciesTaxPageProps {
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenAiBot: () => void;
}

export const PoliciesTaxPage: React.FC<PoliciesTaxPageProps> = ({
  userProfile,
  onOpenProfile,
  onOpenAiBot,
}) => {
  const taxSavingOptions = [
    {
      section: 'Section 80C',
      limit: '₹1,50,000 / year',
      instruments: 'PPF (7.1%), ELSS Mutual Funds (14-16%), Sukanya Samriddhi (8.2%), 5-Year Tax Saver Bank FD (7.25%), NSC (7.7%), EPF',
      regime: 'Old Tax Regime only',
      lockIn: '3 Years (ELSS) to 15 Years (PPF)',
      highlight: 'Save up to ₹46,800 annually if you are in the 30% tax bracket.',
    },
    {
      section: 'Section 80CCD(1B) (NPS)',
      limit: 'Additional ₹50,000 / year',
      instruments: 'National Pension System (Tier 1)',
      regime: 'Exclusive deduction over & above 80C limit of ₹1.5L',
      lockIn: 'Till age 60 (retirement)',
      highlight: 'Saves up to ₹15,600 extra tax. 60% of corpus at maturity is 100% tax-free.',
    },
    {
      section: 'Section 80D (Health Insurance)',
      limit: '₹25,000 (Self/Family) + ₹50,000 (Senior Parents)',
      instruments: 'Health Insurance Premiums & Preventative Health Checkups (₹5,000)',
      regime: 'Old Tax Regime',
      lockIn: 'Annual policy premium',
      highlight: 'Critical for preserving wealth against unexpected hospital medical bills.',
    },
    {
      section: 'Section 10(10D) & Sec 47(viic)',
      limit: 'Unlimited Sovereign Exemption',
      instruments: 'Sovereign Gold Bonds (SGB) & PPF Maturity',
      regime: 'Both Old & New Tax Regimes',
      lockIn: '8 Years (SGB) / 15 Years (PPF)',
      highlight: '100% of capital gains and interest are completely exempt from Income Tax.',
    },
  ];

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-950/80 via-slate-900 to-emerald-950/70 border border-teal-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase tracking-wider">
              Ministry of Finance & SEBI
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Tax Laws & Sovereign Protections
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Indian Government Policies & Tax Advantages
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Learn how the Government of India incentivizes retail investors through tax deductions (Section 80C, 80CCD NPS), sovereign guarantees on Post Office deposits, DICGC bank deposit insurance, and SEBI investor compensation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 bg-teal-950/60 px-3 py-1.5 rounded-lg border border-teal-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Updated for Budget 2024 / 2025</span>
            </div>
            <button
              onClick={onOpenAiBot}
              className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1.5 bg-indigo-950/50 hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI: Should I opt for Old or New Tax Regime?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tax Deduction Sections */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-teal-400" />
            Key Tax Deductions for Indian Investors (Income Tax Act)
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Maximise legal tax rebates while growing your family wealth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {taxSavingOptions.map((opt, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-base text-teal-300">{opt.section}</h4>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    Max: {opt.limit}
                  </span>
                </div>

                <div className="space-y-2 mb-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Eligible Investment Instruments:</span>
                    <span className="text-slate-200 font-medium">{opt.instruments}</span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-slate-800">
                    <span className="text-slate-400">Applicable Regime:</span>
                    <span className="text-amber-300 font-semibold">{opt.regime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lock-in Period:</span>
                    <span className="text-slate-300">{opt.lockIn}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-emerald-300">
                💡 {opt.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capital Gains Tax Rules Comparison Table */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            Budget 2024 / 2025 Capital Gains Tax Guide (LTCG vs STCG)
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            How profits on different Indian asset classes are taxed upon withdrawal.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-md">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Asset Class</th>
                <th className="p-4">Long Term Holding Period</th>
                <th className="p-4">LTCG Tax Rate</th>
                <th className="p-4">STCG Tax Rate</th>
                <th className="p-4">Special Exemption</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr className="hover:bg-slate-800/50">
                <td className="p-4 font-bold text-white">Equity Shares & Equity Mutual Funds</td>
                <td className="p-4">&gt; 12 Months</td>
                <td className="p-4 font-mono font-bold text-amber-400">12.5%</td>
                <td className="p-4 font-mono font-bold text-rose-400">20%</td>
                <td className="p-4 text-emerald-400 font-semibold">First ₹1,25,000 profit/year is 100% Tax Free!</td>
              </tr>
              <tr className="hover:bg-slate-800/50">
                <td className="p-4 font-bold text-white">Post Office PPF & Sukanya Samriddhi</td>
                <td className="p-4">Statutory Tenure</td>
                <td className="p-4 font-mono font-bold text-emerald-400">0% (Nil)</td>
                <td className="p-4 font-mono font-bold text-emerald-400">0% (Nil)</td>
                <td className="p-4 text-emerald-400 font-semibold">100% Tax-Free (EEE Status)</td>
              </tr>
              <tr className="hover:bg-slate-800/50">
                <td className="p-4 font-bold text-white">Sovereign Gold Bonds (SGB)</td>
                <td className="p-4">8 Years (Maturity)</td>
                <td className="p-4 font-mono font-bold text-emerald-400">0% (Nil)</td>
                <td className="p-4 font-mono">Slab Rate if sold &lt; 3Y</td>
                <td className="p-4 text-emerald-400 font-semibold">Zero capital gains tax on RBI redemption</td>
              </tr>
              <tr className="hover:bg-slate-800/50">
                <td className="p-4 font-bold text-white">Bank Fixed Deposits & RD</td>
                <td className="p-4">Any Tenure</td>
                <td className="p-4 font-mono" colSpan={2}>Taxed as per your Income Tax Slab</td>
                <td className="p-4 text-slate-400">TDS applies over ₹40,000 (₹50k seniors)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sovereign Safety & Investor Protection Pillars */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          The 4 Pillars of Indian Government Safety Guarantees
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              1
            </div>
            <h5 className="font-bold text-white text-sm">Sovereign Guarantee</h5>
            <p className="text-slate-300">
              Post Office deposits and RBI Bonds are direct statutory liabilities on the Consolidated Fund of India. Zero risk of default.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              2
            </div>
            <h5 className="font-bold text-white text-sm">DICGC Bank Insurance</h5>
            <p className="text-slate-300">
              Every scheduled Indian bank is insured by DICGC (RBI subsidiary) up to ₹5,00,000 per depositor for principal + interest.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              3
            </div>
            <h5 className="font-bold text-white text-sm">SEBI Investor Fund</h5>
            <p className="text-slate-300">
              National Stock Exchange maintains an IPF compensating retail equity investors up to ₹25 Lakhs in broker insolvency.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              4
            </div>
            <h5 className="font-bold text-white text-sm">AMFI Direct Mandate</h5>
            <p className="text-slate-300">
              Direct mutual funds eliminate 1.5% commission, ensuring all your invested money works exclusively for your future wealth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
