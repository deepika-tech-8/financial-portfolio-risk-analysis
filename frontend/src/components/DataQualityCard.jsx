import React from 'react';
import { CheckCircle, AlertTriangle, Calendar, Hash, Building2, Copy } from 'lucide-react';

export default function DataQualityCard({ summary }) {
  if (!summary) return None;

  const {
    total_rows = 0,
    valid_records = 0,
    total_stocks = 0,
    sectors = [],
    date_range = { start: 'N/A', end: 'N/A' },
    duplicate_rows = 0,
    missing_values = 0
  } = summary;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
          <h3 className="text-base font-bold text-slate-900">Data Quality & Validation Summary</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Cleaned & Verified
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Hash className="h-3.5 w-3.5 text-slate-400" /> Total Rows
          </div>
          <div className="text-lg font-bold text-slate-900">{total_rows.toLocaleString()}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Valid Records
          </div>
          <div className="text-lg font-bold text-emerald-900">{valid_records.toLocaleString()}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-blue-700 font-medium">
            <Building2 className="h-3.5 w-3.5 text-blue-600" /> Total Stocks
          </div>
          <div className="text-lg font-bold text-blue-900">{total_stocks} ({sectors.length} sectors)</div>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-purple-700 font-medium">
            <Calendar className="h-3.5 w-3.5 text-purple-600" /> Date Range
          </div>
          <div className="text-xs font-bold text-purple-900 truncate">
            {date_range.start} to {date_range.end}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium">
            <Copy className="h-3.5 w-3.5 text-amber-600" /> Duplicates
          </div>
          <div className="text-lg font-bold text-amber-900">{duplicate_rows}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <AlertTriangle className="h-3.5 w-3.5 text-slate-400" /> Missing Values
          </div>
          <div className="text-lg font-bold text-slate-900">{missing_values}</div>
        </div>
      </div>
    </div>
  );
}
