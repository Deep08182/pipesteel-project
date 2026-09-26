'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertTriangle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    const { error: authErr, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (authErr) {
      setError(authErr.message);
      return;
    }

    if (data?.user) {
      router.push("/customer");
      router.refresh();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-200 p-8 sm:p-10 rounded-xl shadow-xl">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-[#0B2038] uppercase tracking-tight">
            Customer Portal Login
          </h2>
          <p className="text-sm text-slate-500">
            Sign in to review quotations and track active pipelines.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[#0B2038] text-sm font-semibold">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E8792A] focus:ring-1 focus:ring-[#E8792A] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[#0B2038] text-sm font-semibold">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E8792A] focus:ring-1 focus:ring-[#E8792A] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 rounded bg-[#E8792A] hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-md"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Internal Staff?{" "}
            <Link href="/admin-login" className="text-[#E8792A] hover:underline font-bold">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
