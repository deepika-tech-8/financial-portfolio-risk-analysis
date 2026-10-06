import numpy as np
import pandas as pd
from .risk_metrics import RISK_FREE_RATE, calculate_stock_metrics

def analyze_portfolio(returns_matrix, selected_stocks=None, df_clean=None, market_returns_series=None):
    """
    Analyzes an equal-weighted portfolio of selected stocks.
    """
    if returns_matrix is None or returns_matrix.empty:
        raise ValueError("Empty returns matrix provided.")

    if selected_stocks is None or len(selected_stocks) == 0:
        selected_stocks = list(returns_matrix.columns)

    # Filter matrix to selected stocks and drop any completely missing rows
    port_matrix = returns_matrix[selected_stocks].dropna()
    num_stocks = len(selected_stocks)

    if num_stocks == 0:
        raise ValueError("No valid stocks selected for portfolio analysis.")

    # Equal weighting vector
    weights = np.array([1.0 / num_stocks] * num_stocks)

    # 1. Daily Portfolio Returns Series
    portfolio_daily_returns = port_matrix.dot(weights)
    
    daily_mean_p = portfolio_daily_returns.mean()
    annualized_return_p = daily_mean_p * 252

    # 2. Covariance Matrix & Portfolio Volatility (w^T * Sigma * w)
    cov_matrix = port_matrix.cov()
    portfolio_daily_variance = float(np.dot(weights.T, np.dot(cov_matrix.values, weights)))
    portfolio_daily_volatility = np.sqrt(max(0.0, portfolio_daily_variance))
    annualized_portfolio_volatility = portfolio_daily_volatility * np.sqrt(252)

    # 3. Individual Stock Volatilities
    individual_metrics = []
    stock_sector_map = df_clean.groupby('Stock')['Sector'].first().to_dict() if df_clean is not None else {}
    
    for stock in selected_stocks:
        s_ret = port_matrix[stock]
        sec = stock_sector_map.get(stock, "General")
        m = calculate_stock_metrics(s_ret, market_returns_series, stock_name=stock, sector=sec)
        individual_metrics.append(m)

    avg_individual_volatility_pct = np.mean([m['annualized_volatility_pct'] for m in individual_metrics])

    # 4. Diversification Benefit (%)
    port_vol_pct = annualized_portfolio_volatility * 100
    if avg_individual_volatility_pct > 0:
        diversification_benefit_pct = (1.0 - (port_vol_pct / avg_individual_volatility_pct)) * 100.0
    else:
        diversification_benefit_pct = 0.0

    # 5. Portfolio VaR 99% Parametric
    z_score = 2.326
    portfolio_var_99_pct = max(0.0, (z_score * portfolio_daily_volatility - daily_mean_p) * 100)
    
    # Historical VaR 99%
    hist_1pct_p = np.percentile(portfolio_daily_returns, 1)
    portfolio_hist_var_99_pct = max(0.0, -hist_1pct_p * 100)

    # 6. Portfolio Sharpe Ratio
    if port_vol_pct > 0:
        portfolio_sharpe_ratio = (annualized_return_p - RISK_FREE_RATE) / (port_vol_pct / 100.0)
    else:
        portfolio_sharpe_ratio = 0.0

    # 7. Portfolio Allocations
    allocations = [{"stock": stock, "weight": round(100.0 / num_stocks, 2)} for stock in selected_stocks]

    # 8. Correlation Matrix
    corr_matrix = port_matrix.corr().round(3)
    corr_data = {
        "stocks": selected_stocks,
        "matrix": corr_matrix.values.tolist()
    }

    # 9. Cumulative Return Series for Charting
    cum_returns = (1 + portfolio_daily_returns).cumprod() - 1
    cumulative_series = [
        {"date": date.strftime('%Y-%m-%d'), "portfolio_return_pct": round(float(val * 100), 2)}
        for date, val in cum_returns.items()
    ]

    # 10. Highlights (Highest/Lowest)
    sorted_by_vol = sorted(individual_metrics, key=lambda x: x['annualized_volatility_pct'])
    sorted_by_sharpe = sorted(individual_metrics, key=lambda x: x['sharpe_ratio'], reverse=True)
    sorted_by_beta = sorted(individual_metrics, key=lambda x: x['beta'], reverse=True)
    sorted_by_var = sorted(individual_metrics, key=lambda x: x['parametric_var_99_pct'], reverse=True)

    summary_text = (
        f"Based on the historical period from {portfolio_daily_returns.index.min().strftime('%Y-%m-%d')} "
        f"to {portfolio_daily_returns.index.max().strftime('%Y-%m-%d')} across {num_stocks} selected stocks, "
        f"the equal-weighted portfolio produced an annualized volatility of {port_vol_pct:.2f}%. "
        f"The average individual stock volatility was {avg_individual_volatility_pct:.2f}%. "
        f"This yields a quantitative risk reduction (diversification benefit) of {diversification_benefit_pct:.2f}%. "
        f"The portfolio Sharpe Ratio stands at {portfolio_sharpe_ratio:.3f} under a risk-free rate of 5.25%."
    )

    return {
        "num_stocks": num_stocks,
        "selected_stocks": selected_stocks,
        "allocations": allocations,
        "portfolio_annualized_return_pct": round(float(annualized_return_p * 100), 2),
        "portfolio_volatility_pct": round(float(port_vol_pct), 2),
        "avg_individual_volatility_pct": round(float(avg_individual_volatility_pct), 2),
        "diversification_benefit_pct": round(float(diversification_benefit_pct), 2),
        "portfolio_parametric_var_99_pct": round(float(portfolio_var_99_pct), 2),
        "portfolio_historical_var_99_pct": round(float(portfolio_hist_var_99_pct), 2),
        "portfolio_sharpe_ratio": round(float(portfolio_sharpe_ratio), 3),
        "risk_free_rate_pct": 5.25,
        "individual_stock_metrics": individual_metrics,
        "correlation": corr_data,
        "cumulative_returns": cumulative_series,
        "summary_text": summary_text,
        "highlights": {
            "highest_volatility": {"stock": sorted_by_vol[-1]['stock'], "value_pct": sorted_by_vol[-1]['annualized_volatility_pct']},
            "lowest_volatility": {"stock": sorted_by_vol[0]['stock'], "value_pct": sorted_by_vol[0]['annualized_volatility_pct']},
            "highest_sharpe": {"stock": sorted_by_sharpe[0]['stock'], "value": sorted_by_sharpe[0]['sharpe_ratio']},
            "highest_beta": {"stock": sorted_by_beta[0]['stock'], "value": sorted_by_beta[0]['beta']},
            "lowest_beta": {"stock": sorted_by_beta[-1]['stock'], "value": sorted_by_beta[-1]['beta']},
            "highest_var": {"stock": sorted_by_var[0]['stock'], "value_pct": sorted_by_var[0]['parametric_var_99_pct']}
        }
    }
