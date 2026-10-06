import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function DisclaimerFooter() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 uppercase tracking-wider">
            Important Academic & Educational Disclaimer
          </p>
          <p>
            Educational project only. The analysis is based on historical data and statistical estimates and does not constitute financial or investment advice. Past performance does not guarantee future results.
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Developed for <b>CS5403 – Machine Learning</b> PBL Project Review | Team: Deepika R & Dharshana M | Mentor: Dr. Shanmuga Sundaram (Dept. of B.Tech AI & DS).
          </p>
        </div>
      </div>
    </footer>
  );
}
