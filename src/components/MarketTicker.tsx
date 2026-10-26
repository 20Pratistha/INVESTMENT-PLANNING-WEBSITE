import React from 'react';
import { TrendingUp, ShieldCheck, Flame, Percent, RefreshCw } from 'lucide-react';

export const MarketTicker: React.FC = () => {
  const tickerItems = [
    { label: 'NIFTY 50', value: '25,420.75', change: '+142.30 (+0.56%)', isBullish: true },
    { label: 'SENSEX', value: '83,280.40', change: '+415.80 (+0.50%)', isBullish: true },
    { label: 'NIFTY MIDCAP 150', value: '21,890.15', change: '+210.45 (+0.97%)', isBullish: true },
    { label: 'RBI REPO RATE', value: '6.50%', change: 'Neutral / Stable', isBullish: null },
    { label: '10Y G-SEC YIELD', value: '6.98%', change: '-0.04 bps', isBullish: true },
    { label: 'POST OFFICE PPF', value: '7.10%', change: '100% Tax-Free (EEE)', isBullish: true },
    { label: 'SUKANYA SAMRIDDHI', value: '8.20%', change: 'Highest Govt Small Savings', isBullish: true },
    { label: 'GOLD 24K (10g)', value: '₹78,450', change: '+₹320 (+0.41%)', isBullish: true },
    { label: 'BANK FD (1-3Y)', value: '7.10% - 7.75%', change: 'Senior citizens get +0.50%', isBullish: null },
  ];

  return (
    <div className="bg-[#0c1220] border-b border-slate-800/60 overflow-hidden text-xs py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase tracking-wider text-[11px] shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-amber-400">Live India Market Pulse:</span>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap py-0.5">
          {tickerItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              <span className="text-slate-400 font-medium">{item.label}</span>
              <span className="font-mono font-bold text-slate-100">{item.value}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                  item.isBullish === true
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    : item.isBullish === false
                    ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
