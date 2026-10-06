import React, { useState } from 'react';
import { Search, Download, ArrowUpDown, Filter } from 'lucide-react';

export default function StockTable({ data = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [sortField, setSortField] = useState('annualized_volatility_pct');
  const [sortAsc, setSortAsc] = useState(false);

  const sectors = ['ALL', ...Array.from(new Set(data.map(item => item.sector)))];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // Default descending for risk/return sorting
    }
  };

  const filteredData = data.filter(item => {
    const matchesSearch = item.stock.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'ALL' || item.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  const downloadCSV = () => {
    const headers = ['Stock', 'Sector', 'Annualized Volatility (%)', 'VaR 99% (%)', 'Sharpe Ratio', 'Beta', 'Classification'];
    const rows = sortedData.map(d => [
      d.stock,
      d.sector,
      d.annualized_volatility_pct,
      d.parametric_var_99_pct,
      d.sharpe_ratio,
      d.beta,
      `"${d.risk_classification}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Stock_Risk_Analysis_Metrics.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getRiskBadge = (classification) => {
    if (classification === 'Low Volatility') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (classification === 'Moderate Volatility') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stock or sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {sectors.map(sec => (
                <option key={sec} value={sec}>{sec === 'ALL' ? 'All Sectors' : sec}</option>
              ))}
            </select>
          </div>

          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('stock')}>
                <div className="flex items-center gap-1.5">Stock <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('sector')}>
                <div className="flex items-center gap-1.5">Sector <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-slate-100 text-right" onClick={() => handleSort('annualized_volatility_pct')}>
                <div className="flex items-center justify-end gap-1.5">Ann. Volatility <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-slate-100 text-right" onClick={() => handleSort('parametric_var_99_pct')}>
                <div className="flex items-center justify-end gap-1.5">99% 1-Day VaR <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-slate-100 text-right" onClick={() => handleSort('sharpe_ratio')}>
                <div className="flex items-center justify-end gap-1.5">Sharpe Ratio <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-slate-100 text-right" onClick={() => handleSort('beta')}>
                <div className="flex items-center justify-end gap-1.5">Beta <ArrowUpDown className="h-3 w-3" /></div>
              </th>
              <th className="px-4 py-3 text-center">Risk Classification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-slate-400">
                  No stocks match the search criteria.
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr key={row.stock} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3 font-bold text-slate-900">{row.stock}</td>
                  <td className="px-4 py-3 text-slate-500">{row.sector}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">{row.annualized_volatility_pct.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-right font-semibold text-amber-700">{row.parametric_var_99_pct.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-700">{row.sharpe_ratio.toFixed(3)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-700">{row.beta.toFixed(3)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${getRiskBadge(row.risk_classification)}`}>
                      {row.risk_classification}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-slate-400 text-right">
        Showing {sortedData.length} of {data.length} stocks
      </div>
    </div>
  );
}
