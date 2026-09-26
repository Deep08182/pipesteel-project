"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/database/store";
import { Quotation } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FileCheck2, Plus, Search, Eye, ArrowRight } from "lucide-react";

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    db.initialize();
    setQuotations(db.getQuotations());
  }, []);

  const filtered = quotations.filter((q) => {
    const matchesSearch =
      q.quotation_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.customer_name && q.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.customer_company && q.customer_company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.rfq_number && q.rfq_number.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
            COMMERCIAL PIPELINE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
            QUOTATIONS MASTER LEDGER
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Issued commercial tenders, client acceptance status, and active work orders.
          </p>
        </div>

        <Link
          href="/admin/quotations/new"
          className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow border border-orange-400 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Quotation</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Quote #, RFQ, Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "SENT", "ACCEPTED", "VIEWED", "REJECTED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                statusFilter === st
                  ? "bg-orange-600 text-white"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Quotations Table */}
      <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-900 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase">
                <th className="py-3 px-3">Quote Number</th>
                <th className="py-3 px-3">Linked RFQ</th>
                <th className="py-3 px-3">Client Enterprise</th>
                <th className="py-3 px-3">Items Count</th>
                <th className="py-3 px-3">Grand Total</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Validity</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-slate-850 transition-colors">
                  <td className="py-3 px-3 font-bold text-orange-400">{q.quotation_number}</td>
                  <td className="py-3 px-3 text-slate-300">{q.rfq_number || "Direct"}</td>
                  <td className="py-3 px-3 text-white font-semibold">
                    <p>{q.customer_company}</p>
                    <p className="text-[10px] text-slate-500">{q.customer_name}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{q.items.length} item(s)</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">
                    ₹{q.total.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={q.status} type="quotation" size="sm" />
                  </td>
                  <td className="py-3 px-3 text-slate-400">{q.valid_until}</td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <Link
                      href={`/customer/quotations/${q.id}`}
                      target="_blank"
                      className="inline-block px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px]"
                    >
                      Client View ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
