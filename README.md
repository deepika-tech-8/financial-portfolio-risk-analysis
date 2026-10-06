# Financial Portfolio Risk Analysis

**CS5403 – Machine Learning | Academic PBL Project**

**Team Members:**
- **Deepika R**
- **Dharshana M**

**Department:** B.Tech Artificial Intelligence and Data Science  
**Project Mentor:** Dr. Shanmuga Sundaram  

---

## 1. Project Overview

**Financial Portfolio Risk Analysis** is an interactive, full-stack web application designed for quantitative risk analysis, asset return statistics, and portfolio diversification modelling across Indian National Stock Exchange (NSE) listed equities.

The application calculates quantitative financial risk metrics—**Annualized Volatility**, **99% 1-Day Value at Risk (VaR)** (both Parametric & Historical), **Sharpe Ratio**, and **Beta sensitivity**—and demonstrates the mathematical proof of portfolio diversification through matrix covariance weighting ($w^T \Sigma w$).

---

## 2. Key Features

- **CSV Data Cleaning Engine**: Automatic header whitespace trimming, date parsing, duplicate row detection, missing value handling, and data quality metrics display.
- **Dynamic Demo Dataset**: Pre-configured 2,057-record dataset across 17 stocks and 8 sectors (Banking, IT, Pharma, Auto, Energy, Infrastructure, FMCG, NBFC) spanning `21-Dec-2025` to `21-Jun-2026`.
- **Quantitative Risk Metrics**:
  - Annualized Volatility ($\sigma_{\text{daily}} \times \sqrt{252}$)
  - 99% Parametric 1-Day VaR ($2.326 \times \sigma - \mu$)
  - 99% Historical Simulation VaR (1st percentile empirical loss)
  - Sharpe Ratio ($R_f = 5.25\%$)
  - Beta Sensitivity ($\text{Cov}(R_i, R_m)/\text{Var}(R_m)$) against NIFTY 50 benchmark or Equal-Weighted Portfolio Proxy.
- **Equal-Weighted Portfolio Construction**: Equal weighting vector ($w_i = 1/N$), daily portfolio return $R_p$, covariance matrix variance $w^T \Sigma w$, and risk reduction % calculation.
- **10 Interactive Visual Charts**: Stock price trends, return distributions, comparative bar charts (Volatility, VaR, Sharpe, Beta), allocation donut chart, correlation heatmap, and cumulative return line chart.
- **Automated Project Report Generator**: One-click PDF download containing project title, team info, methodology, metrics tables, findings, and disclaimers.

---

## 3. Technology Stack

- **Backend**: Python 3.14 (Flask, Pandas, NumPy, SciPy, ReportLab for PDF generation, Pytest)
- **Frontend**: React.js 18, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Dataset**: Balanced panel daily trading data (CSV format)

---

## 4. Repository Structure

```
financial_portfolio_risk_analysis/
├── backend/
│   ├── app.py                          # Flask REST API server
│   ├── requirements.txt                # Python dependencies
│   ├── services/
│   │   ├── data_cleaning.py            # CSV cleaning & data quality engine
│   │   ├── returns.py                  # Daily return matrix computation
│   │   ├── risk_metrics.py             # Volatility, VaR, Sharpe, Beta calculations
│   │   ├── portfolio.py                # Matrix covariance w^T Σ w & diversification math
│   │   └── report_generator.py         # ReportLab PDF report builder
│   └── tests/
│       ├── test_data_cleaning.py       # Data cleaning unit tests
│       ├── test_risk_metrics.py        # Risk metrics unit tests
│       └── test_portfolio.py           # Portfolio matrix math unit tests
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── components/                 # Navbar, Sidebar, MetricCard, StockTable, DataQualityCard, DisclaimerFooter
│       ├── pages/                      # Home, Dataset, RiskAnalysis, Portfolio, Comparison, Correlation, Results, Methodology
│       ├── services/                   # API client (fetch/axios)
│       ├── App.jsx
│       └── main.jsx
├── data/
│   ├── demo_dataset.csv                # 2,057 record demo dataset
│   └── nifty50_benchmark_demo.csv     # NIFTY 50 benchmark demo dataset
├── scripts/
│   └── generate_demo_data.py           # Dataset generator script
└── README.md
```

---

## 5. Installation & Quick Start

### Backend Setup (Python Flask)

1. Open terminal and navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```
3. Run backend automated unit tests:
   ```bash
   python -m pytest tests
   ```
4. Start Flask REST API server:
   ```bash
   python app.py
   ```
   *The server runs on `http://127.0.0.1:5000`.*

### Frontend Setup (React + Vite)

1. Open a second terminal and navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:3000`.

---

## 6. API Endpoints

- `POST /api/upload`: Upload custom CSV dataset.
- `GET /api/dataset-summary`: Fetch data quality summary.
- `POST /api/clean`: Re-trigger data cleaning pipeline.
- `POST /api/stock-analysis`: Calculate single stock metrics and trend data.
- `POST /api/portfolio-analysis`: Compute equal-weighted portfolio metrics ($w^T \Sigma w$).
- `POST /api/correlation`: Return Pearson correlation matrix.
- `POST /api/benchmark`: Upload optional benchmark CSV (e.g. NIFTY 50).
- `GET /api/results`: Retrieve overall project findings and narrative.
- `POST /api/report`: Download dynamic PDF project report.

---

## 7. Mathematical Formulations

- **Daily Return**: $R_{i,t} = \frac{\text{Close}_{i,t} - \text{Close}_{i,t-1}}{\text{Close}_{i,t-1}}$
- **Annualized Volatility**: $\sigma_{\text{ann}} = \sigma_{\text{daily}} \times \sqrt{252} \times 100\%$
- **Parametric 99% 1-Day VaR**: $\text{VaR}_{99\%} = (2.326 \times \sigma_{\text{daily}} - \mu_{\text{daily}}) \times 100\%$
- **Sharpe Ratio**: $\text{Sharpe} = \frac{\text{Annualized Return} - 0.0525}{\sigma_{\text{ann}}}$
- **Beta**: $\beta_i = \frac{\text{Cov}(R_i, R_m)}{\text{Var}(R_m)}$
- **Portfolio Covariance Volatility**: $\sigma_p = \sqrt{w^T \Sigma w} \times \sqrt{252}$
- **Diversification Benefit**: $\text{Benefit} = \left(1 - \frac{\sigma_p}{\bar{\sigma}_{\text{ind}}}\right) \times 100\%$

---

## 8. Academic & Educational Disclaimer

Educational project only. The analysis is based on historical data and statistical estimates and does not constitute financial or investment advice. Past performance does not guarantee future results.
