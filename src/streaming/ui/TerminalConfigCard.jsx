import React from "react";

export default function TerminalConfigCard() {
  return (
    <div className="w-full max-w-xl mx-auto rounded-lg border border-slate-800 bg-slate-950 font-mono text-xs shadow-xl overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/60 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold tracking-wider text-slate-300 uppercase text-[11px]">
            Experiment Configuration
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] border border-slate-700">
          Run: <strong className="text-slate-200">EXP001</strong>
        </span>
      </div>

      {/* Main Content Grid */}
      <div className="p-4 grid grid-cols-3 gap-4 text-slate-400">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-slate-500 mb-1">ABR</span>
          <span className="font-medium text-slate-200 text-sm">NDN-RL</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-slate-500 mb-1">
            Scenario
          </span>
          <span className="font-medium text-slate-200 text-sm">
            Fluctuating
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-slate-500 mb-1">
            Memo Status
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            ON
          </span>
        </div>
      </div>
    </div>
  );
}
