"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/database/store";
import { Product } from "@/types";
import { Package, Plus, Search, ExternalLink } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    db.initialize();
    setProducts(db.getProducts());
  }, []);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.material.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
            CATALOG INVENTORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
            STEEL & ALUMINIUM PRODUCT ADMINISTRATION
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Manage engineering specifications, dimensional standard tables, and catalog items.
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
        />
      </div>

      <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-900 shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase">
              <th className="py-3 px-3">Product Name</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Material</th>
              <th className="py-3 px-3">Grades</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-850">
                <td className="py-3 px-3 font-bold text-white">{p.name}</td>
                <td className="py-3 px-3 text-slate-300">{p.category}</td>
                <td className="py-3 px-3 text-orange-400">{p.material}</td>
                <td className="py-3 px-3 text-slate-400 truncate max-w-xs">{p.grades.join(", ")}</td>
                <td className="py-3 px-3 text-right">
                  <Link
                    href={`/products/${p.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-[11px]"
                  >
                    <span>View Public</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
