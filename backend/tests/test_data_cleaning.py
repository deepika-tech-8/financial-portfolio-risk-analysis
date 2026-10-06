import pytest
import pandas as pd
import numpy as np
from services.data_cleaning import clean_stock_data

def test_clean_stock_data_valid():
    df_raw = pd.DataFrame({
        " Date ": ["2026-01-01", "2026-01-02", "2026-01-01", "2026-01-02"],
        " Stock ": ["TCS", "TCS", "INFY", "INFY"],
        " Close Price ": [3800.0, 3850.0, 1500.0, 1520.0],
        " Sector ": ["IT", "IT", "IT", "IT"]
    })

    df_clean, summary = clean_stock_data(df_raw)

    assert len(df_clean) == 4
    assert summary["total_stocks"] == 2
    assert "TCS" in summary["stocks"]
    assert "INFY" in summary["stocks"]
    assert summary["duplicate_rows"] == 0

def test_clean_stock_data_duplicates_and_missing():
    df_raw = pd.DataFrame({
        "Date": ["2026-01-01", "2026-01-01", "2026-01-02", "2026-01-03"],
        "Stock": ["TCS", "TCS", "TCS", "TCS"],
        "Close": [3800.0, 3800.0, np.nan, 3900.0]
    })

    df_clean, summary = clean_stock_data(df_raw)

    assert len(df_clean) == 2  # 1 duplicate dropped, 1 nan dropped
    assert summary["duplicate_rows"] == 1
    assert summary["missing_values"] == 1
