"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { COMPANY_CONFIG } from "@/lib/config/company";
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileCheck2,
  Users,
  Package,
  Layers,
  Settings,
  Bell,
  LogOut,
  ExternalLink,
  Shield,
} from "lucide-react";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Operations Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "RFQ Master Queue", href: "/admin/requests", icon: FileSpreadsheet },
    { label: "Quotation Ledger", href: "/admin/quotations", icon: FileCheck2 },
    { label: "Customer Directory", href: "/admin/customers", icon: Users },
    { label: "Product Catalog Admin", href: "/admin/products", icon: Package },
    { label: "Portfolio Projects", href: "/admin/projects", icon: Layers },
    { label: "Notification Stream", href: "/admin/notifications", icon: Bell },
    { label: "Plant Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Admin Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-orange-600 flex items-center justify-center font-mono font-black text-white text-sm">
              S
            </div>
            <div>
              <span className="font-mono font-black text-xs text-white uppercase tracking-wider block">
                {COMPANY_CONFIG.shortName} OPS
              </span>
              <span className="text-[10px] font-mono text-orange-400 uppercase font-bold block">
                Industrial Admin Control
              </span>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3.5 mx-3 mt-3 rounded bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-orange-400">
            {user?.full_name?.charAt(0) || "A"}
          </div>
          <div className="truncate">
            <p className="text-xs font-mono font-bold text-white truncate">{user?.full_name}</p>
            <p className="text-[10px] font-mono text-slate-400 truncate">{user?.designation || "VP Operations"}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono font-semibold transition-colors ${
                  isActive
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2 rounded text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
        >
          <span>View Public Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-mono text-rose-400 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
