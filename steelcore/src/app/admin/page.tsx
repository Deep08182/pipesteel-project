import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, Users, FileText, AlertTriangle, ArrowRight, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin Dashboard | Steelcore Industries",
};

export default async function AdminDashboard() {
  const supabase = createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();

  if (authErr || !user) {
    redirect("/admin-login");
  }

  // Check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile || (profile.role !== "ADMIN" && profile.role !== "SUPER_ADMIN")) {
    redirect("/login");
  }

  // Fetch RFQs for the urgent queue
  const { data: urgentRfqs } = await supabase
    .from("rfqs")
    .select(`
      *,
      profiles ( full_name, company_name ),
      products ( name )
    `)
    .in("status", ["SUBMITTED", "UNDER_REVIEW"])
    .order("created_at", { ascending: false })
    .limit(10);

  // Fetch analytics from the view
  const { data: dailyVolume } = await supabase
    .from("rfq_daily_volume")
    .select("*")
    .limit(30);

  const volume = dailyVolume || [];
  const today = volume.length > 0 ? volume[0].total_rfqs : 0;
  const yesterday = volume.length > 1 ? volume[1].total_rfqs : 0;
  const last7Days = volume.slice(0, 7).reduce((acc, curr) => acc + Number(curr.total_rfqs), 0);
  const last30Days = volume.reduce((acc, curr) => acc + Number(curr.total_rfqs), 0);

  const StatusPill = ({ status }: { status: string }) => {
    let colors = "bg-slate-200 text-slate-700";
    if (status === "SUBMITTED") colors = "bg-blue-100 text-blue-800";
    if (status === "UNDER_REVIEW") colors = "bg-amber-100 text-amber-800";
    return (
      <span className={`px-2 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${colors}`}>
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2038] tracking-tight">
            Admin Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pipeline Analytics & Inquiry Queue
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Today</h3>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-[#0B2038]">{today}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Yesterday</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-2 text-3xl font-black text-[#0B2038]">{yesterday}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Last 7 Days</h3>
            <TrendingUp className="w-5 h-5 text-[#E8792A]" />
          </div>
          <div className="mt-2 text-3xl font-black text-[#0B2038]">{last7Days}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Last 30 Days</h3>
            <FileText className="w-5 h-5 text-green-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-[#0B2038]">{last30Days}</div>
        </div>
      </div>

      {/* Urgent Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#E8792A]" />
            <h2 className="text-sm font-bold text-[#0B2038] uppercase tracking-wider">
              Engineering Review Queue (Action Required)
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#0B2038] text-white font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">RFQ ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product / Scope</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!urgentRfqs || urgentRfqs.length === 0) ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No urgent RFQs in the queue.
                  </td>
                </tr>
              ) : (
                urgentRfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#E8792A]">
                      {rfq.rfq_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0B2038]">{rfq.profiles?.company_name}</div>
                      <div className="text-xs text-slate-500">{rfq.profiles?.full_name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{rfq.products?.name || rfq.title}</div>
                      <div className="text-xs text-slate-500">Qty: {rfq.quantity}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${rfq.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>
                        {rfq.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusPill status={rfq.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/requests/${rfq.id}`}
                        className="inline-block px-3 py-1.5 rounded bg-[#E8792A] hover:bg-orange-600 text-white font-bold text-xs transition-colors shadow-sm"
                      >
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
