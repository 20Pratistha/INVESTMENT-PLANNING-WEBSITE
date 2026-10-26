import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  TrendingUp, 
  Landmark, 
  PieChart, 
  Coins, 
  ArrowRight, 
  ShieldCheck, 
  IndianRupee,
  Sparkles
} from 'lucide-react';
import { ActivePage } from '../types';

interface HeroSlideshowProps {
  onNavigate: (page: ActivePage) => void;
  onOpenProfile: () => void;
}

interface SlideItem {
  id: string;
  targetPage: ActivePage;
  tag: string;
  tagColor: string;
  title: string;
  hindiTitle: string;
  headline: string;
  description: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  stat3Label: string;
  stat3Value: string;
  gradientBg: string;
  badge: string;
  ctaText: string;
  platforms: string[];
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ onNavigate, onOpenProfile }) => {
  const slides: SlideItem[] = [
    {
      id: 'sip',
      targetPage: 'sip',
      tag: 'GROWTH ENGINE',
      tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      title: 'Systematic Investment Planning (SIP)',
      hindiTitle: 'म्यूचुअल फंड एसआईपी — छोटी बचत से बड़ा कोष',
      headline: 'The Power of Compounding in Indian Equities',
      description: 'Start with just ₹500/month. Rupee-cost averaging automatically buys more mutual fund units when Indian markets dip and delivers average 12-15% long-term CAGR.',
      stat1Label: '₹5,000/mo in 15 Yrs',
      stat1Value: '₹33.8 Lakhs',
      stat2Label: 'Historical CAGR',
      stat2Value: '12% - 15%',
      stat3Label: 'Minimum Start',
      stat3Value: '₹500 / month',
      gradientBg: 'from-emerald-950/70 via-slate-900 to-emerald-900/40 border-emerald-500/30',
      badge: 'Most Popular for 20-45 Age',
      ctaText: 'Calculate SIP Profit & Platforms',
      platforms: ['Zerodha Coin', 'Groww', 'Angel One', 'SBI InTouch'],
    },
    {
      id: 'bachat',
      targetPage: 'fd-bachat',
      tag: '100% SOVEREIGN SAFETY',
      tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      title: 'Post Office Bachat Ghar & National Schemes',
      hindiTitle: 'डाकघर बचत योजनाएं — सरकारी गारंटी और शून्य जोखिम',
      headline: 'Tax-Free Guaranteed Wealth by Ministry of Finance',
      description: 'Public Provident Fund (PPF @ 7.1% EEE tax-free), Sukanya Samriddhi (8.2% for girl child), and Mahila Samman Savings Certificate (7.5%). Zero default risk.',
      stat1Label: 'Sukanya Scheme',
      stat1Value: '8.20% p.a.',
      stat2Label: 'PPF Tax Status',
      stat2Value: '100% Tax Free (EEE)',
      stat3Label: 'Sovereign Guarantee',
      stat3Value: 'Government of India',
      gradientBg: 'from-blue-950/70 via-slate-900 to-indigo-900/40 border-blue-500/30',
      badge: 'Zero Capital Risk',
      ctaText: 'View Bachat Ghar Schemes',
      platforms: ['India Post IPPB', 'Post Office Branches', 'SBI YONO'],
    },
    {
      id: 'fd',
      targetPage: 'fd-bachat',
      tag: 'PREDICTABLE ASSURED YIELD',
      tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      title: 'Bank Fixed Deposits (FD) & Emergency Fund',
      hindiTitle: 'बैंक सावधि जमा — वरिष्ठ नागरिकों हेतु 7.75% तक ब्याज',
      headline: 'Quarterly Compounded Returns & Instant Liquidity',
      description: 'Top Indian banks like SBI, HDFC, ICICI, and PNB offer up to 7.75% for senior citizens. DICGC insured up to ₹5 Lakhs per PAN per bank. Instant loans against FD up to 90%.',
      stat1Label: 'Senior Citizen Rate',
      stat1Value: 'Up to 7.75%',
      stat2Label: 'DICGC Insurance',
      stat2Value: '₹5,00,000 / Bank',
      stat3Label: 'Liquidity',
      stat3Value: 'Instant Netbanking',
      gradientBg: 'from-amber-950/70 via-slate-900 to-orange-900/40 border-amber-500/30',
      badge: 'Ideal Emergency Shield',
      ctaText: 'Compare Bank FD Rates',
      platforms: ['SBI', 'HDFC Bank', 'ICICI Bank', 'PNB'],
    },
    {
      id: 'stocks',
      targetPage: 'stocks',
      tag: 'WEALTH OF NATION',
      tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      title: 'Direct Equity & Bluechip Stocks (NSE / BSE)',
      hindiTitle: 'भारतीय शेयर बाजार — देश की शीर्ष कंपनियों में हिस्सेदारी',
      headline: 'Participate in India’s Journey to a $5 Trillion Economy',
      description: 'Direct equity ownership in Nifty 50 stalwarts (Reliance, Tata, HDFC, Infosys, L&T). Receive direct corporate dividends in your savings account and benefit from capital appreciation.',
      stat1Label: 'Nifty 50 10Y Return',
      stat1Value: '~13.8% CAGR',
      stat2Label: 'SEBI Protection',
      stat2Value: 'Strict Oversight',
      stat3Label: 'Delivery Brokerage',
      stat3Value: '₹0 on Discount Brokers',
      gradientBg: 'from-purple-950/70 via-slate-900 to-fuchsia-900/40 border-purple-500/30',
      badge: 'High Inflation Beater',
      ctaText: 'Explore Stock Guide & Demat',
      platforms: ['Zerodha Kite', 'Groww', 'Angel One', 'ICICI Direct'],
    },
    {
      id: 'gold',
      targetPage: 'gold-sgb',
      tag: 'CULTURAL HEDGE + SGB',
      tagColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      title: 'Sovereign Gold Bonds (RBI) & Digital Gold',
      hindiTitle: 'सॉवरेन गोल्ड बॉन्ड — सोने पर 2.5% अतिरिक्त ब्याज',
      headline: '2.5% Annual Sovereign Interest + Tax-Free Maturity',
      description: 'Issued by Reserve Bank of India on behalf of Government of India. Eliminates theft risk, making charges, and purity worries while paying 2.5% interest semi-annually directly to your bank account.',
      stat1Label: 'RBI Annual Interest',
      stat1Value: '2.50% p.a.',
      stat2Label: 'Capital Gains Tax',
      stat2Value: '100% Tax Free at 8Y',
      stat3Label: 'Safety',
      stat3Value: 'RBI Sovereign Guarantee',
      gradientBg: 'from-yellow-950/70 via-slate-900 to-amber-900/40 border-yellow-500/30',
      badge: 'Superior to Physical Gold',
      ctaText: 'Explore SGB Benefits',
      platforms: ['RBI Retail Direct', 'Bank Netbanking', 'Zerodha', 'Groww'],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto slideshow
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const currentSlide = slides[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border shadow-2xl transition-all">
      {/* Background slide panel */}
      <div className={`p-6 sm:p-10 lg:p-12 bg-gradient-to-br ${currentSlide.gradientBg} transition-all duration-700 min-h-[480px] sm:min-h-[440px] flex flex-col justify-between relative`}>
        {/* Subtle decorative glow elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${currentSlide.tagColor}`}>
              {currentSlide.tag}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
              {currentSlide.badge}
            </span>
          </div>

          {/* Slide Navigation controls */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Previous slide"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Next slide"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="px-2 font-mono text-xs text-slate-400">
              {currentIndex + 1} / {slides.length}
            </div>
          </div>
        </div>

        {/* Slide Main Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="text-xs sm:text-sm font-semibold text-amber-400/90 mb-1">
                {currentSlide.hindiTitle}
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {currentSlide.title}
              </h2>
              <p className="text-sm sm:text-base font-medium text-slate-300 mt-2">
                {currentSlide.headline}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              {currentSlide.description}
            </p>

            {/* Quick platform badges */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] font-semibold text-slate-400">Best Platforms:</span>
              {currentSlide.platforms.map((plat) => (
                <span
                  key={plat}
                  className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-200 border border-slate-700/80"
                >
                  {plat}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onNavigate(currentSlide.targetPage)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenProfile}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Setup My Monthly Budget</span>
              </button>
            </div>
          </div>

          {/* Right Visual Stats Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Key Indian Benchmark
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="space-y-4 pt-4">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{currentSlide.stat1Label}</span>
                  <span className="font-mono font-extrabold text-emerald-400 text-base sm:text-lg">
                    {currentSlide.stat1Value}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{currentSlide.stat2Label}</span>
                  <span className="font-mono font-bold text-amber-300 text-sm sm:text-base">
                    {currentSlide.stat2Value}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{currentSlide.stat3Label}</span>
                  <span className="font-mono font-medium text-slate-200 text-xs sm:text-sm">
                    {currentSlide.stat3Value}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                  Regulated in India
                </span>
                <span className="text-emerald-400 font-medium">Verified 2026 data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicator Dots */}
        <div className="relative z-10 flex items-center justify-center gap-2 pt-6">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx
                  ? 'w-8 bg-amber-400'
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Jump to slide ${idx + 1}: ${s.title}`}
              aria-label={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
