import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  NavigationDrawer 
} from './components/NavigationDrawer';
import { 
  MarketTicker 
} from './components/MarketTicker';
import { 
  OnboardingLoginCard 
} from './components/OnboardingLoginCard';
import { 
  HeroSlideshow 
} from './components/HeroSlideshow';
import { 
  UserProfileModal 
} from './components/UserProfileModal';
import { 
  AiAdvisorBot 
} from './components/AiAdvisorBot';
import { 
  SipPage 
} from './components/SipPage';
import { 
  FdBachatPage 
} from './components/FdBachatPage';
import { 
  StocksPage 
} from './components/StocksPage';
import { 
  GoldSgbPage 
} from './components/GoldSgbPage';
import { 
  PoliciesTaxPage 
} from './components/PoliciesTaxPage';
import { 
  PerformanceTimeline 
} from './components/PerformanceTimeline';
import { 
  MyAllocationPage 
} from './components/MyAllocationPage';
import { 
  Footer 
} from './components/Footer';

import { ActivePage, UserProfile } from './types';
import { analyzeBudgetAndAllocation, formatINR } from './utils/financeCalculators';
import { TOP_INDIAN_PLATFORMS } from './data/indianFinanceData';

import { 
  TrendingUp, 
  Landmark, 
  PieChart, 
  Coins, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  IndianRupee, 
  CheckCircle2, 
  SlidersHorizontal, 
  ExternalLink,
  Flame,
  UserCheck,
  Building2,
  Clock,
  Award
} from 'lucide-react';

const STORAGE_KEY = 'niveshmarg_user_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  phone: '',
  city: 'Mumbai',
  state: 'Maharashtra',
  monthlyIncome: 75000,
  monthlyExpenses: 40000,
  timeHorizonYears: 7,
  riskProfile: 'Moderate',
  existingBanks: ['State Bank of India (SBI)', 'HDFC Bank'],
  primaryGoal: 'Long-term Wealth Creation & Buying Home',
  hasEmergencyFund: false,
  isLoggedIn: false,
};

