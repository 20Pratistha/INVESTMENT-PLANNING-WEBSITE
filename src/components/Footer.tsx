import React from 'react';
import { ShieldCheck, IndianRupee, ExternalLink, Heart } from 'lucide-react';
import { ActivePage } from '../types';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
  onOpenProfile: () => void;
  onOpenAiBot: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenProfile, onOpenAiBot }) => {
  return (
    <footer className="bg-[#070b14] border-t border-slate-800 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center font-bold text-amber-400">
                  ₹
                </div>
              </div>
              <span className="font-bold text-white text-base">NiveshMarg India</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Visual, beginner-friendly Indian investment planning. Helping every Indian citizen start investing with confidence across SIPs, Post Office Bachat Ghar, and Bank FDs.
            </p>
            <div className="text-[11px] text-amber-400/90 font-medium">
              Made with pride for Indian retail investors 🇮🇳
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Investment Avenues
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigate('sip')} className="hover:text-emerald-400 transition-colors">
                  SIP & Mutual Funds (12-15% CAGR)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('fd-bachat')} className="hover:text-blue-400 transition-colors">
                  Post Office Bachat Ghar & PPF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('fd-bachat')} className="hover:text-blue-400 transition-colors">
                  Bank Fixed Deposits (FD / RD)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('stocks')} className="hover:text-purple-400 transition-colors">
                  Indian Stocks (NSE / BSE)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gold-sgb')} className="hover:text-amber-400 transition-colors">
                  Sovereign Gold Bonds (SGB)
                </button>
              </li>
            </ul>
          </div>

          {/* Tools & Government */}
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Tools & Policies
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigate('policies-tax')} className="hover:text-teal-400 transition-colors">
                  Section 80C Tax Guide & Budget 2024
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('performance-tracker')} className="hover:text-rose-400 transition-colors">
                  Periodic Growth Simulator
                </button>
              </li>
              <li>
                <button onClick={onOpenProfile} className="hover:text-amber-400 transition-colors">
                  Personal Surplus & Budget Calculator
                </button>
              </li>
              <li>
                <button onClick={onOpenAiBot} className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <span>AI NiveshMitra Advisor</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1 py-0.2 rounded border border-purple-500/30">
                    Gemini
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Official Indian Regulators & Helplines */}
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Indian Regulatory Helplines
            </h5>
            <ul className="space-y-2 text-xs">
              <li className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">SEBI Investor Helpline:</span>
                <span className="font-mono font-bold text-emerald-400">1800 266 7575 / 1800 22 7575</span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">RBI Integrated Ombudsman:</span>
                <span className="font-mono font-bold text-blue-400">14448 (Toll Free)</span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">India Post Customer Care:</span>
                <span className="font-mono font-bold text-amber-400">1800 266 6868</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Statutory Disclaimer */}
        <div className="pt-8 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2 leading-relaxed">
          <p>
            <strong>Disclaimer:</strong> NiveshMarg is an educational financial visualizer and personal planning tool designed to promote financial literacy in India. Mutual fund investments and equity securities are subject to market risks; please read all scheme-related documents carefully before investing. Historical returns are not indicative of future performance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[10px] text-slate-400">
            <span>© {new Date().getFullYear()} NiveshMarg India. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="https://sebi.gov.in" target="_blank" rel="noreferrer" className="hover:text-slate-200">SEBI.gov.in</a>
              <a href="https://rbi.org.in" target="_blank" rel="noreferrer" className="hover:text-slate-200">RBI.org.in</a>
              <a href="https://amfiindia.com" target="_blank" rel="noreferrer" className="hover:text-slate-200">AMFI India</a>
              <a href="https://indiapost.gov.in" target="_blank" rel="noreferrer" className="hover:text-slate-200">India Post</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
