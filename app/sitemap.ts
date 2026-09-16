import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lad-gubugklakah.vercel.app/'; 

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/history`, lastModified: new Date() },
    { url: `${baseUrl}/management`, lastModified: new Date() },
    { url: `${baseUrl}/galery`, lastModified: new Date() },
    { url: `${baseUrl}/article`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
  ];
}