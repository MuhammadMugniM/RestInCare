# RestInCare - Design System & Theming

Dokumen ini merangkum sistem desain, palet warna, dan gaya visual dari aplikasi **RestInCare**. Referensi ini dapat digunakan untuk membangun Admin Dashboard atau komponen baru lainnya dengan nuansa yang selaras.

## 1. Palet Warna (Tailwind Hex Codes)

Palet warna RestInCare dirancang untuk memberikan kesan tenang (serene), bersih (clean), dan profesional, sesuai dengan layanan kedukaan.

### Warna Latar Belakang (Background)
- **Background Utama (App Root)**: `#fbf8fa` (Putih keabu-abuan hangat / off-white)
- **Background Alternatif (Section)**: `#f0edef` (Abu-abu lembut)
- **Background Kartu / Card**: `#ffffff` (Putih bersih)
- **Background Banner Sukses / Aksen Hijau Muda**: `#f4f7f5` atau `#d5e3d7` (Sage green sangat muda)
- **Background Gelap (Footer / Call to Action)**: `#333e50` (Dark slate / Navy)

### Warna Teks (Typography)
- **Teks Utama (Heading / Body)**: `#1b1b1d` (Charcoal gelap) atau `#333e50` (Slate gelap)
- **Teks Sekunder (Muted)**: `text-gray-600` atau `text-gray-500`
- **Teks Aksen / Brand**: `#546258` (Sage green tua)
- **Teks di Background Gelap**: `#ffffff` atau `#becae0` (Biru pucat untuk footer)

### Warna Tombol & Aksi (Buttons)
- **Primer (Submit / Simpan)**: Background `#546258`, Hover `#3d4a41`, Teks Putih.
- **Sekunder (Outline / Batal)**: Background `#ffffff`, Border `#546258` atau `#eae7e9`, Teks `#546258` / `#1b1b1d`.
- **Tertiary (Aksi Tambahan)**: Background `#fbf8fa`, Hover `#333e50`, Teks `#333e50` (hover menjadi putih).
- **WhatsApp Action**: Background `#25D366`, Hover `#1ebd59`, Teks Putih.
- **Emergency / Destructive (Darurat)**: Background `#ba1a1a`, Hover `bg-red-700`, Teks Putih.

### Warna Border (Garis Tepi)
- **Border Default**: `#eae7e9` (Abu-abu sangat muda)
- **Border Aksen Hijau**: `#d5e3d7` (Soft sage green)

---

## 2. Gaya Styling (Tabel, Form, & Komponen)

- **Rounded Corners (Sudut Membulat)**:
  - **Kartu Utama / Container**: `rounded-2xl`
  - **Modal / Banner**: `rounded-xl`
  - **Tombol / Input Form**: `rounded-lg`
  - **Badge / Label Status**: `rounded-full` (Bentuk pil)
- **Shadow (Bayangan)**:
  - **Kartu / Elemen Statis**: `shadow-sm`
  - **Tombol Melayang / Modal**: `shadow-md` hingga `shadow-lg`
  - **Efek Hover**: `hover:shadow-xl hover:-translate-y-1` dipadukan dengan `transition-all duration-300` untuk memberikan efek interaktif yang mulus.
- **Spacing (Jarak & Margin/Padding)**:
  - Menggunakan spasi (padding) yang lega dan lapang (`p-6`, `p-8`) untuk menghindari kesan sesak (cluttered).
  - Jarak antar elemen menggunakan utility `gap-6` atau `gap-8` pada grid/flexbox.
- **Tipografi**:
  - Teks menggunakan font `sans` yang bersih.
  - Untuk Label Badge atau Judul Kecil sering menggunakan kombinasi: `text-xs uppercase tracking-widest font-bold` untuk memberikan kesan premium dan editorial.

---

## 3. Nuansa Visual Keseluruhan (Vibe)

- **Clean & Minimalist**: Antarmuka tidak dipenuhi elemen yang tidak perlu. Mengandalkan *white-space* (ruang kosong) yang lapang.
- **Bright & Serene**: Dominasi warna latar terang yang hangat (`#fbf8fa`) dipadukan dengan aksen hijau sage (alam/ketenangan) menghindari kesan seram atau gelap, memberikan perasaan damai, profesional, dan menenangkan bagi keluarga yang sedang berduka.
- **Accessible & Clear**: Kontras warna teks sangat jelas, tombol-tombol krusial memiliki warna yang kontras (hijau tua untuk lanjut, merah untuk darurat) agar mudah diakses dalam kondisi panik/berduka.
