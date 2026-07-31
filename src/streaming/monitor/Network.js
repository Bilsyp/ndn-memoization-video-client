import { useNetworkStore } from "../../../store/useNetworkStore";

export class NetworkStateMonitor {
  constructor(store = useNetworkStore) {
    this.store = store;
    this.reset();
  }

  // Sync state ke Zustand store
  syncToStore() {
    if (this.store) {
      this.store.setState({ networkState: { ...this.state } });
    }
  }

  // Method utama untuk merekam metrik jaringan & keputusan
  recordState({
    throughput = 0, // dalam Mbps (misal: 2.81)
    buffer = 0, // dalam detik (misal: 12.4)
    memoKey = "",
    LOW_BUFFER_THRESHOLD,
    BUFFER_SAFETY_LIMIT,
    resolution,
  }) {
    let bufferBucket = "safe";
    if (buffer <= LOW_BUFFER_THRESHOLD) bufferBucket = "panic";
    else if (buffer <= BUFFER_SAFETY_LIMIT) bufferBucket = "low";
    else if (buffer <= 25.0) bufferBucket = "safe";
    else bufferBucket = "abundant";

    let tpBucket = "good";
    if (throughput < 1.2) tpBucket = "critical";
    else if (throughput < 2.3) tpBucket = "fair";
    else if (throughput < 3.8) tpBucket = "good";
    else tpBucket = "excellent";

    this.state = {
      throughput,
      buffer,
      bufferBucket,
      tpBucket,
      memoKey,
      resolution,
    };
    // 4. Sync ke Zustand
    this.syncToStore();
    return this.state;
  }

  getState() {
    return { ...this.state };
  }

  reset() {
    this.state = {
      throughput: 0,
      buffer: 0,
      bufferBucket: "SAFE",
      throughputBucket: "GOOD",
      memoKey: "/ndn/memo/safe/good",
    };

    this.syncToStore();
    return this.state;
  }
}
export const Network = new NetworkStateMonitor(useNetworkStore);
