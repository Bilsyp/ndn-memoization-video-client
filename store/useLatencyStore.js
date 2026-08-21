import { create } from "zustand";

export const useLatencyStore = create((set) => ({
  // Initial state stats
  stats: {
    avgNDN: 0,
    avgAI: 0,
    saving: 0,
    countNDN: 0,
    rawSamples: {
      NDN: [],
      AI: [],
    },
    countAI: 0,
    ndnPercentage: 0,
    aiPercentage: 0,
    savingPercentage: 0,
  },

  // Action untuk update stats ke store
  setStats: (newStats) => set({ stats: newStats }),
}));
