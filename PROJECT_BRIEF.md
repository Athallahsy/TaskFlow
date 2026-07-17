# PROJECT_BRIEF.md — TaskFlow

## Ringkasan Produk

TaskFlow adalah aplikasi manajemen proyek & task sederhana (mirip Trello/Jira minimalis). User bisa membuat project, menambah task di dalamnya, mengubah status task (To Do / In Progress / Done), dan melihat ringkasan progres di dashboard.

Tujuan project ini: portofolio fullstack untuk melamar kerja sebagai Fullstack Developer/Software Engineer junior. Jadi kode harus **rapi, mengikuti best practice, dan mudah dijelaskan saat interview** — bukan sekadar jalan.

## Tech Stack (WAJIB, jangan diganti tanpa izin)

| Layer       | Teknologi                                 |
| ----------- | ----------------------------------------- |
| Backend     | Node.js + Express.js                      |
| Database    | MySQL                                     |
| ORM         | Sequelize                                 |
| Auth        | JWT (jsonwebtoken) + bcrypt               |
| Frontend    | React (Vite) + Tailwind CSS               |
| HTTP Client | Axios                                     |
| Chart       | react-chartjs-2                           |
| Animasi     | GSAP                                      |
| Testing API | Postman (collection disertakan di repo)   |

## Struktur Kode Wajib

- Backend **harus** mengikuti struktur MVC: `routes/`, `controllers/`, `models/` terpisah.
- Environment variable (DB connection, JWT secret) di `.env`, **tidak boleh hardcode**.
- Password **tidak pernah** dikembalikan dalam response API dalam bentuk apapun.
- Semua endpoint project/task dilindungi middleware JWT.
- User hanya bisa akses data miliknya sendiri (cek `user_id` di setiap query).
- Validasi input dilakukan di backend, bukan cuma di frontend.

## Skema Database

**users**: id (PK), name, email (unique), password (hash bcrypt), created_at

**projects**: id (PK), user_id (FK → users.id), name, description (nullable), created_at

**tasks**: id (PK), project_id (FK → projects.id), title, description (nullable), status (ENUM: 'todo' | 'in_progress' | 'done', default 'todo'), deadline (nullable), created_at

Relasi: 1 user → banyak project. 1 project → banyak task.
Hapus project → cascade delete semua task di dalamnya.

## Daftar Endpoint API

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id

GET    /api/projects/:projectId/tasks     (support query ?status=)
POST   /api/projects/:projectId/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

GET    /api/dashboard/summary
```

## Halaman Frontend & Komponen Utama

1. **AuthPage (Sliding Overlay Login & Register)**
   - Menggabungkan form login dan register dalam satu halaman dinamis dengan path `/login` dan `/register` terhubung ke komponen yang sama untuk menghindari full remount.
   - Form diposisikan tetap side-by-side (Register di kiri `left: 0%`, Login di kanan `left: 50%`) dan visibilitas diatur via opacity crossfade serta `pointer-events`.
   - **AuthCarousel** diposisikan sebagai absolute panel overlay (`width: 50%`) yang meluncur/slide mulus menggunakan GSAP (`left: 0%` di mode login menutupi slot register, `left: 50%` di mode register menutupi slot login).
   - Di mobile view (breakpoint `< md`), carousel disembunyikan dan form yang aktif mengambil full-width.
   - Desain form menggunakan input underline-only dan tombol submit pill berlatar belakang charcoal `#241F1A`.
2. **Dashboard** — Menampilkan grafik ringkasan progres task (menggunakan `react-chartjs-2`) dan daftar project yang dimiliki user.
3. **Project Detail** — Papan kanban 3 kolom untuk melacak task, filter berdasarkan status, dan aksi tambah/edit/hapus task.
4. **Modal Form** — Komponen modal popup dengan transisi scale GSAP untuk membuat atau memperbarui project dan task.

## Design System (v2 Terbaru)

**Style:** Minimalism + soft shadow. Tidak memakai glassmorphism/neumorphism.

