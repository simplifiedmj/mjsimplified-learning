import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import hljs from 'highlight.js';

const contentDirectory = path.join(process.cwd(), 'src/content');

import { PostMetadata, Post, CATEGORY_NAMES } from './types';
export type { PostMetadata, Post };
export { CATEGORY_NAMES };

// Configure marked with a custom renderer for syntax highlighting and heading IDs
const renderer = new marked.Renderer();

renderer.code = ({ text, lang }: { text: string; lang?: string; escaped?: boolean }) => {
  const validLanguage = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
  const highlighted = hljs.highlight(text, { language: validLanguage }).value;
  return `<pre><code class="hljs language-${validLanguage}">${highlighted}</code></pre>`;
};

renderer.heading = ({ text, depth }: { text: string; depth: number; raw: string }) => {
  const id = text
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
    
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

marked.use({ renderer });

// Calculate reading time based on word count
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const noOfWords = content.split(/\s+/g).length;
  const minutes = noOfWords / wordsPerMinute;
  return Math.max(1, Math.ceil(minutes));
}

// Extract H2 and H3 headings for the Table of Contents
function extractToc(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const headingRegex = /^(#{2,3})\s+(.*)$/gm;
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ id, text, level });
  }
  
  return headings;
}

// Helper to resolve and format post date (using frontmatter, falling back to file creation/modification)
function resolvePostDate(filePath: string, frontmatterDate?: any): string {
  if (frontmatterDate) {
    if (frontmatterDate instanceof Date) {
      return frontmatterDate.toISOString().split('T')[0];
    }
    return String(frontmatterDate);
  }
  
  try {
    const stats = fs.statSync(filePath);
    const dateObj = (stats.birthtime && stats.birthtime.getTime() > 0) ? stats.birthtime : stats.mtime;
    return dateObj.toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
}

// Get all posts across all categories sorted by date descending
export function getAllPosts(): PostMetadata[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const categories = fs.readdirSync(contentDirectory);
  let allPosts: PostMetadata[] = [];

  categories.forEach((category) => {
    const categoryPath = path.join(contentDirectory, category);
    
    // Check if it's indeed a directory
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath);
      
      files.forEach((fileName) => {
        if (fileName.endsWith('.md')) {
          const filePath = path.join(categoryPath, fileName);
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const { data, content } = matter(fileContents);
          
          const postDate = resolvePostDate(filePath, data.date);
          
          allPosts.push({
            title: data.title || '',
            slug: data.slug || fileName.replace(/\.md$/, ''),
            category: category,
            description: data.description || '',
            date: postDate,
            thumbnail: data.thumbnail || '/images/placeholder.jpg',
            tags: data.tags || [],
            youtubeId: data.youtubeId || (data.youtubeIds && data.youtubeIds[0]) || undefined,
            youtubeIds: data.youtubeIds || (data.youtubeId ? [data.youtubeId] : []),
            author: data.author || 'MJSimplified',
            readTime: calculateReadTime(content),
          });
        }
      });
    }
  });

  // Sort posts by date ascending (oldest first)
  return allPosts.sort((a, b) => (a.date > b.date ? 1 : -1));
}

// Get posts filtered by category
export function getPostsByCategory(category: string): PostMetadata[] {
  return getAllPosts().filter((post) => post.category.toLowerCase() === category.toLowerCase());
}

// Fetch a single post by category and slug
export async function getPostBySlug(category: string, slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(contentDirectory, category, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Parse Markdown to HTML asynchronously using marked
    const contentHtml = await marked.parse(content);
    const toc = extractToc(content);
    const readTime = calculateReadTime(content);

    const postDate = resolvePostDate(filePath, data.date);

    return {
      title: data.title || '',
      slug: slug,
      category: category,
      description: data.description || '',
      date: postDate,
      thumbnail: data.thumbnail || '/images/placeholder.jpg',
      tags: data.tags || [],
      youtubeId: data.youtubeId || (data.youtubeIds && data.youtubeIds[0]) || undefined,
      youtubeIds: data.youtubeIds || (data.youtubeId ? [data.youtubeId] : []),
      author: data.author || 'MJSimplified',
      readTime,
      contentHtml,
      toc,
    };
  } catch (error) {
    console.error(`Error loading post: ${category}/${slug}`, error);
    return null;
  }
}

// Find related posts in the same category or sharing tags (excluding current post)
export function getRelatedPosts(currentSlug: string, category: string, limit = 3): PostMetadata[] {
  const allPosts = getAllPosts();
  return allPosts
    .filter((post) => post.slug !== currentSlug && post.category === category)
    .slice(0, limit);
}

// Search posts by term (title, category, tags)
export function searchPosts(query: string): PostMetadata[] {
  const lowercaseQuery = query.toLowerCase();
  const allPosts = getAllPosts();
  
  if (!lowercaseQuery) {
    return allPosts;
  }

  return allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.category.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
      post.description.toLowerCase().includes(lowercaseQuery)
  );
}
