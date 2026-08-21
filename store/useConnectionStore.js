import { create } from "zustand";

export const useConnectionStore = create((set) => ({
  // State Awal
  ipBridge: "ws://10.10.10.5:5152/ws",
  wsRouter: "ws://10.10.10.1:9696/ws",

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
      ipBridge: "192.168.1.15:5152",
      wsRouter: "ws://192.168.1.24:9696/ws",
      isBridgeConnected: false,
      isWsConnected: false,
      isTesting: false,
    }),
}));
