import { create } from "zustand";

// Instansiasi calculator dengan memasukkan store
export const useMemoStore = create((set) => ({
  stats: {
    hits: 0,
    misses: 0,
    total: 0,
    history: [],
    hitRatio: 0,
    missRatio: 0,
  },
  setStats: (newStats) => set({ stats: newStats }),
}));

// Single instance dengan DI ke store
