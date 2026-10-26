import React from 'react';
import { 
  X, 
  TrendingUp, 
  Landmark, 
  PieChart, 
  Coins, 
  FileCheck2, 
  SlidersHorizontal, 
  History, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { ActivePage, UserProfile } from '../types';
import { formatINR } from '../utils/financeCalculators';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenAiBot: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activePage,
  onSelectPage,
  userProfile,
  onOpenProfile,
  onOpenAiBot,
}) => {
  if (!isOpen) return null;

  const surplus = Math.max(0, userProfile.monthlyIncome - userProfile.monthlyExpenses);

  const navItems = [
    {
      id: 'home' as ActivePage,
      label: 'Home & Investment Overview',
      hindi: 'मुख्य पृष्ठ एवं निवेश परिचय',
      icon: TrendingUp,
      badge: 'Start Here',
      color: 'text-amber-400',
    },
    {
      id: 'sip' as ActivePage,
      label: 'SIP (Systematic Investment Plans)',
      hindi: 'म्यूचुअल फंड एसआईपी (चक्रवृद्धि लाभ)',
      icon: PieChart,
      badge: '12-15% CAGR',
      color: 'text-emerald-400',
    },
    {
      id: 'fd-bachat' as ActivePage,
      label: 'FD & Bachat Ghar (Post Office & Banks)',
      hindi: 'डाकघर बचत योजना एवं बैंक एफडी',
      icon: Landmark,
      badge: '100% Safe (Govt)',
      color: 'text-blue-400',
    },
    {
      id: 'stocks' as ActivePage,
      label: 'Stocks & Direct Equity (NSE / BSE)',
      hindi: 'भारतीय शेयर बाजार (निफ्टी एवं सेंसेक्स)',
      icon: TrendingUp,
      badge: 'High Growth',
      color: 'text-purple-400',
    },
    {
      id: 'gold-sgb' as ActivePage,
      label: 'Gold & Sovereign Gold Bonds (SGB)',
      hindi: 'स्वर्ण निवेश एवं आरबीआई बॉन्ड',
      icon: Coins,
      badge: '2.5% + Tax Free',
      color: 'text-yellow-400',
    },
    {
      id: 'policies-tax' as ActivePage,
      label: 'Government Policies & Tax Advantages',
      hindi: 'सरकारी नीतियां एवं धारा 80C कर छूट',
      icon: FileCheck2,
      badge: 'Save Taxes',
      color: 'text-teal-400',
    },
    {
      id: 'performance-tracker' as ActivePage,
      label: 'Periodic Performance Simulator',
      hindi: 'साप्ताहिक / मासिक निवेश सिमुलेटर',
      icon: History,
      badge: 'Compounding',
      color: 'text-rose-400',
    },
    {
      id: 'my-allocation' as ActivePage,
      label: 'Personalized Allocation & Suggestions',
      hindi: 'आपकी आय के अनुसार निवेश सुझाव',
      icon: SlidersHorizontal,
      badge: 'Custom Plan',
      color: 'text-cyan-400',
    },
  ];

  const handleNavClick = (page: ActivePage) => {
    onSelectPage(page);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#0d1424] border-r border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl z-10 overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 p-0.5 shadow-lg shadow-orange-500/20">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center font-bold text-lg text-amber-400">
                ₹
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-lg text-white">
                <span>NiveshMarg</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 font-medium">
                  INDIA
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">भारत का निवेश साथी • Smart Wealth</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Mini Banner */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800/70 to-slate-900 border border-slate-700/60 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {userProfile.isLoggedIn ? userProfile.name : 'Personal Investor Profile'}
                </h4>
                <p className="text-xs text-slate-400">
                  {userProfile.city ? `${userProfile.city}, ${userProfile.state}` : 'Setup your income & banks'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenProfile();
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-colors"
            >
              {userProfile.isLoggedIn ? 'Edit Profile' : 'Log In / Setup'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-700/50 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Monthly Surplus:</span>
              <span className="font-bold text-emerald-400 text-sm">
                {formatINR(surplus)}/mo
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Risk Appetite:</span>
              <span className="font-medium text-slate-200">
                {userProfile.riskProfile}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Investment Avenues & Tools
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-transparent border border-amber-500/40 text-white shadow-sm'
                    : 'hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-slate-800/80 ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className="text-[11px] text-slate-400">{item.hindi}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    isActive 
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </button>
            );
          })}

          {/* AI Advisor direct CTA button inside drawer */}
          <div className="pt-2 px-1">
            <button
              onClick={() => {
                onClose();
                onOpenAiBot();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/40 text-indigo-100 hover:border-indigo-400 hover:from-indigo-900/80 transition-all shadow-md group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    AI NiveshMitra Advisor
                    <span className="text-[10px] bg-purple-500/30 text-purple-200 px-1.5 py-0.2 rounded border border-purple-400/30">
                      Gemini
                    </span>
                  </div>
                  <div className="text-[11px] text-indigo-200/80">Auto-fill preferences & Ask any question</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Quick Direct Links to Top Indian Platforms */}
          <div className="pt-4 px-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Top Indian Investing Platforms</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="https://zerodha.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 flex items-center justify-between transition-colors group"
              >
                <span className="text-slate-300 font-medium group-hover:text-blue-400">Zerodha</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
              </a>
              <a
                href="https://groww.in"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between transition-colors group"
              >
                <span className="text-slate-300 font-medium group-hover:text-emerald-400">Groww</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
              </a>
              <a
                href="https://onlinesbi.sbi"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 flex items-center justify-between transition-colors group"
              >
                <span className="text-slate-300 font-medium group-hover:text-sky-400">SBI YONO</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-sky-400" />
              </a>
              <a
                href="https://ippbonline.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 flex items-center justify-between transition-colors group"
              >
                <span className="text-slate-300 font-medium group-hover:text-amber-400">Post Office</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/90 text-xs text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">SEBI Investor Helpline:</span>
            <span className="font-mono text-emerald-400 font-semibold">1800 266 7575</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Investments in securities are subject to market risks. Read all scheme related documents carefully.
          </p>
        </div>
      </div>
    </div>
  );
};
