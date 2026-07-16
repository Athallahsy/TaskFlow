/**
 * authSlides.js — Data konfigurasi slide untuk AuthCarousel.
 * Ekspor dua set slides: satu untuk konteks Login, satu untuk Register.
 * Ganti headline/subtext di sini tanpa menyentuh komponen.
 * Tambahkan field `image` (path/URL) ke tiap objek ketika gambar asli tersedia.
 */

/** Slides ditampilkan saat mode 'login' */
export const LOGIN_SLIDES = [
  {
    id: 'login-slide-1',
    headline: 'Selamat Datang Kembali!',
    subtext: 'Semua project dan task kamu masih di sini, tepat seperti kamu tinggalkan.',
  },
  {
    id: 'login-slide-2',
    headline: 'Pantau Progress Tanpa Drama',
    subtext: 'Dashboard langsung menampilkan yang paling penting — tidak ada yang terlewat.',
  },
  {
    id: 'login-slide-3',
    headline: 'Kerjaan Rapi, Pikiran Tenang',
    subtext: 'Satu tempat untuk semua project. Fokus pada pekerjaan, bukan pada koordinasi.',
  },
];

/** Slides ditampilkan saat mode 'register' */
export const REGISTER_SLIDES = [
  {
    id: 'reg-slide-1',
    headline: 'Mulai Kelola Project Kamu',
    subtext: 'Daftar gratis dalam 30 detik — tidak perlu kartu kredit.',
  },
  {
    id: 'reg-slide-2',
    headline: 'Dari Ide Sampai Selesai',
    subtext: 'Buat project, tambah task, pantau status — semua dalam satu tampilan yang bersih.',
  },
  {
    id: 'reg-slide-3',
    headline: 'Satu Tempat, Semua Proyek',
    subtext: 'Filter berdasarkan status dan deadline. Tidak ada task yang jatuh dari radar.',
  },
];

/** Fallback default — dipakai kalau prop slides tidak diberikan */
export const AUTH_SLIDES = LOGIN_SLIDES;
