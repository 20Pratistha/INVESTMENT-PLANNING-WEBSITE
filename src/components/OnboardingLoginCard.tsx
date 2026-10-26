import React, { useState } from 'react';
import { 
  User, 
  IndianRupee, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  Zap,
  SlidersHorizontal,
  Flame,
  PieChart,
  Landmark,
  Coins
} from 'lucide-react';
import { UserProfile, RiskProfile, ActivePage } from '../types';
import { INDIAN_BANKS_LIST, INDIAN_STATES_AND_CITIES, SAMPLE_PROFILES } from '../data/indianFinanceData';
import { analyzeBudgetAndAllocation, formatINR } from '../utils/financeCalculators';

interface OnboardingLoginCardProps {
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onNavigate: (page: ActivePage) => void;
  onOpenAiBot: () => void;
}

export const OnboardingLoginCard: React.FC<OnboardingLoginCardProps> = ({
  userProfile,
  onSaveProfile,
  onNavigate,
  onOpenAiBot,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<UserProfile>({
    ...userProfile,
    isLoggedIn: userProfile.isLoggedIn ?? false,
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(userProfile.isLoggedIn);

  // Live budget and surplus calculation
  const budget = analyzeBudgetAndAllocation(
    formData.monthlyIncome,
    formData.monthlyExpenses,
    formData.riskProfile,
    formData.timeHorizonYears
  );

  const handleBankToggle = (bank: string) => {
    setFormData((prev) => {
      const exists = prev.existingBanks.includes(bank);
      return {
        ...prev,
        existingBanks: exists
          ? prev.existingBanks.filter((b) => b !== bank)
          : [...prev.existingBanks, bank],
      };
    });
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = SAMPLE_PROFILES[presetKey];
    if (preset) {
      setFormData((prev) => ({
        ...prev,
        ...preset,
        isLoggedIn: true,
      }));
      setHasCalculated(true);
    }
  };

  const handleAiAutoFill = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'auto_fill',
          prompt: aiPrompt,
        }),
      });
      const data = await res.json();
      if (data.success && data.advice) {
        try {
          const parsed = typeof data.advice === 'string' 
            ? JSON.parse(data.advice.replace(/```json|```/g, '').trim()) 
            : data.advice;
          setFormData((prev) => ({
            ...prev,
            name: parsed.name || prev.name || 'Indian Investor',
            monthlyIncome: Number(parsed.monthlyIncome) || prev.monthlyIncome,
            monthlyExpenses: Number(parsed.monthlyExpenses) || prev.monthlyExpenses,
            timeHorizonYears: Number(parsed.timeHorizonYears) || prev.timeHorizonYears,
            riskProfile: (parsed.riskProfile as RiskProfile) || prev.riskProfile,
            city: parsed.city || prev.city || 'Mumbai',
            state: parsed.state || prev.state || 'Maharashtra',
            primaryGoal: parsed.primaryGoal || prev.primaryGoal,
            existingBanks: Array.isArray(parsed.existingBanks) && parsed.existingBanks.length > 0 
              ? parsed.existingBanks 
              : prev.existingBanks,
            isLoggedIn: true,
          }));
          setHasCalculated(true);
          setStep(2);
        } catch {
          handleApplyPreset('fresher');
          setHasCalculated(true);
          setStep(2);
        }
      }
    } catch (err) {
      console.error('AI Auto-fill error:', err);
      handleApplyPreset('fresher');
      setHasCalculated(true);
      setStep(2);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCompleteSubmission = () => {
    const completed: UserProfile = {
      ...formData,
      isLoggedIn: true,
    };
    onSaveProfile(completed);
    setHasCalculated(true);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#070b14] border-2 border-amber-500/30 p-6 sm:p-10 shadow-2xl shadow-amber-500/5">
      {/* Glow Backdrops */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 p-0.5 shadow-lg shadow-orange-500/20 shrink-0">
            <div className="w-full h-full bg-[#0b1120] rounded-[14px] flex items-center justify-center text-amber-400">
              <User className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Personal Investor Login & Financial Assessment
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                Step {step} of 2
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Start by providing your details. We calculate your investible surplus and automatically unlock tailored Indian suggestions.
            </p>
          </div>
        </div>

        {/* Quick presets pill bar */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <span className="text-[11px] font-semibold text-slate-400">Quick Auto-Fill:</span>
          <button
            type="button"
            onClick={() => handleApplyPreset('fresher')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
          >
            🎓 Fresher (₹55k)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('family')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
          >
            👨‍👩‍👧 Family (₹1.2L)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('senior')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
          >
            👴 Senior (₹60k)
          </button>
        </div>
      </div>

      {/* AI Smart Prompt Bar */}
      <div className="relative z-10 my-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-slate-900 border border-indigo-500/40 shadow-inner">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-amber-300 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-indigo-200">
              AI Smart Auto-Fill:
            </span>
          </div>

          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. 29yo IT consultant in Bengaluru earning ₹1.1 Lakh with moderate risk and SBI account..."
              className="flex-1 bg-slate-950/90 border border-indigo-500/40 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAiAutoFill())}
            />
            <button
              type="button"
              disabled={isAiLoading || !aiPrompt.trim()}
              onClick={handleAiAutoFill}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shrink-0"
            >
              {isAiLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Fill with AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Multi-Step Form */}
      <div className="relative z-10 space-y-6">
        {step === 1 ? (
          /* Step 1: Personal & Financial Intake */
          <div className="space-y-6">
            {/* Identity & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rohit Sharma"
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>State in India</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => {
                    const newState = e.target.value;
                    const cities = INDIAN_STATES_AND_CITIES[newState] || ['General'];
                    setFormData({ ...formData, state: newState, city: cities[0] });
                  }}
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                >
                  {Object.keys(INDIAN_STATES_AND_CITIES).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  City / Town
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                >
                  {(INDIAN_STATES_AND_CITIES[formData.state] || [formData.city]).map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Income & Expense Live Sliders (The Heart of Surplus Planning) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                    Family Monthly Finances (₹)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Slide to your household's total income and living needs.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Live Calculated Surplus:
                    </span>
                    <span className="text-lg font-black font-mono text-emerald-400">
                      {formatINR(budget.surplus)} / mo
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    budget.savingsRatio >= 20 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {budget.savingsRatio}% Surplus
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Income Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">
                      Total Family Monthly Income:
                    </span>
                    <span className="font-mono font-extrabold text-emerald-400 text-base">
                      {formatINR(formData.monthlyIncome)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20000}
                    max={500000}
                    step={5000}
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>₹20,000</span>
                    <span>₹2,50,000</span>
                    <span>₹5,00,000+</span>
                  </div>
                </div>

                {/* Living Expenses Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">
                      Monthly Living Expenses (Rent, EMIs, Groceries, Bills):
                    </span>
                    <span className="font-mono font-extrabold text-rose-400 text-base">
                      {formatINR(formData.monthlyExpenses)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={Math.max(formData.monthlyIncome, 50000)}
                    step={2000}
                    value={formData.monthlyExpenses}
                    onChange={(e) => setFormData({ ...formData, monthlyExpenses: Number(e.target.value) })}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Essential Needs</span>
                    <span>Discretionary</span>
                    <span>Household</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Banks & Investment Preferences */}
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Which Indian Banks do you currently hold accounts in?</span>
                </span>
                <span className="text-[11px] text-slate-400">Select all that apply</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {INDIAN_BANKS_LIST.slice(0, 8).map((bank) => {
                  const isSelected = formData.existingBanks.includes(bank);
                  return (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => handleBankToggle(bank)}
                      className={`p-2.5 rounded-xl text-xs font-medium text-left border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm shadow-amber-500/10'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="truncate pr-1">{bank}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next Step Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Continue: Risk Appetite & Horizon</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Risk Profile, Horizon, & Live Suggested Split */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risk Profile Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Choose Your Risk Appetite:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Conservative', 'Moderate', 'Aggressive'] as RiskProfile[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, riskProfile: r })}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 ${
                        formData.riskProfile === r
                          ? r === 'Conservative'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-400 shadow-md shadow-blue-500/10'
                            : r === 'Moderate'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-md shadow-amber-500/10'
                            : 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-md shadow-purple-500/10'
                          : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span>{r}</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        {r === 'Conservative' ? 'FD & PPF' : r === 'Moderate' ? 'SIP + FD' : 'Equity Heavy'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Horizon Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>Time Horizon to Invest:</span>
                  </span>
                  <span className="font-bold text-blue-400">{formData.timeHorizonYears} Years</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={formData.timeHorizonYears}
                  onChange={(e) => setFormData({ ...formData, timeHorizonYears: Number(e.target.value) })}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>1-3 Yrs (Short)</span>
                  <span>5-10 Yrs (Balanced)</span>
                  <span>10+ Yrs (Wealth Creation)</span>
                </div>
              </div>
            </div>

            {/* Instant Tailored Suggestion Display */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/50 border border-emerald-500/40 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Personalized Recommendation Generated
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    Suggested Monthly Investment Split from your {formatINR(budget.surplus)} Surplus
                  </h4>
                </div>
                <span className="text-xs text-slate-400">
                  Needs: {formatINR(formData.monthlyExpenses)} | Invest: {formatINR(budget.surplus)}
                </span>
              </div>

              {/* 4 Pillars Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* SIP */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <PieChart className="w-3.5 h-3.5" />
                      SIP (Mutual Funds)
                    </span>
                    <span className="text-xs font-mono font-bold text-white">{budget.allocation.sipPercent}%</span>
                  </div>
                  <div className="text-xl font-extrabold font-mono text-emerald-400">
                    {formatINR(budget.allocation.sipAmount)} / mo
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Nifty 50 & Flexi Cap compounding
                  </span>
                </div>

                {/* Bachat Ghar */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-blue-500/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                      <Landmark className="w-3.5 h-3.5" />
                      FD & Bachat Ghar
                    </span>
                    <span className="text-xs font-mono font-bold text-white">{budget.allocation.fdBachatPercent}%</span>
                  </div>
                  <div className="text-xl font-extrabold font-mono text-blue-400">
                    {formatINR(budget.allocation.fdBachatAmount)} / mo
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    PPF (7.1% tax-free) or Bank FD
                  </span>
                </div>

                {/* Stocks */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-purple-500/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Direct Stocks
                    </span>
                    <span className="text-xs font-mono font-bold text-white">{budget.allocation.stocksPercent}%</span>
                  </div>
                  <div className="text-xl font-extrabold font-mono text-purple-400">
                    {formatINR(budget.allocation.stocksAmount)} / mo
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    NSE Bluechips on Zerodha / Groww
                  </span>
                </div>

                {/* Gold / SGB */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-amber-500/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      Gold / SGB
                    </span>
                    <span className="text-xs font-mono font-bold text-white">{budget.allocation.goldPercent}%</span>
                  </div>
                  <div className="text-xl font-extrabold font-mono text-amber-400">
                    {formatINR(budget.allocation.goldAmount)} / mo
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    2.5% RBI Sovereign Gold Bonds
                  </span>
                </div>
              </div>

              {/* Emergency Alert */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-800/60 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    Emergency Cushion: Keep <strong>{formatINR(budget.recommendedEmergencyFund)}</strong> in a sweep-in FD at {formData.existingBanks[0] || 'SBI'}.
                  </span>
                </span>
                <span className="text-cyan-400 font-semibold text-[11px] shrink-0">6 Months Shield</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                ← Back to Income & Personal Details
              </button>

              <button
                type="button"
                onClick={handleCompleteSubmission}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Profile & Explore Investment Plans Below</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
