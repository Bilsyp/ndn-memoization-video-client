import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import { useLatencyStore } from "../../../store/useLatencyStore";

export default function RealtimeLatencyLog() {
  const [activeTab, setActiveTab] = useState("AI");
  const logRef = useRef(null);

  const rawSamples = useLatencyStore((stats) => stats?.stats?.rawSamples ?? {});
  const ndn = Array.isArray(rawSamples?.NDN) ? rawSamples.NDN : [];
  const ai = Array.isArray(rawSamples?.AI) ? rawSamples.AI : [];
  const currentData = activeTab === "AI" ? ai : ndn;
  const latestValue =
    currentData.length > 0 ? Number(currentData[currentData.length - 1]) : 0;

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [currentData.length]);

  const handleDownloadCsv = () => {
    const rows = [
      ...ai.map((value) => ({
        type: "AI",
        "latency (ms)": Number(value),
      })),
      ...ndn.map((value) => ({
        type: "NDN",
        "latency (ms)": Number(value),
      })),
    ].filter((row) => Number.isFinite(row["latency (ms)"]));

    if (rows.length === 0) return;

    const csv = Papa.unparse(rows, {
      header: true,
      delimiter: ",",
      newline: "\r\n",
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "latency-raw-data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs my-3 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 pt-3 bg-slate-900 border-b border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("AI")}
            className={`px-3 py-1.5 rounded-t-lg font-bold border-t border-x text-[11px] transition-colors ${
              activeTab === "AI"
                ? "bg-slate-950 text-indigo-400 border-indigo-800"
                : "bg-slate-900/50 text-slate-500 border-transparent hover:text-slate-300"
            }`}
          >
            AI View [{ai.length}]
          </button>

          <button
            onClick={() => setActiveTab("NDN")}
            className={`px-3 py-1.5 rounded-t-lg font-bold border-t border-x text-[11px] transition-colors ${
              activeTab === "NDN"
                ? "bg-slate-950 text-cyan-400 border-cyan-800"
                : "bg-slate-900/50 text-slate-500 border-transparent hover:text-slate-300"
            }`}
          >
            NDN View [{ndn.length}]
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            disabled={ai.length === 0 && ndn.length === 0}
            className="px-2.5 py-1 rounded bg-emerald-600/80 text-[10px] font-bold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>

          <span className="text-[10px] text-slate-500 pb-1.5">
            Latest:{" "}
            <strong className="text-slate-200">
              {latestValue.toFixed(2)} ms
            </strong>
          </span>
        </div>
      </div>

      <div
        ref={logRef}
        className="h-64 overflow-y-auto p-3 space-y-1 bg-slate-950 scrollbar-thin scrollbar-thumb-slate-800"
      >
        {currentData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 text-[11px]">
            Waiting for latency data...
          </div>
        ) : (
          currentData.map((val, idx) => (
            <div
              key={idx}
              className={`flex justify-between items-center px-3 py-1 rounded text-[11px] font-mono border ${
                activeTab === "AI"
                  ? "bg-indigo-950/20 border-indigo-900/30 text-indigo-300"
                  : "bg-cyan-950/20 border-cyan-900/30 text-cyan-300"
              }`}
            >
              <span className="text-slate-600 font-mono text-[10px]">
                Index [{idx}]
              </span>
              <span className="font-bold">{Number(val).toFixed(2)} ms</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
