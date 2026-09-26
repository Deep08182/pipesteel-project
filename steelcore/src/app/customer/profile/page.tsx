"use client";

import React from "react";
import { useAuth } from "@/lib/auth/context";
import { db } from "@/lib/database/store";
import { Building, User, Mail, Phone, MapPin, FileCheck2, Shield } from "lucide-react";

export default function CustomerProfilePage() {
  const { user } = useAuth();
  db.initialize();
  const rfqs = user ? db.getRFQs(user.id) : [];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-500">
            ENTERPRISE ACCOUNT
          </span>
          <h1 className="text-2xl sm:text-3xl font-mono font-black text-white uppercase tracking-tight mt-1">
            CLIENT PROFILE & GST DETAILS
          </h1>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-8 space-y-6 font-mono text-xs">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
            <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xl text-orange-400">
              {user?.full_name?.charAt(0) || "C"}
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase">{user?.full_name}</h3>
              <p className="text-slate-400">{user?.designation} • {user?.company_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold">Company Name:</span>
              <p className="text-white text-sm font-bold">{user?.company_name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold">Registered GSTIN:</span>
              <p className="text-orange-400 text-sm font-bold">{user?.gstin || "27AABCA1234F1Z5"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold">Email Address:</span>
              <p className="text-slate-200">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold">Phone / WhatsApp:</span>
              <p className="text-slate-200">{user?.phone}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold">City & State:</span>
              <p className="text-slate-200">{user?.city}, {user?.state}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold">Total RFQ Volume:</span>
              <p className="text-white font-bold">{rfqs.length} Enquiries Logged</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
