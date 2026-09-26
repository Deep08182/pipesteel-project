import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/database/store";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Cpu,
  Layers,
  ShieldCheck,
  ChevronRight,
  Send,
} from "lucide-react";

interface ProductDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  db.initialize();
  const product = db.getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-800 bg-slate-900/60 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/products" className="hover:text-white transition-colors">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-orange-400 font-bold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Hero */}
      <section className="py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-[400px] rounded-lg border border-slate-800 overflow-hidden shadow-2xl bg-slate-900">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${product.image_url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span
                    className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded border ${
                      product.material === "Steel"
                        ? "bg-slate-900/90 text-blue-300 border-blue-600"
                        : product.material === "Aluminium"
                        ? "bg-slate-900/90 text-teal-300 border-teal-600"
                        : "bg-slate-900/90 text-amber-300 border-amber-600"
                    }`}
                  >
                    Material: {product.material}
                  </span>
                  <span className="text-xs font-mono uppercase bg-slate-900/90 text-slate-200 border border-slate-700 px-3 py-1 rounded">
                    {product.subcategory}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Overview & Action */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
                  {product.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-mono font-black text-white uppercase tracking-tight mt-1">
                  {product.name}
                </h1>
                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {product.description}
                </p>
              </div>

              {/* Grades */}
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                  Applicable Standard Grades & Standards:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.grades.map((grade) => (
                    <span
                      key={grade}
                      className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-xs text-orange-300 font-semibold"
                    >
                      {grade}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instant RFQ Action Box */}
              <div className="p-6 rounded-lg bg-gradient-to-br from-slate-900 to-slate-850 border border-orange-500/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white uppercase">
                      REQUEST B2B COMMERCIAL QUOTATION
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Direct factory quotation with transparent rate per metric ton / unit.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/request-quote?product=${product.slug}`}
                    className="flex-1 text-center py-3.5 px-6 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-600/30 border border-orange-400 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>REQUEST QUOTE FOR THIS PRODUCT</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="py-3.5 px-5 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono font-semibold text-xs uppercase tracking-wider transition-colors border border-slate-700 text-center"
                  >
                    Speak with Engineer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications & Applications Deep Dive */}
      <section className="py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Available Specifications */}
            <div className="space-y-4">
              <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-l-2 border-orange-500 pl-3">
                <Layers className="w-5 h-5 text-orange-500" /> Available Specifications
              </h2>
              <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-900">
                <table className="w-full text-xs font-mono">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? "bg-slate-900" : "bg-slate-950/60"}
                      >
                        <td className="font-semibold text-slate-400 py-3 px-4 w-1/3 border-b border-slate-800">
                          {key}
                        </td>
                        <td className="text-slate-200 py-3 px-4 border-b border-slate-800">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Technical Information & Tolerances */}
            <div className="space-y-4">
              <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-l-2 border-orange-500 pl-3">
                <ShieldCheck className="w-5 h-5 text-orange-500" /> Technical & Metallurgy Notes
              </h2>
              <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-900">
                <table className="w-full text-xs font-mono">
                  <tbody>
                    {Object.entries(product.technical_info).map(([key, value], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? "bg-slate-900" : "bg-slate-950/60"}
                      >
                        <td className="font-semibold text-slate-400 py-3 px-4 w-1/3 border-b border-slate-800">
                          {key}
                        </td>
                        <td className="text-slate-200 py-3 px-4 border-b border-slate-800">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Process & Applications */}
      <section className="py-14 border-b border-slate-800 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Manufacturing Process */}
            <div className="space-y-4">
              <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-l-2 border-orange-500 pl-3">
                <Cpu className="w-5 h-5 text-orange-500" /> Manufacturing Process Sequence
              </h2>
              <div className="space-y-3">
                {product.manufacturing_process.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded bg-slate-950 border border-slate-800 flex items-start gap-3.5 text-xs text-slate-300"
                  >
                    <span className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-orange-400 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Applications */}
            <div className="space-y-4">
              <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-l-2 border-orange-500 pl-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Industrial Applications
              </h2>
              <div className="space-y-3">
                {product.applications.map((app, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Floating/Sticky Action Banner */}
      <section className="py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h3 className="text-xl font-mono font-bold text-white uppercase">
            Ready to integrate {product.name} into your project?
          </h3>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Provide your required tonnage or linear meters along with your target delivery schedule.
          </p>
          <div className="pt-2">
            <Link
              href={`/request-quote?product=${product.slug}`}
              className="inline-block px-8 py-4 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-xl shadow-orange-600/20 border border-orange-400"
            >
              REQUEST A QUOTE (AUTO-FILLS {product.name.split(" ")[0]})
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
