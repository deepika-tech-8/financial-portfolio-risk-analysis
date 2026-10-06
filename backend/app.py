import os
import io
import pandas as pd
import numpy as np

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

from services.data_cleaning import clean_stock_data
from services.returns import calculate_daily_returns, get_returns_matrix
from services.risk_metrics import (
    calculate_stock_metrics,
    calculate_all_stocks_metrics
)
from services.portfolio import analyze_portfolio
from services.report_generator import generate_pdf_report


# ============================================================
# PATH CONFIGURATION
# ============================================================

base_dir = os.path.dirname(os.path.abspath(__file__))

dist_folder = os.path.join(
    base_dir,
    "..",
    "frontend",
    "dist"
)


# ============================================================
# FLASK APP
# ============================================================

app = Flask(
    __name__,
    static_folder=dist_folder if os.path.exists(dist_folder) else None,
    static_url_path=""
)

CORS(app)


# ============================================================
# GLOBAL IN-MEMORY SESSION
# ============================================================

CURRENT_SESSION = {
    "df_clean": None,
    "quality_summary": None,
    "returns_matrix": None,
    "market_returns": None,
    "is_demo": True
}


# ============================================================
# LOAD DEFAULT DEMO DATASET
# ============================================================

def load_default_demo_dataset():
    """
    Loads the default demo dataset from:
    data/demo_dataset.csv

    Also loads:
    data/nifty50_benchmark_demo.csv
    """

    base_dir = os.path.dirname(os.path.abspath(__file__))

    demo_path = os.path.join(
        base_dir,
        "..",
        "data",
        "demo_dataset.csv"
    )

    nifty_path = os.path.join(
        base_dir,
        "..",
        "data",
        "nifty50_benchmark_demo.csv"
    )

    if os.path.exists(demo_path):

        df_raw = pd.read_csv(demo_path)

        df_clean, summary = clean_stock_data(df_raw)

        returns_mat = get_returns_matrix(df_clean)

        # Benchmark
        market_series = None

        if os.path.exists(nifty_path):

            nifty_df = pd.read_csv(nifty_path)

            nifty_clean, _ = clean_stock_data(nifty_df)

            nifty_returns = get_returns_matrix(nifty_clean)

            if "NIFTY50" in nifty_returns.columns:
                market_series = nifty_returns["NIFTY50"]

        CURRENT_SESSION["df_clean"] = df_clean
        CURRENT_SESSION["quality_summary"] = summary
        CURRENT_SESSION["returns_matrix"] = returns_mat
        CURRENT_SESSION["market_returns"] = market_series
        CURRENT_SESSION["is_demo"] = True

        print("Default Demo Dataset loaded successfully.")


# ============================================================
# INITIALIZE DEMO DATASET
# ============================================================

try:
    load_default_demo_dataset()

except Exception as e:
    print("Warning loading default demo dataset:", e)


# ============================================================
# API - UPLOAD CSV
# ============================================================

@app.route("/api/upload", methods=["POST"])
def upload_csv():

    try:

        if "file" not in request.files:
            return jsonify({
                "error": "No file uploaded. Please select a CSV file."
            }), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({
                "error": "Selected file is empty."
            }), 400

        df_raw = pd.read_csv(file)

        df_clean, quality_summary = clean_stock_data(df_raw)

        returns_mat = get_returns_matrix(df_clean)

        CURRENT_SESSION["df_clean"] = df_clean
        CURRENT_SESSION["quality_summary"] = quality_summary
        CURRENT_SESSION["returns_matrix"] = returns_mat
        CURRENT_SESSION["is_demo"] = False

        return jsonify({
            "message": "Dataset uploaded and parsed successfully.",
            "is_demo": False,
            "quality_summary": quality_summary
        })

    except Exception as e:

        return jsonify({
            "error": f"Failed to process CSV file: {str(e)}"
        }), 400


# ============================================================
# API - LOAD DEMO DATASET
# ============================================================

@app.route("/api/load-demo", methods=["POST"])
def load_demo():

    try:

        load_default_demo_dataset()

        return jsonify({
            "message": "Loaded Demo Dataset successfully.",
            "is_demo": True,
            "quality_summary": CURRENT_SESSION["quality_summary"]
        })

    except Exception as e:

        return jsonify({
            "error": f"Failed to load demo dataset: {str(e)}"
        }), 500


