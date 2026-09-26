"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { db } from "@/lib/database/store";
import { Quotation } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { COMPANY_CONFIG } from "@/lib/config/company";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileCheck2,
  Building,
  Calendar,
  Truck,
  CreditCard,
  Printer,
  Shield,
  AlertTriangle,
} from "lucide-react";

export default function CustomerQuotationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, role } = useAuth();

  const id = params.id as string;
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) return;
    db.initialize();
    const q = db.getQuotation(id);
    if (q) {
      setQuotation(q);
      // Mark as VIEWED if SENT
      if (q.status === "SENT") {
        db.updateQuotationStatus(q.id, "VIEWED", "Customer opened official commercial quotation in portal.");
      }
    }
    setLoading(false);
  }, [id, user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono text-xs text-slate-400">
        Loading Commercial Quotation...
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-xl font-mono font-bold text-white uppercase">Quotation Not Found</h2>
        <p className="text-xs text-slate-400 font-mono">
          Could not find quotation {id}.
        </p>
        <Link
          href="/customer"
          className="inline-block px-5 py-2.5 rounded bg-slate-800 text-white font-mono text-xs uppercase font-bold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleAccept = () => {
    if (!confirm(`Confirm acceptance of commercial quotation ${quotation.quotation_number}? This will convert the RFQ into an APPROVED work order.`)) {
      return;
    }
    setIsProcessing(true);
    const updated = db.updateQuotationStatus(
      quotation.id,
      "ACCEPTED",
      `Customer ${user?.full_name} accepted quotation ${quotation.quotation_number}. Work order confirmed.`
    );
    if (updated) {
      setQuotation({ ...updated });
      setActionSuccess("Quotation officially accepted! Your order is now APPROVED and routed to plant production scheduling.");
    }
    setIsProcessing(false);
  };

  const handleReject = () => {
    const reason = prompt("Please provide a reason or revision note for the engineering desk:", "Requesting revision on payment terms or schedule.");
    if (reason === null) return;

    setIsProcessing(true);
    const updated = db.updateQuotationStatus(
      quotation.id,
      "REJECTED",
      `Customer requested revisions: ${reason}`
    );
    if (updated) {
      setQuotation({ ...updated });
      setActionSuccess("Quotation revision requested. Our estimation desk has been notified.");
    }
    setIsProcessing(false);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href={quotation.rfq_id ? `/customer/requests/${quotation.rfq_id}` : "/customer"}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to RFQ
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white"
          >
            <Printer className="w-3.5 h-3.5" /> Print Quotation
          </button>
        </div>

        {actionSuccess && (
          <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-600 text-emerald-300 text-xs font-mono flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Industrial Quotation Paper Document */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8 font-mono">
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-800 pb-8">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-orange-600 text-white flex items-center justify-center font-black text-sm">
                  S
                </div>
                <span className="text-base font-black text-white uppercase tracking-wider">
                  {COMPANY_CONFIG.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{COMPANY_CONFIG.fullAddress}</p>
              <p className="text-[11px] text-slate-400">
                GSTIN: {COMPANY_CONFIG.gstin} • CIN: {COMPANY_CONFIG.cin}
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-xs uppercase tracking-widest text-orange-500 font-bold block">
                COMMERCIAL PROPOSAL
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
                {quotation.quotation_number}
              </h2>
              <div className="pt-1">
                <StatusBadge status={quotation.status} type="quotation" size="sm" />
              </div>
            </div>
          </div>

          {/* Meta Information Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded bg-slate-950 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Client Enterprise:</span>
              <span className="text-white font-bold block mt-0.5">{quotation.customer_company}</span>
              <span className="text-slate-400 block text-[11px]">{quotation.customer_name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Linked RFQ Reference:</span>
              <span className="text-orange-400 font-bold block mt-0.5">{quotation.rfq_number || "Direct Tender"}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Quotation Date:</span>
              <span className="text-slate-200 block mt-0.5">
                {new Date(quotation.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Price Validity:</span>
              <span className="text-amber-400 font-bold block mt-0.5">{quotation.valid_until}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <span className="text-xs uppercase text-slate-400 font-bold block">
              Bill of Materials & Pricing Breakdown
            </span>
            <div className="rounded border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Item Description & Specification</th>
                    <th className="py-2.5 px-3">Qty</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3 text-right">Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right">Line Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {quotation.items.map((item, idx) => (
                    <tr key={item.id || idx} className="bg-slate-900/60">
                      <td className="py-3 px-3 text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3 text-slate-200">
                        <p className="font-semibold text-white">{item.description}</p>
                        {item.hsn_code && (
                          <span className="text-[10px] text-slate-500">HSN: {item.hsn_code}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-bold">{item.quantity}</td>
                      <td className="py-3 px-3 text-slate-400">{item.unit}</td>
                      <td className="py-3 px-3 text-right text-slate-300">
                        ₹{item.unit_price.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-3 text-right text-white font-bold">
                        ₹{item.total.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commercial Summary & Taxes */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 border-t border-slate-800">
            {/* Terms and Conditions */}
            <div className="space-y-3 text-xs sm:max-w-md">
              <span className="text-slate-400 uppercase font-bold block">
                Commercial & Delivery Terms
              </span>
              <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
                <p>
                  <strong className="text-slate-200">Payment:</strong> {quotation.payment_terms}
                </p>
                <p>
                  <strong className="text-slate-200">Delivery:</strong> {quotation.delivery_terms}
                </p>
                {quotation.notes && (
                  <p>
                    <strong className="text-slate-200">Engineering Notes:</strong> {quotation.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="w-full sm:w-72 space-y-2 p-4 rounded bg-slate-950 border border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-white">₹{quotation.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18%):</span>
                <span className="text-white">₹{quotation.tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Transport & Handling:</span>
                <span className="text-white">₹{quotation.shipping.toLocaleString("en-IN")}</span>
              </div>
              {quotation.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Special Project Discount:</span>
                  <span>-₹{quotation.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-bold text-orange-400">
                <span>TOTAL (INR):</span>
                <span>₹{quotation.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Current Status: <StatusBadge status={quotation.status} type="quotation" size="sm" />
            </div>

            {quotation.status !== "ACCEPTED" ? (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleReject}
                  className="w-full sm:w-auto px-4 py-2.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 font-mono text-xs uppercase font-bold border border-rose-900/50 flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Request Revision
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleAccept}
                  className="w-full sm:w-auto px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase font-bold border border-emerald-400 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> ACCEPT QUOTATION
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase bg-emerald-950/60 border border-emerald-700 px-4 py-2 rounded">
                <CheckCircle2 className="w-4 h-4" /> Officially Accepted by Client
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
