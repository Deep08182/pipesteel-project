import React from "react";
import Link from "next/link";
import { COMPANY_CONFIG } from "@/lib/config/company";
import {
  CheckCircle2,
  Factory,
  Award,
  Target,
  Eye,
  ShieldCheck,
  Cpu,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Page Header Banner */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            ABOUT {COMPANY_CONFIG.name}
          </span>
          <h1 className="text-4xl sm:text-5xl font-mono font-black text-white uppercase tracking-tight mt-2">
            ENGINEERING QUALITY. <br />
            <span className="text-orange-500">INDUSTRIAL SCALE.</span>
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
            Established in {COMPANY_CONFIG.establishedYear}, {COMPANY_CONFIG.name} has grown from a specialized regional rolling plant into one of India’s premier B2B steel and aluminium manufacturing, extrusion, and heavy fabrication enterprises.
          </p>
        </div>
      </section>

      {/* Company Story & Facilities */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
                OUR HERITAGE & INFRASTRUCTURE
              </span>
              <h2 className="text-3xl font-mono font-black text-white uppercase tracking-tight">
                BUILT ON METALLURGICAL RIGOR & PRECISION
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  At {COMPANY_CONFIG.name}, we specialize in end-to-end steel and aluminium manufacturing. Our primary heavy fabrication plant spans over 45 acres at MIDC Chakan, Pune, complemented by our precision extrusion and rolling works at Sanand, Gujarat.
                </p>
                <p>
                  With an annual output exceeding 120,000 Metric Tons, we serve the country’s most demanding infrastructure developers, metro rail viaduct builders, power OEMs, renewable solar developers, and commercial vehicle manufacturers.
                </p>
                <p>
                  Our integrated engineering and estimation teams operate advanced 3D detailing software, automated submerged arc welding lines, and certified NDT testing stations to eliminate delays and deliver turnkey structural certainty.
                </p>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded bg-slate-900 border border-slate-800">
                  <span className="text-2xl font-black text-white font-mono block">120K MT</span>
                  <span className="text-slate-400 uppercase mt-1 block">Annual Plant Output</span>
                </div>
                <div className="p-4 rounded bg-slate-900 border border-slate-800">
                  <span className="text-2xl font-black text-white font-mono block">500+</span>
                  <span className="text-slate-400 uppercase mt-1 block">Major Projects Delivered</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative h-72 rounded-lg border border-slate-800 overflow-hidden shadow-2xl">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded bg-slate-900/90 border border-slate-700">
                  <span className="text-xs font-mono font-bold text-orange-400">
                    PLANT 1 • 50T CRANE HEAVY SAW FABRICATION BAY
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-44 rounded-lg border border-slate-800 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80')",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-300">
                    2,500T Extrusion Press
                  </div>
                </div>

                <div className="relative h-44 rounded-lg border border-slate-800 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80')",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-300">
                    Automated Shotblast SA 2.5
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-950 p-8 rounded-lg border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded bg-orange-950/60 border border-orange-800 flex items-center justify-center text-orange-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-mono font-black text-white uppercase tracking-wide">
                Our Mission
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                To engineer and supply world-class structural steel and aluminium products that empower infrastructure resilience, foster sustainable industrial growth, and exceed international standards of safety and dimensional precision.
              </p>
            </div>

            <div className="bg-slate-950 p-8 rounded-lg border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded bg-orange-950/60 border border-orange-800 flex items-center justify-center text-orange-400">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-mono font-black text-white uppercase tracking-wide">
                Our Vision
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                To be recognised as Asia’s most trustworthy, technologically advanced industrial manufacturing partner for complex B2B steel structures, engineered extrusions, and specialized pre-engineered architectural solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl font-mono font-black text-white uppercase tracking-tight">
              SIX PILLARS OF INDUSTRIAL ASSURANCE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Precision Manufacturing",
                desc: "High-speed CNC machining, automated plasma beveling, and controlled tolerance rolling.",
              },
              {
                title: "Quality Materials",
                desc: "100% certified prime billets and slabs traceable to primary mills with full chemical MTCs.",
              },
              {
                title: "Experienced Engineers",
                desc: "ASNT Level II / III certified NDT staff, certified welding inspectors, and metallurgists.",
              },
              {
                title: "Custom Fabrication",
                desc: "Tailored built-up box girders, cruciform members, and PEB portal frames up to 60m span.",
              },
              {
                title: "Reliable Delivery",
                desc: "Strategic logistics network with heavy multi-axle trailer contracts across Indian corridors.",
              },
              {
                title: "B2B Project Support",
                desc: "Dedicated project coordinators, transparent milestone tracking, and rapid RFQ quotation desk.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-slate-900/60 p-6 rounded-lg border border-slate-800 flex items-start gap-4"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-sm font-mono font-bold text-white uppercase">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 p-8 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="text-xl font-mono font-bold text-white uppercase">
                Require Plant Visits or Engineering Audits?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                We welcome client technical representatives and third-party inspectors to our Chakan and Sanand manufacturing works.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider shrink-0 transition-colors"
            >
              Contact Plant Office
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
