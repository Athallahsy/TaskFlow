# TaskFlow — Aplikasi Manajemen Proyek & Task

TaskFlow adalah aplikasi manajemen proyek dan task minimalis (mirip Trello / Jira minimalis) yang dirancang dengan antarmuka modern, interaksi dinamis, dan performa responsif. Aplikasi ini menggunakan arsitektur fullstack dengan backend Node.js (Express & Sequelize ORM) dan frontend React (Vite & Tailwind CSS v4).

Aplikasi ini dikembangkan sebagai portofolio profesional untuk menunjukkan penerapan kode yang rapi, praktik terbaik keamanan (JWT, hashing password, otorisasi data), serta antarmuka yang sangat diperhatikan estetikanya.

---

## Fitur Utama

- **Sliding Overlay Auth Page**: Halaman masuk dan daftar dinamis yang digabung dalam satu komponen (`AuthPage.jsx`). Panel promosi (`AuthCarousel`) meluncur secara interaktif menggunakan GSAP (`power3.inOut`) di atas form login dan register tanpa memicu *full remount* halaman.
- **Auto-slide Carousel**: Carousel informasi fitur di panel autentikasi dengan transisi crossfade otomatis setiap 4.5 detik (menghormati preferensi aksesibilitas `prefers-reduced-motion`).
- **Dashboard Progres**: Grafik statistik ringkasan status task (To Do, In Progress, Done) menggunakan `react-chartjs-2` dan ringkasan seluruh proyek aktif.
- **Papan Kanban Proyek**: Tampilan detail proyek dengan papan Kanban interaktif untuk mengelola dan memindahkan status task (To Do $\rightarrow$ In Progress $\rightarrow$ Done) dilengkapi animasi transisi GSAP.
- **Desain Tipografi Mewah & Minimalis**: Menggunakan font serif **Fraunces** untuk heading utama, **Manrope** untuk body teks, dan wordmark brand **"TaskFlow"** yang menggunakan font tulisan tangan **Pinyon Script** yang elegan tanpa ikon persegi lagi.
- **Responsive Layout**: Antarmuka responsif ramah mobile. Papan Kanban dikonversi menjadi tab/scroll horizontal di layar ponsel, dan panel carousel auth disembunyikan di bawah layar tablet (`md`).

---

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Autentikasi**: JWT (jsonwebtoken) & bcryptjs (password hashing)

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS v4
- **Animation**: GSAP (GreenSock Animation Platform)
- **HTTP Client**: Axios
- **Charts**: Chart.js (`react-chartjs-2`)

---

## Struktur Folder Project

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/         # Konfigurasi database Sequelize
│   │   ├── controllers/    # Logika bisnis (MVC Controllers)
│   │   ├── middleware/     # JWT authentication & error handler
│   │   ├── models/         # Skema tabel database (Sequelize Models)
│   │   └── routes/         # Endpoint API router
│   ├── server.js           # Main Entry Point Backend
│   └── create-db.js        # Script pembantu inisialisasi Database
├── frontend/
│   ├── src/
│   │   ├── api/            # Konfigurasi Axios client instance
│   │   ├── components/     # Reusable UI components & layouts (Sidebar, AppShell, AuthCarousel)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── data/           # Konfigurasi data static (authSlides.js)
│   │   ├── hooks/          # Custom hooks (useProjects, dll)
│   │   ├── pages/          # Halaman utama (AuthPage, DashboardPage, ProjectDetailPage)
│   │   ├── index.css       # Token & utility styling Tailwind CSS
│   │   └── main.jsx        # Entry Point Frontend
```

---

## Panduan Instalasi Lokal

### Prasyarat
- Node.js (v18+)
- MySQL Server berjalan lokal

### Langkah 1: Setup Backend
1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. Buat database MySQL kosong baru bernama `taskflow_db` (atau nama lain pilihan Anda).
4. Buat file `.env` di dalam folder `backend/` menggunakan referensi dari `.env.example`:
   ```env
   PORT=5000
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=password_mysql_kamu
   DB_NAME=taskflow_db
   JWT_SECRET=supersecretkeys3cr3t
   NODE_ENV=development
   ```
5. Jalankan script inisialisasi tabel database (Sequelize sync):
   ```bash
   node create-db.js
   ```
6. Jalankan server backend (secara default di port 5000):
   ```bash
   npm start
   # Atau jika ingin menggunakan nodemon secara global/lokal
   npx nodemon server.js
   ```

### Langkah 2: Setup Frontend
1. Masuk ke folder frontend:
   ```bash
   cd ../frontend
   ```
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. Pastikan konfigurasi `.env` mengarah ke backend yang aktif (biasanya target endpoint API proxy berada di port 5000).
4. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   ```
5. Buka tautan lokal yang diberikan di terminal (contoh: `http://localhost:5173` atau `http://localhost:5176`) pada browser Anda.

---

## Daftar Endpoint API Utama

| Method | Endpoint | Keterangan | Proteksi |
|---|---|---|---|
| **POST** | `/api/auth/register` | Mendaftarkan akun baru | Publik |
| **POST** | `/api/auth/login` | Autentikasi masuk akun | Publik |
| **GET** | `/api/projects` | Mengambil seluruh project milik user | Private (JWT) |
| **POST** | `/api/projects` | Membuat project baru | Private (JWT) |
| **GET** | `/api/projects/:id` | Detail project & daftar task di dalamnya | Private (JWT) |
| **PUT** | `/api/projects/:id` | Memperbarui data project | Private (JWT) |
| **DELETE**| `/api/projects/:id` | Menghapus project (dan cascade task) | Private (JWT) |
| **POST** | `/api/projects/:projectId/tasks`| Menambahkan task baru ke project | Private (JWT) |
| **PUT** | `/api/tasks/:id` | Memperbarui task (status, judul, dll) | Private (JWT) |
| **DELETE**| `/api/tasks/:id` | Menghapus task | Private (JWT) |
| **GET** | `/api/dashboard/summary` | Summary jumlah task per-status | Private (JWT) |
