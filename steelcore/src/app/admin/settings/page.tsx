"use client";

import React, { useState } from "react";
import { COMPANY_CONFIG } from "@/lib/config/company";
import { db } from "@/lib/database/store";
import { Settings, RefreshCw, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleResetData = () => {
    if (confirm("Reset local database to initial factory seed dataset? This will restore 10 customers and 30 standard RFQs.")) {
      db.resetToDefaults();
      setResetMessage("Database successfully reset to standard factory demonstration dataset.");
      setTimeout(() => setResetMessage(null), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-mono">
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
          SYSTEM PREFERENCES
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
          PLANT CONFIGURATION & DATA MANAGEMENT
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Global brand settings, factory parameters, and test database re-initialization.
        </p>
      </div>

      {resetMessage && (
        <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* Central Configuration View */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4 text-xs">
        <h3 className="text-xs font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
          Active Plant Configuration (from src/lib/config/company.ts)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded bg-slate-950 border border-slate-850">
            <span className="text-slate-500 text-[10px] uppercase">Corporate Name:</span>
            <p className="text-white font-bold">{COMPANY_CONFIG.name}</p>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-850">
            <span className="text-slate-500 text-[10px] uppercase">Established Year:</span>
            <p className="text-white font-bold">{COMPANY_CONFIG.establishedYear}</p>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-850">
            <span className="text-slate-500 text-[10px] uppercase">Primary Address:</span>
            <p className="text-slate-200">{COMPANY_CONFIG.fullAddress}</p>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-850">
            <span className="text-slate-500 text-[10px] uppercase">Commercial Board Phone:</span>
            <p className="text-orange-400 font-bold">{COMPANY_CONFIG.phone}</p>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-850">
            <span className="text-slate-500 text-[10px] uppercase">GSTIN Registration:</span>
            <p className="text-white font-bold">{COMPANY_CONFIG.gstin}</p>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-850">
            <span className="text-slate-500 text-[10px] uppercase">Corporate CIN:</span>
            <p className="text-white font-bold">{COMPANY_CONFIG.cin}</p>
          </div>
        </div>
      </div>

      {/* Seed Data Reset Tool */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4 text-xs">
        <h3 className="text-xs font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
          Demonstration Data Maintenance
        </h3>
        <p className="text-slate-300 font-sans">
          You can reset the local database store back to the clean seed dataset anytime. This will reset the 10 B2B customers, 30 RFQs, quotations, and notifications back to their pristine demonstration states.
        </p>
        <button
          type="button"
          onClick={handleResetData}
          className="px-4 py-2.5 rounded bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 font-bold text-xs uppercase flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Demo Store to Factory Defaults</span>
        </button>
      </div>
    </div>
  );
}