**Warna:**
| Peran | Hex | Keterangan |
|---|---|---|
| Primary | `#0F6E56` | Teal tua |
| Primary Hover | `#0B5240` | Teal gelap |
| Primary Light | `#E6EFEA` | Latar belakang teal muda |
| Teks Utama | `#1D2D29` | Slate-green sangat gelap |
| Teks Sekunder | `#6B7773` | Gray-green |
| Background | `#F7F4EF` | Warm off-white |
| Surface/Card | `#FFFFFF` | Putih bersih |
| Sidebar Background | `#EFECE5` | Warm gray-beige |
| Success / Done | `#107B57` | Green |
| Success BG | `#E6F5EF` | Light green |
| Warning / In Progress | `#D97706` | Amber |
| Warning BG | `#FEF3C7` | Light amber |
| Neutral / To Do | `#87928E` | Muted gray |
| Neutral BG | `#EEF1F0` | Light gray |
| Danger | `#D94646` | Red |
| Danger BG | `#FEE2E2` | Light red |
| Border | `#E2ECE9` | Light teal-gray border |

Semua kombinasi teks-background wajib contrast ratio minimal 4.5:1.

**Tipografi:**
- **Brand Wordmark:** Font **Pinyon Script** (Cursive) untuk logo teks "TaskFlow" tanpa ikon pendamping.
- **Heading:** Font **Fraunces** (Serif) untuk judul halaman dan section header.
- **Body & Controls:** Font **Manrope** (Sans-serif) untuk teks isi, label, dan input. Base size 16px, line-height 1.5x.

**Layout:** Spacing kelipatan 8px (8/16/24/32/48/64). Mobile-first. Kanban board 3 kolom di desktop, tab/scroll horizontal di mobile.

**Komponen:**
- Button: min-height 44px, rounded-lg (radius 8px)
- Card task: shadow tipis, hover terangkat sedikit dengan GSAP
- Status badge: warna semantic + ikon kecil
- Modal: tombol close jelas, scrim hitam 50%

## UX Writing (Bahasa Indonesia, nada ramah & jelas)

Prinsip: jelas > keren, spesifik > umum, kalimat aktif. Jangan pakai jargon teknis di UI.

Contoh wajib dipakai:
- Tombol tambah project → `"+ Buat Project Baru"`
- Tombol tambah task → `"+ Tambah Task"`
- Empty state project → `"Belum ada project. Yuk buat yang pertama!"`
- Empty state task → `"Belum ada task di project ini."`
- Konfirmasi hapus project → `"Hapus project ini? Semua task di dalamnya juga akan terhapus."`
- Error login → `"Email atau password salah. Coba lagi."`
- Loading → `"Menyimpan..."` / `"Memuat task..."`
- Sukses simpan → `"Task berhasil disimpan"`
- Tombol pakai kata kerja+objek: `"Simpan Task"`, bukan `"OK"`/`"Submit"`
- Pesan error diletakkan dekat field yang error, bukan menumpuk di atas form

## Animation Spec (GSAP)

Durasi 150–300ms (kecuali transisi sliding overlay). Animasikan `opacity` & `transform` saja (jangan width/height). Hormati `prefers-reduced-motion` (jika aktif, transisi instan dan matikan auto-slide).

| Interaksi                | Animasi                               | Durasi/Easing              |
| ------------------------ | ------------------------------------- | -------------------------- |
| Buka modal               | Fade in + scale 95%→100%              | 200ms `power2.out`         |
| Tutup modal              | Fade out + scale ke 95%               | 150ms `power2.in`          |
| Pindah status task       | Slide ke kolom baru + bounce ringan   | 300ms `back.out(1.2)`      |
| List task pertama muncul | Stagger dari bawah                    | tiap card 250ms, jeda 80ms |
| Hover card task          | scale(1.02) dari center + shadow lebih tebal | 150ms `power1.out`         |
| Chart dashboard muncul   | Animasi dari 0 ke nilai asli          | 600ms `power2.out`         |
| Toast notifikasi         | Slide dari atas, auto-hide 3 detik    | masuk 200ms, keluar 150ms  |
| Sliding Carousel (Auth)  | Geser left 0% ↔ 50%                   | 550ms `power3.inOut`       |

## Non-Functional Requirements

- Response API rata-rata < 500ms untuk CRUD sederhana
- Kode backend MVC-structured
- Commit history granular, pesan commit jelas

## Definition of Done

- Semua endpoint berfungsi & sudah dites (Postman collection disertakan)
- Frontend: register/login (sliding overlay), CRUD project, CRUD task, dashboard chart — semua jalan
- UI mengikuti Design System, UX Writing, dan Animation Spec di atas
- README lengkap: deskripsi, screenshot, cara instalasi lokal, tech stack
