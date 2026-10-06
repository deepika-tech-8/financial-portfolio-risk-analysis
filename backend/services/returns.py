import pandas as pd
import numpy as np

def calculate_daily_returns(df):
    """
    Calculates daily percentage return for each stock in the DataFrame.
    DataFrame must contain ['Date', 'Stock', 'Close'].
    Returns a DataFrame with an added 'Daily_Return' column.
    First day of each stock is NaN.
    """
    df = df.sort_values(by=['Stock', 'Date']).copy()
    df['Daily_Return'] = df.groupby('Stock')['Close'].pct_change()
    return df

def get_returns_matrix(df):
    """
    Pivots daily returns into a wide Matrix: Date x Stock symbols.
    Returns: returns_df (DataFrame), date_index
    """
    returns_df = calculate_daily_returns(df)
    pivoted = returns_df.pivot(index='Date', columns='Stock', values='Daily_Return')
    # Drop rows where all returns are NaN (e.g. initial date)
    pivoted = pivoted.dropna(how='all')
    return pivoted
