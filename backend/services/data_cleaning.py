import pandas as pd
import numpy as np

def clean_stock_data(df):
    """
    Cleans and validates uploaded or demo stock dataset.
    Returns: (cleaned_df, quality_summary_dict)
    """
    if df is None or df.empty:
        raise ValueError("Uploaded dataset is empty or invalid.")

    # 1. Strip whitespace from column names
    df.columns = df.columns.str.strip()

    # 2. Dynamic column resolution
    col_map = {}
    for col in df.columns:
        c_lower = col.lower()
        if 'date' in c_lower:
            col_map['date'] = col
        elif c_lower in ['stock', 'symbol', 'company', 'ticker']:
            col_map['stock'] = col
        elif 'close' in c_lower or 'price' in c_lower:
            if 'close' not in col_map:  # pick first close match
                col_map['close'] = col
        elif 'sector' in c_lower:
            col_map['sector'] = col

    # Check mandatory columns
    if 'date' not in col_map or 'stock' not in col_map or 'close' not in col_map:
        missing = []
        if 'date' not in col_map: missing.append("Date")
        if 'stock' not in col_map: missing.append("Stock / Symbol")
        if 'close' not in col_map: missing.append("Close Price")
        raise ValueError(f"Dataset missing required column(s): {', '.join(missing)}. Please upload a valid CSV containing Date, Stock, and Close columns.")

    date_col = col_map['date']
    stock_col = col_map['stock']
    close_col = col_map['close']
    sector_col = col_map.get('sector', None)

    # Standardize column names in a copy
    clean_df = pd.DataFrame()
    clean_df['Date'] = df[date_col]
    clean_df['Stock'] = df[stock_col].astype(str).str.strip().str.upper()
    clean_df['Close'] = df[close_col]
    if sector_col and sector_col in df.columns:
        clean_df['Sector'] = df[sector_col].astype(str).str.strip()
    else:
        clean_df['Sector'] = "General"

    # Transfer extra columns if present (Open, High, Low, Volume)
    for col in df.columns:
        c_lower = col.lower()
        if c_lower in ['open', 'high', 'low', 'volume', 'turnover', 'trades', 'delivery %']:
            clean_df[col] = df[col]

    total_initial_rows = len(clean_df)

    # 3. Parse Dates
    clean_df['Date'] = pd.to_datetime(clean_df['Date'], errors='coerce')
    invalid_date_count = clean_df['Date'].isna().sum()

    # 4. Numeric Conversion for Close
    clean_df['Close'] = pd.to_numeric(clean_df['Close'], errors='coerce')
    invalid_price_count = (clean_df['Close'].isna()) | (clean_df['Close'] <= 0)

    # 5. Missing values detection
    missing_values_count = int(clean_df.isna().sum().sum())

    # 6. Duplicate detection on (Date, Stock)
    duplicate_mask = clean_df.duplicated(subset=['Date', 'Stock'], keep='first')
    duplicate_count = int(duplicate_mask.sum())

    # Filter out invalid rows (missing date, invalid close price, duplicates)
    valid_df = clean_df.dropna(subset=['Date', 'Close']).copy()
    valid_df = valid_df[valid_df['Close'] > 0]
    valid_df = valid_df.drop_duplicates(subset=['Date', 'Stock'], keep='first')

    # Sort chronologically
    valid_df = valid_df.sort_values(by=['Stock', 'Date']).reset_index(drop=True)

    # Data Quality Summary
    unique_stocks = sorted(valid_df['Stock'].unique().tolist())
    sectors = sorted(valid_df['Sector'].unique().tolist())
    
    min_date = valid_df['Date'].min().strftime('%Y-%m-%d') if not valid_df.empty else "N/A"
    max_date = valid_df['Date'].max().strftime('%Y-%m-%d') if not valid_df.empty else "N/A"

    days_per_stock = valid_df.groupby('Stock')['Date'].count().to_dict()

    quality_summary = {
        "total_rows": total_initial_rows,
        "valid_records": len(valid_df),
        "total_stocks": len(unique_stocks),
        "stocks": unique_stocks,
        "sectors": sectors,
        "date_range": {
            "start": min_date,
            "end": max_date
        },
        "duplicate_rows": duplicate_count,
        "missing_values": missing_values_count,
        "invalid_dates": int(invalid_date_count),
        "days_per_stock": days_per_stock
    }

    return valid_df, quality_summary
