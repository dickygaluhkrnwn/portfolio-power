import { GoogleGenerativeAI } from "@google/generative-ai";

// Mengambil API Key dari environment variable
const apiKey = process.env.GEMINI_API_KEY as string;

// Validasi sederhana agar kita tahu jika key belum dipasang
if (!apiKey) {
  console.warn("PERINGATAN: GEMINI_API_KEY tidak ditemukan di .env.local");
}

// Inisialisasi client Gemini
const genAI = new GoogleGenerativeAI(apiKey);

// PERBAIKAN: Gunakan 'gemini-1.5-flash'
// Ini adalah model standar terbaru. Karena kamu sudah Enable API di console,
// model ini seharusnya sekarang sudah bisa diakses.
export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});