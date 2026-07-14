# PROJECT_BRIEF.md — TaskFlow

> File ini adalah sumber kebenaran (source of truth) untuk AI coding agent.
> Taruh file ini di **root folder project**, dan setiap kali membuka sesi baru
> di Antigravity, minta agent membaca file ini dulu sebelum mulai kerja.

## Ringkasan Produk

TaskFlow adalah aplikasi manajemen proyek & task sederhana (mirip Trello/Jira
minimalis). User bisa buat project, tambah task di dalamnya, ubah status task
(To Do / In Progress / Done), dan lihat ringkasan progres di dashboard.

Tujuan project ini: portofolio fullstack untuk melamar kerja sebagai
Fullstack Developer/Software Engineer junior. Jadi kode harus **rapi, ikut
best practice, dan mudah dijelaskan saat interview** — bukan sekadar jalan.

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
| Deploy      | Backend: Railway/Render, Frontend: Vercel |

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

**tasks**: id (PK), project_id (FK → projects.id), title, description (nullable),
status (ENUM: 'todo' | 'in_progress' | 'done', default 'todo'), deadline (nullable), created_at

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

## Halaman Frontend

1. Login / Register page
2. Dashboard — chart ringkasan + daftar project
3. Project Detail — daftar task, filter status, tambah/edit/hapus task
4. Modal form untuk tambah/edit project & task

## Design System (WAJIB diikuti persis)

**Style:** Minimalism + soft shadow. Tidak pakai glassmorphism/neumorphism.

**Warna:**
| Peran | Hex |
|---|---|
| Primary (Indigo) | `#4F46E5` |
| Teks utama (Slate 900) | `#0F172A` |
| Teks sekunder (Slate 500) | `#64748B` |
| Background (Slate 50) | `#F8FAFC` |
| Surface/card (White) | `#FFFFFF` |
| Success/Done (Green 500) | `#22C55E` |
| Warning/In Progress (Amber 500) | `#F59E0B` |
| Neutral/To Do (Slate 400) | `#94A3B8` |
| Danger (Red 500) | `#EF4444` |

Semua kombinasi teks-background wajib contrast ratio minimal 4.5:1.

**Tipografi:** Font Inter (bold untuk heading, regular untuk body). Base size
16px, line-height 1.5x. Jangan lebih kecil dari 16px untuk body text.

**Layout:** Spacing kelipatan 8px (8/16/24/32/48). Mobile-first. Kanban board
3 kolom di desktop, tab/scroll horizontal di mobile.

**Komponen:**

- Button: min-height 44px, rounded-lg (radius 8px)
- Card task: shadow tipis, hover terangkat sedikit
- Status badge: warna semantic + ikon kecil (jangan andalkan warna saja)
- Modal: tombol close jelas, scrim hitam 50%

## UX Writing (Bahasa Indonesia, nada ramah & jelas)

Prinsip: jelas > keren, spesifik > umum, kalimat aktif. Jangan pakai jargon
teknis di UI.

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

Durasi 150–300ms. Animasikan `opacity` & `transform` saja (jangan
width/height). Hormati `prefers-reduced-motion` (kalau aktif, animasi jadi instan).

| Interaksi                | Animasi                               | Durasi/Easing              |
| ------------------------ | ------------------------------------- | -------------------------- |
| Buka modal               | Fade in + scale 95%→100%              | 200ms `power2.out`         |
| Tutup modal              | Fade out + scale ke 95%               | 150ms `power2.in`          |
| Pindah status task       | Slide ke kolom baru + bounce ringan   | 300ms `back.out(1.2)`      |
| List task pertama muncul | Stagger dari bawah                    | tiap card 250ms, jeda 80ms |
| Hover card task          | translateY(-4px) + shadow lebih tebal | 150ms `power1.out`         |
| Chart dashboard muncul   | Animasi dari 0 ke nilai asli          | 600ms `power2.out`         |
| Toast notifikasi         | Slide dari atas, auto-hide 3 detik    | masuk 200ms, keluar 150ms  |

## Non-Functional Requirements

- Response API rata-rata < 500ms untuk CRUD sederhana
- Kode backend MVC-structured
- Commit history granular (bukan 1 commit besar), pesan commit jelas

## Definition of Done

- Semua endpoint berfungsi & sudah dites (Postman collection disertakan)
- Frontend: register/login, CRUD project, CRUD task, dashboard chart — semua jalan
- UI mengikuti Design System, UX Writing, dan Animation Spec di atas
- README lengkap: deskripsi, screenshot, cara instalasi lokal, tech stack
- (Opsional lanjutan) Deploy live: backend + frontend
