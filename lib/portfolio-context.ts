import { getAllProjects } from "@/lib/projects-service";
import { getAllJourneyItems } from "@/lib/journey-service";
import { getAllServices } from "@/lib/services-service";
import { getAllSocials } from "@/lib/socials-service";
import { getPublishedPosts } from "@/lib/blog-service";

export async function getPortfolioContext(): Promise<string> {
  try {
    // Mengambil semua data secara paralel agar cepat
    const [projects, journey, services, socials, posts] = await Promise.all([
      getAllProjects(),
      getAllJourneyItems(),
      getAllServices(),
      getAllSocials(),
      getPublishedPosts(),
    ]);

    // Format data menjadi string yang mudah dibaca oleh AI
    const contextString = `
INFORMASI PORTOFOLIO (DATA DIRI & PENGALAMAN):

1. PROYEK (PROJECTS):
Berikut adalah daftar proyek yang telah dikerjakan:
${projects.map((p: any) => `- Nama: ${p.title}
  Deskripsi: ${p.desc || p.description}
  Kategori: ${p.category}
  Teknologi: ${p.techStack?.map((t:any) => t.name).join(", ") || p.technologies?.join(", ") || "N/A"}
  Link Demo: ${p.demoLink || p.demoUrl || "Tidak tersedia"}
  Link Repo: ${p.repoLink || p.repoUrl || "Tidak tersedia"}
  Tipe: ${p.isFlexible ? "Fleksibel (bisa dikustomisasi bebas)" : "Fixed/Standard"}
`).join("\n")}

2. PERJALANAN KARIR & PENDIDIKAN (JOURNEY):
Riwayat pengalaman kerja dan pendidikan:
${journey.map((j: any) => `- Posisi/Gelar: ${j.role}
  Institusi: ${j.company}
  Tahun: ${j.year}
  Deskripsi: ${j.desc}
`).join("\n")}

3. LAYANAN (SERVICES):
Jasa yang ditawarkan:
${services.map((s: any) => `- Layanan: ${s.title}
  Kategori: ${s.category}
  Harga Normal: ${s.price}
  Status Flash Sale: ${s.isFlashSale ? "Sedang Promo Flash Sale!" : "Tidak promo"}
  Harga Promo Flash Sale: ${s.isFlashSale && s.flashSalePrice ? s.flashSalePrice : "N/A"}
  Harga Asli (Coret): ${s.originalPrice || "N/A"}
  Diskon Persen: ${s.discountValue ? s.discountValue + "%" : "0%"}
  Estimasi Durasi: ${s.duration}
  Deskripsi: ${s.shortDesc || s.description}
  Fitur Utama: ${s.features?.join(", ") || ""}
  Paket Berjenjang (Tiers): ${s.packages && s.packages.length > 0 
    ? s.packages.map((pkg:any) => `\n    - [Paket ${pkg.name}]: ${pkg.price} (Revisi: ${pkg.revisions || "N/A"}) - ${pkg.description}`).join("") 
    : "Tidak ada (hanya 1 harga)"}
`).join("\n")}

4. ARTIKEL BLOG (BLOG POSTS):
Artikel yang ditulis dan dipublikasikan:
${posts.map((b: any) => `- Judul: ${b.title}
  Ringkasan: ${b.excerpt}
  Topik/Tags: ${b.tags?.join(", ") || "Umum"}
  Slug/Link: /blog/${b.slug}
`).join("\n")}

5. KONTAK & SOSIAL MEDIA (SOCIALS):
Cara menghubungi:
${socials.map((s: any) => `- Platform: ${s.platform}
  Username/Label: ${s.label}
  Link: ${s.url}
`).join("\n")}

INSTRUKSI TAMBAHAN UNTUK AI:
- Gunakan data di atas sebagai referensi utama alias "Kebenaran Mutlak".
- Jika user bertanya tentang skill yang tidak ada di daftar proyek atau journey, jawab jujur bahwa data tersebut tidak tercatat, namun kamu bisa belajar dengan cepat.
- Jangan mengarang proyek atau pengalaman yang tidak ada di data di atas.
- PENTING: Nomor WhatsApp Dicky yang benar adalah 085904320201 (link: https://wa.me/6285904320201). Selalu berikan nomor ini jika ditanya kontak WA, dan jangan berikan nomor acak.
- Jika user bertanya tentang artikel blog, berikan ringkasan singkat dan arahkan mereka ke link artikel yang relevan (/blog/slug).
`;

    return contextString;

  } catch (error) {
    console.error("Gagal mengambil context portfolio:", error);
    // Fallback jika database error
    return "Maaf, saat ini saya tidak dapat mengakses database portofolio lengkap. Namun saya siap menjawab pertanyaan umum.";
  }
}