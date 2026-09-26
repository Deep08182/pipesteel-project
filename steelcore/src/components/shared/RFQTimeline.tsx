import React from "react";
import { RFQ, RFQUpdate, RFQStatus } from "@/types";
import {
  CheckCircle,
  Clock,
  FileSearch,
  MessageSquare,
  FileCheck2,
  Send,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  Truck,
  Award,
} from "lucide-react";

interface RFQTimelineProps {
  rfq: RFQ;
  updates: RFQUpdate[];
  showFullPipeline?: boolean;
}

interface WorkflowStage {
  key: RFQStatus;
  label: string;
  icon: React.ElementType;
  description: string;
}

const ALL_STAGES: WorkflowStage[] = [
  {
    key: "SUBMITTED",
    label: "RFQ Submitted",
    icon: Clock,
    description: "Customer requirements logged & registered in central engineering queue.",
  },
  {
    key: "UNDER_REVIEW",
    label: "Engineering Review",
    icon: FileSearch,
    description: "Metallurgical evaluation, plant capacity allocation, and feasibility study.",
  },
  {
    key: "NEED_INFORMATION",
    label: "Technical Clarification",
    icon: MessageSquare,
    description: "Clarifications requested on tolerances, drawings, or material grade.",
  },
  {
    key: "QUOTATION_PREPARED",
    label: "Quotation Prepared",
    icon: FileCheck2,
    description: "BOM estimation, mill pricing, and lead time schedule finalized.",
  },
  {
    key: "QUOTATION_SENT",
    label: "Quotation Sent",
    icon: Send,
    description: "Official commercial proposal dispatched to customer for review.",
  },
  {
    key: "APPROVED",
    label: "Order Confirmed",
    icon: CheckCircle2,
    description: "Quotation accepted by client. Work order issued to production floor.",
  },
  {
    key: "IN_PRODUCTION",
    label: "Production & Fabrication",
    icon: Wrench,
    description: "Rolling, cutting, automated welding, and assembly in progress.",
  },
  {
    key: "COMPLETED",
    label: "Completed & Dispatched",
    icon: Award,
    description: "Passed 100% NDT inspection, MTC 3.1 issued, and final dispatch completed.",
  },
];

export const RFQTimeline: React.FC<RFQTimelineProps> = ({ rfq, updates }) => {
  // Determine which updates have occurred
  const recordedStatusSet = new Set(updates.map((u) => u.new_status));
  recordedStatusSet.add(rfq.status);
  recordedStatusSet.add("SUBMITTED"); // Always present

  // Map updates by status for timestamp & commentary
  const updateMap = new Map<string, RFQUpdate>();
  updates.forEach((u) => updateMap.set(u.new_status, u));

  // Only display stages that have actually occurred as explicitly requested in item 14
  const occurredStages = ALL_STAGES.filter((stage) => recordedStatusSet.has(stage.key));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 my-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-orange-500 font-semibold">
            INDUSTRIAL WORKFLOW TIMELINE
          </span>
          <h3 className="text-xl font-bold text-white tracking-wide mt-0.5">
            {rfq.rfq_number} Track & Trace
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Current Stage:</span>
          <span className="text-sm font-bold text-orange-400 bg-orange-950/40 border border-orange-800 px-3 py-1 rounded">
            {rfq.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Vertical Stepper */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-700">
        {occurredStages.map((stage, idx) => {
          const isLatest = stage.key === rfq.status;
          const matchingUpdate = updateMap.get(stage.key);
          const timestamp = matchingUpdate
            ? new Date(matchingUpdate.created_at).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : new Date(rfq.created_at).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

          const IconComponent = stage.icon;

          return (
            <div key={stage.key} className="relative group">
              {/* Step Circle Pin */}
              <div
                className={`absolute -left-[30px] sm:-left-[38px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  isLatest
                    ? "bg-orange-600 border-orange-400 text-white shadow-lg shadow-orange-500/20 ring-4 ring-orange-500/20"
                    : "bg-slate-800 border-emerald-500 text-emerald-400"
                }`}
              >
                {isLatest ? <IconComponent className="w-4 h-4 animate-pulse" /> : <CheckCircle className="w-4 h-4" />}
              </div>

              {/* Stage Content */}
              <div
                className={`rounded border p-4 transition-all ${
                  isLatest
                    ? "bg-slate-800/90 border-orange-500/50 shadow-md"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">STAGE 0{idx + 1}</span>
                    <h4 className="text-base font-bold text-white uppercase tracking-wide">{stage.label}</h4>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{timestamp}</span>
                </div>

                <p className="text-sm text-slate-300 mb-2">{stage.description}</p>

                {matchingUpdate && matchingUpdate.comment && (
                  <div className="mt-3 text-xs p-3 rounded bg-slate-950/80 border border-slate-800 text-slate-300 font-mono">
                    <span className="text-orange-400 font-semibold">
                      [{matchingUpdate.admin_name || "Engineering Desk"}]:
                    </span>{" "}
                    {matchingUpdate.comment}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
