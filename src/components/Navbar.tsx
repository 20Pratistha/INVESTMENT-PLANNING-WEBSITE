import React from 'react';
import { 
  Menu, 
  Sparkles, 
  User, 
  TrendingUp, 
  ShieldCheck, 
  Wallet
} from 'lucide-react';
import { ActivePage, UserProfile } from '../types';
import { formatINR } from '../utils/financeCalculators';

interface NavbarProps {
  onOpenDrawer: () => void;
  activePage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenAiBot: () => void;
  niftyValue?: number;
  niftyChangePct?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDrawer,
  activePage,
  onSelectPage,
  userProfile,
  onOpenProfile,
  onOpenAiBot,
  niftyValue = 25420.75,
  niftyChangePct = '+0.56%',
}) => {
  const surplus = Math.max(0, userProfile.monthlyIncome - userProfile.monthlyExpenses);

  const mainLinks: { id: ActivePage; label: string }[] = [
    { id: 'home', label: 'Overview' },
    { id: 'sip', label: 'SIP' },
    { id: 'fd-bachat', label: 'FD & Bachat Ghar' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'gold-sgb', label: 'Gold & SGB' },
    { id: 'policies-tax', label: 'Tax & Policies' },
    { id: 'performance-tracker', label: 'Simulate Growth' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090d18]/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: 3-line hamburger menu + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDrawer}
            className="group flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-amber-500/40 text-slate-200 hover:text-amber-400 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            title="Open Investment Navigation Drawer"
            aria-label="Open menu"
          >
            <div className="w-5 h-0.5 bg-current rounded-full transition-all group-hover:w-5 mb-1" />
            <div className="w-4 h-0.5 bg-current rounded-full transition-all group-hover:w-5 mb-1" />
            <div className="w-5 h-0.5 bg-current rounded-full transition-all group-hover:w-5" />
          </button>

          <button 
            onClick={() => onSelectPage('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 p-0.5 shadow-md shadow-orange-500/20">
              <div className="w-full h-full bg-[#090e1a] rounded-[10px] flex items-center justify-center font-bold text-base text-amber-400">
                ₹
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-base sm:text-lg tracking-tight text-white leading-none">
                <span>NiveshMarg</span>
                <span className="hidden sm:inline-block text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 font-semibold tracking-wide">
                  INDIA
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden xs:inline-block leading-tight font-medium">
                भारत का निवेश साथी
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Quick Nav tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          {mainLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectPage(link.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Market snippet + AI Bot + Profile Login */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nifty 50 live badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 text-[11px]">NIFTY:</span>
            <span className="font-mono font-semibold">{niftyValue.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-emerald-400 font-bold">{niftyChangePct}</span>
          </div>

          {/* AI Advisor Button */}
          <button
            onClick={onOpenAiBot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Ask AI NiveshMitra Advisor"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">AI NiveshMitra</span>
            <span className="sm:hidden">AI Bot</span>
          </button>

          {/* User Login & Assessment Button */}
          <button
            onClick={onOpenProfile}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              userProfile.isLoggedIn
                ? 'bg-slate-800/90 border-emerald-500/50 text-white hover:bg-slate-700/80 shadow-sm'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 border-amber-400 font-bold shadow-md shadow-orange-500/20'
            }`}
          >
            {userProfile.isLoggedIn ? (
              <>
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-[10px]">
                  ✓
                </div>
                <div className="text-left hidden xs:block">
                  <div className="leading-tight font-semibold text-slate-200 max-w-[85px] truncate">
                    {userProfile.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono leading-none">
                    {formatINR(surplus, { compact: true })}/mo
                  </div>
                </div>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Login & Setup</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
