# JOBREADY - Portal Lowongan Kerja & Pelacakan Lamaran

> **Tagline:** *"Langkah Tepat Menuju Karier Impianmu!"*  
> **Kategori:** Karier & Pelacakan Lamaran Pekerjaan (Job Portal & Application Tracking SaaS)

JOBREADY adalah platform modern, responsif, dan interaktif yang dirancang khusus untuk mahasiswa, fresh graduate, dan pencari kerja dalam menemukan lowongan pekerjaan impian serta melacak status proses rekrutmen secara real-time.

---

## 🎨 Identitas Visual & Desain UI/UX
- **Warna Utama:** Biru (`#2563EB`)
- **Warna Sekunder / Sidebar:** Navy Dark (`#172554` / `#0B1938`)
- **Background:** Putih (`#FFFFFF`) & Soft Gray (`#F8FAFC`)
- **Tipografi:** Google Fonts *Poppins* (Heading) & *Inter* (Body)
- **Komponen:** Card layout dengan rounded corners, shadow lembut, status badge warna-warni, recruitment timeline progresif, dan ikon minimalis modern.
- **Responsif:** Optimal pada Desktop, Tablet, dan Smartphone.

---

## 🚀 Fitur-Fitur Utama

### 1. Landing Page
- **Navigation Bar:** Logo JOBREADY, navigasi (Beranda, Lowongan, Tips Karier, Tentang), dan aksi autentikasi.
- **Top Meta Bar:** Tagline & 3 pilar fitur (*Cari Lowongan dengan Mudah*, *Lacak Status Lamaran*, *Bangun Karier Lebih Baik*).
- **Hero Section:** Headline informatif, search bar interaktif, tag pencarian cepat, serta ilustrasi vektor pencari kerja profesional.
- **Mengapa JOBREADY?:** 4 card keunggulan (Lowongan Terpercaya, Proses Melamar Mudah, Notifikasi Real-Time, Dukungan Karier).
- **Lowongan Unggulan & Tips Karier:** Menampilkan kurasi lowongan terbaru dan artikel persiapan karier bagi fresh graduate.

### 2. Autentikasi (Login & Register)
- Form Login & Register lengkap dengan validasi.
- Tombol **Tampil/Sembunyikan Password**.
- Opsi **Remember Me** & Lupa Password.
- **Tombol Masuk Cepat (Demo Akun)** untuk langsung mencoba aplikasi sebagai *Alvin*.
- Aplikasi dibuka di halaman awal dan meminta pengguna memilih Masuk atau Masuk Demo sebelum membuka dashboard.
- Login masih simulasi sisi browser (tanpa backend atau verifikasi akun sungguhan); jangan gunakan untuk akun atau data sensitif.

### 3. Dashboard Interaktif
- Sapaan personal (*Halo, Alvin! 👋*).
- **3 Stat Card Utama** (Total Lamaran: 5, Lamaran Diterima: 1, Dalam Proses: 2).
- **Rekomendasi Lowongan** dengan badge tipe kerja (Remote, Hybrid, Baru) dan tombol *Lamar Sekarang*.
- **Status Lamaran Terbaru** dengan indikator warna dot progresif.
- Sidebar menu navigasi lengkap dengan badge counter lamaran.

### 4. Halaman Lowongan Kerja
- Pencarian kata kunci posisi atau nama perusahaan secara real-time.
- Filter cepat tipe pekerjaan via pills: **Semua, Full-Time, Part-Time, Internship, Remote, Hybrid, On-site**.
- Filter dropdown kategori (Teknologi, Desain, Data, Marketing, Manajemen) dan lokasi (Jakarta, Bandung, Surabaya, Remote).
- Tombol **Simpan/Favorit** (Bookmark) yang tersimpan di LocalStorage.
- Tombol **Detail Lowongan** untuk membuka modal detail lengkap.

### 5. Detail Lowongan & Formulir Lamaran
- Informasi komprehensif: Posisi, Perusahaan, Lokasi, Tipe, Gaji, Deskripsi, Kualifikasi (checklist hijau), Benefit (checklist biru), dan Profil Perusahaan.
- Modal **Formulir Lamaran** otomatis terisi dari profil pengguna (Nama, Email, Telepon, dan lampiran CV).
- Validasi pengiriman dan notifikasi sukses otomatis.

### 6. Pelacakan Lamaran (Application Tracking)
- Tab filter status: **Semua, Dalam Proses, Diterima, Ditolak**.
- Badge warna status:
  - 🟢 **Diterima** (Hijau)
  - 🟡 **Dalam Proses** (Kuning/Amber)
  - 🟣 **Wawancara** (Ungu)
  - 🔴 **Ditolak** (Merah)
  - 🔵 **Terkirim** (Biru)
- **Recruitment Timeline:** Visualisasi 4 tahapan rekrutmen (Lamaran Dikirim &rarr; Seleksi Berkas &rarr; Wawancara &rarr; Keputusan Akhir).
- Status lamaran ditampilkan sebagai informasi untuk pelamar; pelamar tidak dapat mengubah statusnya sendiri.

### 7. Profil Pengguna
- Foto avatar profil *Alvin*, nama, headline, dan bio.
- Informasi kontak dan pendidikan (S1 Teknik Informatika - UI).
- Daftar keahlian interaktif (*React.js*, *TypeScript*, *Figma*, dll).
- Riwayat pengalaman kerja.
- **Dokumen CV Card:** Terintegrasi dengan file `CV_Alvin.pdf` (dapat diunduh secara nyata atau diganti dengan file baru).
- Modal **Edit Profil** untuk memperbarui data dan keahlian secara lokal.

### 8. Sistem Notifikasi
- Lonceng notifikasi dengan counter unread badge.
- Dropdown notifikasi real-time untuk update status lamaran dan lowongan baru.
- Fitur *Tandai Semua Dibaca*.

### 9. Pengaturan & Reset Demo
- Ubah profil akun & password.
- Preferensi notifikasi.
- **Tombol Reset Data Prototype** untuk mengembalikan data LocalStorage ke kondisi awal.

---

## 💻 Cara Menjalankan Aplikasi

Aplikasi dibangun menggunakan **HTML5, CSS3, dan Modern Vanilla JavaScript** tanpa dependensi backend atau build step yang rumit:

### Opsi 1: Melalui XAMPP (Apache)
1. Buka aplikasi **XAMPP Control Panel**.
2. Klik tombol **Start** pada modul **Apache**.
3. Buka browser dan kunjungi:
   ```
   http://localhost/JOBREADY/
   ```

### Opsi 2: Buka Langsung di Browser
Cukup klik ganda file `index.html` atau buka URL lokal berikut di browser Anda:
```
file:///c:/xampp/htdocs/JOBREADY/index.html
```

---

## 📂 Struktur Berkas
```
c:\xampp\htdocs\JOBREADY\
├── index.html                 # Struktur utama aplikasi (SPA)
├── README.md                  # Dokumentasi aplikasi
├── css/
│   ├── style.css              # Sistem desain, tipografi, warna, dan layout global
│   └── components.css         # Komponen card, badge, timeline, modal, dan responsive
├── js/
│   ├── data.js                # Data dummy awal yang realistis (lowongan, lamaran, profil)
│   ├── storage.js             # Layanan LocalStorage (Auth, Jobs, Tracking, Profile)
│   └── app.js                 # Logika interaktivitas, router, modal, dan notifikasi
└── assets/
    ├── images/                # Asset SVG logo, avatar, dan ilustrasi hero
    └── documents/             # File PDF CV sample untuk simulasi unduhan
```
