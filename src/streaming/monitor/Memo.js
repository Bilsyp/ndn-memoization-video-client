import { useMemoStore } from "../../../store/useMemoStore";

export class MemoCalculator {
  constructor(store = useMemoStore) {
    this.store = store;
    this.reset();
  }

  // Sync kalkulasi ke Zustand Store
  syncToStore() {
    if (this.store) {
      this.store.getState().setStats({ ...this.stats, history: this.history });
    }
  }

  recordResult(isHit) {
    // Add to history array
    this.history.push({
      timestamp: Date.now(),
      result: isHit ? "hit" : "miss",
    });

    if (isHit) {
      this.hits++;
    } else {
      this.misses++;
    }
    this.updateStats = this.calculate;
    this.syncToStore(); // Otomatis sync ke Zustand

    return this.updateStats();
  }

  calculate() {
    const total = this.hits + this.misses;

    const hitRatio =
      total === 0 ? 0 : Number(((this.hits / total) * 100).toFixed(1));

    const missRatio =
      total === 0 ? 0 : Number(((this.misses / total) * 100).toFixed(1));

    this.stats = {
      hits: this.hits,
      misses: this.misses,
      total,
      hitRatio,
      missRatio,
      history: this.history, // Include history in stats
    };

    return this.stats;
  }

  getStats() {
    return { ...this.stats };
  }

  reset() {
    this.hits = 0;
    this.misses = 0;
    this.history = []; // Initialize history as empty array

    this.stats = {
      hits: 0,
      misses: 0,
      total: 0,
      hitRatio: 0,
      missRatio: 0,
      history: [], // Include empty history in initial stats
    };
    this.syncToStore();
    return this.stats;
  }
}

export const memoCalculator = new MemoCalculator(useMemoStore);
