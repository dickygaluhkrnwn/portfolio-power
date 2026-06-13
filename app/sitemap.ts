import { MetadataRoute } from 'next';
import { getAllProjects } from '@/lib/projects-service';
import { getPublishedPosts } from '@/lib/blog-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Gunakan versi www agar sinkron dengan pilihan canonical Google
  const baseUrl = 'https://www.dickygaluhkrnwn.my.id'; 

  const [projects, posts] = await Promise.all([
    getAllProjects(),
    getPublishedPosts()
  ]);
  
  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    ...projectUrls,
    ...blogUrls,
  ];
}