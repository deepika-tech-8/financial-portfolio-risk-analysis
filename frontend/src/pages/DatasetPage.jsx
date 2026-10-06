import React, { useState } from 'react';
import { Upload, RefreshCw, ArrowRight, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import DataQualityCard from '../components/DataQualityCard';
import { uploadCSVFile, loadDemoDataset, cleanDataset } from '../services/api';

export default function DatasetPage({ summary, setSummary, isDemo, setIsDemo, setActivePage }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await uploadCSVFile(file);
      setSummary(res.quality_summary);
      setIsDemo(false);
      setMessage("CSV file uploaded and validated successfully!");
    } catch (err) {
      setError(err.message || "Failed to parse uploaded CSV file.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDemo = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await loadDemoDataset();
      setSummary(res.quality_summary);
      setIsDemo(true);
      setMessage("Demo dataset loaded successfully!");
    } catch (err) {
      setError(err.message || "Failed to load demo dataset.");
    } finally {
      setLoading(false);
    }
  };

  const handleCleanData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await cleanDataset();
      setSummary(res.quality_summary);
      setMessage("Data cleaning pipeline re-executed successfully!");
    } catch (err) {
      setError(err.message || "Data cleaning failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dataset Management & Cleaning</h2>
        <p className="text-sm text-slate-500">
          Upload custom NSE stock market daily data CSV or load the pre-configured academic Demo Dataset.
        </p>
      </div>

      {/* Notifications */}
      {message && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Upload Dropzone */}
        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-8 text-center space-y-4 hover:border-blue-500 transition">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Upload className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Upload Custom Stock Dataset</h3>
            <p className="text-xs text-slate-500 mt-1">
              CSV file containing Date, Stock/Symbol, and Close price columns.
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Select CSV File</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={loading} />
          </label>
        </div>

        {/* Demo Dataset Loader */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <RefreshCw className={`h-7 w-7 ${loading ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Demo Dataset – For Demonstration Only</h3>
            <p className="text-xs text-slate-500 mt-1">
              2,057 daily records across 17 stocks and 8 sectors (Period: 21-Dec-2025 to 21-Jun-2026).
            </p>
          </div>

          <button
            onClick={handleLoadDemo}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-amber-500/20 hover:bg-amber-400 transition"
          >
            <span>Load Demo Dataset</span>
          </button>
        </div>
      </div>

      {/* Data Quality Report Card */}
      {summary && <DataQualityCard summary={summary} />}

      {/* Cleaning Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-xs text-slate-500">
          <b>Pipeline steps:</b> Whitespace trimming → Date parsing → Duplicate removal → Missing value drop → Chronological sorting
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCleanData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Clean Data</span>
          </button>

          <button
            onClick={() => setActivePage('risk')}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-500/20 transition"
          >
            <span>Continue to Analysis</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
