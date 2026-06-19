## Ringkasan
Migrasi sistem komentar dari GitHub OAuth ke Lovable Cloud auth (email+password & Google), tambah halaman Admin panel + Tentang Kami, dan perbaikan UI/kontras.

## 1. Auth (Lovable Cloud)
- Aktifkan email/password + Google sign-in (default Lovable Cloud).
- Halaman baru:
  - `/auth` — Login & Register dalam satu halaman (tab Login / Register).
  - `/admin` — dashboard admin, dilindungi role `admin` (lihat tabel `user_roles` yang sudah ada).
- Hapus file lama: `src/hooks/useGitHubAuth.ts`, `.env` `VITE_GITHUB_CLIENTID` (tidak dipakai lagi).
- Buat `src/hooks/useAuth.ts` baru (pakai `supabase.auth`, `onAuthStateChange` + `getSession`).
- Promote user jadi admin: dilakukan via SQL satu kali untuk email user setelah register pertama (saya akan minta email-mu setelah migrasi).

## 2. Komentar
- `src/components/Comments.tsx` diubah: tidak pakai GitHub, pakai session Lovable Cloud.
- Skema `comments` di-migrate: kolom `github_username`, `github_avatar` jadi nullable / diganti `display_name`, `avatar_url` (ambil dari `profiles`).
- Jika belum login → tampilkan tombol "Login untuk komentar".

## 3. Admin Panel `/admin`
- Lihat & hapus komentar (moderasi).
- Lihat list user (dari `profiles`) + toggle role admin.
- Hanya bisa diakses jika `has_role(uid, 'admin')`.

## 4. Tentang Kami `/tentang`
- Halaman statis: deskripsi situs + tombol "Donate via QRIS" → `https://qris.zone.id/rizastore?payment_id=rizastore-fxi5sziq` (target _blank).
- Link "Tentang Kami" ditaruh di Footer.

## 5. UI / UX (fokus 4 area yang kamu pilih)
- **Navbar**: rapikan jadi grouped dropdown (Anime, Comic/Novel, Lainnya) supaya tidak overflow. Tombol Login/Avatar di kanan.
- **Card & list**: standarisasi tinggi cover, fallback image konsisten, hover state seragam, line-clamp judul.
- **Detail page**: heading lebih readable, badge meta konsisten, section komentar dipisah jelas dengan separator.
- **Color & typography**: audit `index.css` token — naikkan kontras `--muted-foreground` di light mode, perbaiki `--foreground` di komponen yang masih hardcode `text-white`/`text-black`. Tambah font pair yang lebih readable.

## 6. Hapus fitur yang tidak respon
Kamu tidak sebut spesifik. Saya akan audit halaman ini dan hapus/perbaiki jika benar mati: `/request`, `/api`, `/install`, link navbar yang 404. Akan saya lapor sebelum hapus apa pun yang signifikan.

## Teknis singkat
- Migration: ALTER `comments` (kolom github_* jadi nullable, tambah `display_name`, `avatar_url`), tetap pakai `user_roles` + `has_role`.
- Routes baru di `src/App.tsx`: `/auth`, `/admin`, `/tentang`.
- Hapus `VITE_GITHUB_CLIENTID` reference dari kode (file `.env` tidak diedit langsung).
- Auth init di `useAuth.ts`: pasang `onAuthStateChange` dulu, lalu `getSession()`.
