"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { db } from "@/lib/database/store";
import { RFQ, RFQStatus } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Search, Filter, ArrowRight, FileText, PlusCircle, ExternalLink } from "lucide-react";

export default function CustomerRequestsPage() {
  const { user } = useAuth();
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    if (!user) return;
    db.initialize();
    setRfqs(db.getRFQs(user.id));
  }, [user]);

  const allStatuses: { label: string; value: string }[] = [
    { label: "All Requests", value: "ALL" },
    { label: "Submitted", value: "SUBMITTED" },
    { label: "Under Review", value: "UNDER_REVIEW" },
    { label: "Need Info", value: "NEED_INFORMATION" },
    { label: "Quote Prepared", value: "QUOTATION_PREPARED" },
    { label: "Quotation Sent", value: "QUOTATION_SENT" },
    { label: "Approved", value: "APPROVED" },
    { label: "In Production", value: "IN_PRODUCTION" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const filteredRfqs = rfqs.filter((rfq) => {
    const matchesSearch =
      rfq.rfq_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rfq.product_name && rfq.product_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || rfq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-500">
              CUSTOMER ENQUIRIES LEDGER
            </span>
            <h1 className="text-2xl sm:text-3xl font-mono font-black text-white uppercase tracking-tight mt-1">
              MY QUOTATION REQUESTS
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Track live status updates, engineering reviews, and quotation proposals.
            </p>
          </div>

          <Link
            href="/request-quote"
            className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New RFQ</span>
          </Link>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search RFQ Number, product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
            {allStatuses.slice(0, 6).map((st) => (
              <button
                key={st.value}
                type="button"
                onClick={() => setStatusFilter(st.value)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  statusFilter === st.value
                    ? "bg-orange-600 text-white border border-orange-500"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Table (Desktop) & Cards (Mobile) */}
        {filteredRfqs.length === 0 ? (
          <div className="p-12 rounded-lg bg-slate-900 border border-slate-800 text-center space-y-3 font-mono">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-300 font-bold uppercase">No matching RFQs found</p>
            <p className="text-xs text-slate-500">
              Clear your status filter or submit a new inquiry.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-900 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase">
                    <th className="py-3.5 px-4">RFQ Number</th>
                    <th className="py-3.5 px-4">Product / Scope</th>
                    <th className="py-3.5 px-4">Quantity</th>
                    <th className="py-3.5 px-4">Date Logged</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Last Updated</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredRfqs.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-orange-400">
                        {rfq.rfq_number}
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">
                        <p className="font-semibold text-white">{rfq.product_name}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{rfq.title}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {rfq.quantity} {rfq.unit}
                        <span className="text-[10px] text-slate-500 block">{rfq.material}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(rfq.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={rfq.status} type="rfq" size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(rfq.updated_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {rfq.quotation_id && (
                          <Link
                            href={`/customer/quotations/${rfq.quotation_id}`}
                            className="inline-block px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 text-[11px] font-bold"
                          >
                            Quote
                          </Link>
                        )}
                        <Link
                          href={`/customer/requests/${rfq.id}`}
                          className="inline-block px-2.5 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold"
                        >
                          Track →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
