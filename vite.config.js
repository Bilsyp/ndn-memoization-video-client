import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path"; // <-- tambahkan ini

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      // "@" akan merujuk ke folder root proyek (di luar src)
      "@": resolve(__dirname),
      // Jika tetap butuh alias ke src, bisa ditambahkan:
      // "@src": resolve(__dirname, "src"),
    },
  },
});
