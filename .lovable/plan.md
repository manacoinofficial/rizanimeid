# Rencana: Random Image API di Rizanime AI

Menambahkan integrasi endpoint `https://api.nexray.eu.cc/random/...` sebagai fitur baru di halaman Rizanime AI (`/sakana-ai`). Endpoint `/random/loli` **tidak** disertakan.

## Endpoint yang dipakai

| Sumber | URL | Keyword chat |
|---|---|---|
| Cewek Vietnam | `/random/cecan/vietnam` | `cevie` |
| Cewek Korea | `/random/cecan/korea` | `cekor` |
| Cewek Jepang | `/random/cecan/japan` | `cejap` |
| Random Anime | `/random/anime?type=${type}` | (via tombol tab, banyak tipe) |

## 1. Client helper baru: `src/lib/randomImageApi.ts`
- `fetchCecan(country: 'vietnam' | 'korea' | 'japan')` — panggil endpoint, ambil URL gambar dari respons (dukung field `result` / `url` / `image` sebagai fallback).
- `fetchRandomAnime(type: string)` — panggil `/random/anime?type=${type}`.
- Return `{ url: string, source: string }`.

## 2. Tab baru di Rizanime AI (`src/pages/SakanaAI.tsx`)
Ubah layout menjadi Tabs shadcn dengan dua tab:
- **Chat** — semua UI chat yang ada sekarang, tidak diubah logikanya.
- **Random Anime** — grid tombol tipe (waifu, neko, husbando, kitsune, megumin, cry, hug, kiss, pat, slap, dsb — dari list default yang umum di endpoint waifu-style; user tidak menentukan, jadi pakai preset yang bisa di-scroll). Klik tombol → fetch → tampilkan gambar besar di card, tombol "Generate lagi", tombol download, dan tombol "Kirim ke Chat".

## 3. Quick action bar di atas input Chat
Empat tombol chip: `Cevie`, `Cekor`, `Cejap`, `Random Anime`. Klik = fetch endpoint terkait lalu masukkan hasil sebagai assistant message berisi gambar (menggunakan field `image` di interface `Message` yang sudah ada). Tidak memanggil edge function AI untuk ini — murni client fetch.

## 4. Keyword parser di `sendMessage`
Sebelum memanggil `supabase.functions.invoke('sakana-ai-chat')`, cek `input.trim().toLowerCase()`:
- `cevie` → fetch cecan/vietnam, tambahkan message assistant berisi gambar + caption "Cewek Vietnam random".
- `cekor` → cecan/korea.
- `cejap` → cecan/japan.
- Jika match salah satu keyword, skip pemanggilan AI.

Keyword bekerja juga saat user mengetiknya sendiri (bukan cuma tombol).

## 5. Update copy
- `src/pages/Home.tsx` / kartu Rizanime AI: tambahkan sub-teks "Chat AI + random anime/cewek Asia".
- Tidak mengubah Navbar / route (tetap `/sakana-ai`).

## Out of scope
- Endpoint `/random/loli` (dilewati atas alasan kebijakan konten).
- Persistensi gambar random ke database — cukup ditampilkan real-time.
- Halaman terpisah untuk random image (dimasukkan sebagai tab, bukan route baru).
