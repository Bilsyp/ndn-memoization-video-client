import React from "react";
import Papa from "papaparse";
import { useLatencyStore } from "../../../store/useLatencyStore";
import { useMemoStore } from "../../../store/useMemoStore";

export default function MetricsWidget() {
  const latencyStats = useLatencyStore((state) => state.stats);
  const memoStats = useMemoStore((state) => state.stats);

  const history = Array.isArray(memoStats?.history) ? memoStats.history : [];

  const handleDownloadCsv = () => {
    const csv = Papa.unparse(history, {
      header: true,
      delimiter: ",",
      newline: "\r\n",
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "memo-history.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl my-5 mx-auto bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg text-xs font-mono">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {/* Left Section: Memo Stats */}
        <div className="pr-0 md:pr-2 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-indigo-400 font-bold uppercase">
              NDN Memo Stats
            </span>

            <button
              onClick={handleDownloadCsv}
              disabled={history.length === 0}
              className="px-2.5 py-1 rounded bg-emerald-600/80 text-[10px] font-bold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export CSV
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div className="p-2 bg-slate-950/60 rounded border border-slate-800/80">
              <div className="text-slate-500 text-[10px]">HITS / MISSES</div>
              <div className="text-sm font-bold text-slate-100 mt-0.5">
                {memoStats.hits}{" "}
                <span className="text-xs text-slate-500 font-normal">
                  / {memoStats.misses}
                </span>
              </div>
            </div>
            <div className="p-2 bg-slate-950/60 rounded border border-slate-800/80">
              <div className="text-slate-500 text-[10px]">RL / REUSED</div>
              <div className="text-sm font-bold text-slate-100 mt-0.5">
                {memoStats.misses}{" "}
                <span className="text-xs text-slate-500 font-normal">
                  / {memoStats.hits}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Latency Monitor */}
        <div className="pt-4 md:pt-0 md:pl-6 space-y-2.5">
          <span className="text-emerald-400 font-bold uppercase block mb-1">
            Latency Monitor
          </span>

          <div className="flex justify-between items-center text-slate-400">
            <span>Memo Hit (avg):</span>
            <span className="text-slate-200">{latencyStats.avgNDN} ms</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>RL Inference (avg):</span>
            <span className="text-slate-200">{latencyStats.avgAI} ms</span>
          </div>

          <div className="flex justify-between items-center font-bold text-emerald-400 border-t border-slate-800/80 pt-2">
            <span>NDN Saving:</span>
            <span>{latencyStats.saving}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
