export interface PricingTier {
  name: "Basic" | "Standard" | "Premium";
  description: string;
  price: string;
  duration: string;
  revisions: string;
  features: string[];
}

export interface ServicePackage {
  id: string;
  title: string;
  price: string; // Starting price if packages exist
  duration: string;
  shortDesc: string;
  description: string; // HTML for Rich Text
  thumbnail: string;
  category: "frontend" | "fullstack" | "backend" | "maintenance" | "mobile";
  features: string[]; // General features (fallback if no packages)
  recommended?: boolean;
  rating?: number;
  sales?: number;
  
  isFlashSale?: boolean;
  flashSalePrice?: string;
  originalPrice?: string; 
  discountValue?: string;

  packages?: PricingTier[]; // Optional dynamic packages
  tags?: string[]; // SEO / Visibilitas
  isDraft?: boolean; // Sembunyikan dari publik
}

export const servicesData: ServicePackage[] = [
  {
    id: "s-12",
    title: "Pembuatan Aplikasi Mobile Premium (Android & iOS) + Integrasi AI",
    price: "Rp 2.500.000",
    duration: "Mulai 5 Hari",
    shortDesc: "Aplikasi mobile lintas platform modern (Android & iOS) dengan UI/UX sekelas global, fitur mutakhir, dan integrasi kecerdasan buatan (AI).",
    description: `
      <p class="mb-4">Halo! Butuh aplikasi mobile modern, cepat, dan terlihat premium untuk bisnis atau ide startup Anda? Anda berada di tempat yang tepat!</p>
      <p class="mb-6">Saya adalah Mobile App Developer yang berspesialisasi dalam membangun aplikasi lintas platform (Android & iOS) dengan antarmuka (UI/UX) sekelas aplikasi global.</p>
      
      <h3 class="text-lg font-bold mb-2 text-primary">🔥 Spesialisasi Saya:</h3>
      <ul class="space-y-2 mb-6 list-none text-muted-foreground">
        <li>✅ <strong>Aplikasi Produktivitas & Utilitas:</strong> Seperti To-Do List, Habit Tracker, Note-taking, dan Dashboard Analitik.</li>
        <li>✅ <strong>Integrasi Kecerdasan Buatan (AI):</strong> Menghubungkan aplikasi Anda dengan AI canggih (Google Gemini / OpenAI ChatGPT) untuk fitur smart chat, ringkasan teks, atau pemrosesan data otomatis.</li>
        <li>✅ <strong>UI/UX Premium:</strong> Desain modern (Light/Dark Mode) dengan animasi mulus dan interaksi yang memanjakan pengguna.</li>
      </ul>

      <h3 class="text-lg font-bold mb-2 text-primary">💻 Tech Stack yang Digunakan:</h3>
      <ul class="space-y-2 mb-6 list-none text-muted-foreground">
        <li><strong>Frontend:</strong> React Native & Expo (Satu kode untuk Android & iOS).</li>
        <li><strong>Backend & Database:</strong> Google Firebase (Authentication, Cloud Firestore) yang real-time dan super aman.</li>
        <li><strong>Styling:</strong> NativeWind (Tailwind CSS) & Reanimated untuk animasi 60fps.</li>
      </ul>

      <div class="p-4 mb-6 bg-primary/10 border-l-4 border-primary rounded-r-lg text-sm text-foreground/80">
        <strong>Kelebihan Bekerja Sama dengan Saya:</strong><br/>
        ✔️ Kode terstruktur, rapi, dan mudah dikembangkan di masa depan (Scalable).<br/>
        ✔️ Komunikasi responsif dan transparan.<br/>
        ✔️ Gratis konsultasi arsitektur aplikasi sebelum mulai.
      </div>
      <p>Mari diskusikan ide aplikasi Anda, dan mari kita wujudkan menjadi nyata!</p>
    `,
    thumbnail: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop", 
    category: "mobile",
    features: [
      "Pembuatan UI/UX Premium",
      "React Native & Expo",
      "Integrasi Firebase",
      "Kecerdasan Buatan (AI)"
    ],
    recommended: true,
    rating: 5.0,
    sales: 12,
    
    isFlashSale: false, 
    originalPrice: "",
    discountValue: "",
    tags: [
      "pembuatan aplikasi", "react native", "android developer", "ios developer", 
      "firebase", "integrasi AI", "aplikasi mobile", "bikin aplikasi", 
      "aplikasi produktivitas", "expo"
    ],
    isDraft: false,

    packages: [
      {
        name: "Basic",
        description: "Konversi desain UI Anda menjadi kode aplikasi React Native fungsional (tanpa database online/API). Cocok untuk purwarupa (MVP) visual atau aplikasi offline.",
        price: "Rp 2.500.000",
        duration: "5 Hari",
        revisions: "2 Kali",
        features: [
          "File Source Code Lengkap",
          "File APK (Android) Siap Install",
          "UI Responsif (Maks 5 Halaman)",
          "Tanpa Database / Offline"
        ]
      },
      {
        name: "Standard",
        description: "Aplikasi Mobile (Android/iOS) lengkap dengan sistem Login, Database (CRUD), profil user, dan penyimpanan awan (Firebase).",
        price: "Rp 5.500.000",
        duration: "14 Hari",
        revisions: "3 Kali",
        features: [
          "Semua Fitur Basic",
          "Integrasi Firebase Auth & Firestore",
          "Maksimal 10 Halaman",
          "Bantuan Upload ke Google Play Store"
        ]
      },
      {
        name: "Premium",
        description: "Solusi All-in-One. Aplikasi dinamis lengkap (Paket Standard) DITAMBAH integrasi AI (Gemini/ChatGPT API), Animasi Kompleks, dan Dark Mode.",
        price: "Rp 9.500.000",
        duration: "25 Hari",
        revisions: "Tidak Terbatas",
        features: [
          "Semua Fitur Standard",
          "Integrasi AI API (Gemini/ChatGPT)",
          "Desain Premium & Animasi Kompleks",
          "Maksimal 15 Halaman",
          "Dark / Light Mode"
        ]
      }
    ]
  },
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
    sales: 56
  },
  {
    id: "s-11", 
    title: "Portal Berita / Blog Pro",
    price: "Rp 4.000.000",
    duration: "7-14 Hari Kerja",
    shortDesc: "Website media online siap trafik tinggi. CMS mudah dipakai, slot iklan strategis (AdSense ready), dan SEO friendly.",
    description: `
      <p class="mb-4"><strong>Bangun media digital Anda sendiri dengan platform yang powerful.</strong></p>
      <p class="mb-6">Paket <em>Portal Berita</em> ini dirancang khusus untuk publisher, komunitas, atau instansi yang rutin menerbitkan artikel.</p>
    `,
    thumbnail: "https://i.imgur.com/placeholder-news.jpg",
    category: "fullstack",
    features: [
      "Custom CMS (Content Management System)",
      "Manajemen Kategori & Tag",
      "Manajemen Penulis (Author)",
      "Slot Iklan Dinamis",
      "Fitur Share ke Sosmed"
    ],
    recommended: false,
    rating: 4.9,
    sales: 22
  }
];