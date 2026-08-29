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
    id: "s-app-smarthome",
    title: "Smart Home Controller Dashboard",
    price: "Rp 10.000.000",
    duration: "Mulai 20 Hari",
    shortDesc: "Kendalikan rumah Anda dari satu layar! Dashboard terpusat untuk menyalakan lampu, mengunci pintu, memantau CCTV, hingga mengatur suhu AC secara jarak jauh.",
    description: `
      <p class="mb-4"><strong>Satu layar cerdas untuk mengendalikan seluruh penjuru rumah Anda.</strong></p>
      <p class="mb-6">Banyak pemilik rumah modern terjebak dalam kerumitan memiliki 5 aplikasi berbeda di HP hanya untuk menyalakan lampu (Tuya), mengecek kamera (Bardi), dan mengunci pintu (Xiaomi). <strong>Smart Home Controller Dashboard</strong> adalah antarmuka web terpusat (layaknya <em>Home Assistant</em>) yang menyatukan semua kendali perangkat IoT Anda dalam satu sistem yang elegan. Pasang <em>dashboard</em> ini di <em>tablet</em> dinding ruang tamu Anda, dan rasakan sensasi hidup di rumah masa depan!</p>
      
      <h3 class="text-lg font-bold mb-2 text-primary">💡 Sentralisasi & Otomatisasi (IoT)</h3>
      <ul class="space-y-2 mb-6 list-none text-muted-foreground">
        <li>✅ <strong>Saklar Virtual Universal:</strong> Matikan lampu taman, nyalakan pemanas air, atau tutup tirai jendela hanya dengan satu sentuhan jari, langsung dari antarmuka Web yang cantik (Mendukung <em>Dark/Light Mode</em>).</li>
        <li>✅ <strong>Penjadwalan (Smart Scheduling):</strong> Biarkan rumah Anda berpikir sendiri. Atur agar seluruh lampu luar menyala pada pukul 18:00 dan AC kamar mati perlahan di jam 05:00 pagi.</li>
        <li>✅ <strong>Integrasi Sensor Suhu & Gerak:</strong> Pantau kualitas udara dan suhu ruangan secara <em>real-time</em> langsung di <em>Dashboard</em> Anda.</li>
      </ul>

      <div class="p-4 mb-6 bg-primary/10 border-l-4 border-primary rounded-r-lg text-sm text-foreground/80">
        <strong>Fokus Utama: Mode Skenario (Scene) & Alarm Keamanan.</strong><br/>
        Ubah suasana ruangan dalam hitungan detik! Pada Paket Premium, kami menghadirkan <strong>Mode Skenario</strong>. Cukup klik tombol <em>"Movie Mode"</em>, maka secara ajaib lampu akan meredup, AC menyala dingin, dan tirai otomatis tertutup. Lebih dari itu, sistem ini dibekali pengamanan tingkat tinggi; jika sensor mendeteksi pergerakan di ruang tamu saat Anda sedang liburan, sistem akan langsung menembakkan <strong>Pesan Bahaya ke Telegram</strong> Anda beserta cuplikan langsung dari kamera CCTV!
      </div>
      <p>Cocok untuk: Pemilik Rumah Mewah (Mansion/Villa), Developer Perumahan Cluster, Apartemen Premium, dan Penggemar Teknologi (Tech Enthusiast).</p>
      <p class="text-xs text-muted-foreground mt-4">*Catatan: Harga tertera adalah untuk pembuatan Perangkat Lunak (Software Web Dashboard), tidak termasuk unit perangkat keras (Smart Bulb, CCTV, atau Smart Lock).*</p>
    `,
    thumbnail: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop", 
    category: "fullstack",
    features: [
      "Saklar Virtual (Lampu & Stopkontak)",
      "Sistem Penjadwalan Waktu Otomatis",
      "Mode Skenario (1-Click Automation)",
      "Live CCTV & Alarm Telegram"
    ],
    recommended: true,
    rating: 4.9,
    sales: 14,
    isFlashSale: false,
    tags: [
      "bikin web smarthome", "aplikasi iot rumah", "dashboard smart home", "kontrol lampu jarak jauh", 
      "home assistant clone"
    ],
    isDraft: false,
    packages: [
      {
        name: "Basic",
        description: "Fungsi esensial. Kendalikan perangkat listrik dasar dari genggaman Anda.",
        price: "Rp 10.000.000",
        duration: "20 Hari",
        revisions: "5 Kali",
        features: [
          "Dashboard UI Minimalis (Dark/Light Mode)",
          "Tombol Saklar Virtual (On/Off Lampu/Listrik)",
          "Indikator Status Perangkat (Real-time nyala/mati)",
          "API Ready (Koneksi ke modul ESP8266/Tuya dasar)",
          "Akses Aman (Login PIN/Password)"
        ]
      },
      {
        name: "Standard",
        description: "Best Seller! Biarkan rumah berpikir sendiri dengan fitur penjadwalan & alarm sensor.",
        price: "Rp 18.000.000",
        duration: "30 Hari",
        revisions: "7 Kali",
        features: [
          "Semua Fitur Basic",
          "Sistem Penjadwalan (Jadwal nyala/mati otomatis)",
          "Integrasi Sensor Suhu & Kelembaban Ruangan",
          "Telegram Security Alert (Alarm deteksi gerakan/PIR)",
          "Multi-User (Hak akses terbatas untuk anak/tamu)"
        ]
      },
      {
        name: "Premium",
        description: "Rumah Tony Stark! Mode skenario ala bioskop, live CCTV, dan buka kunci pintu jarak jauh.",
        price: "Rp 30.000.000",
        duration: "45 Hari",
        revisions: "Tidak Terbatas",
        features: [
          "Semua Fitur Standard",
          "Live CCTV Integration (Nonton kamera langsung di Web)",
          "Mode Skenario (Movie Mode / Sleep Mode 1-klik)",
          "Smart Door Lock Control (Buka kunci pintu via Web)",
          "Voice Assistant API Bridge (Google Assistant / Alexa)"
        ]
      }
    ]
  }
];