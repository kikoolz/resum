import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://resum-mu.vercel.app", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://resum-mu.vercel.app/sign-in", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://resum-mu.vercel.app/sign-up", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://resum-mu.vercel.app/terms", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: "https://resum-mu.vercel.app/privacy", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
