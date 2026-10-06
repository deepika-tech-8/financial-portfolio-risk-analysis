import React from 'react';
import { BookOpen, Calculator, ShieldCheck, CheckCircle2 } from 'lucide-react';
import FormulaMath from '../components/FormulaMath';

export default function MethodologyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Quantitative Methodology & Mathematical Pipeline</h2>
        <p className="text-sm text-slate-500">
          Rigorous mathematical formulations and machine learning / statistical data analysis methodology for CS5403 PBL review.
        </p>
      </div>

      {/* Step Pipeline Flow */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">End-to-End Data Processing Pipeline</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">1. CSV Upload</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">2. Data Cleaning</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">3. Date Parsing</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">4. Daily Return</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">5. Risk Metrics</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">6. Covariance Matrix</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">7. Report & Viz</span>
        </div>
      </div>

      {/* Mathematical Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormulaMath
          title="1. Daily Return Calculation"
          formula="R_{i,t} = (Close_{i,t} - Close_{i,t-1}) / Close_{i,t-1} = (Close_{i,t} / Close_{i,t-1}) - 1"
          description="Percentage change in daily closing price. The first trading day for each stock naturally has no previous close (NaN) and is excluded from return vectors."
        />

        <FormulaMath
          title="2. Annualized Volatility"
          formula="Annualized Volatility = Daily Standard Deviation (σ_daily) × √252 × 100%"
          description="Standard deviation of daily returns scaled to an annual basis assuming 252 standard market trading days per calendar year."
        />

        <FormulaMath
          title="3. Parametric 99% 1-Day Value at Risk (VaR)"
          formula="Parametric VaR = (2.326 × σ_daily - μ_daily) × 100%"
          description="Calculates the estimated maximum percentage loss over a 1-day horizon at a 99% confidence level (Z = 2.326) under Gaussian normal distribution assumptions."
        />

        <FormulaMath
          title="4. Historical Simulation 99% VaR"
          formula="Historical VaR = -1.0 × Percentile(Daily Returns, 1.0)"
          description="Non-parametric empirical loss estimate determined directly from the 1st percentile of the actual historical daily return empirical distribution."
        />

        <FormulaMath
          title="5. Sharpe Ratio (Risk-Adjusted Return)"
          formula="Sharpe Ratio = (Annualized Return - 0.0525) / Annualized Volatility"
          description="Measures excess return earned per unit of total risk relative to an annualized risk-free rate (Rf = 5.25%)."
        />

        <FormulaMath
          title="6. Beta (Market Sensitivity)"
          formula="Beta = Covariance(R_stock, R_market) / Variance(R_market)"
          description="Quantifies systemic risk relative to a market benchmark (NIFTY 50 CSV or equal-weighted portfolio proxy). Beta > 1 indicates higher sensitivity than the benchmark."
        />

        <FormulaMath
          title="7. Portfolio Volatility (Covariance Matrix)"
          formula="σ_p² = wᵀ Σ w   ⇒   Annualized Portfolio Volatility = √(wᵀ Σ w) × √252"
          description="Equal-weighted vector w = [1/N, ..., 1/N]^T combined with N×N pairwise return covariance matrix Σ."
        />

        <FormulaMath
          title="8. Diversification Benefit (%)"
          formula="Diversification Benefit (%) = (1 - Portfolio Volatility / Avg Individual Volatility) × 100%"
          description="Quantifies the percentage reduction in overall volatility achieved through cross-asset correlation cancellation."
        />
      </div>

      {/* Limitations & Future Work Box */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Project Limitations & Future Enhancements</h3>
        <ul className="space-y-2 text-xs text-slate-600 list-disc pl-5 leading-relaxed">
          <li>
            <b>Beta Proxy Benchmark:</b> Current analysis utilizes an equal-weighted portfolio proxy when explicit NIFTY 50 benchmark CSV is omitted.
          </li>
          <li>
            <b>Gaussian Tail Assumption:</b> Parametric VaR assumes Gaussian normal return distributions; extreme black-swan events are better captured via Historical Simulation or Monte Carlo.
          </li>
          <li>
            <b>Future Expansion:</b> Markowitz Mean-Variance Optimization, Maximum Sharpe Efficient Frontier, GARCH/LSTM Machine Learning volatility forecasting, and real-time live NSE API feeds.
          </li>
        </ul>
      </div>
    </div>
  );
}
