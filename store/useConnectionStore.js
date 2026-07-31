import { create } from "zustand";

export const useConnectionStore = create((set) => ({
  // State Awal
  ipBridge: "ws://192.168.1.22:5152/ws",
  wsRouter: "ws://192.168.1.24:9696/ws",

  isBridgeConnected: false,
  isWsConnected: false,
  isTesting: false,

  // Actions Direct Update
  setIpBridge: (ipBridge) => set({ ipBridge }),
  setWsRouter: (wsRouter) => set({ wsRouter }),
  setIsBridgeConnected: (isBridgeConnected) => set({ isBridgeConnected }),
  setIsWsConnected: (isWsConnected) => set({ isWsConnected }),
  setIsTesting: (isTesting) => set({ isTesting }),

  // Action Reset
  resetConnection: () =>
    set({
      ipBridge: "192.168.1.22:5152",
      wsRouter: "ws://192.168.1.24:9696/ws",
      isBridgeConnected: false,
      isWsConnected: false,
      isTesting: false,
    }),
}));
