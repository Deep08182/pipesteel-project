"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/database/store";
import { Project } from "@/types";
import { Layers, MapPin, ExternalLink } from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    db.initialize();
    setProjects(db.getProjects());
  }, []);

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
            PORTFOLIO SHOWCASE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
            DELIVERED INDUSTRIAL PROJECTS
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4 text-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-400">{proj.industry} • {proj.year}</span>
                <h3 className="text-base font-bold text-white uppercase mt-0.5">{proj.title}</h3>
                <p className="text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" /> {proj.location}
                </p>
              </div>
              <span className="text-xs font-bold text-orange-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                {proj.tonnage}
              </span>
            </div>

            <p className="text-slate-300 font-sans leading-relaxed text-xs">{proj.description}</p>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-slate-400 text-[11px]">
              <span>Client: {proj.client}</span>
              <Link
                href={`/projects/${proj.slug}`}
                target="_blank"
                className="text-orange-400 hover:text-orange-300 flex items-center gap-1 font-bold"
              >
                <span>View Case Study</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
