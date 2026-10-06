import pytest
import pandas as pd
import numpy as np
from services.risk_metrics import calculate_stock_metrics

def test_risk_metrics_calculation():
    np.random.seed(42)
    daily_returns = pd.Series(np.random.normal(0.001, 0.015, 100)) # ~23.8% annual vol

    metrics = calculate_stock_metrics(daily_returns, stock_name="TEST_STOCK", sector="Tech")

    assert metrics["stock"] == "TEST_STOCK"
    assert metrics["sector"] == "Tech"
    assert metrics["annualized_volatility_pct"] > 0
    assert metrics["parametric_var_99_pct"] > 0
    assert metrics["historical_var_99_pct"] > 0
    assert "sharpe_ratio" in metrics
    assert "beta" in metrics
    assert metrics["risk_classification"] in ["Low Volatility", "Moderate Volatility", "High Volatility"]
