import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import TutorialCard from "@/components/TutorialCard";
import { getPostsByCategory, CATEGORY_NAMES } from "@/lib/posts";

interface PageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  database: "Learn DBMS architecture, indexing mechanisms, transaction controls, SQL optimization, and PostgreSQL setup.",
  springboot: "Master Java REST API construction, secure routes with JWT filter chains, JPA query structures, and microservices.",
  angular: "Explore custom component architectures, binding models, advanced RxJS observables pipeline controls, and standalone designs.",
  finance: "Dive into low-latency systems, limit order book indexing, FIX protocol message tags, and multicast UDP parsing engines.",
};

// Statically generate category routes at build time
export async function generateStaticParams() {
  return [
    { category: "database" },
    { category: "springboot" },
    { category: "angular" },
    { category: "finance" },
  ];
}

// Generate dynamic SEO metadata for each category page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = resolvedParams.category.toLowerCase();
  
  if (!CATEGORY_NAMES[category]) {
    return { title: "Category Not Found" };
  }

  const categoryName = CATEGORY_NAMES[category];
  return {
    title: `${categoryName} Tutorials`,
    description: CATEGORY_DESCRIPTIONS[category] || `Read professional-grade tutorials on ${categoryName}.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const category = resolvedParams.category.toLowerCase();
  
  if (!CATEGORY_NAMES[category]) {
    notFound();
  }

  const categoryName = CATEGORY_NAMES[category];
  const description = CATEGORY_DESCRIPTIONS[category];
  const posts = getPostsByCategory(category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/tutorials"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-accent transition-colors duration-250"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all tutorials
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent border border-accent/20">
          <BookOpen className="h-3.5 w-3.5" />
          Category Series
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {categoryName}
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Tutorials Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <TutorialCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-slate-800 bg-slate-900/10">
          <p className="text-slate-500 text-sm">No tutorials added under this category yet.</p>
        </div>
      )}
    </div>
  );
}
