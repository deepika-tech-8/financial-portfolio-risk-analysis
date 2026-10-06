import pytest
import pandas as pd
import numpy as np
from services.portfolio import analyze_portfolio

def test_portfolio_diversification_effect():
    np.random.seed(42)
    # 2 uncorrelated stocks -> diversification benefit should be positive (> 0%)
    dates = pd.date_range("2026-01-01", periods=100, freq="B")
    ret_a = np.random.normal(0.001, 0.02, 100)
    ret_b = np.random.normal(0.001, 0.02, 100)

    returns_matrix = pd.DataFrame({"STOCK_A": ret_a, "STOCK_B": ret_b}, index=dates)

    df_clean = pd.DataFrame({
        "Date": list(dates) * 2,
        "Stock": ["STOCK_A"] * 100 + ["STOCK_B"] * 100,
        "Sector": ["SectorA"] * 100 + ["SectorB"] * 100,
        "Close": [100.0] * 200
    })

    results = analyze_portfolio(returns_matrix, selected_stocks=["STOCK_A", "STOCK_B"], df_clean=df_clean)

    assert results["num_stocks"] == 2
    assert results["portfolio_volatility_pct"] < results["avg_individual_volatility_pct"]
    assert results["diversification_benefit_pct"] > 0
    assert len(results["allocations"]) == 2
    assert results["allocations"][0]["weight"] == 50.0
