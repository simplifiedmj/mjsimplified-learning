"use client";

import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const totalScrollable = documentHeight - windowHeight;
      if (totalScrollable <= 0) {
        setProgress(0);
        return;
      }
      
      const currentProgress = (scrollTop / totalScrollable) * 100;
      setProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    window.addEventListener("scroll", handleScroll);
    // Initial calculate in case page loads scrolled down
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] w-full bg-slate-900 pointer-events-none">
      <div
        className="h-full bg-accent bg-gradient-to-r from-accent via-sky-300 to-indigo-500 transition-all duration-75 ease-out shadow-[0_0_10px_rgba(56,189,248,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
