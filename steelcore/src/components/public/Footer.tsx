import React from "react";
import Link from "next/link";
import { COMPANY_CONFIG } from "@/lib/config/company";
import { MapPin, Phone, Mail, Clock, ShieldCheck, ChevronRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Corporate Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-orange-600 flex items-center justify-center font-mono font-black text-white text-lg border border-orange-400">
                S
              </div>
              <span className="font-mono font-black tracking-widest text-lg text-white uppercase">
                {COMPANY_CONFIG.name}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {COMPANY_CONFIG.tagline}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Precision steel and aluminium manufacturing, heavy structural fabrication, and CNC engineering for nationwide infrastructure, PEB warehouses, energy, and automotive projects.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-400 space-y-1">
              <p>CIN: {COMPANY_CONFIG.cin}</p>
              <p>GSTIN: {COMPANY_CONFIG.gstin}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-orange-500 pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <Link href="/products" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Products
                </Link>
              </li>
              <li>
                <Link href="/capabilities" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Capabilities
                </Link>
              </li>
              <li>
                <Link href="/industries" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Industries
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Projects
                </Link>
              </li>
              <li>
                <Link href="/quality" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Quality & NDT
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" /> About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" /> Contact & Plant Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-orange-500 pl-2">
              Products
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <Link href="/products?category=steel" className="hover:text-orange-400 transition-colors">
                  Structural Steel Beams (ISMB/UB)
                </Link>
              </li>
              <li>
                <Link href="/products?category=steel" className="hover:text-orange-400 transition-colors">
                  Steel Channels & Angles
                </Link>
              </li>
              <li>
                <Link href="/products?category=steel" className="hover:text-orange-400 transition-colors">
                  High-Strength Plates (IS 2062)
                </Link>
              </li>
              <li>
                <Link href="/products?category=steel" className="hover:text-orange-400 transition-colors">
                  Hollow Sections & Pipes
                </Link>
              </li>
              <li>
                <Link href="/products?category=aluminium" className="hover:text-orange-400 transition-colors">
                  Aluminium T-Slot Profiles
                </Link>
              </li>
              <li>
                <Link href="/products?category=aluminium" className="hover:text-orange-400 transition-colors">
                  Solar PV Module Mounts
                </Link>
              </li>
              <li>
                <Link href="/products?category=custom" className="hover:text-orange-400 transition-colors">
                  Custom Welded Box Girders
                </Link>
              </li>
              <li>
                <Link href="/products?category=custom" className="hover:text-orange-400 transition-colors">
                  Heavy 5-Axis CNC Flanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Plant & Contact Information */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-orange-500 pl-2">
              Plant & Contact
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-slate-300">{COMPANY_CONFIG.fullAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-slate-300 font-mono">{COMPANY_CONFIG.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-slate-300 font-mono">{COMPANY_CONFIG.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-slate-300 font-mono">Mon - Sat: 08:30 - 18:30 IST</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/request-quote"
                className="inline-block w-full text-center py-2.5 px-4 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow transition-colors border border-orange-400"
              >
                REQUEST A QUOTE
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Security Links */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <p>© {new Date().getFullYear()} {COMPANY_CONFIG.name}. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-slate-500">
            <Link href="/login" className="hover:text-slate-300 transition-colors">
              Customer Portal
            </Link>
            <Link href="/admin" className="hover:text-orange-400 transition-colors">
              Admin Operations
            </Link>
            <Link href="/quality" className="hover:text-slate-300 transition-colors">
              ISO Certifications
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
