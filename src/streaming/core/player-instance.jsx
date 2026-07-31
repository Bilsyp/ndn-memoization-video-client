import React, { useEffect, useRef } from "react";
import shaka from "shaka-player";
// Import modul kustom Anda (sesuaikan dengan path foldernya)
import { initCustomNetworkEngine } from "@/src/streaming/network/ndn-scheme-plugin";
import { configurePlayer } from "@/src/streaming/configure/configuration";
import NdnPlugin from "@/src/streaming/plugin/shaka-ndn-plugin";
import NdnAiAbrManagerv4 from "@/src/streaming/abr/abrndnv4";
import { useLatencyStore } from "@/store/useLatencyStore";
import { QoECalculator } from "../monitor/Qoe";
import { useConnectionStore } from "@/store/useConnectionStore";
import { SimpleAbrManager } from "../abr/simple_abr_manager";
import { BufferBasedManager } from "../abr/BufferBasedManager";
const ShakaPlayerComponent = ({ src, abrAlgo }) => {
  const videoRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const ipBridge = useConnectionStore((state) => state.ipBridge);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // 1. Pastikan Polyfill Shaka aktif (penting untuk dukungan browser)
    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      console.error("Browser tidak mendukung Shaka Player!");
      return;
    }

    const initPlayer = async () => {
      try {
        // 1. Inisialisasi Player TANPA elemen video di constructor
        const player = new shaka.Player();
        playerInstanceRef.current = player;

        // 2. Hubungkan ke elemen video secara async
        await player.attach(videoElement);

        const qoeMonitor = new QoECalculator();

        // 3. Daftarkan Custom Network / Skema (misal: NDN) jika ada
        initCustomNetworkEngine(shaka);

        // 4. Terapkan konfigurasi dasar
        player.configure(configurePlayer);

        // Konfigurasi Algoritma ABR
        switch (abrAlgo) {
          case "ndn-rl":
            player.configure({
              abrFactory: () =>
                new NdnAiAbrManagerv4(
                  player,
                  NdnPlugin,
                  useLatencyStore,
                  ipBridge,
                ),
            });
            break;

          case "throughput":
            player.configure({
              abrFactory: () => new SimpleAbrManager(),
            });
            break; // 💡 PERBAIKAN: Ditambahkan break yang sebelumnya hilang!

          case "bba":
            player.configure({
              abrFactory: () => new BufferBasedManager(),
            });
            break; // 💡 PERBAIKAN: Ditambahkan break!

          default:
            break;
        }

        // 5. Registrasi Event Listener SEBELUM memuat (load) manifest
        player.addEventListener("error", (event) => {
          console.error("Error Shaka Player:", event.detail);
        });

        player.addEventListener("adaptation", (event) => {
          if (event.newTrack && event.newTrack.bandwidth) {
            qoeMonitor.recordSwitch(event.newTrack.bandwidth);
          }
        });

        player.addEventListener("buffering", (event) => {
          // if (!qoeMonitor.hasStartedPlayback) return;

          if (event.buffering) {
            qoeMonitor.recordStallStart();
          } else {
            qoeMonitor.recordStallEnd();
          }
        });

        // 6. Muat Video / Manifest menggunakan await (konsisten dengan async function)
        await player.load(src);
        console.log("Manifest berhasil dimuat dan pemutaran siap.");
      } catch (error) {
        console.error(
          "Gagal menginisialisasi atau memuat media pada Shaka Player:",
          error,
        );
      }
    };
    initPlayer();
    // Cleanup function: Hancurkan instance player saat komponen di-unmount
    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
    };
  }, [src, abrAlgo]);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-xl font-mono">
      {/* Mini Video Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-xs">
        <span className="text-slate-400 font-semibold uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Video Stream ({abrAlgo})
        </span>
      </div>

      {/* Video Container dengan Aspect Ratio 16:9 */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-slate-900">
        <video
          ref={videoRef}
          controls
          autoPlay
          className="w-full h-full object-contain"
          style={{ backgroundColor: "#000" }}
        />
      </div>
    </div>
  );
};

export default ShakaPlayerComponent;
