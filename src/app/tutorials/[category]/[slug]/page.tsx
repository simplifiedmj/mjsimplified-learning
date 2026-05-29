import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowRight, Tag, BookOpen, User, Play } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import TutorialCard from "@/components/TutorialCard";
import { getPostBySlug, getAllPosts, getRelatedPosts, CATEGORY_NAMES } from "@/lib/posts";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

// Generate static parameters for pre-rendering all tutorial pages
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

// Dynamic SEO metadata based on the loaded tutorial content
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { category, slug } = resolvedParams;
  const post = await getPostBySlug(category, slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function TutorialDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { category, slug } = resolvedParams;
  const post = await getPostBySlug(category, slug);

  if (!post) {
    notFound();
  }

  // Fetch sibling articles for left sidebar and related posts
  const categoryPosts = getAllPosts().filter((p) => p.category === category);
  const relatedPosts = getRelatedPosts(slug, category);

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative space-y-12 pb-20">
      {/* Scroll indicator bar */}
      <ReadingProgressBar />

      {/* Hero Header Area */}
      <div className="border-b border-slate-900 bg-slate-950/60 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/tutorials" className="hover:text-white">Tutorials</Link>
            <span>/</span>
            <Link href={`/tutorials/${category}`} className="hover:text-white">
              {CATEGORY_NAMES[category.toLowerCase()] || category}
            </Link>
            <span>/</span>
            <span className="text-slate-400 truncate max-w-xs">{post.title}</span>
          </div>

          {/* Title and description */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
              {post.title}
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">
              {post.description}
            </p>
          </div>

          {/* Author/Date/ReadTime Info */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs sm:text-sm text-slate-500 font-medium border-t border-slate-900">
            <div className="flex items-center gap-2 text-slate-350">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-accent border border-slate-700">
                <User className="h-3.5 w-3.5" />
              </span>
              <span>{post.author}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime} min read
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row items-start">
          
          {/* Left Column: Sibling Series Sidebar */}
          <Sidebar currentCategory={category} currentSlug={slug} articles={categoryPosts} />

          {/* Middle Column: Markdown Articles Render */}
          <article className="flex-grow w-full max-w-3xl overflow-hidden">
            
            {/* Inline Table of Contents for Mobile View (Hidden on LG) */}
            {post.toc && post.toc.length > 0 && (
              <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/10 p-5 lg:hidden">
                <h3 className="mb-3 text-sm font-bold tracking-wider text-slate-300 uppercase">
                  Table of Contents
                </h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  {post.toc.map((heading) => (
                    <li
                      key={heading.id}
                      style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
                    >
                      <a href={`#${heading.id}`} className="hover:text-accent font-medium">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Compiled HTML Content */}
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* Embedded YouTube Section */}
            {post.youtubeId && (
              <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-950 p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2.5 border-b border-slate-900 pb-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-none">Video Demonstration</h3>
                    <p className="text-xs text-slate-500 mt-1">Watch a step-by-step visual of this technical concept.</p>
                  </div>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-slate-800 shadow-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${post.youtubeId}`}
                    title={`Video for ${post.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              </div>
            )}

            {/* Tags Bottom */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-slate-900 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Tags:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400 border border-slate-850"
                  >
                    <Tag className="h-3 w-3 text-slate-500" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Right Column: Sticky Table of Contents (Desktop Only) */}
          {post.toc && post.toc.length > 0 && (
            <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24 self-start space-y-4">
              <h3 className="text-xs font-bold tracking-wider text-slate-450 uppercase border-l border-slate-800 pl-3">
                On This Page
              </h3>
              <nav className="border-l border-slate-800 pl-3 space-y-2.5">
                {post.toc.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
                    className="block text-xs font-medium text-slate-400 hover:text-accent transition-colors leading-relaxed line-clamp-2"
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </aside>
          )}

        </div>
      </div>

      {/* Sibling Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-slate-900 pt-16 mt-16 bg-slate-950/20 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex items-baseline justify-between border-b border-slate-900 pb-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">Related Tutorials</h2>
              <Link
                href={`/tutorials/${category}`}
                className="group inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-white transition-colors duration-250"
              >
                More in {CATEGORY_NAMES[category] || category}
                <ArrowRight className="h-4 w-4 transition-transform duration-250 group-hover:translate-x-0.5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <TutorialCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
