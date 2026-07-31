import { useQoEStore } from "../../../store/useQoEStore";

export class QoECalculator {
  constructor(store = useQoEStore) {
    this.store = store;

    this.startPlayTime = performance.now();
    this.lastSwitchTime = performance.now();
    this.records = [];
    this.totalStallTime = 0;
    this.stallStartTime = null;
    this.hasStartedPlayback = false;
    this.switchCount = 0;
    this.bitrateHistory = [];
    this.currentBitrate = 0;

    // Menghubungkan listener tombol CSV jika DOM_IDS tersedia
    if (typeof DOM_IDS !== "undefined") {
      const downloadBtn = document.getElementById(DOM_IDS.downloadBtn);
      if (downloadBtn) {
        downloadBtn.addEventListener("click", () => this.exportToCSV());
      }
    }

    // Panggil sync pertama kali untuk set initial state
    this.syncToStore();
  }

  // Synchronize internal stats ke Zustand Store
  syncToStore() {
    if (this.store) {
      const stats = this.getStats();
      const qoeScore = this.calculateQoE(stats);

      this.store.setState({
        qoeStats: {
          qoeScore,
          avgBitrate: Number((stats.avgBitrate / 1e6).toFixed(2)),
          rebuffRatio: Number(stats.rebuffRatio.toFixed(2)),
          switchFreq: Number(stats.switchFreq.toFixed(2)),
          totalTime: Number(stats.totalTime.toFixed(1)),
          effectiveStallTime: Number(stats.effectiveStallTime.toFixed(1)),
          switchCount: this.switchCount,
          currentBitrate: this.currentBitrate,
        },
      });
    }
  }

  // Method manual update (bisa dipanggil periodik via setInterval/tick)
  updateQoE() {
    this.syncToStore();
  }

  getStats() {
    const now = performance.now();
    const totalTime = (now - this.startPlayTime) / 1000;

    let currentStallSession = 0;
    if (this.stallStartTime) {
      currentStallSession = (now - this.stallStartTime) / 1000;
    }
    const effectiveStallTime = this.totalStallTime + currentStallSession;

    let totalWeightedBitrate = 0;
    this.bitrateHistory.forEach((item) => {
      totalWeightedBitrate += item.bitrate * item.duration;
    });

    totalWeightedBitrate +=
      (this.currentBitrate * (now - this.lastSwitchTime)) / 1000;
    const avgBitrate = totalTime > 0 ? totalWeightedBitrate / totalTime : 0;

    const rebuffRatio =
      totalTime + effectiveStallTime > 0
        ? (effectiveStallTime / (totalTime + effectiveStallTime)) * 100
        : 0;
    const switchFreq = totalTime > 0 ? this.switchCount / (totalTime / 60) : 0;
    return {
      avgBitrate,
      rebuffRatio,
      switchFreq,
      totalTime,
      effectiveStallTime,
    };
  }

  calculateQoE(stats) {
    const { avgBitrate, rebuffRatio, switchFreq } = stats;
    // Standar rumus QoE linear sederhana
    const rawScore = avgBitrate / 1e6 - rebuffRatio * 0.5 - switchFreq * 0.1;
    return rawScore.toFixed(2);
  }

  recordSwitch(newBitrate) {
    const now = performance.now();
    const duration = (now - this.lastSwitchTime) / 1000;
    if (this.currentBitrate > 0) {
      this.bitrateHistory.push({ bitrate: this.currentBitrate, duration });
      this.switchCount++;
    }
    this.currentBitrate = newBitrate;
    this.lastSwitchTime = now;

    // Sync ke Zustand
    this.syncToStore();
  }

  recordStallStart() {
    this.stallStartTime = performance.now();
    // Sync ke Zustand
    this.syncToStore();
  }

  recordStallEnd() {
    if (this.stallStartTime) {
      const stallDuration = (performance.now() - this.stallStartTime) / 1000;
      this.totalStallTime += stallDuration;
      this.stallStartTime = null;
    }
    // Sync ke Zustand
    this.syncToStore();
  }

  reset() {
    this.startPlayTime = performance.now();
    this.lastSwitchTime = performance.now();
    this.totalStallTime = 0;
    this.stallStartTime = null;
    this.switchCount = 0;
    this.bitrateHistory = [];
    this.currentBitrate = 0;
    this.hasStartedPlayback = false;
    this.records = [];

    // Sync reset ke Zustand
    this.syncToStore();
  }
}
