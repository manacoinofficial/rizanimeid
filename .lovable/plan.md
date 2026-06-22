## Scope

Six perbaikan utama. Saya kerjakan berurutan dalam satu sesi.

### 1. Proteksi route `/admin`
- Buat komponen `ProtectedRoute` di `src/components/ProtectedRoute.tsx` yang membaca `useAuth()`.
- Bila `isLoading` → spinner. Bila bukan `isAdmin`/`isOwner` → redirect ke `/auth` dengan toast.
- Bungkus `<Admin />` di `src/App.tsx` dengan komponen ini.

### 2. Real-time pengunjung baru di Admin
- Tambah panel "Pengunjung Live" di `src/pages/Admin.tsx`.
- Subscribe channel Supabase Realtime `postgres_changes` pada table `visits` (INSERT) — prepend ke list (maks 30 row), tampilkan path, nama akun/Tamu, waktu relatif.
- Migration: `ALTER PUBLICATION supabase_realtime ADD TABLE public.visits;` + `ALTER TABLE public.visits REPLICA IDENTITY FULL;`.

### 3. Novel: hanya Sakuranovel
- Hapus pemilih source/tab di `NovelHome`, `NovelLatest`, `NovelPopular`, `NovelSearch`, `NovelGenres`, `NovelGenre` — paksa source = `sakuranovel`.
- Hapus opsi/route source lain di `App.tsx` & `Navbar` jika ada.
- Buat `src/pages/novel/NovelChapter.tsx` aktif untuk format route `/novel/sakuranovel/chapter/:chapterSlug` dan varian lama, dengan tombol Next/Prev memakai `data.navigation.prev|next` (file sudah ada — verifikasi route terdaftar di `App.tsx`).

### 4. Mangasusuku: fix next/prev chapter
- Periksa `MangasusukuChapter.tsx`, normalisasi `navigation.prev/next` (string atau objek). Bila API tidak menyediakan, fallback hitung dari daftar chapter di detail (simpan list ke localStorage saat buka detail).
- Pastikan tombol prev/next memakai `<Link>` agar history terupdate.

### 5. Unified Search
- Satukan ke route `/search` dan `/search/:keyword` (UnifiedSearch sudah ada).
- Tambahkan tab/hasil **Mangasusuku** (saat ini hilang) memakai `mangasusukuApi.search`.
- Update Navbar/search bar global supaya mengarah ke `/search?q=...`.
- Hapus route search per-section yang konflik (anime/comic/novel/mangasusuku search pages tetap ada tapi navbar mengarah ke unified).

### 6. Profil: foto + banner (foto/video)
- Migration: tambah kolom `banner_url text` dan `banner_type text check in ('image','video')` di `profiles`. (`avatar_url` sudah ada.)
- Buat Storage bucket public `profile-media` untuk upload.
- RLS bucket: user hanya boleh upload/update/delete file dengan prefix `userId/`.
- Buat halaman `src/pages/Profile.tsx` dengan form: upload avatar (image), upload banner (image atau video), preview, tombol simpan.
- Tambah link Profile di Navbar (dropdown user) dan route `/profile`.

## Technical Notes
- Realtime: gunakan `useEffect` + cleanup (`supabase.removeChannel`).
- Validasi upload: max 5MB foto, 25MB video, jenis MIME diperiksa di client.
- Tidak mengubah `client.ts`/`types.ts` (auto-gen).

## Out of scope
- Refactor visual besar (typografi, layout) selain area yang disentuh.
- Tidak menambah follower system — "follow banner" diartikan sebagai banner profil saja. Konfirmasi bila maksudnya berbeda.
