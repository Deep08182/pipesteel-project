"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { db } from "@/lib/database/store";
import { RFQ, RFQUpdate } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RFQTimeline } from "@/components/shared/RFQTimeline";
import { formatFileSize } from "@/lib/validations/rfq";
import {
  ArrowLeft,
  FileText,
  FileCheck2,
  Download,
  AlertTriangle,
  Building,
  User,
  Calendar,
  Layers,
  Scale,
  MessageSquare,
  Shield,
} from "lucide-react";

export default function CustomerRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, role } = useAuth();

  const id = params.id as string;
  const [rfq, setRfq] = useState<RFQ | null>(null);
  const [updates, setUpdates] = useState<RFQUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!user) return;
    db.initialize();
    const found = db.getRFQ(id);

    if (!found) {
      setRfq(null);
      setLoading(false);
      return;
    }

    // Security check: Must belong to user OR user is ADMIN
    const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
    if (!isAdmin && found.customer_id !== user.id) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }

    setRfq(found);
    setUpdates(db.getRFQUpdates(found.id));
    setLoading(false);
  }, [id, user, role]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono text-xs text-slate-400">
        Loading RFQ Track & Trace Record...
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-700 flex items-center justify-center text-red-400 mx-auto">
          <Shield className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-mono font-bold text-white uppercase">
          Unauthorized Access Restricted
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Security Policy: You are logged in as {user?.company_name}. This RFQ belongs to another enterprise client. Access to external quotation files is strictly prohibited.
        </p>
        <Link
          href="/customer/requests"
          className="inline-block px-5 py-2.5 rounded bg-slate-800 text-white font-mono text-xs uppercase font-bold border border-slate-700 mt-2"
        >
          Return to My RFQs
        </Link>
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-xl font-mono font-bold text-white uppercase">RFQ Not Found</h2>
        <p className="text-xs text-slate-400 font-mono">
          Could not locate RFQ identifier {id}.
        </p>
        <Link
          href="/customer/requests"
          className="inline-block px-5 py-2.5 rounded bg-slate-800 text-white font-mono text-xs uppercase font-bold"
        >
          Back to Enquiries
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link & Header */}
        <div>
          <Link
            href="/customer/requests"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Enquiries
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-mono font-black text-white uppercase tracking-tight">
                  {rfq.rfq_number}
                </span>
                <StatusBadge status={rfq.status} type="rfq" size="md" />
                <StatusBadge status={rfq.priority} type="priority" size="sm" />
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Registered on {new Date(rfq.created_at).toLocaleString("en-IN")} • Target Delivery: {rfq.delivery_date}
              </p>
            </div>

            {rfq.quotation_id && (
              <Link
                href={`/customer/quotations/${rfq.quotation_id}`}
                className="px-5 py-2.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-600/20 border border-cyan-400 flex items-center gap-2 self-start md:self-auto"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>View Official Quotation →</span>
              </Link>
            )}
          </div>
        </div>

        {/* 1. Industrial Sequential Workflow Timeline */}
        <RFQTimeline rfq={rfq} updates={updates} />

        {/* 2. RFQ Technical Specifications & Bill of Materials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-mono font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
                Technical Scope & Requirements
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 rounded bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block">Product:</span>
                  <span className="text-white font-bold truncate block">{rfq.product_name}</span>
                </div>
                <div className="p-3 rounded bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block">Quantity:</span>
                  <span className="text-orange-400 font-bold block">{rfq.quantity} {rfq.unit}</span>
                </div>
                <div className="p-3 rounded bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block">Material:</span>
                  <span className="text-slate-200 font-semibold block">{rfq.material}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-mono text-slate-400 uppercase font-bold block">
                  Project Description:
                </span>
                <p className="text-slate-300 bg-slate-950 p-4 rounded border border-slate-800 leading-relaxed font-sans text-xs">
                  {rfq.description}
                </p>
              </div>

              {/* Specifications Record */}
              {rfq.specifications && Object.keys(rfq.specifications).length > 0 && (
                <div className="space-y-1 text-xs">
                  <span className="font-mono text-slate-400 uppercase font-bold block">
                    Specified Technical Parameters:
                  </span>
                  <div className="rounded border border-slate-800 overflow-hidden bg-slate-950">
                    <table className="w-full text-xs font-mono">
                      <tbody>
                        {Object.entries(rfq.specifications).map(([k, v]) => {
                          if (!v) return null;
                          return (
                            <tr key={k} className="border-b border-slate-800 last:border-none">
                              <td className="py-2 px-3 text-slate-500 uppercase font-bold w-1/3">
                                {k}
                              </td>
                              <td className="py-2 px-3 text-slate-200">{String(v)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Attached Drawings & Technical Documents */}
            <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-mono font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
                Attached Drawings & BoQ Files ({rfq.attachments?.length || 0})
              </h3>

              {!rfq.attachments || rfq.attachments.length === 0 ? (
                <p className="text-xs font-mono text-slate-500">
                  No technical drawings attached with this request.
                </p>
              ) : (
                <div className="space-y-2">
                  {rfq.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="w-4 h-4 text-orange-400 shrink-0" />
                        <div className="truncate">
                          <p className="font-bold text-white truncate">{att.file_name}</p>
                          <p className="text-[10px] text-slate-500">{formatFileSize(att.file_size)}</p>
                        </div>
                      </div>
                      <a
                        href={att.file_url}
                        download={att.file_name}
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Simulated download of engineering drawing: ${att.file_name}`);
                        }}
                        className="px-3 py-1.5 rounded bg-slate-850 hover:bg-slate-800 text-orange-400 border border-slate-700 flex items-center gap-1 text-[11px] shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Assigned Engineer & Support */}
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                Assigned Technical Desk
              </h4>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded bg-slate-950 border border-slate-850 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase">Lead Engineer:</span>
                  <p className="text-white font-bold">{rfq.assigned_to || "Vikramaditya Mehta"}</p>
                  <p className="text-[11px] text-orange-400">{rfq.assigned_engineer_email || "admin@steelcoreindustries.com"}</p>
                </div>

                <div className="p-3 rounded bg-slate-950 border border-slate-850 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase">Plant Location:</span>
                  <p className="text-slate-200">MIDC Chakan, Pune Works</p>
                </div>

                <div className="p-3 rounded bg-slate-950 border border-slate-850 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase">Need Immediate Clarification?</span>
                  <p className="text-slate-400 text-[11px]">
                    Direct line: +91 98230 12345
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
