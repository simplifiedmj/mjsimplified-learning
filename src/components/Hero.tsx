import Link from "next/link";
import { ArrowRight, Terminal, BookOpen, Database, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-slate-950 py-20 lg:py-32">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Text Section */}
          <div className="space-y-8 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3.5 py-1.5 text-xs font-semibold text-accent backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Unlocking Real-world Engineering Mastery</span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              Simplified Tutorials for{" "}
              <span className="bg-gradient-to-r from-accent via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Modern Developers
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
              Deep-dive tutorials covering Database internals, PostgreSQL optimization, Spring Boot backend microservices, reactive Angular architectures, and low-latency financial technologies.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/tutorials"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-accent/20 hover:bg-accent-hover hover:shadow-accent-hover/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                Browse Tutorials
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-900 hover:border-slate-500 transition-all duration-300 hover:-translate-y-0.5"
              >
                About MJSimplified
              </Link>
            </div>

            {/* Quick stats / Tech tags */}
            <div className="pt-6 border-t border-slate-900 flex flex-wrap gap-6 items-center text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Database className="h-4 w-4 text-accent" /> PostgreSQL
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Terminal className="h-4 w-4 text-accent" /> Spring Boot
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <BookOpen className="h-4 w-4 text-accent" /> Angular
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-400">Finance Tech (FIX / Market Data)</span>
            </div>
          </div>

          {/* Visual Visualizer Component / Code block */}
          <div className="lg:col-span-5 w-full">
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent to-indigo-500 opacity-20 blur-lg transition duration-1000 group-hover:opacity-30 group-hover:duration-200" />
              
              {/* Code window */}
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-xl">
                {/* Header bar */}
                <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs text-slate-500 font-mono">mjsimplified-db-opt.sql</span>
                </div>
                
                {/* Editor code content */}
                <pre className="font-mono text-xs text-slate-300 overflow-x-auto space-y-1.5 select-none leading-relaxed">
                  <div>
                    <span className="text-indigo-400">-- Optimize matching engine index</span>
                  </div>
                  <div>
                    <span className="text-sky-400">CREATE UNIQUE INDEX</span>{" "}
                    <span className="text-emerald-400">idx_order_matching</span>
                  </div>
                  <div>
                    <span className="text-sky-400">ON</span>{" "}
                    <span className="text-white">orders</span>{" "}
                    <span className="text-slate-400">(</span>
                  </div>
                  <div>
                    &nbsp;&nbsp;<span className="text-white">symbol</span>,
                  </div>
                  <div>
                    &nbsp;&nbsp;<span className="text-white">price</span>{" "}
                    <span className="text-sky-400">DESC</span>,
                  </div>
                  <div>
                    &nbsp;&nbsp;<span className="text-white">created_at</span>{" "}
                    <span className="text-sky-400">ASC</span>
                  </div>
                  <div>
                    <span className="text-slate-400">);</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-indigo-400">-- High throughput check</span>
                  </div>
                  <div>
                    <span className="text-sky-400">EXPLAIN ANALYZE SELECT</span>{" "}
                    <span className="text-white">*</span>
                  </div>
                  <div>
                    <span className="text-sky-400">FROM</span>{" "}
                    <span className="text-white">orders</span>
                  </div>
                  <div>
                    <span className="text-sky-400">WHERE</span>{" "}
                    <span className="text-white">symbol =</span>{" "}
                    <span className="text-emerald-400">&apos;AAPL&apos;</span>
                  </div>
                  <div>
                    <span className="text-sky-400">ORDER BY</span>{" "}
                    <span className="text-white">price DESC</span>;
                  </div>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
