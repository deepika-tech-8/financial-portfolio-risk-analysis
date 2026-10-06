import React from 'react';
import { ArrowRight, Upload, BookOpen, ShieldCheck, TrendingUp, PieChart, Award, Users } from 'lucide-react';
import MetricCard from '../components/MetricCard';

export default function Home({ setActivePage, summary, portfolioData }) {
  const stockCount = summary?.total_stocks || 17;
  const recordCount = summary?.valid_records || 2057;
  const portVol = portfolioData?.portfolio_volatility_pct || 16.14;
  const divBenefit = portfolioData?.diversification_benefit_pct || 43.4;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-8 md:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 border border-blue-400/20 backdrop-blur-md">
            <Award className="h-3.5 w-3.5" />
            <span>CS5403 – Machine Learning Academic PBL Project</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Financial Portfolio Risk Analysis
          </h1>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            Data-Driven Analysis of Risk, Return and Portfolio Diversification across Indian NSE-listed stocks. 
            Quantifying volatility reduction through matrix covariance mathematical models.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setActivePage('portfolio')}
              className="flex items-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition"
            >
              <span>Start Analysis</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActivePage('dataset')}
              className="flex items-center gap-2.5 rounded-xl bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-200 border border-slate-700 hover:bg-slate-800 transition"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Dataset</span>
            </button>

            <button
              onClick={() => setActivePage('methodology')}
              className="flex items-center gap-2.5 rounded-xl bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-200 border border-slate-700 hover:bg-slate-800 transition"
            >
              <BookOpen className="h-4 w-4" />
              <span>View Methodology</span>
            </button>
          </div>
        </div>

        {/* Decorative Grid Background Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Academic Credentials Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-slate-400">Team Members</div>
            <div className="text-base font-bold text-slate-900">Deepika R & Dharshana M</div>
            <div className="text-xs text-slate-500">Dept. of B.Tech AI & DS</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-slate-400">Project Mentor</div>
            <div className="text-base font-bold text-slate-900">Dr. Shanmuga Sundaram</div>
            <div className="text-xs text-slate-500">Faculty Review & Guidance</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-slate-400">Course Code</div>
            <div className="text-base font-bold text-slate-900">CS5403 – Machine Learning</div>
            <div className="text-xs text-slate-500">Live PBL Prototype Review</div>
          </div>
        </div>
      </div>

      {/* Quick Dashboard Overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Key Portfolio Overview Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Total Stocks"
            value={stockCount}
            subtitle="Across 8 Indian NSE sectors"
            icon={PieChart}
            color="blue"
          />
          <MetricCard
            title="Total Records"
            value={recordCount.toLocaleString()}
            subtitle="Balanced daily panel series"
            icon={TrendingUp}
            color="indigo"
          />
          <MetricCard
            title="Portfolio Volatility"
            value={`${portVol.toFixed(2)}%`}
            subtitle="Equal-weighted matrix (wᵀΣw)"
            icon={TrendingUp}
            color="purple"
          />
          <MetricCard
            title="Diversification Benefit"
            value={`${divBenefit.toFixed(1)}%`}
            subtitle="Risk reduction vs avg individual"
            icon={ShieldCheck}
            color="emerald"
          />
        </div>
      </div>

      {/* Project Features Grid */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-900">Core PBL Project Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="font-bold text-slate-900 text-base">1. CSV Data Cleaning</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated data validation pipeline that strips whitespace, handles missing values, removes duplicates, and standardizes dates.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="font-bold text-slate-900 text-base">2. Risk Metrics Engine</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates Annualized Volatility (√252 factor), 99% Parametric & Historical VaR, Sharpe Ratio ($R_f=5.25\%$), and Beta vs NIFTY 50.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="font-bold text-slate-900 text-base">3. Equal-Weighted Portfolio</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Constructs $N$-asset equal weight vectors $w_i = 1/N$, computing daily portfolio return $R_p$ and covariance matrix $w^T \Sigma w$.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="font-bold text-slate-900 text-base">4. Diversification Proof</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Demonstrates risk reduction by comparing average individual stock volatility against portfolio volatility in visual bar charts.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="font-bold text-slate-900 text-base">5. Correlation Heatmap</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visualizes asset correlation matrix to identify cross-sector hedge opportunities and low-correlation stock pairings.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="font-bold text-slate-900 text-base">6. PDF Report Generator</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Exports a comprehensive academic project review PDF document containing executive summary, metrics tables, and findings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
