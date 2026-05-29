"use client";

import Link from "next/link";
import { GraduationCap, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      {/* Top Section with newsletter placeholder */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Brand information */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-slate-950">
                <GraduationCap className="h-4.5 w-4.5" />
              </span>
              <span>MJSimplified</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A premium technical learning platform providing high-quality engineering tutorials. Empowering developers to master databases, modern backend services, robust frontend frameworks, and low-latency financial systems.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-200">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-200">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-200">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:col-span-2">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase">Categories</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/tutorials/database" className="hover:text-white transition-colors duration-200">
                    Database Concepts
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials/springboot" className="hover:text-white transition-colors duration-200">
                    Spring Boot REST
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials/angular" className="hover:text-white transition-colors duration-200">
                    Angular Frontend
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials/finance" className="hover:text-white transition-colors duration-200">
                    Finance Tech
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase">Newsletter</h3>
              <p className="text-sm text-slate-400">
                Get notified when we release new tutorials and courses.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 outline-none focus:border-accent w-full"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-accent-hover transition-colors duration-200 whitespace-nowrap cursor-pointer"
                >
                  Join
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} MJSimplified. All rights reserved. Built for technical excellence.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
