import React, { useState } from 'react';
import { ShieldAlert, Database, Award, Layers, Share2, Check, Copy } from 'lucide-react';

export default function Navbar({ isDemo, qualitySummary, activePage, setActivePage }) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:5000';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            Financial Portfolio Risk Analysis
          </h1>
          <p className="text-xs font-medium text-slate-500">
            CS5403 – Machine Learning | Academic PBL Project
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Direct Classroom Review Share Link Button */}
        <button
          onClick={handleCopyLink}
          title="Click to copy direct classroom review URL"
          className="flex items-center gap-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 text-xs font-semibold border border-blue-200 transition shadow-sm"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5 text-blue-600" />}
          <span>{copied ? 'Link Copied!' : 'Classroom Share Link'}</span>
        </button>

        {/* Dataset Status Pill */}
        <div className={`hidden sm:flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
          isDemo ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          <Database className="h-3.5 w-3.5" />
          <span>{isDemo ? 'Demo Dataset' : 'Custom Dataset'}</span>
        </div>

        {/* Academic Team Badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs text-slate-700 border border-slate-200">
          <Award className="h-4 w-4 text-blue-600" />
          <span><b>Deepika R</b> & <b>Dharshana M</b> | Dr. Shanmuga Sundaram</span>
        </div>
      </div>
    </header>
  );
}
