import { MetadataRoute } from 'next';
import { getAllProjects } from '@/lib/projects-service';
import { getPublishedPosts } from '@/lib/blog-service'; // Import service blog

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ganti dengan domain aslimu (tanpa garis miring di akhir)
  const baseUrl = 'https://dickygaluhkrnwn.my.id'; 

  // Ambil semua data dinamis secara paralel agar lebih cepat
  const [projects, posts] = await Promise.all([
    getAllProjects(),
    getPublishedPosts()
  ]);
  
  // 1. Generate URLs untuk Projects
  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`, // Asumsi URL project menggunakan ID
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 2. Generate URLs untuk Blog Posts (Sangat penting untuk SEO)
  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`, // URL blog menggunakan slug
    lastModified: new Date(post.publishedAt), // Gunakan tanggal publikasi asli
    changeFrequency: 'weekly' as const,
    priority: 0.9, // Priority blog bisa lebih tinggi karena konten dinamis
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1, // Beranda paling prioritas
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily', // Halaman list blog sering di-update
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    ...projectUrls,
    ...blogUrls,
  ];
}