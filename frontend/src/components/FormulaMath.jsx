import React from 'react';

export default function FormulaMath({ title, formula, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
      <h4 className="text-sm font-bold text-slate-900">{title}</h4>
      <div className="p-3 rounded-xl bg-slate-900 text-blue-300 font-mono text-xs overflow-x-auto shadow-inner">
        {formula}
      </div>
      {description && (
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
