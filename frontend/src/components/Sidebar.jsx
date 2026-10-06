import React from 'react';
import { 
  Home, 
  Database, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Grid, 
  CheckCircle2, 
  BookOpen 
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage }) {
  const pages = [
    { id: 'home', label: 'Home', icon: Home, desc: 'Project Overview' },
    { id: 'dataset', label: 'Dataset', icon: Database, desc: 'Upload & Data Quality' },
    { id: 'risk', label: 'Risk Analysis', icon: TrendingUp, desc: 'Stock Drilldown & Metrics' },
    { id: 'portfolio', label: 'Portfolio Analysis', icon: PieChart, desc: 'Equal-Weighted Portfolio' },
    { id: 'comparison', label: 'Comparison', icon: BarChart3, desc: 'Cross-Stock Ranking' },
    { id: 'correlation', label: 'Correlation', icon: Grid, desc: 'Heatmap & Diversification' },
    { id: 'results', label: 'Results & Summary', icon: CheckCircle2, desc: 'PBL Executive Summary' },
    { id: 'methodology', label: 'Methodology', icon: BookOpen, desc: 'Formulas & Math Pipeline' },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Navigation Dashboard
        </div>
        {pages.map((p) => {
          const Icon = p.icon;
          const isActive = activePage === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePage(p.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left font-medium text-sm transition-all duration-150 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <div>
                <div className="leading-tight">{p.label}</div>
                <div className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                  {p.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer info */}
      <div className="p-4 m-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
        <div className="font-semibold text-slate-700">CS5403 – Machine Learning</div>
        <div>Department of AI & DS</div>
        <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200 mt-1">
          B.Tech PBL Review 2026
        </div>
      </div>
    </aside>
  );
}
