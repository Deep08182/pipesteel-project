import React from "react";
import { RFQStatus, QuotationStatus, RFQPriority } from "@/types";
import {
  Clock,
  Eye,
  FileCheck,
  Send,
  CheckCircle2,
  Cpu,
  CheckCheck,
  XCircle,
  AlertTriangle,
  FileText,
  Flame,
} from "lucide-react";

interface StatusBadgeProps {
  status: RFQStatus | QuotationStatus | RFQPriority | string;
  type?: "rfq" | "quotation" | "priority";
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = "rfq", size = "md" }) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  }[size];

  // Priority Badges
  if (type === "priority") {
    switch (status) {
      case "URGENT":
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase rounded border bg-red-950/40 text-red-400 border-red-800 ${sizeClasses}`}>
            <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" /> Urgent
          </span>
        );
      case "HIGH":
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-semibold uppercase rounded border bg-orange-950/40 text-orange-400 border-orange-800 ${sizeClasses}`}>
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" /> High
          </span>
        );
      case "NORMAL":
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-medium uppercase rounded border bg-slate-800 text-slate-300 border-slate-700 ${sizeClasses}`}>
            Normal
          </span>
        );
      case "LOW":
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-normal uppercase rounded border bg-slate-900 text-slate-400 border-slate-800 ${sizeClasses}`}>
            Low
          </span>
        );
    }
  }

  // Quotation Badges
  if (type === "quotation") {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase rounded border bg-emerald-950/50 text-emerald-400 border-emerald-700 ${sizeClasses}`}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
          </span>
        );
      case "SENT":
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-semibold uppercase rounded border bg-blue-950/50 text-blue-400 border-blue-700 ${sizeClasses}`}>
            <Send className="w-3.5 h-3.5" /> Sent to Customer
          </span>
        );
      case "VIEWED":
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-medium uppercase rounded border bg-cyan-950/50 text-cyan-400 border-cyan-700 ${sizeClasses}`}>
            <Eye className="w-3.5 h-3.5" /> Viewed
          </span>
        );
      case "REJECTED":
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-medium uppercase rounded border bg-red-950/50 text-red-400 border-red-700 ${sizeClasses}`}>
            <XCircle className="w-3.5 h-3.5" /> Revision Req.
          </span>
        );
      case "EXPIRED":
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-medium uppercase rounded border bg-zinc-900 text-zinc-400 border-zinc-700 ${sizeClasses}`}>
            Expired
          </span>
        );
      case "DRAFT":
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 font-mono font-medium uppercase rounded border bg-amber-950/40 text-amber-400 border-amber-800 ${sizeClasses}`}>
            <FileText className="w-3.5 h-3.5" /> Draft
          </span>
        );
    }
  }

  // RFQ Status Badges (10 Stages)
  switch (status) {
    case "SUBMITTED":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-semibold uppercase rounded border bg-blue-950/50 text-blue-300 border-blue-800 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-blue-400" /> Submitted
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-semibold uppercase rounded border bg-amber-950/50 text-amber-300 border-amber-700 ${sizeClasses}`}>
          <Eye className="w-3.5 h-3.5 text-amber-400" /> Under Review
        </span>
      );
    case "NEED_INFORMATION":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase rounded border bg-purple-950/60 text-purple-300 border-purple-700 animate-pulse ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-purple-400" /> Need Info
        </span>
      );
    case "QUOTATION_PREPARED":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-semibold uppercase rounded border bg-indigo-950/60 text-indigo-300 border-indigo-700 ${sizeClasses}`}>
          <FileCheck className="w-3.5 h-3.5 text-indigo-400" /> Quote Prepared
        </span>
      );
    case "QUOTATION_SENT":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase rounded border bg-cyan-950/60 text-cyan-300 border-cyan-600 ${sizeClasses}`}>
          <Send className="w-3.5 h-3.5 text-cyan-400" /> Quotation Sent
        </span>
      );
    case "APPROVED":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase rounded border bg-emerald-950/60 text-emerald-300 border-emerald-600 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Approved
        </span>
      );
    case "IN_PRODUCTION":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase rounded border bg-orange-950/60 text-orange-300 border-orange-600 ${sizeClasses}`}>
          <Cpu className="w-3.5 h-3.5 text-orange-400 animate-pulse" /> In Production
        </span>
      );
    case "COMPLETED":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase rounded border bg-teal-950/70 text-teal-200 border-teal-500 ${sizeClasses}`}>
          <CheckCheck className="w-3.5 h-3.5 text-teal-400" /> Completed
        </span>
      );
    case "REJECTED":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-semibold uppercase rounded border bg-rose-950/50 text-rose-300 border-rose-800 ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-400" /> Rejected
        </span>
      );
    case "CANCELLED":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-medium uppercase rounded border bg-zinc-900 text-zinc-400 border-zinc-700 ${sizeClasses}`}>
          Cancelled
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-medium uppercase rounded border bg-zinc-800 text-zinc-300 border-zinc-700 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};
