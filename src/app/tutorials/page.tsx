import { Metadata } from "next";
import TutorialsBrowser from "@/components/TutorialsBrowser";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Tutorials Directory",
  description: "Browse our comprehensive list of software engineering tutorials on databases, Spring Boot, Angular, and fintech systems.",
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function TutorialsPage({ searchParams }: PageProps) {
  const posts = getAllPosts();
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-10">
      {/* Page Title */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Technical Tutorials Directory
        </h1>
        <p className="max-w-2xl text-slate-400 text-sm leading-relaxed">
          Comprehensive, production-grade guidebooks and articles detailing system architectures, code designs, and best practices.
        </p>
      </div>

      {/* Interactive Browser (Search & Categories) */}
      <TutorialsBrowser initialPosts={posts} initialQuery={query} />
    </div>
  );
}
