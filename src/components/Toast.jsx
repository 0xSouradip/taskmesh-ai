'use client';

import React from 'react';
import { useApp } from './AppProvider';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';
  const isError = toastMessage.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-start gap-3 text-left ${
          isSuccess
            ? 'bg-slate-900/95 border-emerald-500/40 shadow-emerald-500/10'
            : isError
            ? 'bg-slate-900/95 border-red-500/40 shadow-red-500/10'
            : 'bg-slate-900/95 border-indigo-500/40 shadow-indigo-500/10'
        }`}
      >
        <div className="flex-shrink-0 mt-0.5">
          {isSuccess ? (
            <Sparkles className="w-5 h-5 text-emerald-400" />
          ) : isError ? (
            <AlertCircle className="w-5 h-5 text-red-400" />
          ) : (
            <Info className="w-5 h-5 text-indigo-400" />
          )}
        </div>

        <div className="flex-1">
          <h4 className="text-xs font-bold text-white mb-0.5">
            {toastMessage.title}
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {toastMessage.message}
          </p>
        </div>
      </div>
    </div>
  );
}
