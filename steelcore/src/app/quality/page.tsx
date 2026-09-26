import React from "react";
import Link from "next/link";
import { COMPANY_CONFIG } from "@/lib/config/company";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Award,
  Microscope,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

export default function QualityPage() {
  const qualityStages = [
    {
      title: "1. Raw Material Verification",
      icon: Layers,
      desc: "Every incoming steel billet, coil, and aluminium extrusion ingot undergoes optical emission spectrometry (OES) chemical testing and positive material identification (PMI) before issuance to production.",
      standards: "IS 2062, ASTM A36, EN 10025, ASTM B221",
    },
    {
      title: "2. Dimensional & Metrology Inspection",
      icon: Cpu,
      desc: "Using calibrated Zeiss 3D Coordinate Measuring Machines (CMM) and industrial laser trackers, critical component dimensions, hole pitch, camber, and squareness are verified to sub-millimeter tolerances.",
      standards: "IS 1852, IS 7215, ISO 2768 Precision Class",
    },
    {
      title: "3. Welding & NDT Testing",
      icon: Microscope,
      desc: "100% digital ultrasonic testing (UT) on full-penetration flange-to-web butt welds, magnetic particle inspection (MPI) on fillet welds, and liquid penetrant testing (DPT) conducted by ASNT Level II certified engineers.",
      standards: "AWS D1.1 Structural Welding Code, ASME Section IX",
    },
    {
      title: "4. Surface Treatment & Coating Inspection",
      icon: Sparkles,
      desc: "Surface cleanliness validated to Swedish Standard SA 2.5 after continuous shot blasting. Dry Film Thickness (DFT) measured with calibrated digital elcometers across all shop-primed and painted members.",
      standards: "ISO 8501-1, SSPC-SP 10, ASTM D4417",
    },
    {
      title: "5. Shop Trial Assembly",
      icon: CheckCircle2,
      desc: "Full pre-assembly of complex multi-span portal frames, curved bridge trusses, and modular skid frameworks in the plant yard with digital total stations to eliminate site erection bottlenecks.",
      standards: "Zero-defect fit-up protocol before dispatch",
    },
    {
      title: "6. Mill Test Certification (MTC 3.1 & 3.2)",
      icon: FileCheck,
      desc: "Every batch is dispatched with comprehensive inspection test plans (ITP), welder qualification records (WPQR), and Mill Test Certificates conforming to EN 10204 Type 3.1 (or 3.2 with TUV/DNV/BV witnessing).",
      standards: "EN 10204 Type 3.1 & 3.2",
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Banner */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            ZERO-DEFECT METALLURGY
          </span>
          <h1 className="text-3xl sm:text-5xl font-mono font-black text-white uppercase tracking-tight mt-2">
            QUALITY ASSURANCE & TESTING
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl text-xs sm:text-sm leading-relaxed">
            Uncompromising structural integrity through multi-stage non-destructive testing (NDT), in-house metallurgical labs, and full material traceability.
          </p>
        </div>
      </section>

      {/* Quality Control Stages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            RIGOROUS QUALITY GATES
          </span>
          <h2 className="text-3xl font-mono font-black text-white uppercase tracking-tight">
            SIX-TIER INSPECTION PROTOCOL
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qualityStages.map((stage) => {
            const IconComponent = stage.icon;
            return (
              <div
                key={stage.title}
                className="bg-slate-900 rounded-lg border border-slate-800 p-6 flex flex-col justify-between card-hover space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded bg-orange-950/60 border border-orange-800 flex items-center justify-center text-orange-400">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-mono font-bold text-white uppercase tracking-wide">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                  <span className="text-slate-500 block">Inspection Norms:</span>
                  <span className="text-orange-400 font-semibold">{stage.standards}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certifications Placeholders Section */}
        <div className="mt-20 pt-16 border-t border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
              COMPLIANCE & STANDARDS
            </span>
            <h2 className="text-2xl sm:text-3xl font-mono font-black text-white uppercase tracking-tight">
              MANAGEMENT SYSTEMS & CERTIFICATION PLACEHOLDERS
            </h2>
            <p className="text-xs text-slate-400">
              Audited in accordance with national and international quality and occupational safety standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "ISO 9001:2015",
                subtitle: "Quality Management System (Certification Placeholder)",
                desc: "Standardized operating procedures, continuous defect logging, and annual surveillance audits.",
              },
              {
                title: "ISO 14001:2015",
                subtitle: "Environmental Management (Certification Placeholder)",
                desc: "Scrap segregation, closed-loop flux recycling, and eco-conscious waste minimization.",
              },
              {
                title: "ISO 45001:2018",
                subtitle: "Occupational Health & Safety (Certification Placeholder)",
                desc: "Zero-harm safety culture across high-tonnage overhead crane bays and welding lines.",
              },
              {
                title: "EN 1090-2 (EXC3)",
                subtitle: "Structural Steel Execution (Certification Placeholder)",
                desc: "Execution class EXC3 compliance for dynamic fatigue and seismically loaded structures.",
              },
            ].map((cert) => (
              <div
                key={cert.title}
                className="p-6 rounded-lg bg-slate-900 border border-slate-800 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-orange-400">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-base font-mono font-bold text-white uppercase">{cert.title}</h4>
                <p className="text-[11px] font-mono text-orange-400/90 font-semibold">{cert.subtitle}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Lab Inspection Booking CTA */}
        <div className="mt-16 p-8 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-mono font-bold text-white uppercase">
              Schedule Stage-Gate Inspection or Witness Testing
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Third-party inspection agencies (TUV, Bureau Veritas, DNV, SGS, RITES) are regularly accommodated in our plant testing rooms.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow"
          >
            Coordinate QA Visit
          </Link>
        </div>
      </div>
    </div>
  );
}
