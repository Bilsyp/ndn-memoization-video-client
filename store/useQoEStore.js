import { create } from "zustand";
export const useQoEStore = create((set) => ({
  qoeStats: {
    qoeScore: "0.00",
    avgBitrate: 0,
    rebuffRatio: 0,
    switchFreq: 0,
    totalTime: 0,
    effectiveStallTime: 0,
    switchCount: 0,
    currentBitrate: 0,
  },
}));

// Singleton Instance dengan Inject Store
