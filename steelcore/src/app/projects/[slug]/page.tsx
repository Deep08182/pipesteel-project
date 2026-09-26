import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/database/store";
import { MapPin, Calendar, Award, CheckCircle2, ArrowRight, ChevronRight, Send } from "lucide-react";

interface ProjectDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { slug } = await params;
  db.initialize();
  const project = db.getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b border-slate-800 bg-slate-900/60 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/projects" className="hover:text-white transition-colors">
            Projects
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-orange-400 font-bold truncate max-w-xs">{project.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Main */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase bg-orange-600 text-white px-3 py-1 rounded shadow">
                  {project.industry}
                </span>
                <span className="text-xs font-mono bg-slate-900 text-slate-300 border border-slate-700 px-3 py-1 rounded">
                  Delivered in {project.year}
                </span>
                <span className="text-xs font-mono text-orange-400 font-bold bg-orange-950/40 border border-orange-800 px-3 py-1 rounded">
                  {project.tonnage}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-mono font-black text-white uppercase tracking-tight">
                {project.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {project.description}
              </p>

              {/* Key Specs Card */}
              <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-3 text-xs font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-200 font-semibold">{project.location}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Client / Authority:</span>
                  <span className="text-slate-200 font-semibold">{project.client}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Materials:</span>
                  <span className="text-slate-200 font-semibold">{project.materials}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scope of Work:</span>
                  <span className="text-orange-400 font-bold">{project.scope}</span>
                </div>
              </div>

              {/* Highlights */}
              {project.features && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">
                    Key Technical Highlights:
                  </h3>
                  <div className="space-y-2">
                    {project.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Media & CTA */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative h-96 rounded-lg border border-slate-800 overflow-hidden shadow-2xl bg-slate-900">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${project.image_url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              </div>

              {/* Quote CTA */}
              <div className="p-6 rounded-lg bg-slate-900 border border-orange-500/40 space-y-4">
                <h4 className="text-sm font-mono font-bold text-white uppercase">
                  Planning a Project in this Sector?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Engage our heavy engineering desk early for bill of quantities estimation, connection detailing, and material optimization.
                </p>
                <Link
                  href="/request-quote"
                  className="block w-full text-center py-3 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-600/20 border border-orange-400"
                >
                  REQUEST SIMILAR PROJECT RFQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
