import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://yourwebsite.com'; 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/'], // Blokir akses bot ke halaman admin
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}