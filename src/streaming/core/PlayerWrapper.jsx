import { useState } from "react";
import ShakaPlayerComponent from "./player-instance";
export default function PlayerWrapper() {
  const [src, setSrc] = useState("ndn:/test/china-university/playlist.mpd");
  const [abrAlgo, setAbrAlgo] = useState("ndn-rl");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleReset = () => {
    setSrc("");
    setIsPlaying(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 font-mono text-xs">
      {/* Panel Konfigurasi Player */}
      <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`}
            />
            <span className="font-semibold tracking-wider text-slate-300 uppercase text-[11px]">
              Player Instance Configuration
            </span>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              isPlaying
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            {isPlaying ? "PLAYER ACTIVE" : "IDLE"}
          </span>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* Source Input */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-slate-400 font-medium block text-[11px]">
              Media Source URI (NDN Path)
            </label>
            <input
              type="text"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              placeholder="ndn:/..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-xs transition-colors"
            />
          </div>

          {/* ABR Algorithm Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-medium block text-[11px]">
              ABR Algorithm
            </label>
            <select
              value={abrAlgo}
              onChange={(e) => setAbrAlgo(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-xs transition-colors cursor-pointer"
            >
              <option value="ndn-rl">NDN-RL</option>
              <option value="throughput">Throughput Based</option>
              <option value="bba">BBA (Buffer-Based)</option>
            </select>
          </div>
        </div>

        {/* Controls / Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-900">
          <span className="text-slate-500 text-[10px]">
            {src ? "Ready to initialize ShakaInstance" : "Source is empty"}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 hover:text-slate-200 transition-colors"
            >
              Reset / Hapus Config
            </button>

            <button
              onClick={() => setIsPlaying(true)}
              disabled={isPlaying || !src}
              className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors border border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span>▶</span> Play Stream
            </button>
          </div>
        </div>
      </div>

      {/* Player Section - Hanya Muncul jika ada src dan isPlaying = true */}
      {src && isPlaying && <ShakaPlayerComponent src={src} abrAlgo={abrAlgo} />}
    </div>
  );
}
