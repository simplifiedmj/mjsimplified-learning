import Link from "next/link";
import { ArrowRight, Database, Terminal, Laptop, Activity, BookOpen, Clock } from "lucide-react";
import Hero from "@/components/Hero";
import TutorialCard from "@/components/TutorialCard";
import { getAllPosts, CATEGORY_NAMES } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  const featuredPost = posts[0]; // Take the latest post as featured
  const latestPosts = posts.slice(1, 4); // Take the next 3 posts

  const categories = [
    {
      id: "database",
      name: "Database Concepts",
      description: "DBMS internals, SQL queries, B-Tree indexing, transactions, and PostgreSQL optimization.",
      icon: Database,
      count: posts.filter((p) => p.category === "database").length,
      color: "text-emerald-400 group-hover:text-emerald-300",
      bg: "bg-emerald-500/10 group-hover:bg-emerald-500/20 border-emerald-500/15",
    },
    {
      id: "springboot",
      name: "Spring Boot",
      description: "Secure REST APIs, Spring Security 6, stateless JWT auth, Hibernate/JPA, and microservice architectures.",
      icon: Terminal,
      count: posts.filter((p) => p.category === "springboot").length,
      color: "text-rose-400 group-hover:text-rose-300",
      bg: "bg-rose-500/10 group-hover:bg-rose-500/20 border-rose-500/15",
    },
    {
      id: "angular",
      name: "Angular",
      description: "Standalone component design, reactive forms, routing, services, and advanced RxJS streams.",
      icon: Laptop,
      count: posts.filter((p) => p.category === "angular").length,
      color: "text-indigo-400 group-hover:text-indigo-300",
      bg: "bg-indigo-500/10 group-hover:bg-indigo-500/20 border-indigo-500/15",
    },
    {
      id: "finance",
      name: "Finance Tech",
      description: "Limit Order Books, matching engines, FIX protocol parser, and low-latency market data processing.",
      icon: Activity,
      count: posts.filter((p) => p.category === "finance").length,
      color: "text-amber-400 group-hover:text-amber-300",
      bg: "bg-amber-500/10 group-hover:bg-amber-500/20 border-amber-500/15",
    },
  ];

  // Pick up posts that have YouTube videos embedded
  const videoPosts = posts.filter((p) => p.youtubeId).slice(0, 2);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <Hero />

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Choose Your Learning Path
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            Explore curated collections of professional-grade software development tutorials.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/tutorials/${cat.id}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/20 p-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/50"
              >
                <div className="space-y-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${cat.bg} transition-colors duration-300`}>
                    <Icon className={`h-6 w-6 ${cat.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors duration-200">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">{cat.count} articles</span>
                  <span className="flex items-center gap-1 text-accent group-hover:text-white transition-colors duration-200">
                    Explore
                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Spotlight/Featured Article */}
      {featuredPost && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-850 bg-slate-900/20 p-8 lg:p-12 backdrop-blur-xl">
            <div className="absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />
            <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
            
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent border border-accent/20">
                  Spotlight Article
                </div>
                <h2 className="text-2xl font-extrabold text-white sm:text-3.5xl tracking-tight leading-snug">
                  <Link href={`/tutorials/${featuredPost.category}/${featuredPost.slug}`} className="hover:text-accent transition-colors duration-200">
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  {featuredPost.description}
                </p>
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
                  <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs text-slate-300 font-semibold border border-slate-700">
                    {CATEGORY_NAMES[featuredPost.category] || featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readTime} min read
                  </span>
                </div>
                <div>
                  <Link
                    href={`/tutorials/${featuredPost.category}/${featuredPost.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-slate-950 hover:bg-accent-hover transition-colors duration-200 cursor-pointer"
                  >
                    Start Reading
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Code visual mockup */}
              <div className="hidden lg:block relative rounded-2xl border border-slate-800 bg-[#070b13] p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono">Spotlight Preview</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 space-y-1 overflow-hidden h-[180px] leading-relaxed">
                  <p className="text-slate-600">// Full technical breakdown</p>
                  <p><span className="text-pink-400">package</span> com.mjsimplified.learning;</p>
                  <p>&nbsp;</p>
                  <p><span className="text-sky-400">@RestController</span></p>
                  <p><span className="text-sky-400">@RequestMapping</span>(<span className="text-emerald-400">&quot;/api/v1/data&quot;</span>)</p>
                  <p><span className="text-sky-400">public class</span> <span className="text-indigo-400">FeedHandlerController</span> &#123;</p>
                  <p>&nbsp;&nbsp;<span className="text-sky-400">private final</span> <span className="text-indigo-400">FeedService</span> service;</p>
                  <p>&nbsp;</p>
                  <p>&nbsp;&nbsp;<span className="text-sky-400">@GetMapping</span></p>
                  <p>&nbsp;&nbsp;<span className="text-sky-400">public</span> <span className="text-indigo-400">ResponseEntity</span>&lt;<span className="text-indigo-400">List</span>&lt;<span className="text-indigo-400">Feed</span>&gt;&gt; getFeed() &#123;</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-400">return</span> <span className="text-indigo-400">ResponseEntity</span>.ok(service.getLatestFeed());</p>
                  <p>&nbsp;&nbsp;&#125;</p>
                  <p>&#125;</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Tutorials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-10 border-b border-slate-900 pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Latest Technical Guides
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Refresh your knowledge with our newest code-intensive posts.
            </p>
          </div>
          <Link
            href="/tutorials"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-white transition-colors duration-200"
          >
            View all tutorials
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <TutorialCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* YouTube Video Companion Hub */}
      {videoPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-[#050914] p-8 lg:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-slate-900 pb-5">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl flex items-center gap-2">
                  <svg className="h-8 w-8 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube Companion Hub
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Prefer watching? Check out visual walkthroughs for our premium articles.
                </p>
              </div>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 transition-colors duration-200"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg> Subscribe Channel
              </a>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {videoPosts.map((post) => (
                <div key={post.slug} className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 transition-all duration-300 hover:border-slate-700">
                  {/* YouTube Embed Player */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <iframe
                      src={`https://www.youtube.com/embed/${post.youtubeId}`}
                      title={post.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <span className="inline-block rounded bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-800 uppercase tracking-wider">
                      {CATEGORY_NAMES[post.category] || post.category}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors duration-200">
                      <Link href={`/tutorials/${post.category}/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>
                    <div className="pt-2">
                      <Link
                        href={`/tutorials/${post.category}/${post.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-white transition-colors duration-200"
                      >
                        Read Associated Article
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
