import React, { useState } from 'react';
import { 
  X, 
  User, 
  Sparkles, 
  IndianRupee, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { UserProfile, RiskProfile } from '../types';
import { INDIAN_BANKS_LIST, INDIAN_STATES_AND_CITIES, SAMPLE_PROFILES } from '../data/indianFinanceData';
import { analyzeBudgetAndAllocation, formatINR } from '../utils/financeCalculators';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onNavigateToAvenue?: (page: any) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onNavigateToAvenue,
}) => {
  if (!isOpen) return null;

  // Local form state
  const [formData, setFormData] = useState<UserProfile>({ ...userProfile });
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'calculation'>('details');

  // Compute live financial health and surplus
  const budgetAnalysis = analyzeBudgetAndAllocation(
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
        // Try parsing JSON if Gemini returned JSON
        try {
          const parsed = typeof data.advice === 'string' ? JSON.parse(data.advice.replace(/```json|```/g, '').trim()) : data.advice;
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
            existingBanks: Array.isArray(parsed.existingBanks) && parsed.existingBanks.length > 0 ? parsed.existingBanks : prev.existingBanks,
            isLoggedIn: true,
          }));
          setActiveTab('calculation');
        } catch {
          // If plain text was returned, apply intelligent heuristics
          setFormData((prev) => ({
            ...prev,
            isLoggedIn: true,
            monthlyIncome: prev.monthlyIncome || 75000,
            monthlyExpenses: prev.monthlyExpenses || 40000,
          }));
          setActiveTab('calculation');
        }
      }
    } catch (err) {
      console.error('AI Auto-fill error:', err);
      // Fallback
      handleApplyPreset('fresher');
      setActiveTab('calculation');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...formData,
      isLoggedIn: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[#0c1222] border border-slate-700/80 rounded-2xl shadow-2xl z-10 flex flex-col max-h-[92vh] overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900/90 via-[#0d1428] to-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-emerald-400 p-0.5 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/25 shrink-0">
              <div className="w-full h-full bg-[#0a0f1d] rounded-[14px] flex items-center justify-center text-amber-300">
                <User className="w-6 h-6 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                Investor Profile & Surplus Planner
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wide">
                  50:30:20 Rule
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Personalized Indian financial intake to calculate exact surplus and suggest optimal investment avenues.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Auto-Fill Fast Track Banner */}
        <div className="bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-slate-900 border-b border-indigo-800/40 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 shrink-0 shadow-md">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-indigo-200 block">
                  AI Preference Auto-Fill
                </span>
                <span className="text-[11px] text-slate-400">
                  Describe your profile in plain words or click a sample persona:
                </span>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleApplyPreset('fresher')}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors shadow-sm"
              >
                🎓 Fresher (₹55k)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('family')}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors shadow-sm"
              >
                👨‍👩‍👧 Family (₹1.2L)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('senior')}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors shadow-sm"
              >
                👴 Senior Citizen (₹60k)
              </button>
            </div>
          </div>

          <div className="mt-3.5 flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. 26-year-old software engineer in Pune earning ₹85,000 with moderate risk..."
              className="flex-1 bg-slate-950/90 border border-indigo-500/40 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400"
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
                  <span>Processing...</span>
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

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 font-bold ${
              activeTab === 'details'
                ? 'border-amber-400 text-amber-400 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>1. Personal & Financial Details</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calculation')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 font-bold ${
              activeTab === 'calculation'
                ? 'border-emerald-400 text-emerald-400 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>2. Surplus Calculation & Suggested Split</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
              {formatINR(budgetAnalysis.surplus, { compact: true })}/mo
            </span>
          </button>
        </div>

        {/* Form Body - Ultra Stylish (CSS selector 1) */}
        <form 
          onSubmit={handleSubmit} 
          className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6 bg-gradient-to-b from-[#0c1224] via-[#090e1a] to-[#070b14] scroll-smooth"
        >
          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Personal Identification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rohit Sharma"
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rohit@gmail.com"
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Geographic location in India */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
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
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {Object.keys(INDIAN_STATES_AND_CITIES).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    City / Town
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {(INDIAN_STATES_AND_CITIES[formData.state] || [formData.city]).map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Income & Expenses (The Core Surplus equation) */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                    Family Monthly Finances (₹)
                  </h4>
                  <span className="text-xs text-slate-400">
                    Determines exact investible surplus
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-slate-300">
                        Total Family Monthly Income
                      </label>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
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
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>₹20,000</span>
                      <span>₹2,50,000</span>
                      <span>₹5,00,000+</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-slate-300">
                        Total Monthly Living Expenses
                      </label>
                      <span className="font-mono font-bold text-rose-400 text-sm">
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
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Rent / EMI</span>
                      <span>Groceries</span>
                      <span>Bills & Kids</span>
                    </div>
                  </div>
                </div>

                {/* Live Surplus Indicator Strip */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between bg-slate-950/60 p-3 rounded-lg">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Calculated Investible Surplus:</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">
                      {formatINR(budgetAnalysis.surplus)} / month
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Savings Ratio:</span>
                    <span className={`text-xs font-bold ${budgetAnalysis.savingsRatio >= 20 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {budgetAnalysis.savingsRatio}% of income ({budgetAnalysis.healthStatus})
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Horizon & Risk Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Time Horizon to Invest</span>
                  </label>
                  <select
                    value={formData.timeHorizonYears}
                    onChange={(e) => setFormData({ ...formData, timeHorizonYears: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value={2}>Short Term: 1 - 2 Years (Focus on FD & Liquid)</option>
                    <option value={4}>Medium Term: 3 - 5 Years (Balanced SIP + FD)</option>
                    <option value={7}>Long Term: 5 - 10 Years (Equity Index & Flexicap)</option>
                    <option value={15}>Wealth Creation: 10+ Years (Maximum Compounding)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Risk Appetite</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Conservative', 'Moderate', 'Aggressive'] as RiskProfile[]).map((risk) => (
                      <button
                        key={risk}
                        type="button"
                        onClick={() => setFormData({ ...formData, riskProfile: risk })}
                        className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                          formData.riskProfile === risk
                            ? risk === 'Conservative'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-400 shadow-sm'
                              : risk === 'Moderate'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                              : 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-sm'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {risk}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Bank Accounts */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Currently has Accounts in which Indian Banks?</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Select all that apply</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {INDIAN_BANKS_LIST.map((bank) => {
                    const isSelected = formData.existingBanks.includes(bank);
                    return (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => handleBankToggle(bank)}
                        className={`p-2 rounded-lg text-xs font-medium text-left border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="truncate pr-1">{bank}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Goal */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Financial Goal
                </label>
                <input
                  type="text"
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                  placeholder="e.g. Save ₹50 Lakhs for child's college, early retirement, buying a home..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          ) : (
            /* Calculation & Suggestions Tab */
            <div className="space-y-6">
              {/* Financial Health Summary Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800/80 to-slate-900 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Indian Household Budget Diagnostic (50:30:20 Rule)
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    budgetAnalysis.healthStatus === 'Optimal' 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {budgetAnalysis.healthStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center py-2 border-y border-slate-700/50">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Income</span>
                    <span className="text-base font-bold text-white font-mono">
                      {formatINR(formData.monthlyIncome)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Living Expenses</span>
                    <span className="text-base font-bold text-rose-400 font-mono">
                      {formatINR(formData.monthlyExpenses)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-emerald-400 font-semibold block">Net Surplus</span>
                    <span className="text-lg font-extrabold text-emerald-400 font-mono">
                      {formatINR(budgetAnalysis.surplus)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300">
                  {budgetAnalysis.healthMessage}
                </p>
              </div>

              {/* Recommended Monthly Basket */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">
                    Suggested Monthly Investment Split ({formData.riskProfile} Profile):
                  </h4>
                  <span className="text-xs text-slate-400">Total: {formatINR(budgetAnalysis.surplus)}/mo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* SIP Allocation */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="text-xs font-bold text-emerald-300">SIP (Mutual Funds)</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                        {budgetAnalysis.allocation.sipPercent}%
                      </span>
                    </div>
                    <div className="text-lg font-bold text-white font-mono">
                      {formatINR(budgetAnalysis.allocation.sipAmount)} / mo
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Nifty 50 Index & Flexi Cap funds via Zerodha Coin or Groww. Historical 12-15% CAGR.
                    </p>
                  </div>

                  {/* FD & Bachat Allocation */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-blue-500/30 hover:border-blue-500/60 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                        <span className="text-xs font-bold text-blue-300">FD & Bachat Ghar</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                        {budgetAnalysis.allocation.fdBachatPercent}%
                      </span>
                    </div>
                    <div className="text-lg font-bold text-white font-mono">
                      {formatINR(budgetAnalysis.allocation.fdBachatAmount)} / mo
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Post Office PPF (7.1% tax-free) or Bank FD (7.25% at {formData.existingBanks[0] || 'SBI'}).
                    </p>
                  </div>

                  {/* Stocks Allocation */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/30 hover:border-purple-500/60 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                        <span className="text-xs font-bold text-purple-300">Direct Stocks</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                        {budgetAnalysis.allocation.stocksPercent}%
                      </span>
                    </div>
                    <div className="text-lg font-bold text-white font-mono">
                      {formatINR(budgetAnalysis.allocation.stocksAmount)} / mo
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Nifty 50 Bluechip stalwarts for long-term compounding via Zerodha Kite or Angel One.
                    </p>
                  </div>

                  {/* Gold & SGB Allocation */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="text-xs font-bold text-amber-300">Gold / SGB</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                        {budgetAnalysis.allocation.goldPercent}%
                      </span>
                    </div>
                    <div className="text-lg font-bold text-white font-mono">
                      {formatINR(budgetAnalysis.allocation.goldAmount)} / mo
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Sovereign Gold Bonds (2.5% p.a. sovereign interest + tax-free gains) or Digital Gold.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended Emergency Cushion */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-cyan-200 block mb-0.5">
                    Recommended 6-Month Emergency Cushion: {formatINR(budgetAnalysis.recommendedEmergencyFund)}
                  </span>
                  <p className="text-slate-300">
                    Keep this in a sweep-in Fixed Deposit or Liquid Mutual Fund at {formData.existingBanks[0] || 'your primary bank'}. It protects your long-term SIPs from emergency liquidation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            {activeTab === 'details' ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('calculation')}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-orange-500/20"
                >
                  <span>Review Surplus & Split</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Back to Details
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile & Apply Across Site</span>
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
