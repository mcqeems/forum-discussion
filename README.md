# Dicoding Forum App

Aplikasi Forum Diskusi — React + Redux Toolkit + React Router (Vite).

## Scripts

- `npm install` — pasang dependensi
- `npm test` — unit + component test (vitest run)
- `npm run e2e` — end-to-end test (dev server otomatis + cypress run)
- `npm run dev` — mode pengembangan
- `npm run lint` — ESLint (Dicoding Academy style-guide), harus nol error
- `npm run build` — build produksi (Vite)

## Fitur

- Register, login/logout (token di localStorage + preload `/users/me`).
- Daftar thread publik (judul, snippet body, waktu, jumlah komentar, nama+avatar owner).
- Detail thread + komentar (judul, body HTML, waktu, owner, vote).
- Buat thread (`/new`, protected), buat komentar (wajib login).
- Loading indicator global (top bar) + splash preload.
- Saran Rating 5: vote thread & komentar optimistik + highlight + count,
  halaman leaderboard (nama/avatar/score), filter kategori frontend (chips).

## Struktur

- `src/utils/api.js` — satu-satunya tempat `fetch` Forum API.
- `src/states/` — store + slice per domain (authUser, users, threads,
  threadDetail, leaderboards, isPreload, loadingBar).
- `src/components/` — UI modular reusable, tanpa pemanggilan API.
- `src/pages/` — Home, Detail, Login, Register, NewThread, Leaderboards.
