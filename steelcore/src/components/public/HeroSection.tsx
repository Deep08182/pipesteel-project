import React from "react";
import Link from "next/link";
import { COMPANY_CONFIG } from "@/lib/config/company";
import { ShieldCheck, ArrowRight, Layers, Award, Factory, Cpu } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <div>
      {/* Industrial Hero Banner */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-slate-950 overflow-hidden border-b border-slate-800">
        {/* Background Image with Engineering Mesh Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80')",
          }}
        />

        {/* Industrial Gradient Mesh & Grid Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#ff5722 1px, transparent 1px), radial-gradient(#64748b 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0, 16px 16px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl space-y-6">
            {/* Engineering Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900/90 border border-orange-500/40 text-orange-400 font-mono text-xs uppercase tracking-widest backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              Heavy Industrial Manufacturing • IS 2062 & ASTM Certified
            </div>

            {/* Hero Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-mono font-black text-white uppercase tracking-tight leading-[1.1]">
              ENGINEERED FOR STRENGTH. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-white">
                BUILT FOR INDUSTRY.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl">
              Precision steel and aluminium manufacturing solutions for construction, infrastructure, engineering and industrial applications. Operating multi-hectare rolling, extrusion, and automated submerged arc fabrication plants.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/request-quote"
                className="px-6 py-3.5 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-600/30 border border-orange-400 flex items-center gap-2 group"
              >
                <span>REQUEST A QUOTE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/products"
                className="px-6 py-3.5 rounded bg-slate-900/80 hover:bg-slate-800 text-white font-mono font-semibold text-sm uppercase tracking-wider transition-all border border-slate-700 hover:border-slate-500 flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>EXPLORE PRODUCTS</span>
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Factory className="w-4 h-4 text-orange-500 shrink-0" />
                <span>2,500T Extrusion & Rolling</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Cpu className="w-4 h-4 text-orange-500 shrink-0" />
                <span>5-Axis 4m CNC Machining</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
                <span>100% UT / NDT Inspection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Company Stats Section */}
      <section className="bg-slate-900 border-b border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 border-r border-slate-800 last:border-none">
              <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
                {COMPANY_CONFIG.stats.yearsExperience}
              </div>
              <div className="text-xs sm:text-sm font-mono uppercase text-orange-400 tracking-wider mt-1">
                Years Experience
              </div>
            </div>

            <div className="p-4 border-r border-slate-800 last:border-none">
              <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
                {COMPANY_CONFIG.stats.projectsDelivered}
              </div>
              <div className="text-xs sm:text-sm font-mono uppercase text-orange-400 tracking-wider mt-1">
                Projects Delivered
              </div>
            </div>

            <div className="p-4 border-r border-slate-800 last:border-none">
              <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
                {COMPANY_CONFIG.stats.industrialProducts}
              </div>
              <div className="text-xs sm:text-sm font-mono uppercase text-orange-400 tracking-wider mt-1">
                Industrial Products
              </div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
                {COMPANY_CONFIG.stats.industriesServed}
              </div>
              <div className="text-xs sm:text-sm font-mono uppercase text-orange-400 tracking-wider mt-1">
                Industries Served
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
