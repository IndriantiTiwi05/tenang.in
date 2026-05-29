"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // State untuk buka-tutup sidebar

  const navItem = (href: string, label: string) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setIsOpen(false)} // Sidebar tutup otomatis kalau menu diklik
        className={`block px-4 py-3 rounded-xl transition font-medium ${
          isActive
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
            : "text-gray-300 hover:bg-[#232336] hover:text-white"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <main className="flex min-h-screen bg-[#070710] text-white">
      {/* TOMBOL HAMBURGER (Hanya muncul di HP) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-[#111118] rounded-md md:hidden"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111118] border-r border-[#232336] p-6 flex flex-col transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 mt-12 md:mt-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Tenang.in
          </h1>
        </div>
        <nav className="space-y-3">{navItem("/dashboard", "Dashboard")}{navItem("/checkin", "Check-in")}{navItem("/history", "History")}{navItem("/profile", "Profile")}</nav>
      </aside>

      {/* OVERLAY (Gelap saat sidebar terbuka di HP) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* CONTENT */}
      <section className="flex-1 p-8 overflow-y-auto mt-16 md:mt-0">
        {children}
      </section>
    </main>
  );
}