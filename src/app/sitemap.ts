import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://airesume.dev", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://airesume.dev/sign-in", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://airesume.dev/sign-up", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://airesume.dev/terms", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: "https://airesume.dev/privacy", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
