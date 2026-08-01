## 🚀 Langkah Instalasi & Pengoperasian

Ikuti urutan langkah berikut untuk mengunduh dan menjalankan proyek di komputer lokal Anda:

### 1. Unduh Proyek (Clone / ZIP)

Pilih salah satu cara berikut untuk mendapatkan kode sumber proyek:

- **Cara A: Menggunakan Git Clone (Direkomendasikan)**

  ```bash
  git clone https://github.com/Bilsyp/ndn-memoization-video-client.git
  ```

- **Cara B: Unduh ZIP**
  1. Klik tombol **Code** di halaman GitHub proyek ini.
  2. Pilih **Download ZIP**.
  3. Ekstrak file ZIP tersebut ke folder di komputer Anda.

### 2. Pastikan Node.js Terinstal

Aplikasi ini membutuhkan Node.js versi 24 (LTS) atau versi LTS terbaru.

- Cek versi Node.js yang terpasang:
  ```bash
  node -v
  ```
- Jika belum terinstal atau versinya tidak sesuai, unduh dan instal dari [Halaman Resmi Node.js](https://nodejs.org/).

### 3. Masuk ke Folder Proyek & Instal Dependensi

1. Buka **Command Prompt** (atau Terminal).
2. Arahkan direktori ke folder proyek Anda:
   ```bash
   cd ndn-memoization-video-client
   ```
3. Jalankan perintah berikut untuk menginstal semua package yang dibutuhkan:
   ```bash
   npm install
   ```

### 4. Jalankan Aplikasi

Jalankan perintah sesuai skenario yang ingin Anda gunakan (lihat perintah yang tersedia di file package.json):

- **Mode Pengembangan (Development)**

  ```bash
  npm run dev
  ```

- **Mode Pratinjau Build (Preview)**
  ```bash
  npm run preview
  ```

Setelah server lokal aktif, buka browser dan kunjungi alamat URL yang ditampilkan di Command Prompt (misalnya `http://localhost:5173` atau `http://localhost:3000`).
