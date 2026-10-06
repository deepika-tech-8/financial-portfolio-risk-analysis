import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { TrendingUp, ShieldAlert, Zap, Target, Activity } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { fetchStockAnalysis } from '../services/api';

export default function RiskAnalysisPage({ availableStocks = [] }) {
  const [selectedStock, setSelectedStock] = useState(availableStocks[0] || 'TCS');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [varMode, setVarMode] = useState('parametric'); // 'parametric' or 'historical'

  useEffect(() => {
    if (availableStocks.length > 0 && !availableStocks.includes(selectedStock)) {
      setSelectedStock(availableStocks[0]);
    }
  }, [availableStocks]);

  useEffect(() => {
    let isMounted = true;
    async function loadStockData() {
      setLoading(true);
      try {
        const data = await fetchStockAnalysis(selectedStock);
        if (isMounted) setAnalysis(data);
      } catch (err) {
        console.error("Stock analysis error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadStockData();
    return () => { isMounted = false; };
  }, [selectedStock]);

  const defaultMetrics = {
    stock: selectedStock || "TCS",
    sector: "IT",
    annualized_volatility_pct: 22.5,
    parametric_var_99_pct: 3.25,
    historical_var_99_pct: 3.10,
    sharpe_ratio: 1.15,
    beta: 1.05,
    beta_benchmark_type: "NIFTY 50",
    risk_classification: "Moderate Volatility"
  };

  const metrics = analysis?.metrics || defaultMetrics;
  const priceHistory = analysis?.price_history || [];
  const distribution = analysis?.distribution || [];
  const stockList = analysis?.available_stocks || (availableStocks.length > 0 ? availableStocks : ["HDFCBANK", "ICICIBANK", "SBIN", "KOTAKBANK", "TCS", "INFY", "WIPRO", "SUNPHARMA", "DRREDDY", "TATAMOTORS", "MARUTI", "RELIANCE", "NTPC", "LT", "ITC", "HINDUNILVR", "BAJFINANCE"]);

  return (
    <div className="space-y-8">
      {/* Stock Selection Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Individual Stock Risk Analysis</h2>
          <p className="text-xs text-slate-500">Drill down into statistical risk metrics, price history, and return distribution.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Select Stock:</label>
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {stockList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <MetricCard
          title="Ann. Volatility"
          value={`${(metrics.annualized_volatility_pct || 0).toFixed(2)}%`}
          subtitle="Annualized (σ_daily × √252)"
          icon={Activity}
          color="blue"
        />

        <div className="relative">
          <MetricCard
            title={varMode === 'parametric' ? "99% Parametric VaR" : "99% Historical VaR"}
            value={`${(varMode === 'parametric' ? metrics.parametric_var_99_pct : metrics.historical_var_99_pct || 0).toFixed(2)}%`}
            subtitle="Estimated 1-day max loss"
            icon={ShieldAlert}
            color="amber"
          />
          <button
            onClick={() => setVarMode(varMode === 'parametric' ? 'historical' : 'parametric')}
            className="absolute top-2 right-2 text-[10px] font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-1.5 py-0.5 rounded transition"
          >
            Switch to {varMode === 'parametric' ? 'Hist' : 'Param'}
          </button>
        </div>

        <MetricCard
          title="Sharpe Ratio"
          value={(metrics.sharpe_ratio || 0).toFixed(3)}
          subtitle="Risk-free rate = 5.25%"
          icon={Zap}
          color="emerald"
        />

        <MetricCard
          title="Beta"
          value={(metrics.beta || 0).toFixed(3)}
          subtitle={`Benchmark: ${metrics.beta_benchmark_type || 'NIFTY 50'}`}
          icon={Target}
          color="purple"
        />

        <MetricCard
          title="Classification"
          value={metrics.risk_classification || "Moderate"}
          subtitle="Project-defined risk bucket"
          icon={TrendingUp}
          color="indigo"
        />
      </div>

      {/* Chart 1: Stock Price Trend Line Chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Chart 1 – Stock Price Historical Trend</h3>
            <p className="text-xs text-slate-500">Date vs Daily Close Price (INR)</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
            {selectedStock} ({metrics.sector || 'Sector'})
          </span>
        </div>

        <div className="h-72 w-full">
          {loading ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">Loading chart data...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} tickFormatter={(v) => `₹${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`₹${val.toFixed(2)}`, 'Close Price']}
                />
                <Line type="monotone" dataKey="close" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 2: Return Distribution Histogram */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Chart 2 – Daily Return Frequency Distribution</h3>
            <p className="text-xs text-slate-500">Histogram of daily percentage return frequencies for {selectedStock}</p>
          </div>
        </div>

        <div className="h-64 w-full">
          {loading ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">Loading distribution...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bin" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
