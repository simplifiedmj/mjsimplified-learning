export interface PostMetadata {
  title: string;
  slug: string;
  category: string;
  description: string;
  date: string;
  thumbnail: string;
  tags: string[];
  youtubeId?: string;
  author: string;
  readTime: number;
}

export interface Post extends PostMetadata {
  contentHtml: string;
  toc: { id: string; text: string; level: number }[];
}

export const CATEGORY_NAMES: Record<string, string> = {
  database: "Database",
  springboot: "Spring Boot",
  angular: "Angular",
  finance: "Finance Tech",
};
