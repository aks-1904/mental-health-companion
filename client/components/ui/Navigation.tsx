"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-calm-400 to-calm-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-calm-600 to-calm-800 bg-clip-text text-transparent">
              MindCare
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {!isHome && (
              <Link
                href="/"
                className="text-neutral-600 hover:text-calm-600 font-medium transition-colors duration-300"
              >
                Home
              </Link>
            )}

            {pathname !== "/login" && (
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-lg text-neutral-700 font-medium hover:bg-white/50 backdrop-blur-sm transition-all duration-300"
              >
                Login
              </Link>
            )}

            {pathname !== "/register" && (
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-lg bg-linear-to-r from-calm-500 to-calm-600 text-white font-medium hover:from-calm-600 hover:to-calm-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
