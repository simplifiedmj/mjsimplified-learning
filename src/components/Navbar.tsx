"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, Code, GraduationCap } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tutorials?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Tutorials", href: "/tutorials" },
    { name: "Database", href: "/tutorials/database" },
    { name: "Spring Boot", href: "/tutorials/springboot" },
    { name: "Angular", href: "/tutorials/angular" },
    { name: "Finance Tech", href: "/tutorials/finance" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 w-full transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white group">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-slate-950 transition-transform duration-300 group-hover:scale-105">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="bg-gradient-to-r from-white via-slate-200 to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:opacity-90">
                MJSimplified
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-accent bg-slate-800/60"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search bar & Mobile menu toggle */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block md:w-60 lg:w-72">
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-slate-700 bg-slate-900/60 py-1.5 pl-4 pr-10 text-sm text-slate-200 outline-none transition-all duration-300 focus:border-accent focus:bg-slate-900 focus:ring-1 focus:ring-accent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent transition-colors duration-200"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* Hamburger button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent lg:hidden"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden glass border-t border-slate-800 animate-in slide-in-from-top duration-200">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {/* Mobile Search */}
            <div className="px-3 py-2 sm:hidden">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-slate-700 bg-slate-900 py-2 pl-4 pr-10 text-sm text-slate-200 outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-3 py-2.5 text-base font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-accent bg-slate-800/80"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
