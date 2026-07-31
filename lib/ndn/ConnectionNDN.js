import { connectToNetwork, connectToRouter } from "@ndn/autoconfig";
import { H3Transport } from "@ndn/quic-transport";

/** @type {string|undefined} */
export let remote;

/**
 * Fungsi untuk menghubungkan ke jaringan NDN.
 * @param {boolean} preferManual - Jika true, akan mencoba ke router pilihan dulu.
 */
export default async function connect(
  preferredRouter = "ws://192.168.1.24:9696/ws/",
  preferManual = true,
) {
  // 1. Opsi A: Mencoba hubungkan ke Router Spesifik (Manual)
  if (preferManual) {
    try {
      if (preferredRouter) {
        const { face } = await connectToRouter(preferredRouter, {
          H3Transport,
          testConnection: false,
        });
        remote = face.toString();
        console.log("Terhubung manual ke:", remote);
        return;
      }
    } catch (err) {
      console.warn(
        "Gagal terhubung ke router manual, mencoba otomatis...",
        err,
      );
    }
  }

  // 2. Opsi B: Mencoba hubungkan ke Jaringan Global (Otomatis)
  try {
    const [face] = await connectToNetwork({
      H3Transport,
      preferH3: true,
      // Daftar server cadangan jika pencarian otomatis gagal
      fallback: ["suns.cs.ucla.edu", "vnetlab.gcom.di.uminho.pt"],
      testConnectionTimeout: 6000,
    });

    remote = face.toString();
    console.log("Terhubung otomatis ke:", remote);
  } catch (err) {
    console.error("Gagal terhubung ke jaringan NDN:", err);
    throw new Error("Koneksi NDN gagal total.");
  }
}
