import { Metadata } from "next";
import { getPostBySlug } from "@/lib/blog-service";

type Props = {
  params: Promise<{ slug: string }>;
};

// Fungsi ini akan dieksekusi oleh Server Next.js sebelum halaman di-render
// Khusus untuk menghasilkan tag <head> SEO dan Open Graph
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  try {
    const post = await getPostBySlug(slug);
    
    if (!post) {
      return { title: "Artikel Tidak Ditemukan | IKY Dev." };
    }

    return {
      title: `${post.title} | IKY Dev. Blog`,
      description: post.excerpt || "Baca insight dan tutorial menarik dari IKY Dev.",
      openGraph: {
        title: post.title,
        description: post.excerpt || "Baca insight dan tutorial menarik dari IKY Dev.",
        url: `https://dickygaluh.com/blog/${post.slug}`, // Ganti dengan domain aslimu
        siteName: "IKY Dev.",
        images: [
          {
            url: post.coverImage || "/og-image.jpg",
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        locale: "id_ID",
        type: "article",
        publishedTime: post.publishedAt,
        authors: ["Dicky Galuh Kurniawan"],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: [post.coverImage || "/og-image.jpg"],
        creator: "@iky_username", // Opsional: Ganti dengan username Twitter kamu
      },
    };
  } catch (error) {
    return { title: "Blog | IKY Dev." };
  }
}

export default function BlogDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}