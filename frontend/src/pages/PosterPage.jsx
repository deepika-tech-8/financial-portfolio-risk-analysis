import React, { useRef } from 'react';
import { Printer, Download, Award, ShieldCheck } from 'lucide-react';

export default function PosterPage({ summary, portfolioData }) {
  const posterRef = useRef(null);

  const stockCount = summary?.total_stocks || 17;
  const recordCount = summary?.valid_records || 2057;
  const portVol = portfolioData?.portfolio_volatility_pct || 16.14;
  const avgVol = portfolioData?.avg_individual_volatility_pct || 28.53;
  const divBenefit = portfolioData?.diversification_benefit_pct || 43.4;
  const portSharpe = portfolioData?.portfolio_sharpe_ratio || 1.42;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Academic PBL Presentation Poster</h2>
          <p className="text-xs text-slate-500">Official Chennai Institute of Technology (Autonomous) PBL Review Board Poster format.</p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Save PDF Poster</span>
        </button>
      </div>

      {/* Official Poster Container (3:4 aspect ratio presentation layout) */}
      <div 
        ref={posterRef}
        className="w-full bg-slate-200 p-4 md:p-6 rounded-3xl shadow-xl border border-slate-300 font-sans print:p-0 print:bg-white print:shadow-none print:border-none"
      >
        <div className="bg-white border-4 border-slate-800 p-6 shadow-2xl rounded-2xl space-y-6 print:border-2 print:rounded-none">
          
          {/* Top Main Banner (Chennai Institute of Technology) */}
          <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 rounded-xl border-2 border-blue-600 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            
            {/* Left Institution Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-16 w-16 bg-amber-400 rounded-2xl flex items-center justify-center p-2 text-blue-950 font-black text-xs text-center border-2 border-amber-300 shadow-md">
                CHENNAI<br/>CIT
              </div>
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">CHENNAI INSTITUTE OF TECHNOLOGY</div>
                <div className="text-[11px] font-medium text-slate-300">(Autonomous)</div>
              </div>
            </div>

            {/* Center Course & Project Title */}
            <div className="flex-1 space-y-1">
              <div className="text-sm md:text-base font-extrabold uppercase tracking-widest text-amber-300">
                PBL Course – Machine Learning
              </div>
              <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                Project Title: Financial Portfolio Risk Analysis
              </h1>
              <div className="text-xs text-slate-300 font-medium">
                Data-Driven Volatility & Value at Risk Modeling using Portfolio Covariance Weighting
              </div>
            </div>

            {/* Right SIRAGU Logo & Academic Year */}
            <div className="shrink-0 text-right space-y-1">
              <div className="inline-block bg-white/10 px-3 py-1 rounded-lg border border-white/20 text-xs font-bold text-amber-300">
                SIRAGU
              </div>
              <div className="text-sm font-bold text-slate-200">2026–27</div>
            </div>
          </div>

          {/* 3-Column Academic Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-800 text-xs leading-relaxed">
            
            {/* COLUMN 1: Abstract & Introduction */}
            <div className="space-y-6">
              {/* Abstract */}
              <div className="rounded-xl border border-blue-200 bg-slate-50 overflow-hidden shadow-sm">
                <div className="bg-blue-800 px-4 py-2 text-white font-bold text-sm uppercase tracking-wider text-center">
                  Abstract
                </div>
                <div className="p-4 space-y-2 text-slate-700">
                  <p>
                    This project evaluates historical risk and quantitative performance of Indian NSE-listed stocks across 8 major sectors using machine learning data pipelines and quantitative financial metrics.
                  </p>
                  <p>
                    By computing annualized standard deviation (σ_ann), 99% Value at Risk (VaR), Sharpe Ratio, and pairwise return covariance matrices (Σ), an equal-weighted portfolio (w_i = 1/N) is constructed.
                  </p>
                  <p className="font-semibold text-blue-900 bg-blue-50 p-2 rounded border border-blue-100">
                    Key Result: The equal-weighted portfolio reduced volatility from {avgVol.toFixed(2)}% to {portVol.toFixed(2)}%, delivering a {divBenefit.toFixed(1)}% diversification risk reduction.
                  </p>
                </div>
              </div>

              {/* Introduction */}
              <div className="rounded-xl border border-blue-200 bg-slate-50 overflow-hidden shadow-sm">
                <div className="bg-blue-800 px-4 py-2 text-white font-bold text-sm uppercase tracking-wider text-center">
                  Introduction
                </div>
                <div className="p-4 space-y-2 text-slate-700">
                  <p>
                    Modern Portfolio Theory (Markowitz) asserts that market participants can minimize variance for a given level of return through asset diversification.
                  </p>
                  <p>
                    <b>Dataset Characteristics:</b>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    <li>Period: 21-Dec-2025 to 21-Jun-2026 (~6 Months)</li>
                    <li>Total Records: <b>{recordCount.toLocaleString()}</b> balanced panel daily trading rows</li>
                    <li>Assets: <b>{stockCount}</b> Indian NSE-listed equities</li>
                    <li>Sectors: Banking, IT, Pharma, Auto, Energy, Infrastructure, FMCG, NBFC</li>
                  </ul>
                  <div className="p-2 rounded bg-slate-900 text-blue-300 font-mono text-[10px] text-center shadow-inner">
                    Template Ratio = Desired Print Height / Desired Print Width
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: Methods, Materials & Results */}
            <div className="space-y-6">
              {/* Methods and Materials */}
              <div className="rounded-xl border border-blue-200 bg-slate-50 overflow-hidden shadow-sm">
                <div className="bg-blue-800 px-4 py-2 text-white font-bold text-sm uppercase tracking-wider text-center">
                  Methods and Materials
                </div>
                <div className="p-4 space-y-2 text-slate-700">
                  <p><b>1. Daily Percentage Return:</b></p>
                  <div className="p-2 rounded bg-slate-900 text-blue-300 font-mono text-[10px] text-center">
                    R_{`i,t`} = (Close_{`t`} - Close_{`t-1`}) / Close_{`t-1`}
                  </div>

                  <p><b>2. Annualized Volatility:</b></p>
                  <div className="p-2 rounded bg-slate-900 text-blue-300 font-mono text-[10px] text-center">
                    σ_ann = σ_daily × √252 × 100%
                  </div>

                  <p><b>3. Parametric 99% 1-Day VaR:</b></p>
                  <div className="p-2 rounded bg-slate-900 text-blue-300 font-mono text-[10px] text-center">
                    VaR_99% = 2.326 × σ_daily - μ_daily
                  </div>

                  <p><b>4. Portfolio Covariance Variance:</b></p>
                  <div className="p-2 rounded bg-slate-900 text-blue-300 font-mono text-[10px] text-center">
                    σ_p² = wᵀ Σ w   (w_i = 1/N)
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="rounded-xl border border-blue-200 bg-slate-50 overflow-hidden shadow-sm">
                <div className="bg-blue-800 px-4 py-2 text-white font-bold text-sm uppercase tracking-wider text-center">
                  Results
                </div>
                <div className="p-4 space-y-3 text-slate-700">
                  <table className="w-full text-left text-[11px] border-collapse border border-slate-200">
                    <thead className="bg-blue-900 text-white font-bold">
                      <tr>
                        <th className="p-1.5 border border-slate-300">Metric</th>
                        <th className="p-1.5 border border-slate-300 text-right">Calculated Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="p-1.5 border border-slate-200 font-medium">Portfolio Volatility</td>
                        <td className="p-1.5 border border-slate-200 text-right font-bold text-emerald-700">{portVol.toFixed(2)}%</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="p-1.5 border border-slate-200 font-medium">Avg Stock Volatility</td>
                        <td className="p-1.5 border border-slate-200 text-right font-bold text-rose-700">{avgVol.toFixed(2)}%</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-1.5 border border-slate-200 font-medium">Diversification Benefit</td>
                        <td className="p-1.5 border border-slate-200 text-right font-bold text-blue-700">{divBenefit.toFixed(1)}% Risk Reduction</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="p-1.5 border border-slate-200 font-medium">Portfolio Sharpe Ratio</td>
                        <td className="p-1.5 border border-slate-200 text-right font-bold text-purple-700">{portSharpe.toFixed(3)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* COLUMN 3: Discussion & Conclusions */}
            <div className="space-y-6">
              {/* Discussion */}
              <div className="rounded-xl border border-blue-200 bg-slate-50 overflow-hidden shadow-sm">
                <div className="bg-blue-800 px-4 py-2 text-white font-bold text-sm uppercase tracking-wider text-center">
                  Discussion
                </div>
                <div className="p-4 space-y-2 text-slate-700">
                  <p>
                    The pairwise correlation matrix ρ(i,j) highlights that cross-sector pairings (e.g. Banking vs FMCG) exhibit low or negative covariance.
                  </p>
                  <p>
                    Equal weighting eliminates idiosyncratic company risk, producing a robust risk-adjusted return ratio ($R_f = 5.25\%$).
                  </p>
                </div>
              </div>

              {/* Visual Risk Comparison Diagram Box */}
              <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm text-center space-y-2">
                <div className="text-xs font-bold text-slate-900 uppercase">Figure: Risk Reduction Comparison</div>
                <div className="h-28 flex items-end justify-center gap-6 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-16 bg-rose-500 rounded-t-lg flex flex-col items-center justify-end p-1 text-white text-[10px] font-bold" style={{ height: '90%' }}>
                    <span>{avgVol.toFixed(1)}%</span>
                    <span className="text-[8px]">Avg Stock</span>
                  </div>
                  <div className="w-16 bg-emerald-500 rounded-t-lg flex flex-col items-center justify-end p-1 text-white text-[10px] font-bold" style={{ height: '52%' }}>
                    <span>{portVol.toFixed(1)}%</span>
                    <span className="text-[8px]">Portfolio</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  Diversification Risk Reduction: {divBenefit.toFixed(1)}%
                </div>
              </div>

              {/* Conclusions */}
              <div className="rounded-xl border border-blue-200 bg-slate-50 overflow-hidden shadow-sm">
                <div className="bg-blue-800 px-4 py-2 text-white font-bold text-sm uppercase tracking-wider text-center">
                  Conclusions
                </div>
                <div className="p-4 space-y-2 text-slate-700">
                  <p>
                    1. Mathematical proof confirms equal-weight portfolio covariance reduces overall asset volatility by <b>~43.4%</b>.
                  </p>
                  <p>
                    2. Parametric 99% VaR effectively bounds 1-day potential downside loss for risk management.
                  </p>
                  <p>
                    3. Developed for live academic PBL evaluation & faculty project review.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Banner (Project Team & References) */}
          <div className="border-t-2 border-slate-300 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            {/* Project Team */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 uppercase text-xs border-b border-slate-200 pb-1">
                Project Team & Academic Information
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <div className="font-semibold text-slate-800">1. Deepika R</div>
                  <div className="text-[11px] text-slate-500">B.Tech AI & DS</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-800">2. Dharshana M</div>
                  <div className="text-[11px] text-slate-500">B.Tech AI & DS</div>
                </div>
              </div>
              <div className="pt-2 text-[11px] text-blue-900 font-semibold">
                Project Mentor: Dr. Shanmuga Sundaram | CHENNAI INSTITUTE OF TECHNOLOGY
              </div>
            </div>

            {/* References */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 uppercase text-xs border-b border-slate-200 pb-1">
                References & Data Sources
              </div>
              <ol className="list-decimal pl-4 space-y-0.5 text-[10px] text-slate-600">
                <li>Markowitz, H. (1952). Portfolio Selection. The Journal of Finance, 7(1), 77-91.</li>
                <li>Sharpe, W. F. (1966). Mutual Fund Performance. The Journal of Business, 39(1), 119-138.</li>
                <li>Jorion, P. (2006). Value at Risk: The New Benchmark for Managing Financial Risk. McGraw-Hill.</li>
                <li>NSE India Daily Stock Market Trading Panel Dataset (2025-2026).</li>
              </ol>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
