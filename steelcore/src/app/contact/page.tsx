"use client";

import React, { useState } from "react";
import { COMPANY_CONFIG } from "@/lib/config/company";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  Factory,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Banner */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            COMMERCIAL & PLANT INQUIRIES
          </span>
          <h1 className="text-3xl sm:text-5xl font-mono font-black text-white uppercase tracking-tight mt-2">
            CONTACT {COMPANY_CONFIG.shortName}
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl text-xs sm:text-sm leading-relaxed">
            Reach our plant estimation desk, corporate headquarters, or project coordination team across our Indian manufacturing hubs.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Facilities */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase text-orange-500 tracking-wider">
                CORPORATE & PLANT ADDRESSES
              </span>
              <h2 className="text-2xl font-mono font-bold text-white uppercase">
                DIRECT INDUSTRIAL DESKS
              </h2>
            </div>

            <div className="space-y-6 text-xs sm:text-sm">
              <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-orange-400 font-mono font-bold uppercase text-xs">
                  <Factory className="w-4 h-4" /> Plant 1 (Heavy Fabrication & Rolling)
                </div>
                <p className="text-slate-300 font-sans">{COMPANY_CONFIG.fullAddress}</p>
              </div>

              <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-orange-400 font-mono font-bold uppercase text-xs">
                  <Building className="w-4 h-4" /> Plant 2 (Aluminium Extrusion Works)
                </div>
                <p className="text-slate-300 font-sans">
                  Plot 18-22, GIDC Heavy Engineering Estate, Sanand, Ahmedabad, Gujarat 382110, India
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs font-mono">
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Primary: {COMPANY_CONFIG.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Plant Board: {COMPANY_CONFIG.phoneAlt}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Commercial: {COMPANY_CONFIG.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Direct RFQs: {COMPANY_CONFIG.rfqEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Operating Hours: Monday – Saturday (08:30 – 18:30 IST)</span>
                </div>
              </div>
            </div>

            {/* Google Maps Placeholder */}
            <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-900 p-6 text-center space-y-3">
              <MapPin className="w-8 h-8 text-orange-500 mx-auto" />
              <h4 className="text-xs font-mono font-bold text-white uppercase">
                Satellite Map Navigation (Placeholder)
              </h4>
              <p className="text-[11px] text-slate-400 font-mono">
                Coordinates: 18.7562° N, 73.8124° E • MIDC Chakan Heavy Engineering Zone
              </p>
              <div className="h-28 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono text-slate-400">
                [ Interactive Industrial GPS Map Interface ]
              </div>
            </div>
          </div>

          {/* Contact & Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
                  GENERAL BUSINESS & PROJECT ENQUIRIES
                </span>
                <h3 className="text-2xl font-mono font-black text-white uppercase tracking-tight mt-1">
                  SEND AN INDUSTRIAL MESSAGE
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  For formal price tenders and BoQ submissions, please use the{" "}
                  <a href="/request-quote" className="text-orange-400 underline font-semibold">
                    Request a Quote
                  </a>{" "}
                  page for CAD attachment validation.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-lg bg-emerald-950/50 border border-emerald-700 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-mono font-bold text-white uppercase">
                    Message Dispatched to Plant Desk
                  </h4>
                  <p className="text-xs text-slate-300">
                    Thank you, {formData.name}. Our commercial coordination officer will respond to {formData.email} within 4 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-mono uppercase text-orange-400 underline font-semibold"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-400 uppercase font-semibold">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 uppercase font-semibold">
                        Company / Organization *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ABC Infrastructure Pvt Ltd"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-400 uppercase font-semibold">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@abc.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-400 uppercase font-semibold">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98112 34567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-400 uppercase font-semibold">
                      Subject / Project Scope *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Supply of Welded Box Girders for Highway Interchange"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-400 uppercase font-semibold">
                      Message & Technical Requirements *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Describe material grade, approximate tonnages, target delivery date, and site location..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-600/30 border border-orange-400 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>SEND INDUSTRIAL INQUIRY</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
