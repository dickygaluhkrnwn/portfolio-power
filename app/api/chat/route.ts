import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAllProjects } from "@/lib/projects-service";
import { getAllServices } from "@/lib/services-service";
import { getPublishedPosts } from "@/lib/blog-service";

// Inisialisasi dilakukan per-request agar aman

export async function POST(req: NextRequest) {
  try {
    // 1. Cek API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("CRITICAL: GEMINI_API_KEY is missing in .env.local");
      return NextResponse.json(
        { error: "Server Configuration Error: API Key missing" },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    // 2. AMBIL & KOMPRESI DATA (HEMAT TOKEN)
    // Kita ambil data langsung dan membuang field berat (seperti konten HTML panjang/gambar)
    // sehingga AI hanya membaca inti sarinya saja dengan token yang sangat minim.
    const [projectsData, servicesData, blogsData] = await Promise.all([
      getAllProjects(),
      getAllServices(),
      getPublishedPosts()
    ]);

    // Tambahkan Index/Urutan agar AI tahu mana yang terbaru (Asumsi index 0 = terbaru)
    const miniProjects = projectsData.map((p, index) => ({
      urutan_terbaru: index + 1, // Angka 1 berarti paling baru
      nama: p.title,
      kategori: p.category,
      tahun: p.year || "Tidak disebutkan",
      deskripsi: p.desc || (p as any).description,
      teknologi: p.techStack?.map(t => t.name).join(", ") || "Tidak disebutkan",
      link_detail: `/projects/${p.id}`,
      demo: p.demoLink || null,
      repo: p.repoLink || null
    }));

    const miniServices = servicesData.map(s => ({
      nama: s.title,
      kategori: s.category,
      harga: s.price,
      deskripsi_singkat: s.shortDesc,
      link_detail: `/services/${s.id}`
    }));

    const miniBlogs = blogsData.map((b, index) => ({
      urutan_terbaru: index + 1,
      judul: b.title,
      topik: b.tags?.join(", ") || "Umum",
      ringkasan: b.excerpt,
      link_detail: `/blog/${b.slug}`
    }));

    // "Otak" baru yang super komprehensif tapi ringan
    const superContext = `
    [PROFIL DICKY]
    Nama: Dicky Galuh Kurniawan (Panggilan: Iky)
    Role: Full Stack Developer
    Fokus: Membangun aplikasi web modern, cepat, dan user-friendly.
    Kontak: dicky.galuh.kurniawan1@gmail.com, GitHub: dickygaluhkrnwn, LinkedIn: dickygaluhkrnwn

    [DATA PROJECT DICKY] (Urutan 1 adalah yang paling baru)
    ${JSON.stringify(miniProjects)}

    [DATA LAYANAN/SERVICES DICKY]
    ${JSON.stringify(miniServices)}

    [DATA ARTIKEL/BLOG DICKY] (Urutan 1 adalah yang paling baru)
    ${JSON.stringify(miniBlogs)}
    `;

    // 3. Format History
    const rawHistory = messages.slice(0, -1);
    const firstUserIndex = rawHistory.findIndex((msg: any) => msg.role === 'user');
    
    let validHistory = [];
    if (firstUserIndex !== -1) {
      validHistory = rawHistory.slice(firstUserIndex).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));
    }

    // 4. Inisialisasi Gemini Client
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // MENGGUNAKAN MODEL VERSI AMAN YANG TERBUKTI JALAN ("gemini-2.5-flash")
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: {
        role: "system",
        parts: [{ text: `
          Kamu adalah AI Assistant eksklusif untuk Portofolio Dicky. 
          Tugasmu menjawab pertanyaan pengunjung tentang proyek, layanan, atau artikel Dicky berdasarkan DATA JSON yang diberikan di bawah ini.
          
          ATURAN EMAS (WAJIB DIIKUTI):
          1. BACA DATA JSON DENGAN TELITI: Perhatikan properti 'urutan_terbaru'. Jika ditanya "Project atau Blog terbaru", pastikan kamu mengambil item dengan urutan_terbaru nomor 1.
          2. JANGAN PERNAH MENGARANG (HALLUCINATE): Jika data tidak ada di JSON, bilang dengan sopan bahwa kamu belum punya informasinya.
          3. SELALU BERIKAN LINK KLIKABEL (MARKDOWN): Saat kamu menyebutkan nama Project, Layanan, atau Blog yang ada di data, kamu WAJIB membungkusnya dengan link menggunakan properti 'link_detail'.
             Contoh Format Output: 
             "Proyek terbaru Dicky adalah **[28 Coffee](/projects/1)**. Teknologi yang digunakan adalah React. Anda bisa melihat live demonya [di sini](https://demo.com)."
          4. BAHASA: Ramah, santai, profesional, dan gunakan bahasa Indonesia. Jangan menjawab dalam format JSON kaku, melainkan ubah jadi paragraf atau daftar (bullet points) yang enak dibaca manusia.
          
          KONTEKS DATA (SUMBER KEBENARANMU):
          ${superContext}
        `}],
      },
    });

    const lastMessage = messages[messages.length - 1].content;

    // 5. Mulai Chat Session
    const chatSession = model.startChat({
      history: validHistory,
    });

    // 6. Kirim pesan TANPA streaming (Metode aman terbukti berhasil)
    const result = await chatSession.sendMessage(lastMessage);

    // 7. Kembalikan response JSON murni
    return NextResponse.json({ result: result.response.text() });

  } catch (error: any) {
    console.error("Error in chat API:", error);
    
    // Tangkap error spesifik
    const errorMessage = error.message || "Terjadi kesalahan pada server AI.";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}