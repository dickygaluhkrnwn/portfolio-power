export interface JourneyItem {
  id: string;
  year: string;
  role: string;
  company: string; // Bisa nama perusahaan fiktif/placeholder atau deskripsi tempat
  type: "work" | "education" | "certification";
  desc: string;
}

export const journeyData: JourneyItem[] = [
  {
    id: "j-1",
    year: "2023 - Present",
    role: "Full Stack Developer",
    company: "Freelance / Agency",
    type: "work",
    desc: "Menggabungkan keahlian Frontend dan Backend untuk membangun aplikasi web modern (Next.js & Firebase). Bertanggung jawab penuh mulai dari arsitektur database, keamanan sistem, hingga implementasi antarmuka yang interaktif dan responsif."
  },
  {
    id: "j-2",
    year: "2021 - 2023",
    role: "Back End Developer",
    company: "Tech Startup Indonesia",
    type: "work",
    desc: "Fokus mendalam pada logika sisi server. Merancang RESTful API yang efisien, mengelola database SQL/NoSQL, dan memastikan keamanan data pengguna serta performa server yang stabil di bawah beban trafik tinggi."
  },
  {
    id: "j-3",
    year: "2020 - 2021",
    role: "Front End Developer",
    company: "Digital Creative Studio",
    type: "work",
    desc: "Memulai karir profesional dengan spesialisasi pada UI/UX. Menerjemahkan desain statis menjadi kode React.js yang hidup, memastikan kompatibilitas lintas browser, dan menciptakan pengalaman pengguna yang mulus."
  }
];