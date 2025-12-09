export interface Project {
  id: number | string;
  title: string;
  subtitle?: string;
  desc: string;
  category: "fullstack" | "frontend" | "backend" | "mobile" | "uiux";
  techStack: { name: string; color: string }[];
  image: string; 
  demoLink?: string;
  repoLink?: string;
  featured?: boolean;
  
  // Detail khusus
  challenge?: string;
  solution?: string;
  features?: string[];
  year?: string;
  role?: string;
  client?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "28 Coffee",
    subtitle: "Your 24/7 Sanctuary in Jogja",
    desc: "Website resmi untuk 28 Coffee, sebuah cafe 24 jam di Yogyakarta. Membawa suasana 'Sanctuary' cafe ke ranah digital.",
    category: "fullstack",
    techStack: [
      { name: "Next.js 15", color: "#000000" },
      { name: "TypeScript", color: "#3178C6" },
      { name: "Tailwind CSS v4", color: "#38B2AC" },
      { name: "Framer Motion", color: "#E902B5" },
      { name: "Lucide React", color: "#F56565" },
    ],
    image: "/images/suasana-utama.jpg",
    demoLink: "https://28-coffee.vercel.app/",
    repoLink: "#",
    featured: true,
    year: "2024",
    role: "Full Stack Developer",
    client: "28 Coffee Jogja",
    challenge: "Tantangan utama adalah menciptakan keseimbangan antara estetika visual yang berat dengan performa website yang cepat.",
    solution: "Saya membangun aplikasi ini menggunakan Next.js 15 (App Router) untuk memanfaatkan Server Side Rendering demi SEO yang optimal.",
    features: [
      "Cinematic Parallax Hero Section",
      "Instant Menu Filtering & Search",
      "Responsive Interactive Map",
      "Custom Design System (Theme-aware)",
      "Optimized Image Loading"
    ]
  },
  {
    id: "2",
    title: "Eternity Coffee",
    subtitle: "The Ultimate 24/7 Coffee Club",
    desc: "Platform digital untuk Eternity Coffee. Desain estetik dengan tema Sage Green dan fitur menu interaktif yang seamless.",
    category: "frontend",
    techStack: [
      { name: "Next.js 16", color: "#000000" },
      { name: "React 19", color: "#61DAFB" },
      { name: "Tailwind CSS v4", color: "#38B2AC" },
      { name: "Framer Motion", color: "#E902B5" },
    ],
    image: "/images/eternity-cover.jpg",
    demoLink: "https://eternity-coffee.vercel.app/",
    repoLink: "#",
    featured: true,
    year: "2024",
    role: "Frontend Engineer",
    client: "Eternity Coffee",
    challenge: "Klien ingin website yang tidak hanya informatif tapi juga memancarkan 'Vibe' tempatnya yang nyaman untuk nugas berjam-jam.",
    solution: "Solusinya adalah Single Page Application feel dengan Next.js. Desain UI menggunakan konsep Glassmorphism.",
    features: [
      "Real-time Menu Search & Filter",
      "Interactive Facilities Grid",
      "Dark/Sage Theme Implementation",
      "Mobile-First Navigation"
    ]
  },
  {
    id: "3",
    title: "Atika Cake & Bakery",
    subtitle: "Premium Custom Cakes in Lombok",
    desc: "Katalog digital untuk toko kue legendaris di Lombok dengan 3 cabang. Menampilkan produk unggulan seperti Custom Tart dan Wedding Cake dengan visual yang menggugah selera.",
    category: "frontend",
    techStack: [
      { name: "Next.js 16", color: "#000000" },
      { name: "Tailwind CSS v4", color: "#38B2AC" },
      { name: "Framer Motion", color: "#E902B5" },
    ],
    image: "/images/atika-cover.jpg", // Pastikan file ini ada!
    demoLink: "https://atika-cake-bakery.vercel.app/",
    repoLink: "#",
    featured: true,
    year: "2024",
    role: "Frontend Developer",
    client: "Atika Cake & Bakery",
    challenge: "Tantangannya adalah mengelola katalog produk yang sangat beragam (Tart, Roti, Snack) dan memudahkan pelanggan menemukan lokasi 3 cabang yang tersebar di Lombok (Mataram, Praya, Kediri).",
    solution: "Saya merancang sistem kategori menu yang dinamis dan halaman 'Lokasi' yang terintegrasi dengan Google Maps. UI didominasi warna brand (Merah & Kuning) namun tetap terlihat modern dan bersih.",
    features: [
      "Dynamic WhatsApp Ordering Link",
      "Multi-location Branch Finder",
      "Product Category Filtering",
      "Responsive Mobile Layout",
      "Brand Identity Implementation"
    ]
  },
  {
    id: "4",
    title: "Crypto Dashboard",
    desc: "Dashboard real-time tracking harga aset kripto dengan WebSocket dan grafik interaktif.",
    category: "frontend",
    techStack: [{ name: "Vue.js", color: "#4FC08D" }],
    image: "/images/projects/crypto.jpg",
    demoLink: "#",
    featured: false
  },
];