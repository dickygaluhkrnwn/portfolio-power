import { NextRequest, NextResponse } from "next/server";
import { getPortfolioContext } from "@/lib/portfolio-context";
import { chatWithGroq } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse incoming messages
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // 2. AMBIL KONTEKS SUPER DARI PORTFOLIO CONTEXT
    // Konteks ini sudah diperbarui dengan detail Paket Berjenjang, Flash Sale, dll.
    const superContextData = await getPortfolioContext();

    // 3. System Instruction yang sangat kuat
    const systemInstruction = `Kamu adalah AI Assistant eksklusif untuk Portofolio Dicky. 
Tugasmu menjawab pertanyaan pengunjung tentang proyek, layanan, atau artikel Dicky berdasarkan DATA yang diberikan di bawah ini.

ATURAN EMAS (WAJIB DIIKUTI):
1. BACA DATA DENGAN TELITI. Jika ditanya tentang layanan, pastikan kamu menawarkan paket yang sesuai jika ada paket berjenjang (Basic/Standard/Premium).
2. JANGAN PERNAH MENGARANG (HALLUCINATE): Jika data tidak ada, bilang dengan sopan bahwa kamu belum punya informasinya.
3. JAWAB SINGKAT PADAT JELAS. Jika user hanya menyapa, sapa balik dengan ramah tanpa perlu memberikan daftar panjang.
4. JUALAN & MARKETING: Jika user menanyakan jasa, berikan jawaban persuasif layaknya sales profesional dan sebutkan benefit atau diskon/flash sale jika sedang aktif!
5. BAHASA: Ramah, santai, profesional, dan gunakan bahasa Indonesia. Gunakan format markdown (bullet points, bold) agar enak dibaca.
6. SELALU BERIKAN LINK KLIKABEL (MARKDOWN): Saat menyebutkan Proyek atau Layanan, bungkus dengan link menggunakan format markdown. Contoh: [Web E-Commerce](/projects/1) atau [Jasa Pembuatan Web](/services/2).
7. DILARANG KERAS MENGGUNAKAN HTML TAGS (seperti <br>, <a>, <b>). SELALU GUNAKAN PURE MARKDOWN UNTUK FORMATTING.

KONTEKS DATA (SUMBER KEBENARANMU):
${superContextData}`;

    // 4. Panggil Groq API
    const responseText = await chatWithGroq(messages, systemInstruction);

    // 5. Kembalikan response JSON murni
    return NextResponse.json({ result: responseText });

  } catch (error: any) {
    console.error("Error in chat API:", error);
    
    let errorMessage = error.message || "Terjadi kesalahan pada server AI.";
    
    // Tangkap error spesifik Rate Limit dari Groq
    if (errorMessage.toLowerCase().includes("rate limit") || errorMessage.includes("429")) {
      errorMessage = "Sistem AI kami sedang melayani banyak antrean pengunjung saat ini. 🙏 Mohon tunggu beberapa detik dan coba kirim pesan Anda lagi ya!";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}