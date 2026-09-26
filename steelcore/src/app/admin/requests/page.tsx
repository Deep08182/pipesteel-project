"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/database/store";
import { RFQ, RFQStatus, RFQPriority } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Search,
  Filter,
  ArrowUpDown,
  FileSpreadsheet,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminRequestsPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [materialFilter, setMaterialFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    db.initialize();
    setRfqs(db.getRFQs());
  }, []);

  const allStatuses: { label: string; value: string }[] = [
    { label: "All Statuses", value: "ALL" },
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
      (rfq.customer?.company_name && rfq.customer.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rfq.customer?.full_name && rfq.customer.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rfq.product_name && rfq.product_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || rfq.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || rfq.priority === priorityFilter;
    const matchesMaterial = materialFilter === "ALL" || rfq.material === materialFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesMaterial;
  });

  const totalPages = Math.ceil(filteredRfqs.length / pageSize) || 1;
  const paginatedRfqs = filteredRfqs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
            OPERATIONS MASTER PIPELINE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
            RFQ ENQUIRIES MANAGEMENT
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            View, evaluate, assign engineers, and prepare quotations for all corporate client requirements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/quotations/new"
            className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow border border-orange-400"
          >
            Create Quotation
          </Link>
        </div>
      </div>

      {/* Multi-Criteria Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search RFQ, Company, Person..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            {allStatuses.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="NORMAL">Normal Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        {/* Material Filter */}
        <div>
          <select
            value={materialFilter}
            onChange={(e) => {
              setMaterialFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="ALL">All Materials</option>
            <option value="Steel">Structural Steel</option>
            <option value="Aluminium">Aluminium Extrusion</option>
            <option value="Custom Alloy">Custom Alloys</option>
            <option value="Stainless Steel">Stainless Steel</option>
          </select>
        </div>
      </div>

      {/* RFQ Master Table (Matches Prompt Requirement 17: RFQ ID, Customer, Company, Product, Quantity, Priority, Status, Date, Assigned To, Action) */}
      <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-900 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase">
                <th className="py-3 px-3">RFQ ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Enterprise</th>
                <th className="py-3 px-3">Product / Scope</th>
                <th className="py-3 px-3">Quantity</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Assigned To</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {paginatedRfqs.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-slate-850 transition-colors">
                  <td className="py-3 px-3 font-bold text-orange-400 whitespace-nowrap">
                    {rfq.rfq_number}
                  </td>
                  <td className="py-3 px-3 text-slate-200">
                    <p className="font-semibold">{rfq.customer?.full_name || "Client"}</p>
                    <p className="text-[10px] text-slate-500">{rfq.customer?.phone}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-bold max-w-[140px] truncate">
                    {rfq.customer?.company_name || "Direct"}
                  </td>
                  <td className="py-3 px-3 text-slate-200">
                    <p className="font-semibold text-white max-w-[180px] truncate">{rfq.product_name}</p>
                    <span className="text-[10px] text-slate-500">{rfq.material}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-bold whitespace-nowrap">
                    {rfq.quantity} {rfq.unit}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <StatusBadge status={rfq.priority} type="priority" size="sm" />
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <StatusBadge status={rfq.status} type="rfq" size="sm" />
                  </td>
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                    {new Date(rfq.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </td>
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap text-[11px]">
                    {rfq.assigned_to || "Unassigned"}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/requests/${rfq.id}`}
                      className="inline-block px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold text-[11px] uppercase transition-colors"
                    >
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredRfqs.length)} of {filteredRfqs.length} requests
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-30 hover:bg-slate-800 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-30 hover:bg-slate-800 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
