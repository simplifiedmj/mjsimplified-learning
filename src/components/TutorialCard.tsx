import Link from "next/link";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { PostMetadata, CATEGORY_NAMES } from "@/lib/types";

interface TutorialCardProps {
  post: PostMetadata;
}

export default function TutorialCard({ post }: TutorialCardProps) {
  // Select badge color based on category
  const getCategoryBadgeStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case "database":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "springboot":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "angular":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
      case "finance":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/60 hover:-translate-y-1">
      {/* Decorative backdrop glow */}
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-accent/5 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-50" />

      <div className="space-y-4">
        {/* Card Header: Category & Read Time */}
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getCategoryBadgeStyles(post.category)}`}>
            {CATEGORY_NAMES[post.category.toLowerCase()] || post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime} min read
          </span>
        </div>

        {/* Card Body: Title & Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-200 leading-snug">
            <Link href={`/tutorials/${post.category}/${post.slug}`}>
              {post.title}
            </Link>
          </h3>
          <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
            {post.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Metadata & Link */}
      <div className="mt-6 pt-4 border-t border-slate-900 space-y-4">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-800"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
          <Link
            href={`/tutorials/${post.category}/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-white transition-colors duration-200"
          >
            Read Article
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
