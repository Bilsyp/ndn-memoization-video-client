/**
 * Custom Buffer-Based ABR Manager for Shaka Player
 * Implementasi BBA dengan mekanisme Hysteresis (Interval 5 detik)
 */
export class BufferBasedManager {
  constructor() {
    /** @private {Array<!shaka.extern.Variant>} */
    this.variants_ = [];

    /** @private {HTMLMediaElement} */
    this.mediaElement_ = null;
    this.currentVariant_ = null;
    /** @private {boolean} */
    this.enabled_ = false;

    /** @private {?function(!shaka.extern.Variant)} */
    this.switch_ = null;

    /** @private {number} */
    this.lastTimeChosenMs_ = 0;

    /** @private {shaka.extern.AbrConfiguration} */
    this.config_ = null;

    // --- Konfigurasi Parameter BBA (Bisa disesuaikan untuk Riset) ---
    this.RESERVOIR_ = 5; // (detik) Jika di bawah ini, paksa bitrate terendah
    this.CUSHION_ = 15; // (detik) Area transisi kualitas
    this.SWITCH_INTERVAL_MS_ = 5000; // Hysteresis 5 detik
  }

  /** @override */
  init(switchCallback) {
    this.switch_ = switchCallback;
  }

  /** @override */
  configure(config) {
    this.config_ = config;
  }

  /** @override */
  setVariants(variants) {
    // Syarat BBA: Variant harus terurut berdasarkan bandwidth (rendah ke tinggi)
    this.variants_ = variants.sort((a, b) => a.bandwidth - b.bandwidth);
    return true;
  }

  /** @override */
  setMediaElement(mediaElement) {
    this.mediaElement_ = mediaElement;
  }

  /** @override */
  enable() {
    this.enabled_ = true;
  }

  /** @override */
  disable() {
    this.enabled_ = false;
  }

  /** @override */
  stop() {
    this.enabled_ = false;
    this.variants_ = [];
  }

  /** @override */
  release() {
    this.mediaElement_ = null;
    this.switch_ = null;
  }

  /**
   * Mengambil estimasi level buffer saat ini dalam detik.
   * @return {number}
   * @private
   */
  getBufferLevel_() {
    if (!this.mediaElement_) return 0;

    const buffered = this.mediaElement_.buffered;
    const currentTime = this.mediaElement_.currentTime;

    for (let i = 0; i < buffered.length; i++) {
      if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
        return buffered.end(i) - currentTime;
      }
    }
    return 0;
  }

  /** @override */
  chooseVariant() {
    if (this.variants_.length === 0) return null;
    console.log(this.variants_);
    const bufferLevel = this.getBufferLevel_();
    console.log(bufferLevel);
    // 1. Logic Reservoir (Panic Mode)
    if (bufferLevel <= this.RESERVOIR_) {
      return this.variants_[0];
    }

    // 2. Logic Top Level (Safe Mode)
    if (bufferLevel >= this.RESERVOIR_ + this.CUSHION_) {
      return this.variants_[this.variants_.length - 1];
    }

    // 3. Logic Cushion (Linear Mapping)
    const ratio = (bufferLevel - this.RESERVOIR_) / this.CUSHION_;
    const index = Math.floor(ratio * (this.variants_.length - 1));

    return this.variants_[index];
  }

  /**
   * Logika Interval (Hysteresis) agar tidak pindah-pindah terlalu sering
   * @param {boolean=} force
   * @private
   */
  suggestStreams_(force = false) {
    if (!this.enabled_ || !this.switch_) return;

    if (!force) {
      const now = Date.now();
      const delta = now - this.lastTimeChosenMs_;
      if (delta < this.SWITCH_INTERVAL_MS_) return;
    }

    const chosenVariant = this.chooseVariant();

    // EKSEKUSI PERPINDAHAN NYATA (Hanya jika variannya BERBEDA dari yang sekarang)
    if (chosenVariant && chosenVariant !== this.currentVariant_) {
      this.lastTimeChosenMs = Date.now();
      this.currentVariant_ = chosenVariant; // Simpan varian baru sebagai varian aktif
      this.switch_(chosenVariant);

      console.log(
        `[BBA] REAL SWITCH to bitrate: ${chosenVariant.bandwidth} bps | Buffer: ${this.getBufferLevel_().toFixed(2)}s`,
      );
    }
  }
  /** @override */
  segmentDownloaded(deltaTimeMs, numBytes, allowSwitch) {
    if (allowSwitch) {
      // Panggil suggestStreams secara real-time setiap kali segmen selesai didownload
      this.suggestStreams_(false);
    }
  }

  /** @override */
  trySuggestStreams() {
    this.suggestStreams_(false);
  }

  /** @override */
  getBandwidthEstimate() {
    // BBA murni tidak menggunakan estimasi bandwidth, mengembalikan 0 atau nilai statis
    return 0;
  }

  /** @override */
  playbackRateChanged(rate) {}

  /** @override */
  setCmsdManager(cmsdManager) {}
}
