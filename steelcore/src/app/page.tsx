import React from "react";
import Link from "next/link";
import { HeroSection } from "@/components/public/HeroSection";
import { COMPANY_CONFIG } from "@/lib/config/company";
import { db } from "@/lib/database/store";
import {
  Factory,
  Wrench,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  FileText,
  ChevronRight,
  HardHat,
  Compass,
} from "lucide-react";

export default function Home() {
  db.initialize();
  const products = db.getProducts().slice(0, 6);
  const projects = db.getProjects().slice(0, 3);
  const capabilities = db.getCapabilities().slice(0, 4);

  return (
    <div>
      {/* 1. Full-Width Industrial Hero Section with Trust Stats */}
      <HeroSection />

      {/* 2. About Overview / Industrial Scale */}
      <section className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
              ABOUT {COMPANY_CONFIG.shortName}
            </span>
            <h2 className="text-3xl sm:text-4xl font-mono font-black text-white uppercase tracking-tight">
              ENGINEERING QUALITY. INDUSTRIAL SCALE.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Operating state-of-the-art rolling mills, aluminium extrusion presses, and heavy submerged arc fabrication facilities in India. Supplying mission-critical infrastructure projects, high-rise structural steel, and precision engineering assemblies worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-950 p-8 rounded-lg border border-slate-800 card-hover space-y-4">
              <div className="w-12 h-12 rounded bg-orange-950/60 border border-orange-800 flex items-center justify-center text-orange-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Precision Manufacturing
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated CNC machining centers, 20kW fiber laser profiling, and multi-cavity extrusion presses ensure micron-level tolerances across all carbon steel and aluminium grades.
              </p>
              <div className="pt-2 text-xs font-mono text-orange-400 flex items-center gap-1">
                <span>Tolerance down to ±0.005mm</span>
              </div>
            </div>

            <div className="bg-slate-950 p-8 rounded-lg border border-slate-800 card-hover space-y-4">
              <div className="w-12 h-12 rounded bg-orange-950/60 border border-orange-800 flex items-center justify-center text-orange-400">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Custom Heavy Fabrication
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated 50T crane bays for built-up box girders, cruciform columns, PEB portal frames, and variable-depth bridge structures qualified to AWS D1.1 and ASME standards.
              </p>
              <div className="pt-2 text-xs font-mono text-orange-400 flex items-center gap-1">
                <span>Up to 60 Metric Tons per piece</span>
              </div>
            </div>

            <div className="bg-slate-950 p-8 rounded-lg border border-slate-800 card-hover space-y-4">
              <div className="w-12 h-12 rounded bg-orange-950/60 border border-orange-800 flex items-center justify-center text-orange-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Quality Assurance & NDT
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                In-house optical emission spectrometry, 100% digital ultrasonic testing (UT), magnetic particle inspection, and 3D coordinate measuring machine (CMM) verification.
              </p>
              <div className="pt-2 text-xs font-mono text-orange-400 flex items-center gap-1">
                <span>EN 10204 3.1 & 3.2 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products Catalog Preview */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
                ENGINEERING CATALOG
              </span>
              <h2 className="text-3xl sm:text-4xl font-mono font-black text-white uppercase tracking-tight mt-1">
                FEATURED STEEL & ALUMINIUM PRODUCTS
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-orange-400 hover:text-orange-300 font-bold"
            >
              <span>VIEW ALL PRODUCTS</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex flex-col card-hover"
              >
                <div className="relative h-48 bg-slate-800 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                    style={{ backgroundImage: `url('${prod.image_url}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded border ${
                        prod.material === "Steel"
                          ? "bg-slate-900/90 text-blue-300 border-blue-600"
                          : prod.material === "Aluminium"
                          ? "bg-slate-900/90 text-teal-300 border-teal-600"
                          : "bg-slate-900/90 text-amber-300 border-amber-600"
                      }`}
                    >
                      {prod.material}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-slate-900/80 text-slate-300 border border-slate-700 px-2 py-1 rounded">
                      {prod.subcategory}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-mono font-bold text-white uppercase tracking-wide line-clamp-1">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {prod.short_description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Grades:</span>
                      <span className="text-slate-200 font-semibold">{prod.grades.slice(0, 2).join(", ")}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <Link
                      href={`/products/${prod.slug}`}
                      className="text-xs font-mono uppercase font-bold text-slate-300 hover:text-white"
                    >
                      Details & Specs
                    </Link>
                    <Link
                      href={`/request-quote?product=${prod.slug}`}
                      className="px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Manufacturing Capabilities Showcase */}
      <section className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
              PLANT INFRASTRUCTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-mono font-black text-white uppercase tracking-tight">
              ADVANCED INDUSTRIAL CAPABILITIES
            </h2>
            <p className="text-sm text-slate-300">
              Modern heavy industrial machinery installed across our primary manufacturing plants in Maharashtra and Gujarat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap) => (
              <div
                key={cap.id}
                className="bg-slate-950 rounded-lg border border-slate-800 p-6 flex flex-col justify-between card-hover space-y-4"
              >
                <div>
                  <div className="h-36 rounded bg-slate-800 overflow-hidden relative mb-4">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${cap.image_url}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  </div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wide">
                    {cap.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-1 text-[11px] font-mono text-slate-400">
                  <p className="text-orange-400 font-semibold">{cap.capacity}</p>
                  <p className="truncate">Tol: {cap.tolerances}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/capabilities"
              className="inline-flex items-center gap-2 px-6 py-3 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors border border-slate-700"
            >
              <span>Explore All Plant Machinery & Technical Capabilities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Delivered Projects Case Studies */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
                TRACK RECORD
              </span>
              <h2 className="text-3xl sm:text-4xl font-mono font-black text-white uppercase tracking-tight mt-1">
                COMPLETED INDUSTRIAL PROJECTS
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-orange-400 hover:text-orange-300 font-bold"
            >
              <span>VIEW ALL CASE STUDIES</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex flex-col card-hover"
              >
                <div className="relative h-52 bg-slate-800">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${proj.image_url}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono uppercase bg-orange-600/90 text-white px-2 py-0.5 rounded font-bold">
                      {proj.industry}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-xs font-mono text-slate-300">
                    <span>{proj.location}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-mono font-bold text-white uppercase tracking-wide">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-xs font-mono space-y-1.5 text-slate-400">
                    <div className="flex justify-between">
                      <span>Scope:</span>
                      <span className="text-slate-200 truncate max-w-[65%]">{proj.scope}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tonnage:</span>
                      <span className="text-orange-400 font-semibold">{proj.tonnage}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us / B2B Quality Commitment */}
      <section className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
                B2B EXCELLENCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-mono font-black text-white uppercase tracking-tight">
                WHY LEADING ENTERPRISES PARTNER WITH {COMPANY_CONFIG.shortName}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                From EPC infrastructure contractors to multinational automotive OEMs and power utilities, our clients count on transparent mill test certificates, guaranteed chemical metallurgy, and dedicated engineering desks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  "Precision Manufacturing to Mill Specs",
                  "100% Certified Prime Raw Materials",
                  "Experienced Metallurgical Engineers",
                  "Automated Heavy SAW Fabrication",
                  "Reliable Pan-India Multimodal Logistics",
                  "Direct B2B Project Support & RFQ Desk",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/request-quote"
                  className="px-6 py-3 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-600/20 border border-orange-400"
                >
                  START YOUR RFQ ENQUIRY
                </Link>
                <Link
                  href="/quality"
                  className="px-6 py-3 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors border border-slate-700"
                >
                  VIEW QUALITY LABS
                </Link>
              </div>
            </div>

            <div className="relative h-[420px] rounded-lg border border-slate-800 overflow-hidden shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded bg-slate-900/90 border border-slate-700 backdrop-blur-sm">
                <p className="text-xs font-mono uppercase text-orange-400 font-bold">
                  PLANT FACILITY • MIDC CHAKAN
                </p>
                <p className="text-sm font-bold text-white mt-1">
                  120,000 MT Annual Combined Structural Steel & Extrusion Capacity
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bottom RFQ Call To Action */}
      <section className="py-16 bg-gradient-to-r from-orange-950 via-slate-950 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 sm:p-12 rounded-xl bg-slate-900/80 border border-orange-500/30 shadow-2xl">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
                INDUSTRIAL PROCUREMENT & FABRICATION
              </span>
              <h3 className="text-2xl sm:text-3xl font-mono font-black text-white uppercase tracking-tight">
                HAVE DRAWINGS OR A BILL OF QUANTITIES READY?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Submit your project specifications or CAD files. Our engineering and estimation team prepares complete commercial quotations with transparent BOM breakdowns within 24 to 48 hours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/request-quote"
                className="px-8 py-4 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-orange-600/30 border border-orange-400 text-center"
              >
                SUBMIT RFQ ENQUIRY
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
