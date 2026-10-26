import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Indian Financial Insights & AI Assistant endpoint
app.post('/api/advisor', async (req, res) => {
  try {
    const {
      prompt,
      profile,
      actionType, // 'auto_fill' | 'recommendation' | 'query'
    } = req.body;

    // If Gemini API is available, query gemini-3.8-flash
    if (ai) {
      const systemInstruction = `You are "NiveshMitra", an elite, certified Indian Financial Planner and SEBI-aware investment expert for retail Indian investors.
Your goal is to guide beginners into building wealth through Indian financial instruments:
- Systematic Investment Plans (SIP / Mutual Funds - Nifty 50 Index, Flexicap, Midcap)
- Fixed Deposits (Bank FDs like SBI, HDFC, ICICI, Post Office Term Deposits)
- Post Office Bachat Ghar (PPF @ 7.1%, Sukanya Samriddhi Yojana @ 8.2%, Mahila Samman @ 7.5%, Kisan Vikas Patra, Senior Citizen Savings Scheme @ 8.2%)
- Indian Equity / Stocks (NSE/BSE, Nifty 50, Bluechips)
- Sovereign Gold Bonds (SGB) & Digital Gold
- National Pension System (NPS Tier 1 under 80CCD)

Key Indian Financial Context:
- Currency is Indian Rupee (₹).
- Indian Tax rules: Sec 80C up to ₹1.5L, 80CCD(1B) extra ₹50k, New Tax Regime vs Old Tax Regime, LTCG on equity above ₹1.25L taxed at 12.5%, STCG at 20%, FD interest TDS above ₹40,000 (₹50,000 for seniors).
- Platforms: Zerodha (Kite & Coin), Groww, Angel One, Upstox, SBI YONO, India Post IPPB, ICICI Direct.
- Suggest tailored allocations using the 50:30:20 rule (Needs:Wants:Investments) adapted for Indian families.
Keep responses crisp, encouraging, structured, highly practical, and with actionable steps.`;

      let queryText = prompt || '';
      if (actionType === 'auto_fill') {
        queryText = `The user described themselves as: "${prompt}".
Please generate a structured JSON profile for an Indian retail investor with realistic estimates:
{
  "name": string,
  "monthlyIncome": number,
  "monthlyExpenses": number,
  "timeHorizonYears": number,
  "riskProfile": "Conservative" | "Moderate" | "Aggressive",
  "existingBanks": string[],
  "city": string,
  "state": string,
  "primaryGoal": string,
  "recommendedSplit": {
    "sipPercent": number,
    "fdBachatPercent": number,
    "stocksPercent": number,
    "goldPercent": number
  },
  "rationale": string
}
Return strictly the JSON object.`;
      } else if (profile) {
        queryText = `Analyze this user's profile and query:
User Profile:
- Monthly Income: ₹${profile.monthlyIncome || 0}
- Monthly Expenses: ₹${profile.monthlyExpenses || 0}
- Net Disposable Surplus: ₹${(profile.monthlyIncome || 0) - (profile.monthlyExpenses || 0)}
- Investment Horizon: ${profile.timeHorizonYears || 5} years
- Risk Profile: ${profile.riskProfile || 'Moderate'}
- Preferred/Existing Banks: ${profile.existingBanks?.join(', ') || 'SBI'}
- Location: ${profile.city || 'India'}, ${profile.state || 'India'}
- User query/intent: ${prompt || 'Recommend an investment road map for me.'}

Provide an actionable, step-by-step investment plan for India, specifying exact monthly ₹ allocations, ideal schemes/funds, recommended Indian platforms (e.g. Zerodha, Groww, SBI YONO, Post Office), and relevant tax benefits.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: queryText,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || '';
      return res.json({ success: true, advice: text });
    }

    // Fallback if API key is not configured yet: provide high-fidelity tailored Indian financial response
    const income = profile?.monthlyIncome || 60000;
    const expenses = profile?.monthlyExpenses || 35000;
    const surplus = Math.max(0, income - expenses);
    const risk = profile?.riskProfile || 'Moderate';

    let advice = '';
    if (actionType === 'auto_fill') {
      return res.json({
        success: true,
        advice: JSON.stringify({
          name: 'Priya Sharma',
          monthlyIncome: 75000,
          monthlyExpenses: 42000,
          timeHorizonYears: 7,
          riskProfile: 'Moderate',
          existingBanks: ['State Bank of India (SBI)', 'HDFC Bank'],
          city: 'Pune',
          state: 'Maharashtra',
          primaryGoal: 'Wealth Creation & Tax Saving',
          recommendedSplit: {
            sipPercent: 50,
            fdBachatPercent: 30,
            stocksPercent: 15,
            goldPercent: 5,
          },
          rationale: 'Balanced Indian portfolio with 50% in equity index/flexicap SIPs, 30% in high-yield Post Office/Bank FDs for capital safety, and 20% in direct bluechips & digital gold.',
        }),
      });
    }

    advice = `Based on your monthly surplus of ₹${surplus.toLocaleString('en-IN')}:
1. **Systematic Investment Plan (SIP)**: ₹${Math.round(surplus * 0.5).toLocaleString('en-IN')}/mo in Nifty 50 Index Fund & Parag Parikh Flexi Cap Fund via Zerodha Coin or Groww.
2. **Safe Haven / Bachat Ghar**: ₹${Math.round(surplus * 0.3).toLocaleString('en-IN')}/mo into Post Office PPF (7.1% tax-free) or SBI Special Term Deposit (7.10% - 7.60%).
3. **Equities / Bluechip Stocks**: ₹${Math.round(surplus * 0.15).toLocaleString('en-IN')}/mo into large-cap leaders (TCS, Reliance, HDFC Bank) via Zerodha Kite or Angel One.
4. **Digital Gold / SGB**: ₹${Math.round(surplus * 0.05).toLocaleString('en-IN')}/mo for inflation hedge.`;

    return res.json({ success: true, advice });
  } catch (error: any) {
    console.error('Advisor API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while generating advice',
    });
  }
});

// Real-time simulated Indian Market data endpoint
app.get('/api/market-trends', (_req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    indices: {
      nifty50: { value: 25420.75, change: '+142.30', changePct: '+0.56%', status: 'bullish' },
      sensex: { value: 83280.40, change: '+415.80', changePct: '+0.50%', status: 'bullish' },
      niftyMidcap150: { value: 21890.15, change: '+210.45', changePct: '+0.97%', status: 'bullish' },
      niftyBank: { value: 52140.90, change: '-45.20', changePct: '-0.09%', status: 'neutral' },
    },
    fixedIncome: {
      rbiRepoRate: '6.50%',
      tenYearGSecYield: '6.98%',
      sbiFdRate: '7.10% (7.60% Seniors)',
      hdfcFdRate: '7.25% (7.75% Seniors)',
      postOfficePpfRate: '7.10% (EEE tax status)',
      sukanyaSamriddhiRate: '8.20% (Triple tax exemption)',
      mahilaSammanRate: '7.50% (2-Year lock-in)',
      goldRate24kPer10g: '₹78,450',
    },
    topIndianBrokers: [
      { name: 'Zerodha (Kite & Coin)', rating: '4.8★', fee: '₹0 for Equity Delivery & Direct MF', url: 'https://zerodha.com' },
      { name: 'Groww', rating: '4.7★', fee: 'Zero account opening, instant UPI SIPs', url: 'https://groww.in' },
      { name: 'Angel One', rating: '4.6★', fee: 'Zero brokerage on delivery', url: 'https://angelone.in' },
      { name: 'SBI YONO / InTouch', rating: '4.5★', fee: 'Direct banking integration for FDs & RD', url: 'https://onlinesbi.sbi' },
      { name: 'India Post Payments Bank (IPPB)', rating: '4.7★', fee: 'Direct Government Sovereign Schemes', url: 'https://ippbonline.com' },
    ],
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NiveshMarg full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
