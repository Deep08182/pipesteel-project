"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/lib/database/store";
import { RFQ, QuotationItem } from "@/types";
import { ArrowLeft, Plus, Trash2, Send, FileCheck2, Calculator } from "lucide-react";

function QuotationBuilder() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rfqId = searchParams.get("rfqId");

  db.initialize();
  const allRfqs = db.getRFQs();
  const customers = db.getCustomerProfiles();

  const [selectedRfqId, setSelectedRfqId] = useState(rfqId || "");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [validUntil, setValidUntil] = useState("2026-10-15");
  const [paymentTerms, setPaymentTerms] = useState("30% Advance with PO, 70% against Proforma Invoice prior to dispatch.");
  const [deliveryTerms, setDeliveryTerms] = useState("Ex-Works Chakan Works (Transport arranged to client destination). Phased trailers in 15-20 days.");
  const [notes, setNotes] = useState("All structural sections conform to IS 2062 Grade E350. Ultrasonic testing report and Mill Test Certificate (MTC 3.1) included.");

  // Line items state
  const [items, setItems] = useState<QuotationItem[]>([
    {
      id: "item-1",
      description: "Structural Steel Beams (ISMB 450 E350) Shot Blasted SA 2.5",
      quantity: 25,
      unit: "Tons",
      unit_price: 68500,
      total: 1712500,
      hsn_code: "7216",
    },
  ]);

  const [shipping, setShipping] = useState<number>(45000);
  const [discount, setDiscount] = useState<number>(25000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate when RFQ is selected
  useEffect(() => {
    if (selectedRfqId) {
      const r = allRfqs.find((req) => req.id === selectedRfqId);
      if (r) {
        setSelectedCustomerId(r.customer_id);
        setItems([
          {
            id: `item-${Date.now()}`,
            description: `${r.product_name || "Structural Fabrication"} - ${r.material} (As per RFQ ${r.rfq_number})`,
            quantity: r.quantity,
            unit: r.unit,
            unit_price: r.material === "Steel" ? 68500 : 285000,
            total: (r.quantity || 1) * (r.material === "Steel" ? 68500 : 285000),
            hsn_code: r.material === "Steel" ? "7216" : "7604",
          },
        ]);
      }
    }
  }, [selectedRfqId]);

  const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };

    if (field === "quantity" || field === "unit_price") {
      const q = field === "quantity" ? Number(value) : item.quantity;
      const p = field === "unit_price" ? Number(value) : item.unit_price;
      item.total = (q || 0) * (p || 0);
    }

    updated[index] = item;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: "Additional Fabrication / Processing Component",
        quantity: 1,
        unit: "Tons",
        unit_price: 65000,
        total: 65000,
        hsn_code: "7216",
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST standard in India
  const grandTotal = subtotal + tax + Number(shipping) - Number(discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const customer = db.getProfile(selectedCustomerId);
    const rfq = allRfqs.find((r) => r.id === selectedRfqId);

    const quotation = db.createQuotation({
      rfq_id: selectedRfqId || "direct",
      rfq_number: rfq ? rfq.rfq_number : undefined,
      customer_id: selectedCustomerId,
      customer_name: customer?.full_name,
      customer_company: customer?.company_name,
      items,
      subtotal,
      tax,
      shipping: Number(shipping) || 0,
      discount: Number(discount) || 0,
      total: grandTotal,
      valid_until: validUntil,
      payment_terms: paymentTerms,
      delivery_terms: deliveryTerms,
      notes,
      status: "SENT",
    });

    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/admin/requests/${selectedRfqId || ""}`);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-mono">
      <Link
        href="/admin/quotations"
        className="inline-flex items-center gap-1.5 text-xs uppercase text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Quotation Ledger
      </Link>

      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
          COMMERCIAL ESTIMATION ENGINE
        </span>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-1">
          GENERATE OFFICIAL COMMERCIAL QUOTATION
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Assemble line-item BoQ, compute 18% GST, specify freight terms, and dispatch directly to client portal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* RFQ and Client Association */}
        <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
            1. Associate RFQ & Enterprise Customer
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase font-semibold">
                Link Existing RFQ:
              </label>
              <select
                value={selectedRfqId}
                onChange={(e) => setSelectedRfqId(e.target.value)}
                className="w-full px-3 py-2.5 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500 text-xs"
              >
                <option value="">-- Direct Quotation (No RFQ) --</option>
                {allRfqs.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.rfq_number} - {r.customer?.company_name} ({r.product_name})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-400 uppercase font-semibold">
                Client Enterprise *
              </label>
              <select
                required
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2.5 rounded bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500 text-xs"
              >
                <option value="">-- Select Customer Account --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company_name} ({c.full_name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bill of Materials & Items Editor */}
        <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
              2. Line Items & Rate Estimation
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-orange-400 font-bold text-xs uppercase flex items-center gap-1 border border-slate-700"
            >
              <Plus className="w-3.5 h-3.5" /> Add Line Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded bg-slate-950 border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-400 uppercase">Item #{idx + 1}</span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6 space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase">Description & Grade:</label>
                    <input
                      type="text"
                      required
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase">Qty:</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white text-xs font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase">Unit:</label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase">Unit Price (₹):</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(idx, "unit_price", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-white text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="text-right text-xs font-bold text-slate-300">
                  Line Total: <span className="text-white">₹{(item.total || 0).toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial Terms & Calculations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Terms */}
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <h3 className="text-xs font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
              3. Commercial Conditions
            </h3>

            <div className="space-y-1">
              <label className="text-slate-400 uppercase">Price Validity Until:</label>
              <input
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 uppercase">Payment Terms:</label>
              <textarea
                rows={2}
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 uppercase">Delivery & Freight Terms:</label>
              <textarea
                rows={2}
                value={deliveryTerms}
                onChange={(e) => setDeliveryTerms(e.target.value)}
                className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>

          {/* Pricing Computation Box */}
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-3 text-xs flex flex-col justify-between">
            <h3 className="text-xs font-bold text-white uppercase border-l-2 border-orange-500 pl-2">
              4. Calculation & Tax Summary
            </h3>

            <div className="space-y-2 p-3 rounded bg-slate-950 border border-slate-850">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-white font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18% Statutory):</span>
                <span className="text-white font-bold">₹{tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 gap-2">
                <span>Transport / Freight (₹):</span>
                <input
                  type="number"
                  min="0"
                  value={shipping}
                  onChange={(e) => setShipping(Number(e.target.value))}
                  className="w-32 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-right text-white"
                />
              </div>
              <div className="flex items-center justify-between text-emerald-400 gap-2">
                <span>Commercial Discount (₹):</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-32 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-right text-emerald-400"
                />
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-orange-400">
                <span>GRAND TOTAL:</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !selectedCustomerId}
              className="w-full py-3.5 rounded bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-600/30 border border-orange-400 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "DISPATCHING QUOTATION..." : "DISPATCH COMMERCIAL QUOTATION"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function NewQuotationPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-mono text-xs text-slate-400">Loading Quotation Generator...</div>}>
      <QuotationBuilder />
    </Suspense>
  );
}
