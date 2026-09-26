"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/auth/context";
import { Shield, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, switchDemoUser, isLoading } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    }
  }, [role, isLoading]);

  if (isLoading) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center font-mono text-xs text-slate-400">
        Authenticating Industrial Operations Desk...
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl font-mono">
          <div className="w-14 h-14 rounded-full bg-orange-950/60 border border-orange-600 flex items-center justify-center text-orange-400 mx-auto">
            <Shield className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] text-orange-500 uppercase font-bold tracking-wider">
              Restricted Operations Route
            </span>
            <h2 className="text-xl font-black text-white uppercase">
              Admin Access Authentication Required
            </h2>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              You are currently authenticated as customer{" "}
              <strong className="text-slate-200">{user?.full_name || "Guest"}</strong>. Plant administrative operations require an ADMIN or SUPER_ADMIN role.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => switchDemoUser("usr-admin-01")}
              className="w-full py-3 px-4 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-600/30 border border-orange-400 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Switch to Vikramaditya Mehta (Admin)</span>
            </button>

            <Link
              href="/customer"
              className="block w-full py-2.5 rounded bg-slate-800 text-slate-300 hover:text-white text-xs uppercase"
            >
              Return to Customer Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
