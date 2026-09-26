import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, FileCheck, ArrowRight, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Customer Dashboard | Steelcore Industries",
};

export default async function CustomerDashboard() {
  const supabase = createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();

  if (authErr || !user) {
    redirect("/login");
  }

  // Fetch the customer's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    // If no profile, they are not properly registered
    redirect("/login");
  }

  // Fetch the customer's RFQs
  const { data: rfqs, error: rfqErr } = await supabase
    .from("rfqs")
    .select(`
      *,
      products ( name, material ),
      quotations ( id, status )
    `)
    .eq("customer_id", profile.id)
    .order("created_at", { ascending: false });

  const rfqsList = rfqs || [];
  
  // Calculate stats
  const stats = {
    total: rfqsList.length,
    pending: rfqsList.filter((r) => r.status === "SUBMITTED").length,
    underReview: rfqsList.filter((r) => r.status === "UNDER_REVIEW" || r.status === "NEED_INFORMATION").length,
    quoted: rfqsList.filter((r) => r.status === "QUOTATION_PREPARED" || r.status === "QUOTATION_SENT").length,
    approved: rfqsList.filter((r) => r.status === "APPROVED" || r.status === "IN_PRODUCTION").length,
    completed: rfqsList.filter((r) => r.status === "COMPLETED").length,
  };

  const recentRfqs = rfqsList.slice(0, 5);

  const StatusPill = ({ status }: { status: string }) => {
    let colors = "bg-slate-800 text-slate-300";
    if (["SUBMITTED", "UNDER_REVIEW"].includes(status)) colors = "bg-blue-100 text-blue-800";
    if (["NEED_INFORMATION"].includes(status)) colors = "bg-purple-100 text-purple-800";
    if (["QUOTATION_PREPARED", "QUOTATION_SENT"].includes(status)) colors = "bg-amber-100 text-amber-800";
    if (["APPROVED", "IN_PRODUCTION"].includes(status)) colors = "bg-[#E8792A]/10 text-[#E8792A]";
    if (["COMPLETED"].includes(status)) colors = "bg-green-100 text-green-800";
    if (["REJECTED", "CANCELLED"].includes(status)) colors = "bg-red-100 text-red-800";

    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${colors}`}>
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2038] tracking-tight">
            Customer Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, {profile.full_name} ({profile.company_name})
          </p>
        </div>
        <Link
          href="/request-quote"
          className="inline-flex items-center justify-center px-4 py-2 bg-[#E8792A] hover:bg-orange-600 text-white text-sm font-bold rounded-md shadow transition-colors"
        >
          New RFQ
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Total</span>
          <div className="text-2xl font-mono font-black text-[#0B2038]">{stats.total}</div>
        </div>
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-blue-500 uppercase font-semibold">Pending</span>
          <div className="text-2xl font-mono font-black text-blue-600">{stats.pending}</div>
        </div>
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-purple-500 uppercase font-semibold">Review</span>
          <div className="text-2xl font-mono font-black text-purple-600">{stats.underReview}</div>
        </div>
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-amber-500 uppercase font-semibold">Quoted</span>
          <div className="text-2xl font-mono font-black text-amber-600">{stats.quoted}</div>
        </div>
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-[#E8792A] uppercase font-semibold">Active</span>
          <div className="text-2xl font-mono font-black text-[#E8792A]">{stats.approved}</div>
        </div>
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-green-500 uppercase font-semibold">Done</span>
          <div className="text-2xl font-mono font-black text-green-600">{stats.completed}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0B2038] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#E8792A]" />
            Your Recent RFQs
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#0B2038] text-white font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">RFQ Number</th>
                <th className="py-3 px-4">Product / Scope</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRfqs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No RFQs found. Request a quote to get started.
                  </td>
                </tr>
              ) : (
                recentRfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#E8792A]">
                      {rfq.rfq_number}
                    </td>
                    <td className="py-3 px-4 text-[#0B2038]">
                      <div className="font-semibold">{rfq.products?.name || "Custom Scope"}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs">{rfq.title}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {rfq.quantity}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {new Date(rfq.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <StatusPill status={rfq.status} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/customer/requests/${rfq.id}`}
                        className="text-[#E8792A] hover:text-orange-700 text-xs font-bold transition-colors"
                      >
                        View Details →
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
