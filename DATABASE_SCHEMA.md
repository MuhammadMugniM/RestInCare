# RestInCare - Database Schema & Payload Specification

Dokumen ini menjelaskan struktur data dan skema database (Firestore) yang digunakan oleh aplikasi RestInCare saat mengirimkan (submit) data pesanan paket kedukaan ke server. Referensi ini dapat digunakan sebagai panduan data untuk menyusun tabel monitoring dan modal detail di aplikasi Admin Dashboard.

## 1. Koleksi Firestore (Collection)
Seluruh data pesanan/rencana duka (inquiries) dari pengguna disimpan ke dalam koleksi berikut:
**Nama Collection**: `inquiries`

## 2. Struktur Data (Field Types & Properties)

Berikut adalah daftar lengkap field (literal, *case-sensitive*) yang dikirim di dalam payload ke Firestore beserta tipe datanya:

| Nama Field | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `belief` | `String` | ID layanan/kepercayaan yang dipilih pada Step 1 (contoh: 'islam', 'kristen', 'katolik'). |
| `packageId` | `String` | ID paket kedukaan yang dipilih pada Step 2 (contoh: 'basic', 'standard', 'premium'). |
| `selectedOptions` | `Array of Strings` | Daftar ID layanan tambahan (add-ons) yang dipilih pada Step 3 (contoh: dekorasi ekstra, MC, dsb). |
| `deceasedName` | `String` | Nama lengkap mendiang (Step 4). |
| `applicantName` | `String` | Nama lengkap pemesan/pendaftar (Step 4). |
| `applicantPhone` | `String` | Nomor kontak/WhatsApp pemesan (Step 4). |
| `applicantRelation` | `String` | Hubungan pemesan dengan mendiang (contoh: 'Anak', 'Pasangan') (Step 4). |
| `specialRequests` | `String` | Catatan atau permintaan khusus dari keluarga (Step 4). |
| `dateOfPassing` | `String` | Tanggal mendiang berpulang dalam format YYYY-MM-DD (Step 4). |
| `locationOfPassing` | `String` | Lokasi berpulang (contoh: Rumah, Nama Rumah Sakit) (Step 4). |
| `deathCertificateFile` | `String` | Data file surat keterangan dokter/kematian (biasanya berupa string Base64 atau URL dokumen jika sudah di-upload) (Step 4). |
| `funeralHomeStartDate` | `String` | Rencana tanggal mulai penggunaan rumah duka dalam format YYYY-MM-DD (Step 4). |
| `cateringPortions` | `Number` | Jumlah porsi katering yang dipesan, dikonversi ke angka (Step 4). |
| `coffinDimension` | `String` | Pilihan ukuran peti jenazah (contoh: 'standar', 'menengah', 'besar') (Step 4). |
| `cemeteryCity` | `String` | Kota TPU/lokasi pemakaman yang dipilih dari peta Leaflet.js (Step 4). |
| `cemeteryName` | `String` | Nama TPU/lokasi pemakaman yang dipilih dari peta Leaflet.js (Step 4). |
| `totalCost` | `Number` | Total keseluruhan estimasi biaya paket dasar + layanan tambahan (Step 5). |
| `createdAt` | `String` | Timestamp kapan pesanan dibuat dalam format ISO-8601 (otomatis digenerate saat klik submit). |

## 3. Contoh Payload (JSON)

Berikut adalah contoh bentuk data JSON literal yang diterima oleh Firestore dari form RestInCare:

```json
{
  "belief": "kristen",
  "packageId": "premium",
  "selectedOptions": [
    "bunga_tabur_ekstra",
    "mc_ibadah",
    "mobil_jenazah_vip"
  ],
  "deceasedName": "Budi Santoso",
  "applicantName": "Andi Santoso",
  "applicantPhone": "081234567890",
  "applicantRelation": "Anak",
  "specialRequests": "Mohon sediakan bunga lili putih yang dominan di ruang duka dan parkir yang berdekatan.",
  "dateOfPassing": "2026-06-25",
  "locationOfPassing": "RS Mitra Keluarga Kelapa Gading",
  "deathCertificateFile": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
  "funeralHomeStartDate": "2026-06-26",
  "cateringPortions": 150,
  "coffinDimension": "standar",
  "cemeteryCity": "Jakarta Selatan",
  "cemeteryName": "TPU Jeruk Purut",
  "totalCost": 45000000,
  "createdAt": "2026-06-27T17:55:00.000Z"
}
```

**Catatan Integrasi Dashboard Admin**: 
- Gunakan field `createdAt` untuk melakukan sorting tabel pesanan terbaru (descending).
- Total biaya (`totalCost`) bertipe *Number*, pastikan melakukan *formatting* (seperti `Intl.NumberFormat('id-ID')`) saat merendernya di antarmuka tabel admin.
- Field `selectedOptions` berbentuk *Array of Strings*. Admin Dashboard mungkin memerlukan referensi kamus data (dictionary) untuk memetakan ID layanan tambahan ini ke label yang mudah dibaca.
