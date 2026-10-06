
// ============================================================
// API BASE URL
// ============================================================
const getApiBaseUrl = () => {
  // Local development
  // Vite runs on port 3000 and proxies /api to Flask
  if (
    typeof window !== 'undefined' &&
    window.location.port === '3000'
  ) {
    return '/api';
  }

  // Production
  // Vercel frontend connects directly to Render backend
  return 'https://financial-portfolio-risk-analysis-1.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();


// ============================================================
// DATASET SUMMARY
// ============================================================

export async function fetchDatasetSummary() {
  const res = await fetch(`${API_BASE_URL}/dataset-summary`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch dataset summary');
  }

  return await res.json();
}

export const getDatasetSummary = fetchDatasetSummary;


// ============================================================
// UPLOAD CSV FILE
// ============================================================

export async function uploadCSVFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to upload CSV file');
  }

  return await res.json();
}

export const uploadDataset = uploadCSVFile;


// ============================================================
// LOAD DEMO DATASET
// ============================================================

export async function loadDemoDataset() {
  const res = await fetch(`${API_BASE_URL}/load-demo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to load demo dataset');
  }

  return await res.json();
}


// ============================================================
// CLEAN DATASET
// ============================================================

export async function cleanDataset() {
  const res = await fetch(`${API_BASE_URL}/clean`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to clean dataset');
  }

  return await res.json();
}

export const cleanData = cleanDataset;


// ============================================================
// STOCK ANALYSIS
// ============================================================
//
// IMPORTANT:
// This function is kept for pages that already use
// analyzeStocks(selectedStocks).
//
// It sends selected_stocks as an array.
//

export async function analyzeStocks(selectedStocks = []) {
  const res = await fetch(`${API_BASE_URL}/stock-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      selected_stocks: selectedStocks
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to analyze stocks');
  }

  return await res.json();
}


// ============================================================
// FETCH SINGLE STOCK ANALYSIS
// ============================================================
//
// RiskAnalysisPage uses:
// fetchStockAnalysis(stock)
//
// This sends the single stock name as:
// { stock: "TCS" }
//

export async function fetchStockAnalysis(stock) {
  const res = await fetch(`${API_BASE_URL}/stock-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      stock: stock
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to analyze selected stock');
  }

  return await res.json();
}


// ============================================================
// PORTFOLIO ANALYSIS
// ============================================================

export async function analyzePortfolio(
  selectedStocks = [],
  weights = {},
  confidenceLevel = 0.99
) {
  const res = await fetch(`${API_BASE_URL}/portfolio-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      selected_stocks: selectedStocks,
      weights: weights,
      confidence_level: confidenceLevel
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to analyze portfolio');
  }

  return await res.json();
}


// ============================================================
// CORRELATION
// ============================================================

export async function getCorrelation(selectedStocks = []) {
  const res = await fetch(`${API_BASE_URL}/correlation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      selected_stocks: selectedStocks
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to calculate correlation');
  }

  return await res.json();
}


// ============================================================
// REPORT / PDF
// ============================================================

export async function downloadReportPDF(selectedStocks = []) {
  const res = await fetch(`${API_BASE_URL}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      selected_stocks: selectedStocks
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to generate PDF report');
  }

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download = 'financial_portfolio_risk_report.pdf';

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}


// ============================================================
// DATE FORMATTER
// ============================================================

export function formatDate(date) {
  if (!date) {
    return '';
  }

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return date;
  }

  return d.toISOString().split('T')[0];
}


// ============================================================
// SUMMARY TEXT
// ============================================================

export function createSummaryText(data) {
  if (!data) {
    return '';
  }

  const parts = [];

  if (data.total_records !== undefined) {
    parts.push(`Total Records: ${data.total_records}`);
  }

  if (data.total_stocks !== undefined) {
    parts.push(`Total Stocks: ${data.total_stocks}`);
  }

  if (data.total_sectors !== undefined) {
    parts.push(`Total Sectors: ${data.total_sectors}`);
  }

  if (data.start_date) {
    parts.push(`Start Date: ${formatDate(data.start_date)}`);
  }

  if (data.end_date) {
    parts.push(`End Date: ${formatDate(data.end_date)}`);
  }

  return parts.join(' | ');
}


// ============================================================
// DISTRIBUTION DATA
// ============================================================

export function getDistributionData(data) {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.distribution)) {
    return data.distribution;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}


// ============================================================
// HASH FUNCTION
// ============================================================

export function hashStr(str) {
  let hash = 0;

  if (!str) {
    return hash;
  }

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    hash = ((hash << 5) - hash) + char;

    hash |= 0;
  }

  return hash;
}


// ============================================================
// COMPATIBILITY EXPORTS
// ============================================================
//
// These aliases allow existing pages to continue working
// without changing their imports.
//

export const uploadData = uploadCSVFile;

export const fetchPortfolioAnalysis = analyzePortfolio;

export const fetchCorrelation = getCorrelation;

