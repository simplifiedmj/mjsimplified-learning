import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const BASE_URL = "https://mjsimplified.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  // Dynamic URLs for individual tutorials
  const postUrls = posts.map((post) => ({
    url: `${BASE_URL}/tutorials/${post.category}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic URLs for category landing pages
  const categoryUrls = ["database", "springboot", "angular", "finance"].map((category) => ({
    url: `${BASE_URL}/tutorials/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Static URLs
  const staticUrls = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tutorials`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...categoryUrls, ...postUrls];
}
