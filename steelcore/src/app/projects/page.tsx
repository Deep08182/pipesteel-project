import React from "react";
import Link from "next/link";
import { db } from "@/lib/database/store";
import { MapPin, Calendar, Layers, ArrowRight, Award } from "lucide-react";

export default function ProjectsPage() {
  db.initialize();
  const projects = db.getProjects();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Banner */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            DELIVERED CASE STUDIES
          </span>
          <h1 className="text-3xl sm:text-5xl font-mono font-black text-white uppercase tracking-tight mt-2">
            FEATURED INDUSTRIAL PROJECTS
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl text-xs sm:text-sm leading-relaxed">
            Monumental structural steel frameworks, metro rail viaducts, heavy PEB logistics facilities, and utility solar mounting installations across India.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex flex-col justify-between card-hover"
            >
              <div>
                <div className="relative h-64 bg-slate-800">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${proj.image_url}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="text-xs font-mono font-bold uppercase bg-orange-600 text-white px-2.5 py-1 rounded shadow">
                      {proj.industry}
                    </span>
                    <span className="text-xs font-mono bg-slate-950/80 text-slate-200 border border-slate-700 px-2.5 py-1 rounded">
                      {proj.year}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-400" /> {proj.location}
                    </span>
                    <span className="text-orange-400 font-bold">{proj.tonnage}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-mono font-black text-white uppercase tracking-wide">
                    {proj.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-800 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Materials:</span>
                      <span className="text-slate-200 font-semibold truncate max-w-[65%] text-right">
                        {proj.materials}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Scope:</span>
                      <span className="text-slate-200 font-semibold truncate max-w-[65%] text-right">
                        {proj.scope}
                      </span>
                    </div>
                    {proj.client && (
                      <div className="flex justify-between text-slate-400">
                        <span>Client:</span>
                        <span className="text-orange-400 font-semibold truncate max-w-[65%] text-right">
                          {proj.client}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-800 flex items-center justify-between mt-4">
                <Link
                  href={`/projects/${proj.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-orange-400 hover:text-orange-300"
                >
                  <span>View Project Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/request-quote"
                  className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Similar Scope RFQ
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
