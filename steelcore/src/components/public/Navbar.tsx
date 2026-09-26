"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPANY_CONFIG } from "@/lib/config/company";
import { useAuth } from "@/lib/auth/context";
import { NotificationDropdown } from "@/components/shared/NotificationDropdown";
import { Menu, X, Shield, User, ChevronRight, FileText } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Capabilities", href: "/capabilities" },
    { name: "Industries", href: "/industries" },
    { name: "Projects", href: "/projects" },
    { name: "Quality", href: "/quality" },
    { name: "Contact", href: "/contact" },
  ];

  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
        isScrolled
          ? "bg-slate-950/95 backdrop-blur-md border-slate-800 py-2.5 shadow-xl"
          : "bg-slate-950 border-slate-900 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Industrial Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center font-mono font-black text-white text-xl shadow-lg border border-orange-500/40 group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <span className="font-mono font-black tracking-widest text-lg sm:text-xl text-white uppercase block leading-none">
                {COMPANY_CONFIG.shortName}
              </span>
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block mt-0.5">
                INDUSTRIES • INDIA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-mono uppercase tracking-wider transition-colors hover:text-orange-400 ${
                    isActive ? "text-orange-500 font-bold border-b-2 border-orange-500 pb-0.5" : "text-slate-300"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center space-x-3">
            {user ? (
              <>
                <NotificationDropdown />
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold uppercase bg-slate-900 border border-orange-500 text-orange-400 hover:bg-orange-950/30 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" /> Admin Portal
                  </Link>
                ) : (
                  <Link
                    href="/customer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold uppercase bg-slate-900 border border-blue-500 text-blue-400 hover:bg-blue-950/30 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" /> Portal
                  </Link>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="text-xs font-mono uppercase text-slate-300 hover:text-white px-3 py-1.5"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/request-quote"
              className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-600/20 border border-orange-400 flex items-center gap-1.5 group"
            >
              <span>REQUEST A QUOTE</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center space-x-2">
            {user && <NotificationDropdown />}
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded text-slate-300 hover:text-white hover:bg-slate-900 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`px-3 py-2 rounded text-xs font-mono uppercase tracking-wider ${
                  pathname === link.href
                    ? "bg-orange-950/60 text-orange-400 font-bold border-l-2 border-orange-500"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={isAdmin ? "/admin" : "/customer"}
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono font-bold uppercase text-white"
                >
                  Go to {isAdmin ? "Admin Operations" : "Customer Portal"}
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileOpen(false)}
                className="block text-center py-2 text-xs font-mono uppercase text-slate-300 hover:text-white"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/request-quote"
              onClick={() => setIsMobileOpen(false)}
              className="block text-center w-full py-3 rounded bg-orange-600 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              REQUEST A QUOTE
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
