"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/lib/database/store";
import { useAuth } from "@/lib/auth/context";
import { FileUpload } from "@/components/shared/FileUpload";
import { Attachment, RFQ } from "@/types";
import {
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  Calendar,
  Send,
  Building,
  User,
  Phone,
  Mail,
  Scale,
} from "lucide-react";
import Link from "next/link";

function RequestQuoteForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const productParam = searchParams.get("product");

  db.initialize();
  const products = db.getProducts();

  const initialProduct = productParam
    ? products.find((p) => p.slug === productParam || p.id === productParam)
    : undefined;

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [companyName, setCompanyName] = useState(user?.company_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [selectedProductId, setSelectedProductId] = useState(initialProduct?.id || "");
  const [material, setMaterial] = useState<"Steel" | "Aluminium" | "Custom Alloy" | "Stainless Steel">(
    (initialProduct?.material as any) || "Steel"
  );
  const [quantity, setQuantity] = useState<number | string>(25);
  const [unit, setUnit] = useState<RFQ["unit"]>("Tons");
  const [specificationsText, setSpecificationsText] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("2026-10-30");
  const [additionalMessage, setAdditionalMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [submittedRFQ, setSubmittedRFQ] = useState<RFQ | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.full_name);
      if (!companyName) setCompanyName(user.company_name);
      if (!email) setEmail(user.email);
      if (!phone) setPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (productParam) {
      const found = products.find((p) => p.slug === productParam || p.id === productParam);
      if (found) {
        setSelectedProductId(found.id);
        if (found.material === "Steel" || found.material === "Aluminium") {
          setMaterial(found.material);
        }
      }
    }
  }, [productParam, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedProduct = products.find((p) => p.id === selectedProductId);
    const customerId = user?.id || "usr-cust-01"; // Fallback to demo customer if guest

    const newRFQ = db.createRFQ({
      customer_id: customerId,
      product_id: selectedProductId || undefined,
      product_name: selectedProduct ? selectedProduct.name : "Custom Industrial Fabrication",
      title: projectDetails
        ? `${projectDetails.slice(0, 50)}...`
        : `RFQ for ${selectedProduct ? selectedProduct.name : material + " Fabrication"}`,
      description: `${projectDetails}\n\nAdditional Notes: ${additionalMessage}`,
      quantity: Number(quantity) || 1,
      unit,
      material,
      specifications: {
        rawInput: specificationsText,
        productSpecs: selectedProduct ? JSON.stringify(selectedProduct.specifications) : undefined,
      },
      delivery_date: deliveryDate,
      priority: "NORMAL",
      attachments,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedRFQ(newRFQ);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {submittedRFQ ? (
        /* Submission Success Screen */
        <div className="rounded-xl bg-slate-900 border border-orange-500/50 p-8 sm:p-12 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400">
              RFQ SUBMITTED SUCCESSFULLY
            </span>
            <h2 className="text-3xl font-mono font-black text-white uppercase tracking-tight">
              Quotation Request Registered
            </h2>
            <div className="inline-block px-4 py-2 rounded bg-slate-950 border border-orange-500/40 text-orange-400 font-mono font-bold text-lg sm:text-xl my-3">
              Reference Number: {submittedRFQ.rfq_number}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Your quotation request has been routed to our Chief Estimation and Metallurgical Review Desk. We will analyze your BoQ, CAD drawings, and specifications.
            </p>
          </div>

          {/* Quick Details Box */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-left max-w-lg mx-auto space-y-2">
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-500">Product / Scope:</span>
              <span className="text-slate-200 font-semibold truncate">{submittedRFQ.product_name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-500">Quantity:</span>
              <span className="text-orange-400 font-semibold">{submittedRFQ.quantity} {submittedRFQ.unit}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-500">Expected Delivery:</span>
              <span className="text-slate-200">{submittedRFQ.delivery_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Drawings Attached:</span>
              <span className="text-slate-200 font-semibold">{submittedRFQ.attachments?.length || 0} File(s)</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/customer/requests/${submittedRFQ.id}`}
              className="w-full sm:w-auto px-8 py-3.5 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-600/30 border border-orange-400 flex items-center justify-center gap-2"
            >
              <span>TRACK THIS RFQ IN CUSTOMER PORTAL</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmittedRFQ(null);
                setProjectDetails("");
                setSpecificationsText("");
                setAttachments([]);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase tracking-wider border border-slate-700"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        /* RFQ Submission Form */
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="border-b border-slate-800 pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-orange-500 tracking-wider">
              <FileCheck2 className="w-4 h-4" /> B2B INDUSTRIAL TENDER & RFQ SYSTEM
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-black text-white uppercase tracking-tight">
              REQUEST FOR QUOTATION (RFQ)
            </h1>
            <p className="text-xs text-slate-300">
              Submit your structural or extrusion specifications. Our engineering team prepares formal line-item commercial proposals with transparent delivery terms.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs font-mono">
            {/* 1. Contact / Company Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-mono font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
                1. Company & Procurement Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-400 uppercase font-semibold">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-400 uppercase font-semibold">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. ABC Infrastructure Pvt Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-400 uppercase font-semibold">
                    Official Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@abc.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-400 uppercase font-semibold">
                    Phone / Mobile *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98112 34567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Product & Quantity */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-mono font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
                2. Product / Service Requirements
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-400 uppercase font-semibold">
                    Select Product / Catalog Item
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="">-- Custom Engineering / Other --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.material})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-400 uppercase font-semibold">
                    Material Required *
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Steel">Structural Steel (IS 2062 / EN 10025)</option>
                    <option value="Aluminium">Aluminium (6063-T6 / 6082-T6 / 5052)</option>
                    <option value="Custom Alloy">Custom Alloy / Tool Steel</option>
                    <option value="Stainless Steel">Stainless Steel (304 / 316L)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-400 uppercase font-semibold">
                    Quantity Required *
                  </label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="e.g. 25"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-400 uppercase font-semibold">
                    Measurement Unit *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Tons">Metric Tons (MT)</option>
                    <option value="KG">Kilograms (KG)</option>
                    <option value="Meters">Linear Meters</option>
                    <option value="Pieces">Pieces / Items</option>
                    <option value="Assemblies">Assemblies / Skids</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Technical Specifications & Schedule */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-mono font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
                3. Technical Specifications & Delivery Requirement
              </h3>

              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase font-semibold">
                  Required Dimensions, Steel Grade, or Surface Coating
                </label>
                <input
                  type="text"
                  placeholder="e.g. ISMB 450, Grade E350, Shot Blasted SA 2.5 + 75µm Red Oxide Primer"
                  value={specificationsText}
                  onChange={(e) => setSpecificationsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-400 uppercase font-semibold">
                    Expected Delivery Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="date"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-400 uppercase font-semibold">
                    Project / Delivery Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pune / Mumbai Metro Site / Gujarat"
                    className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-400 uppercase font-semibold">
                  Project Details & Scope Overview *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe where these structural sections or extrusions will be installed (e.g. Elevated viaduct pier support, warehouse portal framing, solar tracking mounts)..."
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* 4. Upload Drawing / Specification */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-mono font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
                4. Upload Engineering Drawings / BoQ Specification
              </h3>
              <FileUpload onFilesSelected={(files) => setAttachments(files)} />
            </div>

            {/* 5. Additional Message */}
            <div className="space-y-1.5 pt-4 border-t border-slate-800">
              <label className="block text-slate-400 uppercase font-semibold">
                Additional Commercial / Packaging Notes
              </label>
              <textarea
                rows={2}
                placeholder="Mention any third-party inspection preferences (TUV/BV/DNV), test certificate needs, or payment term preferences..."
                value={additionalMessage}
                onChange={(e) => setAdditionalMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-mono font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-orange-600/30 border border-orange-400 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>GENERATING INDUSTRIAL RFQ REFERENCE...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT RFQ FOR ENGINEERING REVIEW</span>
                  </>
                )}
              </button>
              <p className="text-[11px] font-mono text-center text-slate-500 mt-2">
                Generates instant RFQ Reference (e.g. RFQ-2026-00124) with real-time portal tracking.
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function RequestQuotePage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <Suspense fallback={<div className="text-center py-20 font-mono text-xs text-slate-400">Loading RFQ Form...</div>}>
        <RequestQuoteForm />
      </Suspense>
    </div>
  );
}
