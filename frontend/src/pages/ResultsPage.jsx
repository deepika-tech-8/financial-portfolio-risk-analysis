import React, { useState, useEffect } from 'react';
import { Download, Award, CheckCircle2, ShieldAlert, TrendingUp, Sparkles, FileText } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { fetchPortfolioAnalysis, downloadReportPDF } from '../services/api';

export default function ResultsPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function loadResults() {
      setLoading(true);
      try {
        const res = await fetchPortfolioAnalysis(null);
        setResults(res);
      } catch (err) {
        console.error("Results load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReportPDF(null);
    } catch (err) {
      alert("Failed to generate PDF report: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const highlights = results?.highlights || {};

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/20">
            <Award className="h-3.5 w-3.5" />
            <span>Automated PBL Review Findings</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Project Results & Executive Summary</h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Synthesized quantitative conclusions derived from historical return series and equal-weighted portfolio covariance weighting.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition shrink-0"
        >
          <Download className={`h-4 w-4 ${downloading ? 'animate-bounce' : ''}`} />
          <span>{downloading ? 'Generating PDF...' : 'Download Project Report (PDF)'}</span>
        </button>
      </div>

      {/* Auto-Generated Summary Narrative Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-blue-600 border-b border-slate-100 pb-3">
          <Sparkles className="h-5 w-5" />
          <h3 className="text-lg font-bold text-slate-900">Project Result Narrative</h3>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-100">
          "{results?.summary_text || "Loading quantitative summary narrative..."}"
        </p>
      </div>

      {/* Highlight Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Key Outlier Asset Highlights</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-rose-100 bg-rose-50/40 space-y-1">
            <div className="text-xs font-semibold uppercase text-rose-600">Highest Volatility Asset</div>
            <div className="text-xl font-bold text-slate-900">{highlights.highest_volatility?.stock || 'N/A'}</div>
            <div className="text-xs font-medium text-slate-600">{highlights.highest_volatility?.value_pct?.toFixed(2)}% Annualized</div>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/40 space-y-1">
            <div className="text-xs font-semibold uppercase text-emerald-600">Lowest Volatility Asset</div>
            <div className="text-xl font-bold text-slate-900">{highlights.lowest_volatility?.stock || 'N/A'}</div>
            <div className="text-xs font-medium text-slate-600">{highlights.lowest_volatility?.value_pct?.toFixed(2)}% Annualized</div>
          </div>

          <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/40 space-y-1">
            <div className="text-xs font-semibold uppercase text-blue-600">Highest Sharpe Ratio</div>
            <div className="text-xl font-bold text-slate-900">{highlights.highest_sharpe?.stock || 'N/A'}</div>
            <div className="text-xs font-medium text-slate-600">Sharpe = {highlights.highest_sharpe?.value?.toFixed(3)}</div>
          </div>

          <div className="p-5 rounded-2xl border border-purple-100 bg-purple-50/40 space-y-1">
            <div className="text-xs font-semibold uppercase text-purple-600">Highest Market Sensitivity (Beta)</div>
            <div className="text-xl font-bold text-slate-900">{highlights.highest_beta?.stock || 'N/A'}</div>
            <div className="text-xs font-medium text-slate-600">Beta = {highlights.highest_beta?.value?.toFixed(3)}</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
            <div className="text-xs font-semibold uppercase text-slate-500">Lowest Market Sensitivity (Beta)</div>
            <div className="text-xl font-bold text-slate-900">{highlights.lowest_beta?.stock || 'N/A'}</div>
            <div className="text-xs font-medium text-slate-600">Beta = {highlights.lowest_beta?.value?.toFixed(3)}</div>
          </div>

          <div className="p-5 rounded-2xl border border-amber-100 bg-amber-50/40 space-y-1">
            <div className="text-xs font-semibold uppercase text-amber-600">Highest 99% 1-Day VaR</div>
            <div className="text-xl font-bold text-slate-900">{highlights.highest_var?.stock || 'N/A'}</div>
            <div className="text-xs font-medium text-slate-600">{highlights.highest_var?.value_pct?.toFixed(2)}% 1-Day Loss</div>
          </div>
        </div>
      </div>
    </div>
  );
}
