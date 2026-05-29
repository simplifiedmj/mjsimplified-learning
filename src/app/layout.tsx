import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MJSimplified — Master Database, Backend, Frontend & Finance Tech",
    template: "%s | MJSimplified",
  },
  description:
    "Master database systems, PostgreSQL, Spring Boot microservices, Angular frontend engineering, and low-latency financial technologies through simplified, production-grade tutorials.",
  keywords: [
    "Database concepts",
    "PostgreSQL",
    "Spring Boot",
    "Angular",
    "Finance technology",
    "Low latency systems",
    "Software Engineering tutorials",
  ],
  authors: [{ name: "MJSimplified" }],
  openGraph: {
    title: "MJSimplified — Technical Learning Platform",
    description: "Simplified, premium engineering tutorials for modern software developers.",
    url: "https://mjsimplified.com",
    siteName: "MJSimplified",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MJSimplified — Technical Learning Platform",
    description: "Simplified, premium engineering tutorials for modern software developers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0f172a] text-[#e2e8f0]">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
