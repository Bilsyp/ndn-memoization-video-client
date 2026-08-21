import EWMA from "./Ewma";
export default class BandwidthEstimator {
  constructor() {
    // dua EWMA dengan kecepatan "lupa" berbeda
    this.fast = new EWMA(2); // reaktif, cepat merespon perubahan
    this.slow = new EWMA(5); // stabil, tidak mudah terpengaruh spike

    this.bytesSampled = 0;
    this.minTotalBytes = 128e3; // butuh minimal 128KB sebelum estimasi dipercaya
    this.minBytes = 16e3; // abaikan download di bawah 16KB (terlalu kecil, latency dominan)
  }

  // Masukkan hasil download
  addSample(durationMs, numBytes) {
    // abaikan file terlalu kecil — waktunya didominasi latency bukan transfer
    if (numBytes < this.minBytes) return;

    const bandwidth = (8000 * numBytes) / durationMs; // konversi ke bps
    const weight = durationMs / 1000; // bobot = durasi dalam detik

    this.bytesSampled += numBytes;
    this.fast.addSample(weight, bandwidth);
    this.slow.addSample(weight, bandwidth);
  }

  // Ambil estimasi bandwidth saat ini
  getEstimate(defaultEstimate) {
    // belum cukup data → pakai default dulu
    if (this.bytesSampled < this.minTotalBytes) {
      return defaultEstimate;
    }

    // pakai nilai MINIMUM dari fast dan slow
    // efeknya: turun cepat (fast langsung detect), naik pelan (slow yang dominan)
    return Math.min(this.fast.getEstimate(), this.slow.getEstimate());
  }

  // Cek apakah estimasi sudah bisa dipercaya
  isReady() {
    return this.bytesSampled >= this.minTotalBytes;
  }
}
