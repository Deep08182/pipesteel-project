import React from "react";
import Link from "next/link";
import { db } from "@/lib/database/store";
import {
  Factory,
  Cpu,
  Wrench,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function CapabilitiesPage() {
  db.initialize();
  const capabilities = db.getCapabilities();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Banner */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            PLANT INFRASTRUCTURE & MACHINERY
          </span>
          <h1 className="text-3xl sm:text-5xl font-mono font-black text-white uppercase tracking-tight mt-2">
            MANUFACTURING CAPABILITIES
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl text-xs sm:text-sm leading-relaxed font-sans">
            Equipped with 2,500T direct extrusion lines, automated submerged arc welding (SAW) gantries, high-power 20kW fiber lasers, and heavy double-column CNC machining centers.
          </p>
        </div>
      </section>

      {/* Grid of Capabilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {capabilities.map((cap, idx) => (
            <div
              key={cap.id}
              className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 card-hover"
            >
              {/* Image & Machine Specs */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative h-64 rounded-lg overflow-hidden border border-slate-800">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${cap.image_url}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-xs font-mono font-bold uppercase bg-slate-950/80 text-orange-400 px-3 py-1 rounded border border-orange-500/40">
                    Capability 0{idx + 1}
                  </span>
                </div>

                <div className="p-4 rounded bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                  <span className="text-slate-400 uppercase font-bold block text-[11px]">
                    Installed Machine Infrastructure:
                  </span>
                  <p className="text-slate-200 font-semibold">{cap.machinery}</p>
                </div>
              </div>

              {/* Technical Description & Applications */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-mono font-black text-white uppercase tracking-wide">
                    {cap.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                    {cap.description}
                  </p>

                  {/* Badges Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs font-mono">
                    <div className="p-3 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase">Plant Capacity:</span>
                      <span className="text-orange-400 font-bold mt-0.5 block">{cap.capacity}</span>
                    </div>
                    <div className="p-3 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase">Tolerance Standard:</span>
                      <span className="text-slate-200 font-semibold mt-0.5 block">{cap.tolerances}</span>
                    </div>
                  </div>

                  {/* Materials Processed */}
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">
                      Compatible Materials & Grades:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {cap.materials.map((m) => (
                        <span
                          key={m}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Typical Applications */}
                  <div className="mt-4">
                    <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">
                      Typical Industrial Deliverables:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {cap.applications.map((app, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{app}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <Link
                    href="/request-quote"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-orange-400 hover:text-orange-300"
                  >
                    <span>Request Quotation for this Capability</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
