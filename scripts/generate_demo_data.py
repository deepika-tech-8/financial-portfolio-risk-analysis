import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_datasets():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, "data")
    os.makedirs(data_dir, exist_ok=True)

    # 17 Stocks across 8 sectors
    stock_sectors = {
        "HDFCBANK": "Banking",
        "ICICIBANK": "Banking",
        "SBIN": "Banking",
        "KOTAKBANK": "Banking",
        "TCS": "IT",
        "INFY": "IT",
        "WIPRO": "IT",
        "SUNPHARMA": "Pharma",
        "DRREDDY": "Pharma",
        "TATAMOTORS": "Auto",
        "MARUTI": "Auto",
        "RELIANCE": "Energy",
        "NTPC": "Energy",
        "LT": "Infrastructure",
        "ITC": "FMCG",
        "HINDUNILVR": "FMCG",
        "BAJFINANCE": "NBFC"
    }

    base_prices = {
        "HDFCBANK": 1650.0,
        "ICICIBANK": 1100.0,
        "SBIN": 820.0,
        "KOTAKBANK": 1780.0,
        "TCS": 3850.0,
        "INFY": 1520.0,
        "WIPRO": 480.0,
        "SUNPHARMA": 1550.0,
        "DRREDDY": 6100.0,
        "TATAMOTORS": 980.0,
        "MARUTI": 12200.0,
        "RELIANCE": 2950.0,
        "NTPC": 360.0,
        "LT": 3650.0,
        "ITC": 430.0,
        "HINDUNILVR": 2450.0,
        "BAJFINANCE": 7100.0
    }

    annual_vols = {
        "HDFCBANK": 0.22,
        "ICICIBANK": 0.24,
        "SBIN": 0.28,
        "KOTAKBANK": 0.23,
        "TCS": 0.20,
        "INFY": 0.25,
        "WIPRO": 0.27,
        "SUNPHARMA": 0.21,
        "DRREDDY": 0.22,
        "TATAMOTORS": 0.35,
        "MARUTI": 0.26,
        "RELIANCE": 0.24,
        "NTPC": 0.25,
        "LT": 0.26,
        "ITC": 0.18,
        "HINDUNILVR": 0.19,
        "BAJFINANCE": 0.32
    }

    start_date = datetime(2025, 12, 21)
    end_date = datetime(2026, 6, 21)
    
    curr = start_date
    trading_days = []
    while curr <= end_date:
        if curr.weekday() < 5:  # Monday to Friday
            trading_days.append(curr.strftime("%Y-%m-%d"))
        curr += timedelta(days=1)
    
    num_days = len(trading_days)
    print(f"Generated {num_days} trading days between {start_date.date()} and {end_date.date()}")

    np.random.seed(42)

    market_daily_vol = 0.15 / np.sqrt(252)
    market_returns = np.random.normal(0.0004, market_daily_vol, num_days)

    records = []
    
    nifty_base = 22500.0
    nifty_prices = [nifty_base]
    for r in market_returns[:-1]:
        nifty_prices.append(nifty_prices[-1] * (1 + r))

    nifty_df = pd.DataFrame({
        "Date": trading_days,
        "Stock": ["NIFTY50"] * num_days,
        "Sector": ["Index"] * num_days,
        "Open": [round(p * 0.998, 2) for p in nifty_prices],
        "High": [round(p * 1.006, 2) for p in nifty_prices],
        "Low": [round(p * 0.994, 2) for p in nifty_prices],
        "Close": [round(p, 2) for p in nifty_prices],
        "Volume": np.random.randint(10000000, 25000000, num_days)
    })
    nifty_path = os.path.join(data_dir, "nifty50_benchmark_demo.csv")
    nifty_df.to_csv(nifty_path, index=False)
    print(f"Saved benchmark dataset to {nifty_path}")

    for stock, sector in stock_sectors.items():
        base_p = base_prices[stock]
        target_vol = annual_vols[stock]
        daily_vol = target_vol / np.sqrt(252)
        
        beta = 0.7 + (hash(stock) % 80) / 100.0
        idio_vol = np.sqrt(max(0.0001, daily_vol**2 - (beta * market_daily_vol)**2))
        
        stock_returns = beta * market_returns + np.random.normal(0.0002, idio_vol, num_days)
        
        prices = [base_p]
        for r in stock_returns[:-1]:
            prices.append(prices[-1] * (1 + r))
            
        for i, d in enumerate(trading_days):
            close_p = round(prices[i], 2)
            open_p = round(close_p * (1 + np.random.normal(0, 0.004)), 2)
            high_p = round(max(open_p, close_p) * (1 + abs(np.random.normal(0.005, 0.003))), 2)
            low_p = round(min(open_p, close_p) * (1 - abs(np.random.normal(0.005, 0.003))), 2)
            vol = int(np.random.lognormal(12, 0.5))
            turnover = round(vol * close_p, 2)
            trades = int(vol / np.random.randint(15, 30))
            delivery_pct = round(float(np.random.uniform(35.0, 75.0)), 2)

            records.append({
                "Date": d,
                "Stock": stock,
                "Sector": sector,
                "Open": open_p,
                "High": high_p,
                "Low": low_p,
                "Close": close_p,
                "Volume": vol,
                "Turnover": turnover,
                "Trades": trades,
                "Delivery %": delivery_pct
            })

    df = pd.DataFrame(records)
    demo_path = os.path.join(data_dir, "demo_dataset.csv")
    df.to_csv(demo_path, index=False)
    print(f"Generated {len(df)} records across {len(stock_sectors)} stocks. Saved to {demo_path}")

if __name__ == "__main__":
    generate_datasets()
