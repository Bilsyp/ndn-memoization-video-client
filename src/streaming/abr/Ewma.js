export default class EWMA {
  constructor(halfLife = 5) {
    // halfLife = seberapa cepat data lama "dilupakan"
    // makin kecil = makin cepat lupa data lama (reaktif)
    // makin besar = data lama masih berpengaruh (stabil)
    this.alpha = Math.exp(Math.log(0.5) / halfLife);
    this.estimate = 0;
    this.totalWeight = 0;
  }

  // Masukkan sample baru
  // weight = durasi download (detik), value = throughput (bps)
  addSample(weight, value) {
    const adjAlpha = Math.pow(this.alpha, weight);
    const newEstimate = value * (1 - adjAlpha) + adjAlpha * this.estimate;

    if (!isNaN(newEstimate)) {
      this.estimate = newEstimate;
      this.totalWeight += weight;
    }
  }

  // Ambil hasil estimasi saat ini
  getEstimate() {
    // zeroFactor untuk koreksi bias di awal (saat data masih sedikit)
    const zeroFactor = 1 - Math.pow(this.alpha, this.totalWeight);
    return this.estimate / zeroFactor;
  }
}
