"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);

  // 1. Load theme AFTER mount
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
  }, []);

  // 2. Apply theme when ready
  useEffect(() => {
    if (!theme) return;

    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // prevent hydration flicker
  if (!theme) return null;

  return (
    <button
      id="theme-toggler"
      className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
