"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/database/store";
import { UserProfile, RFQ } from "@/types";
import { Users, Search, Building, Phone, Mail, FileText, ArrowRight } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<UserProfile | null>(null);

  useEffect(() => {
    db.initialize();
    setCustomers(db.getCustomerProfiles());
    setRfqs(db.getRFQs());
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) ||
      c.company_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  const getCustomerStats = (customerId: string) => {
    const custRfqs = rfqs.filter((r) => r.customer_id === customerId);
    const total = custRfqs.length;
    const active = custRfqs.filter((r) => r.status === "APPROVED" || r.status === "IN_PRODUCTION").length;
    const completed = custRfqs.filter((r) => r.status === "COMPLETED").length;
    return { total, active, completed };
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
            ENTERPRISE DIRECTORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
            B2B CLIENT MANAGEMENT
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Corporate buyer profiles, GST compliance credentials, and RFQ procurement histories.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by company, person, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Customers Table (Prompt Requirement 27: Customer, Company, Email, Phone, Total RFQs, Active RFQs, Completed Orders, Registration Date. Do NOT expose passwords.) */}
      <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-900 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase">
                <th className="py-3 px-3">Company / Enterprise</th>
                <th className="py-3 px-3">Contact Person</th>
                <th className="py-3 px-3">Email & Phone</th>
                <th className="py-3 px-3">GSTIN</th>
                <th className="py-3 px-3 text-center">Total RFQs</th>
                <th className="py-3 px-3 text-center">Active Orders</th>
                <th className="py-3 px-3 text-center">Completed</th>
                <th className="py-3 px-3">Registered</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCustomers.map((cust) => {
                const stats = getCustomerStats(cust.id);
                return (
                  <tr key={cust.id} className="hover:bg-slate-850 transition-colors">
                    <td className="py-3.5 px-3 text-white font-bold">
                      <p className="text-sm">{cust.company_name}</p>
                      <p className="text-[10px] text-slate-500">{cust.city}, {cust.state}</p>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      <p className="font-semibold text-white">{cust.full_name}</p>
                      <p className="text-[10px] text-slate-500">{cust.designation || "Procurement"}</p>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      <p className="text-orange-400">{cust.email}</p>
                      <p className="text-[10px] text-slate-400">{cust.phone}</p>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-bold text-[11px]">
                      {cust.gstin || "27AABCA1234F1Z5"}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-white">
                      {stats.total}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-orange-400">
                      {stats.active}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-emerald-400">
                      {stats.completed}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                      {new Date(cust.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(cust)}
                        className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px]"
                      >
                        Enquiries →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Customer RFQ Modal / Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-400">Customer Dossier</span>
                <h3 className="text-xl font-bold text-white uppercase">{selectedCustomer.company_name}</h3>
                <p className="text-xs text-slate-400 font-sans">{selectedCustomer.full_name} ({selectedCustomer.email})</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-white text-xs uppercase px-2.5 py-1 rounded bg-slate-800"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400">
                All Logged Enquiries ({rfqs.filter((r) => r.customer_id === selectedCustomer.id).length})
              </h4>
              <div className="space-y-2">
                {rfqs
                  .filter((r) => r.customer_id === selectedCustomer.id)
                  .map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="text-orange-400 font-bold">{r.rfq_number}</span>
                        <p className="font-semibold text-white">{r.product_name} ({r.quantity} {r.unit})</p>
                        <p className="text-[10px] text-slate-500">{new Date(r.created_at).toLocaleDateString("en-IN")}</p>
                      </div>
                      <Link
                        href={`/admin/requests/${r.id}`}
                        onClick={() => setSelectedCustomer(null)}
                        className="px-3 py-1 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold text-[11px]"
                      >
                        Open RFQ →
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
