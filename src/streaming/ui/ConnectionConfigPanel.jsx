import React, { useState } from "react";
import connect from "@/lib/ndn/ConnectionNDN";
import { useConnectionStore } from "@/store/useConnectionStore";
export default function ConnectionConfigPanel() {
  const ipBridge = useConnectionStore((state) => state.ipBridge);
  const wsRouter = useConnectionStore((state) => state.wsRouter);
  const isBridgeConnected = useConnectionStore(
    (state) => state.isBridgeConnected,
  );
  const isWsConnected = useConnectionStore((state) => state.isWsConnected);
  const isTesting = useConnectionStore((state) => state.isTesting);

  const setIpBridge = useConnectionStore((state) => state.setIpBridge);
  const setWsRouter = useConnectionStore((state) => state.setWsRouter);
  const setIsBridgeConnected = useConnectionStore(
    (state) => state.setIsBridgeConnected,
  );
  const setIsWsConnected = useConnectionStore(
    (state) => state.setIsWsConnected,
  );
  const setIsTesting = useConnectionStore((state) => state.setIsTesting);

  const isConnected = isBridgeConnected && isWsConnected;

  const handleConnection = async (e) => {
    e.preventDefault();
    if (isConnected) {
      setIsBridgeConnected(false);
      setIsWsConnected(false);
      setIsTesting(false);
      return;
    }

    setIsTesting(true);
    setIsBridgeConnected(false);
    setIsWsConnected(false);
    console.log("noos");

    try {
      await connect(wsRouter);
      console.log("yeey");
      setIsWsConnected(true);

      const bridgeSocket = new WebSocket(ipBridge);

      bridgeSocket.onopen = () => {
        setIsBridgeConnected(true);
        setIsTesting(false);
      };

      bridgeSocket.onerror = (err) => {
        console.error("[ABR-NDN] ❌ WebSocket Error:", err);
        setIsBridgeConnected(false);
        setIsWsConnected(false);
        setIsTesting(false);
      };
    } catch (error) {
      setIsBridgeConnected(false);
      setIsWsConnected(false);
      setIsTesting(false);
      console.error("[ABR-NDN] ❌ Connection Error:", error.message || error);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-3 rounded-lg border border-slate-800 bg-slate-950 font-mono text-xs shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
          />
          <span className="font-semibold tracking-wider text-slate-300 uppercase text-[11px]">
            Node Connection Setup
          </span>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] border ${
            isConnected
              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
              : "bg-amber-950/60 text-amber-400 border-amber-800"
          }`}
        >
          {isConnected ? "CONNECTED" : "DISCONNECTED"}
        </span>
      </div>

      <form
        onSubmit={handleConnection}
        className="p-4 space-y-4 text-slate-300"
      >
        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-400 font-medium flex justify-between">
            <span>WebSocket Bridge URL</span>
            <span className="text-slate-500 text-[10px]">ws:// or wss://</span>
          </label>
          <input
            type="text"
            value={ipBridge}
            onChange={(e) => setIpBridge(e.target.value)}
            placeholder="ws://192.168.1.100:5152/ws"
            className="w-full bg-slate-900/90 border border-slate-800 rounded px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-xs transition-colors"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-400 font-medium flex justify-between">
            <span>WebSocket Router URL</span>
            <span className="text-slate-500 text-[10px]">ws:// or wss://</span>
          </label>
          <input
            type="text"
            value={wsRouter}
            onChange={(e) => setWsRouter(e.target.value)}
            placeholder="ws://localhost:8080/ndn-router"
            className="w-full bg-slate-900/90 border border-slate-800 rounded px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-xs transition-colors"
            required
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-900">
          <button
            type="button"
            onClick={() => {
              setIpBridge("");
              setWsRouter("");
              setIsBridgeConnected(false);
              setIsWsConnected(false);
              setIsTesting(false);
            }}
            className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 transition-colors"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={isTesting}
            className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors flex items-center gap-2 border border-indigo-500 disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </>
            ) : isConnected ? (
              "Disconnect"
            ) : (
              "Connect Router"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
