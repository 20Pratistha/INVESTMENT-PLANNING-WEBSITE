import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { UserProfile } from '../types';
import { formatINR } from '../utils/financeCalculators';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  platforms?: { name: string; url: string }[];
}

interface AiAdvisorBotProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfileFromAi?: (updated: Partial<UserProfile>) => void;
}

export const AiAdvisorBot: React.FC<AiAdvisorBotProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfileFromAi,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Namaste! I am **NiveshMitra**, your AI Investment Companion for India. 🇮🇳\n\nI can help you:\n• Calculate how much you can invest from your family income\n• Choose between SIPs, Post Office Bachat Ghar, Bank FDs, and Stocks\n• Clarify Indian tax rules (80C, LTCG/STCG)\n• Recommend the best platforms like Zerodha, Groww, or SBI YONO.\n\nWhat would you like to plan today?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const surplus = Math.max(0, userProfile.monthlyIncome - userProfile.monthlyExpenses);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    `How to invest my ₹${formatINR(surplus, { compact: true })} monthly surplus?`,
    'Compare PPF (7.1%) vs Equity SIP (13%)',
    'What are the new Budget 2024 LTCG tax rules?',
    'Best Indian broker for complete beginners with ₹500 SIP?',
    'How much should I keep in an emergency bank FD?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          profile: userProfile,
          actionType: 'query',
        }),
      });

      const data = await response.json();
      let botReply = '';

      if (data.success && data.advice) {
        botReply = data.advice;
      } else {
        botReply = `Based on your profile with a monthly disposable surplus of ₹${surplus.toLocaleString('en-IN')}:
• **SIP (50%)**: Start ₹${Math.round(surplus * 0.5).toLocaleString('en-IN')}/mo in a Nifty 50 Index Fund via Zerodha Coin or Groww.
• **Post Office / FD (30%)**: Place ₹${Math.round(surplus * 0.3).toLocaleString('en-IN')}/mo into PPF or SBI Fixed Deposit for risk-free safety.
• **Equities (15%)**: Allocate ₹${Math.round(surplus * 0.15).toLocaleString('en-IN')}/mo in large caps.
• **Gold/SGB (5%)**: Allocate ₹${Math.round(surplus * 0.05).toLocaleString('en-IN')}/mo as an inflation hedge.`;
      }

      // Check if platforms should be recommended
      const recPlatforms: { name: string; url: string }[] = [];
      if (query.toLowerCase().includes('platform') || query.toLowerCase().includes('broker') || query.toLowerCase().includes('sip') || query.toLowerCase().includes('invest')) {
        recPlatforms.push(
          { name: 'Zerodha (Coin & Kite)', url: 'https://zerodha.com' },
          { name: 'Groww', url: 'https://groww.in' },
          { name: 'India Post (IPPB)', url: 'https://ippbonline.com' }
        );
      }

      const botMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        platforms: recPlatforms.length > 0 ? recPlatforms : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Advisor chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'bot',
          text: `For an Indian investor with ₹${surplus.toLocaleString('en-IN')} investible surplus, we recommend starting a monthly SIP in a Nifty 50 Index Fund (via Zerodha or Groww) combined with Post Office PPF (7.1% EEE tax-free). This balances wealth creation and capital safety.`,
          timestamp: 'Just now',
          platforms: [
            { name: 'Zerodha Coin', url: 'https://zerodha.com' },
            { name: 'Groww', url: 'https://groww.in' },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Bot Chat Container */}
      <div className="relative w-full max-w-2xl bg-[#0c1224] border border-indigo-500/40 rounded-2xl shadow-2xl z-10 flex flex-col h-[620px] max-h-[90vh] overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0c1224] rounded-[10px] flex items-center justify-center text-amber-300">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">AI NiveshMitra Advisor</h3>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-indigo-200/70">
                Powered by Gemini • Customized for Indian Retail Investors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Context Strip */}
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <span className="text-slate-300 font-semibold">{userProfile.name}</span>
            <span>•</span>
            <span>Surplus: <strong className="text-emerald-400 font-mono">{formatINR(surplus)}/mo</strong></span>
            <span>•</span>
            <span className="capitalize">{userProfile.riskProfile} Risk</span>
          </div>
          <span className="text-[11px] text-amber-400/90 font-medium shrink-0">
            {userProfile.city || 'India'}
          </span>
        </div>

        {/* Chat message list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-medium'
                    : 'bg-slate-900/90 border border-slate-700/80 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line">
                  {msg.text}
                </div>

                {/* Recommended Platform Direct Cards */}
                {msg.platforms && msg.platforms.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-2">
                    <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block">
                      Direct Verified Platforms to Start:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.platforms.map((p) => (
                        <a
                          key={p.name}
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors group"
                        >
                          <span>{p.name}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1 text-right ${
                    msg.sender === 'user' ? 'text-slate-900/70' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-amber-300 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>NiveshMitra is formulating Indian financial advice...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="p-2 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto no-scrollbar flex gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat input box */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. Which fund to choose? How to save 80C?)..."
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
