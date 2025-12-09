export interface ServicePackage {
  id: string;
  title: string;
  price: string;
  duration: string;
  description: string;
  // Kategori difokuskan ke 3 pilar utama web development
  category: "frontend" | "fullstack" | "backend";
  features: string[];
  recommended?: boolean;
}

export const servicesData: ServicePackage[] = [
  // --- KATEGORI: FRONTEND (Fokus Tampilan & Interaksi) ---
  {
    id: "s-1",
    title: "Landing Page UMKM",
    price: "Rp 999.000",
    duration: "2-3 Hari Kerja",
    description: "Website satu halaman (Single Page) untuk promosi produk atau jasa UMKM. Fokus konversi ke WhatsApp.",
    category: "frontend",
    features: [
      "Desain Responsif (HP & Laptop)",
      "Copywriting Dasar",
      "Tombol Call-to-Action (WA)",
      "Gratis Hosting (Vercel/Netlify)",
      "Gratis Domain .my.id (1 Tahun)",
      "SEO Basic Setup"
    ],
    recommended: false
  },
  {
    id: "s-2",
    title: "Personal Portfolio",
    price: "Rp 1.500.000",
    duration: "3-5 Hari Kerja",
    description: "Bangun personal branding profesional. Cocok untuk fresh graduate, freelancer, atau konten kreator.",
    category: "frontend",
    features: [
      "Home, About, Works, Contact",
      "Galeri Portofolio Interaktif",
      "Link Bio / Social Media Integration",
      "Download CV Feature",
      "Animasi Halus",
      "Form Kontak ke Email"
    ],
    recommended: false
  },
  {
    id: "s-3",
    title: "Company Profile Starter",
    price: "Rp 2.500.000",
    duration: "5-7 Hari Kerja",
    description: "Website profil perusahaan standar. Informatif, bersih, dan meningkatkan kredibilitas di mata klien.",
    category: "frontend",
    features: [
      "5 Halaman Utama",
      "Desain Korporat Modern",
      "Google Maps Integration",
      "Mobile Friendly",
      "Gratis Domain .com (1 Tahun)",
      "Revisi Minor 2x"
    ],
    recommended: false
  },
  {
    id: "s-4",
    title: "Company Profile Pro",
    price: "Rp 4.500.000",
    duration: "7-10 Hari Kerja",
    description: "Website perusahaan level lanjut dengan animasi premium dan performa tinggi untuk kesan eksklusif.",
    category: "frontend",
    features: [
      "Hingga 8 Halaman",
      "Animasi Interaktif (Framer Motion)",
      "Multi-bahasa (ID/EN)",
      "Optimasi Kecepatan (Lighthouse 90+)",
      "Integrasi Live Chat (WA/Messenger)",
      "SEO Technical Audit"
    ],
    recommended: true
  },
  {
    id: "s-5",
    title: "Website Undangan Digital",
    price: "Rp 1.200.000",
    duration: "3-4 Hari Kerja",
    description: "Undangan pernikahan atau event yang estetik. Hemat kertas dan mudah disebarkan.",
    category: "frontend",
    features: [
      "Desain Custom (Bukan Template Pasaran)",
      "Fitur RSVP (Konfirmasi Kehadiran)",
      "Countdown Timer",
      "Galeri Foto Pre-wedding",
      "Integrasi Google Maps",
      "Background Music"
    ],
    recommended: false
  },
  {
    id: "s-6",
    title: "Figma to React/Next.js",
    price: "Mulai Rp 1.000.000 / Halaman",
    duration: "Tergantung Desain",
    description: "Punya desain di Figma? Saya ubah menjadi kode React/Next.js yang rapi (Pixel Perfect).",
    category: "frontend",
    features: [
      "Pixel Perfect Implementation",
      "Clean Code & Component Based",
      "Fully Responsive",
      "Interaksi Hover/Active state",
      "Optimasi Aset Gambar",
      "Source Code Only"
    ],
    recommended: false
  },

  // --- KATEGORI: FULLSTACK (Fokus Fungsi & Data) ---
  {
    id: "s-7",
    title: "Toko Online WhatsApp",
    price: "Rp 3.500.000",
    duration: "7-10 Hari Kerja",
    description: "Katalog produk online. Pengunjung memilih barang, lalu order diteruskan otomatis ke chat WhatsApp Anda.",
    category: "fullstack",
    features: [
      "Admin Panel (Input Produk)",
      "Kategori & Pencarian Produk",
      "Keranjang Belanja Sederhana",
      "Checkout via WhatsApp API",
      "Tidak Perlu Payment Gateway",
      "Training Penggunaan Admin"
    ],
    recommended: true
  },
  {
    id: "s-8",
    title: "Toko Online Professional",
    price: "Rp 7.500.000",
    duration: "14-21 Hari Kerja",
    description: "E-commerce lengkap dengan hitung ongkir otomatis dan pembayaran online (Virtual Account/E-Wallet).",
    category: "fullstack",
    features: [
      "Integrasi RajaOngkir",
      "Payment Gateway (Midtrans/Xendit)",
      "Manajemen Stok Otomatis",
      "Member Area & Riwayat Order",
      "Email Notifikasi Transaksi",
      "Laporan Penjualan"
    ],
    recommended: false
  },
  {
    id: "s-9",
    title: "Portal Berita / Blog",
    price: "Rp 4.000.000",
    duration: "7-10 Hari Kerja",
    description: "Media online untuk publikasi artikel, berita, atau blog pribadi dengan CMS yang powerful.",
    category: "fullstack",
    features: [
      "CMS Custom / Headless CMS",
      "Manajemen Kategori & Tag",
      "Sistem Komentar",
      "Slot Iklan (AdSense Ready)",
      "Fitur Share ke Sosmed",
      "Optimasi SEO Artikel (Schema Markup)"
    ],
    recommended: false
  },
  {
    id: "s-10",
    title: "Sistem Kasir (POS) Cloud",
    price: "Rp 6.000.000",
    duration: "14-20 Hari Kerja",
    description: "Aplikasi kasir berbasis web untuk cafe/toko. Bisa diakses dari tablet atau laptop di mana saja.",
    category: "fullstack",
    features: [
      "Transaksi Penjualan Cepat",
      "Cetak Struk (Thermal Printer)",
      "Laporan Harian/Bulanan",
      "Manajemen Stok Real-time",
      "Multi-user (Kasir & Owner)",
      "Database Backup Otomatis"
    ],
    recommended: false
  },
  {
    id: "s-11",
    title: "Sistem Inventory Gudang",
    price: "Rp 8.000.000",
    duration: "20-30 Hari Kerja",
    description: "Aplikasi pencatatan stok masuk dan keluar untuk gudang atau distributor agar data akurat.",
    category: "fullstack",
    features: [
      "Barang Masuk & Keluar",
      "Opname Stok",
      "Cetak Surat Jalan",
      "Dashboard Statistik Stok",
      "Peringatan Stok Menipis",
      "Export Data Excel/PDF"
    ],
    recommended: false
  },
  {
    id: "s-12",
    title: "Website Sekolah / Kampus",
    price: "Rp 5.500.000",
    duration: "10-14 Hari Kerja",
    description: "Website institusi pendidikan dengan fitur pengumuman, profil guru, dan pendaftaran siswa baru (PPDB).",
    category: "fullstack",
    features: [
      "Profil Institusi & Fasilitas",
      "Direktori Guru & Staff",
      "Sistem Pengumuman & Berita",
      "Formulir PPDB Online",
      "Download Area (Materi/Jadwal)",
      "Galeri Kegiatan"
    ],
    recommended: false
  },
  {
    id: "s-13",
    title: "Booking & Reservasi",
    price: "Rp 5.000.000",
    duration: "10-14 Hari Kerja",
    description: "Sistem booking jadwal untuk klinik, salon, bengkel, atau sewa lapangan.",
    category: "fullstack",
    features: [
      "Kalender Ketersediaan Slot",
      "Form Booking Online",
      "Notifikasi Email/WA",
      "Manajemen Jadwal Admin",
      "Riwayat Booking",
      "Pembayaran DP (Opsional)"
    ],
    recommended: false
  },
  {
    id: "s-14",
    title: "Custom Web Application",
    price: "Mulai Rp 10.000.000",
    duration: "1-3 Bulan",
    description: "Punya ide startup atau sistem bisnis unik? Saya buatkan aplikasi web custom sesuai flow bisnis Anda.",
    category: "fullstack",
    features: [
      "Analisis Kebutuhan Mendalam",
      "Desain Database Custom",
      "Pengembangan Fitur Spesifik",
      "Testing & Quality Assurance",
      "Deployment ke Server",
      "Garansi Bug 3 Bulan"
    ],
    recommended: true
  },

  // --- KATEGORI: BACKEND (API & Database) ---
  {
    id: "s-15",
    title: "REST API Development",
    price: "Mulai Rp 2.500.000",
    duration: "5-7 Hari Kerja",
    description: "Pembuatan Backend/API untuk kebutuhan aplikasi mobile atau integrasi sistem pihak ketiga.",
    category: "backend",
    features: [
      "Arsitektur API yang Aman",
      "Dokumentasi API (Swagger)",
      "Autentikasi (JWT/OAuth)",
      "Optimasi Query Database",
      "Upload File Handling",
      "Unit Testing"
    ],
    recommended: false
  },
  {
    id: "s-16",
    title: "Integrasi Payment Gateway",
    price: "Rp 1.500.000",
    duration: "2-3 Hari Kerja",
    description: "Jasa pasang sistem pembayaran otomatis (Midtrans/Xendit) ke website yang sudah ada.",
    category: "backend",
    features: [
      "Setup Akun Payment Gateway",
      "Integrasi API (Snap/Core)",
      "Handling Webhook/Callback",
      "Testing Environment",
      "Switch ke Production",
      "Dokumentasi Teknis"
    ],
    recommended: false
  }
];