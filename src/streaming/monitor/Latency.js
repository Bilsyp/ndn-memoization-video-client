import { useLatencyStore } from "../../../store/useLatencyStore";

export class LatencyCalculator {
  constructor(store = useLatencyStore) {
    this.store = store;
    this.reset();
  }

  // Sync kalkulasi ke Zustand Store
  _syncToStore() {
    if (this.store) {
      this.store.getState().setStats({ ...this.stats });
    }
  }

  addSample(type, duration) {
    if (!this.latencyMap[type]) {
      this.latencyMap[type] = [];
    }

    this.latencyMap[type].push(duration);
    const updatedStats = this.calculate();

    // Auto-update ke Zustand Store
    this._syncToStore();

    return updatedStats;
  }

  calculate() {
    const avg = (arr) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const ndnAvg = avg(this.latencyMap.NDN).toFixed(2);
    const aiAvg = avg(this.latencyMap.AI).toFixed(2);

    const saving =
      ndnAvg > 0 && aiAvg > 0 ? ((aiAvg - ndnAvg) / aiAvg) * 100 : 0;

    this.stats = {
      avgNDN: ndnAvg,
      avgAI: aiAvg,
      rawSamples: {
        NDN: [...this.latencyMap.NDN],
        AI: [...this.latencyMap.AI],
      },
      saving,
      countNDN: this.latencyMap.NDN.length,
      countAI: this.latencyMap.AI.length,
      ndnPercentage: this.toPercentage(ndnAvg),
      aiPercentage: this.toPercentage(aiAvg),
      savingPercentage: Math.min(Math.max(saving, 0), 100),
    };

    return this.stats;
  }

  toPercentage(value, maxValue = 500) {
    return Math.min(Math.max((value / maxValue) * 100, 0), 100);
  }

  getStats() {
    return { ...this.stats };
  }

  reset() {
    this.latencyMap = {
      NDN: [],
      AI: [],
    };

    this.stats = {
      avgNDN: 0,
      avgAI: 0,
      saving: 0,
      countNDN: 0,
      countAI: 0,
      ndnPercentage: 0,
      aiPercentage: 0,
      rawSamples: {
        NDN: [],
        AI: [],
      },
      savingPercentage: 0,
    };

    // Auto-update ke Zustand Store saat di-reset
    this._syncToStore();

    return this.stats;
  }
}

// Instance singleton yang siap dipakai di mana saja
export const latencyCalculator = new LatencyCalculator(useLatencyStore);
