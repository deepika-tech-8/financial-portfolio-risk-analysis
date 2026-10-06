import numpy as np
import pandas as pd
from scipy.stats import norm

RISK_FREE_RATE = 0.0525  # 5.25% annualized

def calculate_stock_metrics(returns_series, market_returns_series=None, stock_name="Stock", sector="General"):
    """
    Calculates comprehensive quantitative risk metrics for a single stock daily return series.
    returns_series: pd.Series of daily percentage returns (dropna'd)
    market_returns_series: pd.Series of daily percentage returns for market benchmark
    """
    clean_returns = returns_series.dropna()
    if len(clean_returns) < 5:
        return {
            "stock": stock_name,
            "sector": sector,
            "error": "Insufficient data points for calculation"
        }

    daily_mean = clean_returns.mean()
    daily_std = clean_returns.std(ddof=1)
    
    # 1. Annualized Return & Volatility
    annualized_return = daily_mean * 252
    annualized_volatility = daily_std * np.sqrt(252)

    # 2. Parametric 99% 1-Day VaR (Z = 2.326)
    # VaR formula: VaR_pct = 2.326 * daily_std - daily_mean
    z_score = 2.326
    parametric_var_1day_pct = max(0.0, (z_score * daily_std - daily_mean) * 100)

    # 3. Historical Simulation 99% 1-Day VaR
    # 1st percentile loss
    hist_1pct = np.percentile(clean_returns, 1)
    historical_var_1day_pct = max(0.0, -hist_1pct * 100)

    # 4. Sharpe Ratio (Rf = 5.25%)
    if annualized_volatility > 0:
        sharpe_ratio = (annualized_return - RISK_FREE_RATE) / annualized_volatility
    else:
        sharpe_ratio = 0.0

    # 5. Beta Calculation
    beta = 1.0
    beta_benchmark_type = "Portfolio Proxy"
    
    if market_returns_series is not None:
        # Align indexes
        combined = pd.DataFrame({'stock': clean_returns, 'market': market_returns_series}).dropna()
        if len(combined) > 10:
            cov = combined.cov().iloc[0, 1]
            market_var = combined['market'].var()
            if market_var > 0:
                beta = cov / market_var
                beta_benchmark_type = "NIFTY 50"

    # 6. Risk Classification (Project-defined, non-advisory)
    ann_vol_pct = annualized_volatility * 100
    if ann_vol_pct < 20.0:
        risk_class = "Low Volatility"
    elif ann_vol_pct <= 30.0:
        risk_class = "Moderate Volatility"
    else:
        risk_class = "High Volatility"

    return {
        "stock": stock_name,
        "sector": sector,
        "data_points": len(clean_returns),
        "daily_mean_return_pct": round(float(daily_mean * 100), 4),
        "daily_std_pct": round(float(daily_std * 100), 4),
        "annualized_return_pct": round(float(annualized_return * 100), 2),
        "annualized_volatility_pct": round(float(ann_vol_pct), 2),
        "parametric_var_99_pct": round(float(parametric_var_1day_pct), 2),
        "historical_var_99_pct": round(float(historical_var_1day_pct), 2),
        "sharpe_ratio": round(float(sharpe_ratio), 3),
        "beta": round(float(beta), 3),
        "beta_benchmark_type": beta_benchmark_type,
        "risk_classification": risk_class,
        "risk_free_rate_pct": 5.25
    }

def calculate_all_stocks_metrics(returns_matrix, df_clean, market_returns_series=None):
    """
    Computes risk metrics for all stocks in the matrix.
    """
    results = []
    # Build stock to sector map
    stock_sector_map = df_clean.groupby('Stock')['Sector'].first().to_dict()

    for stock in returns_matrix.columns:
        s_returns = returns_matrix[stock].dropna()
        sector = stock_sector_map.get(stock, "General")
        m = calculate_stock_metrics(s_returns, market_returns_series, stock_name=stock, sector=sector)
        results.append(m)

    return results
