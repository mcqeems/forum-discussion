# Submission: Menerapkan Automation Testing dan CI/CD pada Aplikasi Forum Diskusi

## Informasi Submission

- **Nama Proyek:** Aplikasi Forum Diskusi (`forum-discussion/`)
- **URL Vercel:** https://forum-discussion-red.vercel.app
- **Repository:** https://github.com/mcqeems/forum-discussion
- **React Ecosystem:** Storybook (`storybook`, `@storybook/react-vite`)

## Jumlah Pengujian

- **Reducer tests:** 4 files, 21 tests (`threads`, `authUser`, `threadDetail`, `loadingBar`)
- **Thunk tests:** 4 files, 17 tests (`authUser`, `threads`, `threadDetail`, `leaderboards`)
- **Component tests:** 4 files, 13 tests (`VoteButton`, `CategoryFilter`, `LoadingBar`, `ThreadItem`)
- **E2E tests:** 1 file, 3 tests (`cypress/e2e/login.cy.js` — login flow, API di-stub)
- **Component stories:** 3 files (`VoteButton`, `CategoryFilter`, `ThreadItem`)

## Perintah Verifikasi

```bash
npm install
npm test      # unit + component (vitest run)
npm run e2e   # end-to-end (dev server otomatis + cypress run)
npm run build # production build (dijalankan juga oleh CI)
```

## Fitur Rating 5 (dipertahankan dari submission sebelumnya)

- Vote thread (up/down/neutral, optimistic + rollback)
- Vote komentar
- Leaderboard (`/leaderboards`)
- Filter thread berdasarkan kategori
- Bugs highlighting: pesan error login/register tampil inline (`.error`)
