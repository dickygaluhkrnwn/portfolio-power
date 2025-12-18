import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPortfolioContext } from "@/lib/portfolio-context";

// Kita tidak menggunakan lib/gemini.ts lagi untuk route ini agar lebih aman
// Inisialisasi dilakukan per-request seperti di Clashub

export async function POST(req: NextRequest) {
  try {
    // 1. Cek API Key (Debugging)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("CRITICAL: GEMINI_API_KEY is missing in .env.local");
      return NextResponse.json(
        { error: "Server Configuration Error: API Key missing" },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    // 2. Ambil "Otak" (Context)
    const portfolioContext = await getPortfolioContext();

    // 3. Format History (Filter pesan awal sistem/assistant agar history valid)
    // Gemini mewajibkan history dimulai dengan role 'user'.
    const rawHistory = messages.slice(0, -1);
    const firstUserIndex = rawHistory.findIndex((msg: any) => msg.role === 'user');
    
    let validHistory = [];
    if (firstUserIndex !== -1) {
      validHistory = rawHistory.slice(firstUserIndex).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));
    }

    // 4. Inisialisasi Gemini Client (Clashub Style)
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Kita gunakan model standar yang paling stabil dulu: 'gemini-1.5-flash'
    // Jika masih gagal, baru kita coba 'gemini-2.5-flash-preview-09-2025' seperti Clashub
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-09-2025",
      systemInstruction: {
        role: "system",
        parts: [{ text: `
          Kamu adalah AI Assistant untuk Portofolio Dicky. 
          Tugasmu adalah menjawab pertanyaan pengunjung seputar pengalaman, proyek, dan keahlian Dicky.
          Bersikaplah profesional, ramah, dan membantu. Gunakan Bahasa Indonesia.
          
          Gunakan konteks berikut sebagai sumber kebenaran utama:
          ${portfolioContext}
        `}],
      },
    });

    const lastMessage = messages[messages.length - 1].content;

    // 5. Mulai Chat Session
    const chatSession = model.startChat({
      history: validHistory,
    });

    // 6. Kirim pesan dan minta respons streaming
    const result = await chatSession.sendMessageStream(lastMessage);

    // 7. Buat ReadableStream untuk dikirim ke frontend
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });

  } catch (error: any) {
    console.error("Error in chat API:", error);
    
    // Tangkap error spesifik Google
    const errorMessage = error.message || "Terjadi kesalahan pada server AI.";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}