export default function App() {
  // Navigation & Modal States
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isAiBotOpen, setIsAiBotOpen] = useState<boolean>(false);
  const [showEditLoginCard, setShowEditLoginCard] = useState<boolean>(false);

  // User Profile State with LocalStorage persistence
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load user profile from storage', e);
    }
    return DEFAULT_PROFILE;
  });

  // Save profile changes
  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    setShowEditLoginCard(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save user profile to storage', e);
    }
  };

  const handleUpdateProfilePartial = (partial: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...partial };
    handleSaveProfile(updated);
  };

  // Scroll to top when changing active page
  const handleSelectPage = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Surplus calculation
  const surplus = Math.max(0, userProfile.monthlyIncome - userProfile.monthlyExpenses);
  const budget = analyzeBudgetAndAllocation(
    userProfile.monthlyIncome,
    userProfile.monthlyExpenses,
    userProfile.riskProfile,
    userProfile.timeHorizonYears
  );

  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-300">
      {/* Slide-out Navigation Drawer triggered by top-left 3 lines */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activePage={activePage}
        onSelectPage={handleSelectPage}
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAiBot={() => setIsAiBotOpen(true)}
      />

      {/* User Login & Financial Diagnostic Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        onNavigateToAvenue={handleSelectPage}
      />

      {/* AI FinBot Advisor Floating / Modal */}
      <AiAdvisorBot
        isOpen={isAiBotOpen}
        onClose={() => setIsAiBotOpen(false)}
        userProfile={userProfile}
        onUpdateProfileFromAi={handleUpdateProfilePartial}
      />

      {/* Top Navbar */}
      <Navbar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        activePage={activePage}
        onSelectPage={handleSelectPage}
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAiBot={() => setIsAiBotOpen(true)}
      />

      {/* Live Market Ticker */}
      <MarketTicker />

      {/* Main Content Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 1. FIRST THING: Personal Login & Financial Intake */}
            {(!userProfile.isLoggedIn || showEditLoginCard) ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <span>First Step: Your Financial Profile</span>
                  </div>
                  {userProfile.isLoggedIn && (
                    <button
                      onClick={() => setShowEditLoginCard(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Hide Login Card
                    </button>
                  )}
                </div>

                <OnboardingLoginCard
                  userProfile={userProfile}
                  onSaveProfile={handleSaveProfile}
                  onNavigate={handleSelectPage}
                  onOpenAiBot={() => setIsAiBotOpen(true)}
                />
              </div>
            ) : (
              /* Already Logged In: Stylish Overview Banner with quick edit trigger */
              <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950/40 border border-emerald-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Profile Configured • Suggestions Active
                      </span>
                      <span className="text-xs text-slate-400">
                        {userProfile.city}, {userProfile.state}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      Welcome {userProfile.name}, your calculated investible surplus is{' '}
                      <span className="text-emerald-400 font-mono">{formatINR(surplus)} / month</span>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      We have analyzed your family income of <strong>{formatINR(userProfile.monthlyIncome)}</strong> against <strong>{formatINR(userProfile.monthlyExpenses)}</strong> expenses. Below is your tailored Indian roadmap across SIPs, Post Office Bachat Ghar, Bank FDs, and Stocks.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleSelectPage('my-allocation')}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      <span>View Custom Split</span>
                    </button>

                    <button
                      onClick={() => setShowEditLoginCard(true)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-colors"
                    >
                      Update Income / Banks
                    </button>
                  </div>
                </div>

                {/* 4 Pillar Quick Allocation Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30">
                    <span className="text-slate-400 block text-[11px]">SIP & Mutual Funds:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {formatINR(budget.allocation.sipAmount)}/mo ({budget.allocation.sipPercent}%)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-blue-500/30">
                    <span className="text-slate-400 block text-[11px]">FD & Bachat Ghar:</span>
                    <span className="font-mono font-bold text-blue-400 text-sm">
                      {formatINR(budget.allocation.fdBachatAmount)}/mo ({budget.allocation.fdBachatPercent}%)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-purple-500/30">
                    <span className="text-slate-400 block text-[11px]">Direct Indian Stocks:</span>
                    <span className="font-mono font-bold text-purple-400 text-sm">
                      {formatINR(budget.allocation.stocksAmount)}/mo ({budget.allocation.stocksPercent}%)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/30">
                    <span className="text-slate-400 block text-[11px]">Gold & SGB (RBI):</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {formatINR(budget.allocation.goldAmount)}/mo ({budget.allocation.goldPercent}%)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Visual Multi-page Slideshow Hero */}
            <HeroSlideshow
              onNavigate={handleSelectPage}
              onOpenProfile={() => setIsProfileModalOpen(true)}
            />

            {/* Introduction to Investment Planning for Beginners */}
            <div className="space-y-6">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Why Investment Planning is Essential in India
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Stop Keeping Money Idle in 2.7% Savings Accounts
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  With Indian inflation averaging 5.5% - 6% annually, keeping money in a regular bank savings account actually reduces your purchasing power every single day. Here is how disciplined investing changes your financial trajectory.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
                    1
                  </div>
                  <h3 className="font-bold text-white text-base">Beat Indian Inflation</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    While groceries, education, and medical costs rise at 6% - 8% yearly in India, equity SIPs have historically grown at 12% - 15% CAGR, safeguarding your future purchasing power.
                  </p>
                  <div className="text-[11px] text-amber-400 font-semibold pt-2">
                    Real positive return: +6% to +8%
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                    2
                  </div>
                  <h3 className="font-bold text-white text-base">The Magic of Compounding</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Albert Einstein called compounding the 8th wonder of the world. Just ₹5,000/month invested for 15 years results in ₹9 Lakhs contributed but yields an estimated <strong>₹33.8 Lakhs</strong>!
                  </p>
                  <div className="text-[11px] text-emerald-400 font-semibold pt-2">
                    Over ₹24.8 Lakhs in pure profit
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-blue-500/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
                    3
                  </div>
                  <h3 className="font-bold text-white text-base">Sovereign & Tax Advantages</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Take advantage of Government of India exemptions: Section 80C up to ₹1.5L, 100% tax-free Post Office PPF (EEE), and zero capital gains tax on Sovereign Gold Bonds.
                  </p>
                  <div className="text-[11px] text-blue-400 font-semibold pt-2">
                    Legally save up to ₹46,800/yr in taxes
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Investment Avenues Grid (Interactive Jump Cards) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-400" />
                    Explore the 4 Pillars of Indian Wealth
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Each avenue has dedicated calculators, daily statistics, and government policy guides.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. SIP */}
                <div 
                  onClick={() => handleSelectPage('sip')}
                  className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-slate-800 hover:border-emerald-500/60 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <PieChart className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      12% - 15% CAGR
                    </span>
                    <h4 className="font-bold text-white text-lg group-hover:text-emerald-300 transition-colors">
                      SIP & Mutual Funds
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Invest monthly into India’s top 50 companies with Rupee Cost Averaging. Start with as little as ₹500/month.
                    </p>
                  </div>
                  <div className="pt-5 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>Open SIP Hub & Calculator</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. FD & Bachat */}
                <div 
                  onClick={() => handleSelectPage('fd-bachat')}
                  className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950/40 border border-slate-800 hover:border-blue-500/60 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                      100% Sovereign Safety
                    </span>
                    <h4 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">
                      Post Office & Bank FD
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      PPF (7.1% EEE tax-free), Sukanya Samriddhi (8.2%), and Bank FDs up to 7.75% for senior citizens.
                    </p>
                  </div>
                  <div className="pt-5 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs font-bold text-blue-400">
                    <span>Open Bachat Ghar Hub</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 3. Stocks */}
                <div 
                  onClick={() => handleSelectPage('stocks')}
                  className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-purple-950/40 border border-slate-800 hover:border-purple-500/60 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                      NSE & BSE Equity
                    </span>
                    <h4 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors">
                      Indian Stocks (Demat)
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Fractional ownership in India’s corporate titans. Earn dividends directly to bank and capital appreciation.
                    </p>
                  </div>
                  <div className="pt-5 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs font-bold text-purple-400">
                    <span>Explore Stocks & Demat</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 4. Gold & SGB */}
                <div 
                  onClick={() => handleSelectPage('gold-sgb')}
                  className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-yellow-950/40 border border-slate-800 hover:border-yellow-500/60 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Coins className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                      2.5% RBI Interest + Tax Free
                    </span>
                    <h4 className="font-bold text-white text-lg group-hover:text-amber-300 transition-colors">
                      Gold & Sovereign Bonds
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Sovereign Gold Bonds eliminate making charges, GST, and locker fees. 100% tax-free at 8 years.
                    </p>
                  </div>
                  <div className="pt-5 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>Explore Gold & SGB</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Beginner Roadmap: 4 Simple Steps to Start */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Zero Confusion Guide
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  How a Complete Beginner Can Start Investing Today
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="font-mono font-bold text-emerald-400 text-sm">Step 01</div>
                  <h5 className="font-bold text-white text-sm">Assess Family Surplus</h5>
                  <p className="text-slate-400">
                    Subtract essential living expenses from total family income. Even ₹1,000 to ₹5,000 monthly surplus is enough.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="font-mono font-bold text-blue-400 text-sm">Step 02</div>
                  <h5 className="font-bold text-white text-sm">Build Emergency Cushion</h5>
                  <p className="text-slate-400">
                    Keep 6 months of expenses in an auto-sweep Bank FD at {userProfile.existingBanks[0] || 'SBI'} before entering equities.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="font-mono font-bold text-purple-400 text-sm">Step 03</div>
                  <h5 className="font-bold text-white text-sm">Automate SIP with UPI</h5>
                  <p className="text-slate-400">
                    Open a 100% free account on Zerodha Coin or Groww. Set up an automated monthly UPI mandate in a Nifty 50 Index Fund.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="font-mono font-bold text-amber-400 text-sm">Step 04</div>
                  <h5 className="font-bold text-white text-sm">Claim Tax Benefits</h5>
                  <p className="text-slate-400">
                    Deposit up to ₹1.5L in Post Office PPF or Sukanya Samriddhi for triple tax-free wealth accumulation under Sec 80C.
                  </p>
                </div>
              </div>
            </div>

            {/* Top Indian Platforms Directory */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-400" />
                    Verified Indian Platforms to Start Investing
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Direct access to official SEBI, RBI, and India Post portals.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TOP_INDIAN_PLATFORMS.map((plat) => (
                  <div
                    key={plat.name}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">{plat.name}</span>
                        <span className="text-xs text-amber-400 font-semibold">{plat.rating}</span>
                      </div>
                      <p className="text-xs text-slate-300 mb-3">{plat.highlight}</p>
                      <div className="text-[11px] text-emerald-400 font-medium mb-3">
                        {plat.charges}
                      </div>
                    </div>
                    <a
                      href={plat.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                    >
                      <span>Visit {plat.name.split(' ')[0]} Official Portal</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Pages */}
        {activePage === 'sip' && (
          <SipPage
            userProfile={userProfile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenAiBot={() => setIsAiBotOpen(true)}
          />
        )}

        {activePage === 'fd-bachat' && (
          <FdBachatPage
            userProfile={userProfile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenAiBot={() => setIsAiBotOpen(true)}
          />
        )}

        {activePage === 'stocks' && (
          <StocksPage
            userProfile={userProfile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenAiBot={() => setIsAiBotOpen(true)}
          />
        )}

        {activePage === 'gold-sgb' && (
          <GoldSgbPage
            userProfile={userProfile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenAiBot={() => setIsAiBotOpen(true)}
          />
        )}

        {activePage === 'policies-tax' && (
          <PoliciesTaxPage
            userProfile={userProfile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenAiBot={() => setIsAiBotOpen(true)}
          />
        )}

        {activePage === 'performance-tracker' && (
          <PerformanceTimeline
            userProfile={userProfile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenAiBot={() => setIsAiBotOpen(true)}
          />
        )}

        {activePage === 'my-allocation' && (
          <MyAllocationPage
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfilePartial}
            onNavigate={handleSelectPage}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenAiBot={() => setIsAiBotOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleSelectPage}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAiBot={() => setIsAiBotOpen(true)}
      />
    </div>
  );
}
