import { useNetworkStore } from "../../../store/useNetworkStore";
export default function NetworkStateTerminal() {
  const stats = useNetworkStore((state) => state.networkState);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-lg border border-slate-800 bg-slate-950 font-mono text-xs shadow-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-semibold tracking-wider text-slate-300 uppercase text-[11px]">
            Current Network State
          </span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="p-3 rounded bg-slate-900/60 border border-slate-800/80">
          <span className="text-slate-500 text-[10px] uppercase block mb-1">
            Throughput
          </span>
          <div className="text-lg font-bold text-slate-100">
            {stats.throughput}{" "}
            <span className="text-xs font-normal text-slate-400">Mbps</span>
          </div>
        </div>

        <div className="p-3 rounded bg-slate-900/60 border border-slate-800/80">
          <span className="text-slate-500 text-[10px] uppercase block mb-1">
            Buffer
          </span>
          <div className="text-lg font-bold text-slate-100">
            {stats.buffer}{" "}
            <span className="text-xs font-normal text-slate-400">sec</span>
          </div>
        </div>
      </div>

      {/* Buckets Status */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-slate-400">
        <div className="flex items-center justify-between p-2 rounded bg-slate-900/30 border border-slate-800/50">
          <span>Buffer Bucket:</span>
          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-bold border border-blue-800/60 text-[11px]">
            {stats.bufferBucket}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 rounded bg-slate-900/30 border border-slate-800/50">
          <span>Throughput Bucket:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800/60 text-[11px]">
            {stats.tpBucket}
          </span>
        </div>
      </div>

      {/* NDN Memo Key Section */}
      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 mb-4 flex items-center justify-between">
        <span className="text-slate-500 text-[11px]">Memo Key:</span>
        <code className="text-amber-400 font-semibold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50 text-[11px]">
          {stats.memoKey}
        </code>
      </div>

      {/* Final Decision Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center">
        <span className="text-slate-400 uppercase text-[10px] tracking-wider">
          Current Decision
        </span>
        <span className="text-base font-bold text-indigo-400 bg-indigo-950/50 px-3 py-1 rounded border border-indigo-800/60">
          {stats.resolution}
        </span>
      </div>
    </div>
  );
}
