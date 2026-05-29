import { Metadata } from "next";
import { GraduationCap, Database, Terminal, Laptop, Activity, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About MJSimplified",
  description: "Learn more about the mission of MJSimplified to make complex technical topics simple for modern software developers.",
};

export default function AboutPage() {
  const pillars = [
    {
      title: "Complexity Simplified",
      description: "We break down dense, hard-to-grasp engineering topics into digestible, well-commented tutorials and architectural guides.",
      icon: CheckCircle,
    },
    {
      title: "Production Ready Code",
      description: "No half-baked examples. Every line of SQL, Java, TypeScript, or C++ we write is structured for scalability and efficiency.",
      icon: CheckCircle,
    },
    {
      title: "Modern Tech Focus",
      description: "Specialized in backend APIs, SQL optimization, modern reactive frontends, and low-latency financial exchange technologies.",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4 border border-accent/20">
          <GraduationCap className="h-6 w-6" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          About MJSimplified
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed">
          Making complex database configurations, enterprise backend setups, advanced reactive frontends, and low-latency financial systems understandable for everyone.
        </p>
      </div>

      {/* Grid: Vision & Details */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Our Mission</h2>
          <p className="text-slate-450 leading-relaxed text-sm">
            Modern software engineering is complex. Developers are expected to understand databases, API design, security protocols, containerization, micro-frontends, and latency limits all at once. Too often, tutorials focus on minimal viable products that break under real load.
          </p>
          <p className="text-slate-455 leading-relaxed text-sm">
            <strong>MJSimplified</strong> was founded to change that. We produce engineering-first tutorials. We show you the &quot;why&quot; behind index structures, security filters, state management, and memory allocations, matching theory with production-ready code.
          </p>
        </div>

        <div className="relative rounded-2xl border border-slate-800 bg-[#060914] p-8 shadow-xl">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent to-indigo-500 opacity-10 blur-xl pointer-events-none" />
          <h3 className="text-lg font-bold text-slate-200 mb-6">Key Engineering Domains</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Database Internals</h4>
                <p className="text-xs text-slate-400">B-Trees, indexing strategies, ACID compliance, and query analyzers.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Terminal className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Spring Boot Microservices</h4>
                <p className="text-xs text-slate-400">Stateless REST design, Spring Security 6 configurations, and JPA transactions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Laptop className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Angular Reactive Ecosystem</h4>
                <p className="text-xs text-slate-400">RxJS pipeline streams, custom control state bindings, and lifecycle control.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Low-Latency Finance Tech</h4>
                <p className="text-xs text-slate-400">Limit Order Books, matching engines, FIX protocol, and UDP multicast handlers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars Section */}
      <section className="border-t border-slate-900 pt-16 space-y-12">
        <h2 className="text-2xl font-bold text-center text-white tracking-tight">Our Core Principles</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/10 p-6 space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                <p className="text-sm text-slate-450 leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
