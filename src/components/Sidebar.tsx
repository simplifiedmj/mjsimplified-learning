import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { PostMetadata, CATEGORY_NAMES } from "@/lib/types";

interface SidebarProps {
  currentCategory: string;
  currentSlug: string;
  articles: PostMetadata[];
}

export default function Sidebar({ currentCategory, currentSlug, articles }: SidebarProps) {
  const categoryDisplayName = CATEGORY_NAMES[currentCategory.toLowerCase()] || currentCategory;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
      {/* Back Button */}
      <div>
        <Link
          href="/tutorials"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-accent transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tutorials
        </Link>
      </div>

      {/* Sidebar Navigation Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 backdrop-blur-md">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-slate-300 uppercase">
          <BookOpen className="h-4.5 w-4.5 text-accent" />
          <span>{categoryDisplayName} Series</span>
        </h3>

        <nav className="space-y-1">
          {articles.map((article) => {
            const isActive = article.slug === currentSlug;
            return (
              <Link
                key={article.slug}
                href={`/tutorials/${article.category}/${article.slug}`}
                className={`group flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-accent/10 text-accent font-semibold border-l-2 border-accent"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                }`}
              >
                <ChevronRight
                  className={`h-4 w-4 mt-0.5 flex-shrink-0 transition-transform duration-200 ${
                    isActive ? "text-accent" : "text-slate-500 group-hover:translate-x-0.5"
                  }`}
                />
                <span className="line-clamp-2">{article.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
