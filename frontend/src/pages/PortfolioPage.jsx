import React, { useState, useEffect } from 'react';
import { 
  PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import { ShieldCheck, PieChart as PieIcon, CheckSquare, Square, RefreshCw } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { fetchPortfolioAnalysis } from '../services/api';

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#f472b6', '#fb7185', '#38bdf8', '#4ade80', '#facc15', '#fb923c', '#e879f9', '#2dd4bf', '#a3e635', '#f87171', '#94a3b8'];

export default function PortfolioPage({ availableStocks = [], setPortfolioData }) {
  const [selectedStocks, setSelectedStocks] = useState(availableStocks);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (availableStocks.length > 0 && selectedStocks.length === 0) {
      setSelectedStocks(availableStocks);
    }
  }, [availableStocks]);

  const loadPortfolio = async (stocks) => {
    setLoading(true);
    try {
      const res = await fetchPortfolioAnalysis(stocks);
      setPortfolio(res);
      if (setPortfolioData) setPortfolioData(res);
    } catch (err) {
      console.error("Portfolio analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStocks.length > 0) {
      loadPortfolio(selectedStocks);
    }
  }, [selectedStocks]);

  const toggleStock = (stock) => {
    if (selectedStocks.includes(stock)) {
      if (selectedStocks.length === 1) return; // Must keep at least 1 stock
      setSelectedStocks(selectedStocks.filter(s => s !== stock));
    } else {
      setSelectedStocks([...selectedStocks, stock]);
    }
  };

  const handleSelectAll = () => setSelectedStocks([...availableStocks]);
  const handleClearAll = () => setSelectedStocks([availableStocks[0] || 'TCS']);

  const allocations = portfolio?.allocations || [];
  const riskComparisonData = [
    { name: 'Avg Individual Volatility', volatility: portfolio?.avg_individual_volatility_pct || 0, fill: '#ef4444' },
    { name: 'Portfolio Volatility', volatility: portfolio?.portfolio_volatility_pct || 0, fill: '#10b981' }
  ];
  const cumulativeData = portfolio?.cumulative_returns || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Equal-Weighted Portfolio Risk Analysis</h2>
        <p className="text-sm text-slate-500">
          Construct an equal-weighted portfolio ($w_i = 1/N$) and evaluate covariance matrix diversification benefits ($w^T \Sigma w$).
        </p>
      </div>

      {/* Stock Selection Box */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <PieIcon className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Select Stocks for Portfolio ({selectedStocks.length} of {availableStocks.length} Selected)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Reset to 1
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {availableStocks.map((stock) => {
            const isSelected = selectedStocks.includes(stock);
            return (
              <button
                key={stock}
                onClick={() => toggleStock(stock)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  isSelected 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isSelected ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5 text-slate-400" />}
                <span>{stock}</span>
                <span className="opacity-75 text-[10px]">
                  ({(100 / selectedStocks.length).toFixed(1)}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <MetricCard
          title="Portfolio Volatility"
          value={`${(portfolio?.portfolio_volatility_pct || 0).toFixed(2)}%`}
          subtitle="Matrix Annualized Volatility"
          icon={PieIcon}
          color="blue"
        />

        <MetricCard
          title="Avg Individual Vol"
          value={`${(portfolio?.avg_individual_volatility_pct || 0).toFixed(2)}%`}
          subtitle="Mean constituent asset volatility"
          icon={PieIcon}
          color="amber"
        />

        <MetricCard
          title="Risk Reduction"
          value={`${(portfolio?.diversification_benefit_pct || 0).toFixed(1)}%`}
          subtitle="Diversification Benefit %"
          icon={ShieldCheck}
          color="emerald"
        />

        <MetricCard
          title="99% Portfolio VaR"
          value={`${(portfolio?.portfolio_parametric_var_99_pct || 0).toFixed(2)}%`}
          subtitle="1-Day Parametric VaR"
          icon={ShieldCheck}
          color="purple"
        />

        <MetricCard
          title="Portfolio Sharpe"
          value={(portfolio?.portfolio_sharpe_ratio || 0).toFixed(3)}
          subtitle="Risk-Free Rate = 5.25%"
          icon={PieIcon}
          color="indigo"
        />
      </div>

      {/* Grid of Visualizations: Chart 8 Allocation & Chart 7 Diversification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 8: Portfolio Allocation Donut Chart */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Chart 8 – Equal-Weighted Allocation</h3>
            <p className="text-xs text-slate-500">Weight per stock = {(100 / (selectedStocks.length || 1)).toFixed(2)}%</p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            {loading ? (
              <div className="text-xs text-slate-400">Loading allocation...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={allocations}
                    dataKey="weight"
                    nameKey="stock"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {allocations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    formatter={(val) => [`${val.toFixed(2)}%`, 'Weight']}
                  />
                </RePieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 7: Portfolio vs Average Individual Risk */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Chart 7 – Diversification Risk Comparison</h3>
            <p className="text-xs text-slate-500">
              Average Individual Stock Volatility vs Equal-Weighted Portfolio Volatility
            </p>
          </div>

          <div className="h-72 w-full">
            {loading ? (
              <div className="text-xs text-slate-400">Loading comparison...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    formatter={(val) => [`${val.toFixed(2)}%`, 'Annualized Volatility']}
                  />
                  <Bar dataKey="volatility" radius={[8, 8, 0, 0]} barSize={50}>
                    {riskComparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Chart 10: Cumulative Return Plot */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Chart 10 – Cumulative Portfolio Return Plot</h3>
          <p className="text-xs text-slate-500">Historical performance trajectory over time (%)</p>
        </div>

        <div className="h-72 w-full">
          {loading ? (
            <div className="text-xs text-slate-400">Loading trajectory...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`${val.toFixed(2)}%`, 'Cumulative Return']}
                />
                <Line type="monotone" dataKey="portfolio_return_pct" stroke="#10b981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
