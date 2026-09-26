"use client";

import React, { useState } from "react";
import Link from "next/link";
import { db } from "@/lib/database/store";
import { ProductCategory } from "@/types";
import { Search, Filter, ArrowRight, Layers, CheckCircle2 } from "lucide-react";

export default function ProductsPage() {
  db.initialize();
  const allProducts = db.getProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("ALL");

  const categories = [
    { label: "All Categories", value: "ALL" },
    { label: "Steel Products", value: "Steel Products" },
    { label: "Aluminium Products", value: "Aluminium Products" },
    { label: "Custom Products", value: "Custom Products" },
    { label: "Fabricated Structures", value: "Fabricated Structures" },
  ];

  const materials = ["ALL", "Steel", "Aluminium", "Alloy"];

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subcategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || product.category === selectedCategory;

    const matchesMaterial =
      selectedMaterial === "ALL" || product.material === selectedMaterial;

    return matchesSearch && matchesCategory && matchesMaterial;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Header Banner */}
      <section className="relative py-16 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            PRODUCT CATALOG & SPECIFICATIONS
          </span>
          <h1 className="text-3xl sm:text-4xl font-mono font-black text-white uppercase tracking-tight mt-2">
            CERTIFIED STEEL & ALUMINIUM PRODUCTS
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl text-xs sm:text-sm leading-relaxed">
            Engineered hot-rolled sections, heavy structural plates, automated submerged arc welded box girders, and architectural aluminium extrusion profiles.
          </p>
        </div>
      </section>

      {/* Catalog & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between pb-8 border-b border-slate-800">
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by profile, grade, specification..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-semibold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat.value
                    ? "bg-orange-600 text-white border border-orange-500 shadow-md"
                    : "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-850 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Material Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400 mr-1">Material:</span>
            {materials.map((mat) => (
              <button
                key={mat}
                type="button"
                onClick={() => setSelectedMaterial(mat)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase transition-colors ${
                  selectedMaterial === mat
                    ? "bg-slate-800 text-orange-400 border border-orange-600"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="py-8">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6">
            <span>Showing {filteredProducts.length} certified products</span>
            <span>Total Catalog: {allProducts.length}</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center rounded-lg border border-slate-800 bg-slate-900/50">
              <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-mono text-slate-300 font-bold uppercase">
                No matching industrial products found
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try adjusting your search keyword or clearing the category filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                  setSelectedMaterial("ALL");
                }}
                className="mt-4 px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs uppercase"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex flex-col justify-between card-hover"
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative h-48 bg-slate-800 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                        style={{ backgroundImage: `url('${product.image_url}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded border ${
                            product.material === "Steel"
                              ? "bg-slate-900/90 text-blue-300 border-blue-600"
                              : product.material === "Aluminium"
                              ? "bg-slate-900/90 text-teal-300 border-teal-600"
                              : "bg-slate-900/90 text-amber-300 border-amber-600"
                          }`}
                        >
                          {product.material}
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-slate-900/80 text-slate-300 border border-slate-700 px-2 py-1 rounded">
                          {product.subcategory}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-base font-mono font-bold text-white uppercase tracking-wide">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                          {product.short_description}
                        </p>
                      </div>

                      {/* Grades & Standards */}
                      <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                        <div className="flex justify-between text-slate-400">
                          <span>Grades:</span>
                          <span className="text-slate-200 font-semibold truncate max-w-[65%] text-right">
                            {product.grades.join(", ")}
                          </span>
                        </div>
                      </div>

                      {/* Applications Preview */}
                      <div className="space-y-1 text-xs">
                        <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                          Typical Applications:
                        </span>
                        <ul className="text-slate-300 text-xs space-y-1">
                          {product.applications.slice(0, 2).map((app, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 truncate">
                              <span className="text-orange-500 font-bold">•</span>
                              <span className="truncate">{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 border-t border-slate-800 flex items-center justify-between gap-3 mt-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-xs font-mono uppercase font-bold text-slate-300 hover:text-white"
                    >
                      Specifications Sheet →
                    </Link>
                    <Link
                      href={`/request-quote?product=${product.slug}`}
                      className="px-3.5 py-2 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
