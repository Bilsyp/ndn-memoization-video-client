import React from "react";
import { useQoEStore } from "../../../store/useQoEStore";
export default function QoEMonitorTerminal() {
  // Dummy data untuk grafik riwayat bitrate

  const stats = useQoEStore((state) => state.qoeStats);
  return (
    <div className="w-full max-w-2xl mx-auto rounded-lg border border-slate-800 bg-slate-950 font-mono text-xs shadow-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="font-semibold tracking-wider text-slate-300 uppercase text-[11px]">
            QoE Monitor
          </span>
        </div>
        <span className="text-[10px] text-slate-500">LIVE FEED</span>
      </div>

      {/* 4 Grid Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80">
          <span className="text-slate-500 text-[10px] uppercase block">
            Avg Bitrate
          </span>
          <span className="text-sm font-bold text-slate-100 mt-1 block">
            {stats.avgBitrate}{" "}
            <span className="text-[10px] font-normal text-slate-400">Mbps</span>
          </span>
        </div>

        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80">
          <span className="text-slate-500 text-[10px] uppercase block">
            Rebuffering
          </span>
          <span className="text-sm font-bold text-emerald-400 mt-1 block">
            {stats.rebuffRatio} sec
          </span>
        </div>

        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80">
          <span className="text-slate-500 text-[10px] uppercase block">
            Switch Freq
          </span>
          <span className="text-sm font-bold text-slate-100 mt-1 block">
            {stats.switchFreq}
          </span>
        </div>

        <div className="p-2.5 rounded bg-indigo-950/40 border border-indigo-800/50">
          <span className="text-indigo-400 text-[10px] uppercase block font-medium">
            QoE Score
          </span>
          <span className="text-sm font-bold text-indigo-300 mt-1 block">
            {stats.qoeScore}
          </span>
        </div>
      </div>
    </div>
  );
}
