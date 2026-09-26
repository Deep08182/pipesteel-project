"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { COMPANY_CONFIG } from "@/lib/config/company";
import { Building, User, Mail, Phone, MapPin, FileCheck, ArrowRight, AlertTriangle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    email: "",
    phone: "",
    designation: "",
    city: "Mumbai",
    state: "Maharashtra",
    gstin: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await register(formData);
    setIsLoading(false);

    if (res.success) {
      router.push("/customer");
    } else {
      setError(res.error || "Failed to register account.");
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-xl shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded bg-orange-600 border border-orange-400 mx-auto flex items-center justify-center font-mono font-black text-white text-xl">
            S
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase block">
            {COMPANY_CONFIG.name}
          </span>
          <h2 className="text-2xl font-mono font-black text-white uppercase tracking-tight">
            REGISTER B2B CUSTOMER ACCOUNT
          </h2>
          <p className="text-xs text-slate-400">
            Create an enterprise procurement account to track RFQs, manage drawings, and approve quotations.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded bg-red-950/50 border border-red-800 text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase font-semibold">
                Contact Person Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase font-semibold">
                Company / Enterprise *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. ABC Infrastructure Pvt Ltd"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase font-semibold">
                Official Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@abc.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase font-semibold">
                Phone / Mobile *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98112 34567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase font-semibold">
                Designation / Department
              </label>
              <input
                type="text"
                placeholder="e.g. Head of Procurement"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase font-semibold">
                Company GSTIN (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 27AABCA1234F1Z5"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-600/30 border border-orange-400 mt-2"
          >
            {isLoading ? "CREATING ENTERPRISE ACCOUNT..." : "CREATE B2B ACCOUNT"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <p className="text-xs text-slate-400 font-mono">
            Already have an industrial account?{" "}
            <Link href="/login" className="text-orange-400 hover:underline font-bold">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