# ============================================================
# API - DATASET SUMMARY
# ============================================================

@app.route("/api/dataset-summary", methods=["GET"])
def get_dataset_summary():

    if CURRENT_SESSION["quality_summary"] is None:

        return jsonify({
            "error": "No dataset currently loaded."
        }), 404

    return jsonify({
        "is_demo": CURRENT_SESSION["is_demo"],
        "quality_summary": CURRENT_SESSION["quality_summary"]
    })


# ============================================================
# API - CLEAN DATA
# ============================================================

@app.route("/api/clean", methods=["POST"])
def clean_data_endpoint():

    if CURRENT_SESSION["df_clean"] is None:

        return jsonify({
            "error": "No dataset loaded to clean."
        }), 400

    return jsonify({
        "message": "Data cleaned and validated.",
        "quality_summary": CURRENT_SESSION["quality_summary"]
    })


# ============================================================
# API - UPLOAD BENCHMARK
# ============================================================

@app.route("/api/benchmark", methods=["POST"])
def upload_benchmark():

    try:

        if "file" not in request.files:

            return jsonify({
                "error": "No benchmark file uploaded."
            }), 400

        file = request.files["file"]

        df_raw = pd.read_csv(file)

        df_clean, summary = clean_stock_data(df_raw)

        returns_mat = get_returns_matrix(df_clean)

        first_stock = returns_mat.columns[0]

        CURRENT_SESSION["market_returns"] = returns_mat[first_stock]

        return jsonify({
            "message": (
                f"Benchmark dataset ({first_stock}) set successfully."
            ),
            "benchmark_stock": first_stock
        })

    except Exception as e:

        return jsonify({
            "error": f"Failed to upload benchmark CSV: {str(e)}"
        }), 400


# ============================================================
# API - STOCK ANALYSIS
# ============================================================

@app.route("/api/stock-analysis", methods=["POST"])
def stock_analysis():

    try:

        data = request.json or {}

        stock = data.get("stock")

        returns_mat = CURRENT_SESSION["returns_matrix"]

        df_clean = CURRENT_SESSION["df_clean"]

        market_series = CURRENT_SESSION["market_returns"]

        if returns_mat is None:

            return jsonify({
                "error": "No dataset loaded."
            }), 400

        if not stock or stock not in returns_mat.columns:

            stock = returns_mat.columns[0]

        s_returns = returns_mat[stock].dropna()

        stock_sector_map = (
            df_clean
            .groupby("Stock")["Sector"]
            .first()
            .to_dict()
        )

        sector = stock_sector_map.get(
            stock,
            "General"
        )

        metrics = calculate_stock_metrics(
            s_returns,
            market_series,
            stock_name=stock,
            sector=sector
        )

        # Price history
        price_df = (
            df_clean[df_clean["Stock"] == stock]
            .sort_values(by="Date")
        )

        price_history = [
            {
                "date": row["Date"].strftime("%Y-%m-%d"),
                "close": float(row["Close"])
            }
            for _, row in price_df.iterrows()
        ]

        # Histogram distribution
        hist, bin_edges = np.histogram(
            s_returns.values * 100,
            bins=20
        )

        distribution = [
            {
                "bin": (
                    f"{bin_edges[i]:.1f}% "
                    f"to {bin_edges[i + 1]:.1f}%"
                ),
                "count": int(hist[i])
            }
            for i in range(len(hist))
        ]

        return jsonify({
            "metrics": metrics,
            "price_history": price_history,
            "distribution": distribution,
            "available_stocks": list(returns_mat.columns)
        })

    except Exception as e:

        return jsonify({
            "error": f"Stock analysis error: {str(e)}"
        }), 500


# ============================================================
# API - PORTFOLIO ANALYSIS
# ============================================================

@app.route("/api/portfolio-analysis", methods=["POST"])
def portfolio_analysis_endpoint():

    try:

        data = request.json or {}

        selected_stocks = data.get(
            "selected_stocks",
            None
        )

        returns_mat = CURRENT_SESSION["returns_matrix"]

        df_clean = CURRENT_SESSION["df_clean"]

        market_series = CURRENT_SESSION["market_returns"]

        if returns_mat is None:

            return jsonify({
                "error": "No dataset loaded."
            }), 400

        results = analyze_portfolio(
            returns_mat,
            selected_stocks,
            df_clean,
            market_series
        )

        return jsonify(results)

    except Exception as e:

        return jsonify({
            "error": f"Portfolio analysis failed: {str(e)}"
        }), 500


