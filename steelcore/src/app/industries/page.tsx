import React from "react";
import Link from "next/link";
import { db } from "@/lib/database/store";
import {
  Building2,
  Train,
  SunMedium,
  Car,
  Warehouse,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function IndustriesPage() {
  db.initialize();
  const industries = db.getIndustries();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Banner */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            SECTORS & MARKET DOMAINS
          </span>
          <h1 className="text-3xl sm:text-5xl font-mono font-black text-white uppercase tracking-tight mt-2">
            INDUSTRIES SERVED
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl text-xs sm:text-sm leading-relaxed">
            Delivering high-tensile structural steel and precision extruded aluminium components to critical national infrastructure, energy complexes, and industrial OEMs.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((ind) => (
            <div
              key={ind.id}
              className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex flex-col justify-between card-hover"
            >
              <div>
                <div className="relative h-64 bg-slate-800">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${ind.hero_image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-mono font-bold uppercase bg-orange-600 text-white px-3 py-1 rounded shadow">
                      {ind.name}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-xs font-mono text-orange-400 bg-slate-950/80 p-2 rounded border border-slate-800 backdrop-blur-sm">
                    {ind.statistics}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {ind.description}
                  </p>

                  {/* Applications */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                      Key Structural Applications:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {ind.applications.map((app, aIdx) => (
                        <li key={aIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Relevant Products */}
                  <div className="pt-2">
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                      Supplied Products:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {ind.key_products.map((p) => (
                        <span
                          key={p}
                          className="px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-slate-300 font-mono text-[11px]"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-800 flex items-center justify-between mt-4">
                <Link
                  href="/request-quote"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-orange-400 hover:text-orange-300"
                >
                  <span>Request Sector Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products"
                  className="text-xs font-mono uppercase text-slate-400 hover:text-white"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
