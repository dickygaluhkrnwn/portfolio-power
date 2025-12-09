export interface ServicePackage {
  id: string;
  title: string;
  price: string;
  duration: string;
  shortDesc: string;
  description: string; // Berisi HTML untuk Rich Text
  thumbnail: string;
  category: "frontend" | "fullstack" | "backend" | "maintenance";
  features: string[];
  recommended?: boolean;
  rating?: number;
  sales?: number;
  
  // Field Baru untuk Flash Sale & Diskon
  isFlashSale?: boolean;
  originalPrice?: string; // Harga Coret (e.g. "Rp 5.000.000")
  discountValue?: number; // Persentase (e.g. 40)
}

export const servicesData: ServicePackage[] = [
  {
    id: "s-10",
    title: "Website Redesign & Optimization",
    price: "Rp 3.000.000",
    duration: "5-10 Hari Kerja",
    shortDesc: "Punya website tapi lemot dan tampilan jadul? Kami rombak total tampilannya menjadi modern, responsif, dan skor Google Lighthouse hijau.",
    description: `
      <p class="mb-4"><strong>Website lama Anda mungkin mengusir pelanggan tanpa Anda sadari.</strong></p>
      <p class="mb-6">Di era 2024 ke atas, pengguna internet tidak mentolerir website yang loadingnya lebih dari 3 detik atau berantakan saat dibuka di HP. Paket <em>Redesign</em> ini bukan sekadar ganti warna, tapi menulis ulang kode website Anda menggunakan teknologi modern (Next.js) agar performanya maksimal.</p>
      
      <div class="p-4 mb-6 bg-green-500/10 border-l-4 border-green-500 rounded-r-lg text-sm text-green-200">
        <strong>🚀 Target Kami:</strong> Skor Google Lighthouse di atas 90 (Hijau) untuk Performance, Accessibility, dan SEO.
      </div>

      <h3 class="text-lg font-bold mb-2 text-primary">Apa Saja yang Dirombak?</h3>
      <ul class="space-y-2 mb-6 list-none text-muted-foreground">
        <li>✅ <strong>UI/UX Modern:</strong> Mengubah tampilan kaku menjadi fluid, estetik, dan enak dipandang (User Friendly).</li>
        <li>✅ <strong>Struktur Kode:</strong> Migrasi dari CMS berat (seperti WP lama) atau HTML lawas ke React/Next.js yang ringan.</li>
        <li>✅ <strong>Optimasi Aset:</strong> Kompresi gambar otomatis (WebP), lazy loading, dan pembersihan script sampah.</li>
      </ul>

      <h3 class="text-lg font-bold mb-2 text-primary">Tanda Website Anda Butuh Ini:</h3>
      <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6 text-sm">
        <li class="flex items-center gap-2"><span class="text-red-400">●</span> Loading lebih dari 5 detik</li>
        <li class="flex items-center gap-2"><span class="text-red-400">●</span> Tampilan hancur di HP</li>
        <li class="flex items-center gap-2"><span class="text-red-400">●</span> Susah ditemukan di Google</li>
        <li class="flex items-center gap-2"><span class="text-red-400">●</span> Desain terlihat seperti tahun 2010</li>
      </ul>
    `,
    thumbnail: "https://i.imgur.com/placeholder-redesign.jpg", 
    category: "frontend",
    features: [
      "Audit Website Lama Gratis",
      "Redesign UI/UX Total",
      "Optimasi Core Web Vitals",
      "Migrasi Konten Lama",
      "Setup SEO On-Page Baru",
      "Garansi Kenaikan Speed",
      "Maintenance 1 Bulan"
    ],
    recommended: false,
    rating: 4.8,
    sales: 56,
    
    // Contoh Data Diskon (Bisa diaktifkan lewat Admin nanti)
    isFlashSale: false, 
    originalPrice: "",
    discountValue: 0
  },
  {
    id: "s-11", 
    title: "Portal Berita / Blog Pro",
    price: "Rp 4.000.000",
    duration: "7-14 Hari Kerja",
    shortDesc: "Website media online siap trafik tinggi. CMS mudah dipakai, slot iklan strategis (AdSense ready), dan SEO friendly.",
    description: `
      <p class="mb-4"><strong>Bangun media digital Anda sendiri dengan platform yang powerful.</strong></p>
      <p class="mb-6">Paket <em>Portal Berita</em> ini dirancang khusus untuk publisher, komunitas, atau instansi yang rutin menerbitkan artikel. Kami fokus pada dua hal: <strong>Kemudahan Menulis</strong> bagi admin dan <strong>Kenyamanan Membaca</strong> bagi pengunjung.</p>
      
      <h3 class="text-lg font-bold mb-2 text-primary">Fitur Khusus Publisher:</h3>
      <ul class="space-y-2 mb-6 list-none text-muted-foreground">
        <li>✅ <strong>CMS User Friendly:</strong> Dashboard admin yang semudah mengetik di Word. Support upload gambar, video, dan embed sosmed.</li>
        <li>✅ <strong>AdSense Optimized:</strong> Tata letak sudah disiapkan dengan slot iklan strategis (Header, In-Article, Sidebar) untuk memaksimalkan revenue tanpa mengganggu pembaca.</li>
        <li>✅ <strong>Related Articles:</strong> Fitur "Artikel Terkait" cerdas untuk menjaga pembaca tetap lama di website Anda (Bounce Rate rendah).</li>
      </ul>

      <div class="p-4 bg-secondary/20 border-l-4 border-primary rounded-r-lg italic text-sm text-foreground/80">
        "Konten adalah raja, tapi platform adalah istananya. Kami bangun istana yang megah agar konten Anda dihargai."
      </div>
    `,
    thumbnail: "https://i.imgur.com/placeholder-news.jpg",
    category: "fullstack",
    features: [
      "Custom CMS (Content Management System)",
      "Manajemen Kategori & Tag",
      "Manajemen Penulis (Author)",
      "Slot Iklan Dinamis",
      "Fitur Share ke Sosmed",
      "Schema Markup Berita (SEO)",
      "Newsletter Subscription Form"
    ],
    recommended: false,
    rating: 4.9,
    sales: 22,

    // Default Diskon Kosong
    isFlashSale: false,
    originalPrice: "",
    discountValue: 0
  }
];