# ============================================================
# API - CORRELATION MATRIX
# ============================================================

@app.route("/api/correlation", methods=["POST"])
def correlation_matrix():

    try:

        data = request.json or {}

        selected_stocks = data.get(
            "selected_stocks",
            None
        )

        returns_mat = CURRENT_SESSION["returns_matrix"]

        if returns_mat is None:

            return jsonify({
                "error": "No dataset loaded."
            }), 400

        if not selected_stocks:

            selected_stocks = list(
                returns_mat.columns
            )

        sub_matrix = (
            returns_mat[selected_stocks]
            .dropna()
        )

        corr = sub_matrix.corr().round(3)

        return jsonify({
            "stocks": selected_stocks,
            "matrix": corr.values.tolist()
        })

    except Exception as e:

        return jsonify({
            "error": f"Correlation calculation error: {str(e)}"
        }), 500


# ============================================================
# API - RESULTS
# ============================================================

@app.route("/api/results", methods=["GET"])
def get_results():

    try:

        returns_mat = CURRENT_SESSION["returns_matrix"]

        df_clean = CURRENT_SESSION["df_clean"]

        market_series = CURRENT_SESSION["market_returns"]

        if returns_mat is None:

            return jsonify({
                "error": "No dataset loaded."
            }), 400

        results = analyze_portfolio(
            returns_mat,
            None,
            df_clean,
            market_series
        )

        return jsonify(results)

    except Exception as e:

        return jsonify({
            "error": f"Failed to retrieve project results: {str(e)}"
        }), 500


# ============================================================
# API - PDF REPORT
# ============================================================

@app.route("/api/report", methods=["POST"])
def download_report():

    try:

        data = request.json or {}

        selected_stocks = data.get(
            "selected_stocks",
            None
        )

        returns_mat = CURRENT_SESSION["returns_matrix"]

        df_clean = CURRENT_SESSION["df_clean"]

        market_series = CURRENT_SESSION["market_returns"]

        quality_summary = CURRENT_SESSION["quality_summary"]

        if returns_mat is None:

            return jsonify({
                "error": "No dataset loaded."
            }), 400

        results = analyze_portfolio(
            returns_mat,
            selected_stocks,
            df_clean,
            market_series
        )

        pdf_buffer = generate_pdf_report(
            results,
            quality_summary
        )

        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=(
                "Financial_Portfolio_Risk_Analysis_Report.pdf"
            ),
            mimetype="application/pdf"
        )

    except Exception as e:

        return jsonify({
            "error": f"Report generation failed: {str(e)}"
        }), 500


# ============================================================
# FRONTEND / ROOT ROUTE
# ============================================================

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):

    # IMPORTANT:
    # Use isfile() instead of exists().
    # exists() returns True for directories too,
    # which caused the Render IsADirectoryError.

    if app.static_folder:

        requested_file = os.path.join(
            app.static_folder,
            path
        )

        # Only send actual files.
        if os.path.isfile(requested_file):

            res = send_file(requested_file)

            res.headers[
                "Cache-Control"
            ] = "no-cache, no-store, must-revalidate"

            return res

        # If the requested file does not exist,
        # serve React's index.html for SPA routing.
        index_file = os.path.join(
            app.static_folder,
            "index.html"
        )

        if os.path.isfile(index_file):

            res = send_file(index_file)

            res.headers[
                "Cache-Control"
            ] = "no-cache, no-store, must-revalidate"

            return res

    # Backend-only response.
    # This is used on Render when the frontend
    # is deployed separately on Vercel.

    return jsonify({
        "message": (
            "Financial Portfolio Risk Analysis "
            "Backend API operational."
        ),
        "academic_info": {
            "course": "CS5403 Machine Learning",
            "team": "Deepika R & Dharshana M",
            "mentor": "Dr. Shanmuga Sundaram",
            "department": "B.Tech AI & DS"
        }
    })


# ============================================================
# LOCAL DEVELOPMENT
# ============================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )