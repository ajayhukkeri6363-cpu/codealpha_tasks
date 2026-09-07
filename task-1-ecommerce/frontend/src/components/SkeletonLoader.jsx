import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse flex flex-col">
      <div className="aspect-[4/3] bg-slate-200 w-full" />
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-4/5" />
        <div className="h-4 bg-slate-200 rounded w-3/5" />
        <div className="h-3 bg-slate-200 rounded w-1/4 mt-2" />
        <div className="pt-3 mt-auto flex items-center justify-between border-t border-slate-100">
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-8 bg-slate-200 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200" />
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="p-4 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div key={cIdx} className="h-4 bg-slate-200 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
