"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { db } from "@/lib/database/store";
import { RFQ, RFQUpdate, RFQStatus, RFQPriority } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RFQTimeline } from "@/components/shared/RFQTimeline";
import { formatFileSize } from "@/lib/validations/rfq";
import {
  ArrowLeft,
  FileSpreadsheet,
  FileCheck2,
  Download,
  AlertTriangle,
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  Layers,
  Scale,
  MessageSquare,
  CheckCircle2,
  Save,
  Send,
  PlusCircle,
} from "lucide-react";

export default function AdminRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const id = params.id as string;
  const [rfq, setRfq] = useState<RFQ | null>(null);
  const [updates, setUpdates] = useState<RFQUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin Controls State
  const [selectedStatus, setSelectedStatus] = useState<RFQStatus>("SUBMITTED");
  const [selectedPriority, setSelectedPriority] = useState<RFQPriority>("NORMAL");
  const [assignedEngineer, setAssignedEngineer] = useState("Vikramaditya Mehta");
  const [adminComment, setAdminComment] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const engineers = [
    "Vikramaditya Mehta (VP Operations)",
    "Rajesh Kulkarni (Chief Metallurgical Engineer)",
    "Aniket Shinde (Senior Structural Estimator)",
    "Pooja Deshpande (Extrusion Die Specialist)",
  ];

  const loadRFQ = () => {
    db.initialize();
    const found = db.getRFQ(id);
    if (found) {
      setRfq(found);
      setSelectedStatus(found.status);
      setSelectedPriority(found.priority);
      if (found.assigned_to) setAssignedEngineer(found.assigned_to);
      setUpdates(db.getRFQUpdates(found.id));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRFQ();
  }, [id]);

  const handleUpdateStatus = (overrideStatus?: RFQStatus, customComment?: string) => {
    if (!rfq) return;
    const targetStatus = overrideStatus || selectedStatus;
    const targetComment = customComment || adminComment || `Status set to ${targetStatus.replace("_", " ")} by ${user?.full_name || "Admin"}.`;

    const updated = db.updateRFQStatus(
      rfq.id,
      targetStatus,
      user?.id,
      targetComment,
      {
        priority: selectedPriority,
        assigned_to: assignedEngineer,
      }
    );

    if (updated) {
      setRfq(updated);
      setSelectedStatus(updated.status);
      setAdminComment("");
      setUpdates(db.getRFQUpdates(updated.id));
      setFeedbackMessage(`Status successfully updated to ${targetStatus.replace("_", " ")}! Notification sent to customer.`);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleRequestMoreInfo = () => {
    const question = prompt(
      "Enter technical clarification question to send to the client (e.g., hole pattern details, exact alloy temper, or surface coating):",
      "Please confirm the anchor bolt center distance and whether holes require counter-boring."
    );
    if (!question) return;

    handleUpdateStatus("NEED_INFORMATION", question);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono text-xs text-slate-400">
        Loading RFQ Dossier...
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4 font-mono">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-white uppercase">RFQ Not Found</h2>
        <Link
          href="/admin/requests"
          className="inline-block px-5 py-2.5 rounded bg-slate-800 text-white text-xs uppercase"
        >
          Back to Queue
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/admin/requests"
          className="inline-flex items-center gap-1.5 text-xs uppercase text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Master Queue
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white uppercase">
                {rfq.rfq_number}
              </span>
              <StatusBadge status={rfq.status} type="rfq" size="md" />
              <StatusBadge status={rfq.priority} type="priority" size="sm" />
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Registered by {rfq.customer?.full_name} ({rfq.customer?.company_name}) on{" "}
              {new Date(rfq.created_at).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/admin/quotations/new?rfqId=${rfq.id}`}
              className="px-5 py-2.5 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-600/30 border border-orange-400 flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>CREATE COMMERCIAL QUOTATION</span>
            </Link>
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Main Grid: Details + Operational Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Complete Enquiry Information (Prompt Requirement 18) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer & Company Details */}
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
              Customer & Procurement Enterprise
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded bg-slate-950 border border-slate-850 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Enterprise:</span>
                <p className="text-white font-bold text-sm">{rfq.customer?.company_name || "Enterprise"}</p>
                <p className="text-slate-400">{rfq.customer?.city}, {rfq.customer?.state}</p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-850 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Contact Person:</span>
                <p className="text-white font-bold text-sm">{rfq.customer?.full_name}</p>
                <p className="text-slate-400">{rfq.customer?.designation || "Procurement Manager"}</p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-850 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Email:</span>
                <p className="text-orange-400">{rfq.customer?.email}</p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-850 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Phone:</span>
                <p className="text-slate-200">{rfq.customer?.phone}</p>
              </div>
            </div>
          </div>

          {/* Product & Scope Details */}
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
              Scope of Supply & Quantity
            </h3>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded bg-slate-950 border border-slate-850">
                <span className="text-slate-500 text-[10px] uppercase">Product:</span>
                <p className="text-white font-bold truncate mt-0.5">{rfq.product_name}</p>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-850">
                <span className="text-slate-500 text-[10px] uppercase">Required Qty:</span>
                <p className="text-orange-400 font-bold mt-0.5">{rfq.quantity} {rfq.unit}</p>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-850">
                <span className="text-slate-500 text-[10px] uppercase">Material Base:</span>
                <p className="text-slate-200 font-bold mt-0.5">{rfq.material}</p>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400 uppercase font-bold block">
                Project & Installation Details:
              </span>
              <p className="p-3 rounded bg-slate-950 border border-slate-800 text-slate-300 font-sans text-xs leading-relaxed">
                {rfq.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-slate-950 border border-slate-850">
                <span className="text-slate-500 text-[10px] uppercase">Target Delivery:</span>
                <p className="text-amber-400 font-bold">{rfq.delivery_date}</p>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-850">
                <span className="text-slate-500 text-[10px] uppercase">Estimated Value:</span>
                <p className="text-emerald-400 font-bold">
                  {rfq.estimated_value ? `₹${rfq.estimated_value.toLocaleString("en-IN")}` : "Pending Estimation"}
                </p>
              </div>
            </div>
          </div>

          {/* Attachments Section (Prompt Requirement 18 & 21) */}
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
              Attached Engineering Drawings & Files ({rfq.attachments?.length || 0})
            </h3>

            {!rfq.attachments || rfq.attachments.length === 0 ? (
              <p className="text-xs text-slate-500">No client files attached with this RFQ.</p>
            ) : (
              <div className="space-y-2">
                {rfq.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="truncate">
                      <p className="font-bold text-white truncate">{att.file_name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{formatFileSize(att.file_size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert(`Simulated download of engineering drawing: ${att.file_name}`)}
                      className="px-3 py-1.5 rounded bg-slate-850 hover:bg-slate-800 text-orange-400 border border-slate-700 flex items-center gap-1 text-[11px] shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Workflow Timeline Display */}
          <RFQTimeline rfq={rfq} updates={updates} />
        </div>

        {/* Right 5 Cols: Admin Operational Controls (Prompt Requirement 18) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-lg bg-slate-900 border border-orange-500/40 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] text-orange-400 uppercase font-bold block tracking-wider">
                ADMIN CONTROL PANEL
              </span>
              <h3 className="text-base font-black text-white uppercase mt-0.5">
                TRIAGE & STATUS TRANSITIONS
              </h3>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-400 uppercase font-bold">
                Workflow Status [STATUS ▼]
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as RFQStatus)}
                className="w-full px-3 py-2.5 rounded bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-orange-500 text-xs"
              >
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                <option value="NEED_INFORMATION">NEED_INFORMATION</option>
                <option value="QUOTATION_PREPARED">QUOTATION_PREPARED</option>
                <option value="QUOTATION_SENT">QUOTATION_SENT</option>
                <option value="APPROVED">APPROVED</option>
                <option value="IN_PRODUCTION">IN_PRODUCTION</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            {/* Priority Dropdown */}
            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-400 uppercase font-bold">
                Priority Level [PRIORITY ▼]
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as RFQPriority)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-orange-500 text-xs"
              >
                <option value="URGENT">URGENT (Critical Infrastructure)</option>
                <option value="HIGH">HIGH Priority</option>
                <option value="NORMAL">NORMAL Priority</option>
                <option value="LOW">LOW Priority</option>
              </select>
            </div>

            {/* Assigned Engineer Dropdown */}
            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-400 uppercase font-bold">
                Assigned Lead [ENGINEER ▼]
              </label>
              <select
                value={assignedEngineer}
                onChange={(e) => setAssignedEngineer(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500 text-xs"
              >
                {engineers.map((eng) => (
                  <option key={eng} value={eng}>
                    {eng}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Comment */}
            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-400 uppercase font-bold">
                Engineering Comment / Customer Note
              </label>
              <textarea
                rows={3}
                placeholder="Log internal metallurgical review findings, WPS verification, or clarification questions..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="w-full p-3 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 text-xs"
              />
            </div>

            {/* Primary Action Buttons (Prompt Requirement 18: UPDATE STATUS, SEND RESPONSE, REQUEST MORE INFORMATION, CREATE QUOTATION) */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleUpdateStatus()}
                className="w-full py-3 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow border border-orange-400 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>UPDATE STATUS & NOTIFY CLIENT</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleRequestMoreInfo}
                  className="py-2.5 px-3 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-[11px] uppercase border border-purple-800/60"
                >
                  Request More Info
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus("UNDER_REVIEW", "Engineering technical review initiated. Estimating raw material & shop hours.")}
                  className="py-2.5 px-3 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] uppercase border border-amber-800/60"
                >
                  Set Under Review
                </button>
              </div>

              <Link
                href={`/admin/quotations/new?rfqId=${rfq.id}`}
                className="w-full py-3 rounded bg-slate-850 hover:bg-slate-800 text-cyan-300 font-bold text-xs uppercase tracking-wider transition-colors border border-cyan-700/60 flex items-center justify-center gap-2 text-center"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>CREATE QUOTATION FOR THIS RFQ</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
