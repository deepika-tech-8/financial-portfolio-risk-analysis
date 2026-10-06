import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import StockTable from '../components/StockTable';
import { fetchPortfolioAnalysis } from '../services/api';

export default function ComparisonPage({ availableStocks = [] }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetchPortfolioAnalysis(null);
        setData(res.individual_stock_metrics || []);
      } catch (err) {
        console.error("Comparison load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Cross-Stock Risk & Metric Comparison</h2>
        <p className="text-sm text-slate-500">
          Compare annualized volatility, 99% VaR, Sharpe Ratio, and Beta across all dataset stocks.
        </p>
      </div>

      {/* Grid of 4 Comparative Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Volatility Comparison Bar Chart */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900">Chart 3 – Annualized Volatility (%)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="stock" stroke="#64748b" fontSize={10} angle={-30} textAnchor="end" height={45} />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="annualized_volatility_pct" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: VaR Comparison Bar Chart */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900">Chart 4 – 99% Parametric 1-Day VaR (%)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="stock" stroke="#64748b" fontSize={10} angle={-30} textAnchor="end" height={45} />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="parametric_var_99_pct" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Sharpe Ratio Bar Chart */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900">Chart 5 – Sharpe Ratio Comparison (Rf = 5.25%)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="stock" stroke="#64748b" fontSize={10} angle={-30} textAnchor="end" height={45} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="sharpe_ratio" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Beta Bar Chart */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900">Chart 6 – Beta Sensitivity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="stock" stroke="#64748b" fontSize={10} angle={-30} textAnchor="end" height={45} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="beta" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stock Risk Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Comprehensive Stock Risk Metrics Table</h3>
        <StockTable data={data} />
      </div>
    </div>
  );
}
