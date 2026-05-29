"use client";

import { useState, useMemo } from "react";
import { Search, Tag, FileX, BookOpen } from "lucide-react";
import TutorialCard from "./TutorialCard";
import { PostMetadata, CATEGORY_NAMES } from "@/lib/types";

interface TutorialsBrowserProps {
  initialPosts: PostMetadata[];
  initialQuery: string;
}

export default function TutorialsBrowser({ initialPosts, initialQuery }: TutorialsBrowserProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    return [
      { id: "all", name: "All Topics" },
      ...Object.entries(CATEGORY_NAMES).map(([id, name]) => ({ id, name })),
    ];
  }, []);

  const filteredPosts = useMemo(() => {
    let result = initialPosts;

    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((post) => post.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return result;
  }, [initialPosts, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-slate-900 pb-8">
        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2 order-2 lg:order-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-accent border-accent text-slate-950 font-bold"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search input field */}
        <div className="relative w-full lg:w-80 order-1 lg:order-2">
          <input
            type="text"
            placeholder="Search by title, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/40 py-2.5 pl-4 pr-10 text-sm text-slate-200 outline-none focus:border-accent focus:bg-slate-900 transition-colors"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        </div>
      </div>

      {/* Results grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <TutorialCard key={`${post.category}-${post.slug}`} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl border border-dashed border-slate-800 bg-slate-900/10 space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-slate-500">
            <FileX className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white">No tutorials found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try checking your spelling, clear the search filter, or select a different category.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="rounded-xl border border-slate-800 bg-slate-900 px-4.5 py-2 text-xs font-semibold text-white hover:border-slate-650 transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
