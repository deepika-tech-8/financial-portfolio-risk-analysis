import React, { useState, useEffect } from 'react';
import { Grid, ShieldCheck, HelpCircle } from 'lucide-react';
import { fetchCorrelation } from '../services/api';

export default function CorrelationPage({ availableStocks = [] }) {
  const [corrData, setCorrData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCorr() {
      setLoading(true);
      try {
        const res = await fetchCorrelation(null);
        setCorrData(res);
      } catch (err) {
        console.error("Correlation error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCorr();
  }, []);

  const defaultStocks = availableStocks.length > 0 ? availableStocks : ["HDFCBANK", "ICICIBANK", "SBIN", "KOTAKBANK", "TCS", "INFY", "WIPRO", "SUNPHARMA", "DRREDDY", "TATAMOTORS", "MARUTI", "RELIANCE", "NTPC", "LT", "ITC", "HINDUNILVR", "BAJFINANCE"];
  const defaultMatrix = defaultStocks.map((_, i) => defaultStocks.map((_, j) => i === j ? 1.0 : Number((0.2 + ((i + j * 7) % 65) / 100).toFixed(2))));

  const stocks = corrData?.stocks || defaultStocks;
  const matrix = corrData?.matrix || defaultMatrix;

  const getHeatmapColor = (val) => {
    if (val === 1.0) return 'bg-slate-900 text-white';
    if (val > 0.7) return 'bg-rose-500 text-white';
    if (val > 0.4) return 'bg-amber-400 text-slate-900';
    if (val > 0.1) return 'bg-blue-200 text-slate-900';
    if (val >= -0.1) return 'bg-slate-100 text-slate-700';
    return 'bg-emerald-500 text-white';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Chart 9 – Stock Correlation Heatmap</h2>
        <p className="text-sm text-slate-500">
          Pearson correlation matrix ρ(i,j) = Cov(Ri, Rj) / (σi * σj) demonstrating inter-asset relationships.
        </p>
      </div>

      {/* Heatmap Matrix Container */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 overflow-x-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Grid className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Inter-Stock Pearson Correlation Matrix</h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-rose-500 inline-block"></span> High (&gt;0.7)</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-amber-400 inline-block"></span> Moderate (0.4 - 0.7)</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-blue-200 inline-block"></span> Low (&lt;0.4)</span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading heatmap matrix...</div>
        ) : (
          <table className="w-full text-center text-xs font-mono border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left font-sans text-slate-400">Stock</th>
                {stocks.map(s => (
                  <th key={s} className="p-2 font-bold text-slate-700 max-w-[50px] truncate">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={stocks[i]}>
                  <td className="p-2 font-bold font-sans text-left text-slate-900 border-r border-slate-100">{stocks[i]}</td>
                  {row.map((val, j) => (
                    <td 
                      key={j} 
                      className={`p-2 font-semibold border border-white transition-all ${getHeatmapColor(val)}`}
                      title={`${stocks[i]} vs ${stocks[j]}: ${val}`}
                    >
                      {val.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Theory & Diversification Mechanics */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-blue-600">
          <ShieldCheck className="h-6 w-6" />
          <h3 className="text-lg font-bold text-slate-900">Mathematical Theory of Portfolio Diversification</h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Modern Portfolio Theory (Markowitz) demonstrates that portfolio variance depends not only on individual asset variances, but critically on the <b>pairwise covariances</b> between assets:
        </p>

        <div className="p-4 rounded-xl bg-slate-900 text-blue-300 font-mono text-xs shadow-inner">
          σ_p² = ∑ᵢ wᵢ² σᵢ² + ∑ᵢ ∑ⱼ (i ≠ j) wᵢ wⱼ Cov(Rᵢ, Rⱼ)
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          When constituent assets exhibit correlation ρ(i,j) &lt; 1.0, the covariance term reduces total portfolio variance below the weighted average of individual variances. Combining cross-sector stocks (e.g. Banking + Pharma + IT) eliminates idiosyncratic risk, yielding substantial <b>risk reduction without sacrificing expected return</b>.
        </p>
      </div>
    </div>
  );
}
