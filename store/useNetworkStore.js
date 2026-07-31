import { create } from "zustand";

export const useNetworkStore = create((set) => ({
  networkState: {
    throughput: 0,
    buffer: 0,
    bufferBucket: "SAFE",
    tpBucket: "GOOD",
    memoKey: "/ndn/memo/safe/good",
    resolution: "",
  },
  setStats: (newStats) => set({ stats: newStats }),
  // Actions
}));
