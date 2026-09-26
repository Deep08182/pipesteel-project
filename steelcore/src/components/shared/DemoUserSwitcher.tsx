"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { UserCheck, Shield, ChevronDown, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export const DemoUserSwitcher: React.FC = () => {
  const { user, role, switchDemoUser, availableDemoUsers } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSwitch = (id: string, targetRole: string) => {
    switchDemoUser(id);
    setIsOpen(false);
    if (targetRole === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/customer");
    }
  };

  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md shadow-xl border text-xs font-mono font-bold uppercase transition-all ${
            isAdmin
              ? "bg-slate-900 border-orange-500 text-orange-400 hover:bg-slate-850"
              : "bg-slate-900 border-blue-500 text-blue-400 hover:bg-slate-850"
          }`}
          title="Demo Role Switcher"
        >
          {isAdmin ? <Shield className="w-3.5 h-3.5 text-orange-400" /> : <UserCheck className="w-3.5 h-3.5 text-blue-400" />}
          <span className="hidden sm:inline">
            Role: {isAdmin ? "ADMIN" : "CUSTOMER"} ({user?.full_name?.split(" ")[0] || "Guest"})
          </span>
          <span className="sm:hidden">{isAdmin ? "Admin" : "Cust"}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute bottom-12 right-0 w-72 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                Switch Test Role
              </span>
              <span className="text-[10px] text-orange-400 font-mono">1-Click Live Test</span>
            </div>

            <div className="space-y-1 text-xs">
              <p className="text-[10px] font-mono text-slate-500 uppercase px-1">Plant Administrators</p>
              <button
                type="button"
                onClick={() => handleSwitch("usr-admin-01", "ADMIN")}
                className={`w-full text-left p-2 rounded flex items-center justify-between transition-colors ${
                  user?.id === "usr-admin-01"
                    ? "bg-orange-950/60 border border-orange-700 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                <div>
                  <p className="font-bold text-xs">Vikramaditya Mehta</p>
                  <p className="text-[10px] text-slate-400 font-mono">VP Operations (Admin)</p>
                </div>
                {user?.id === "usr-admin-01" && <span className="text-orange-400 font-mono text-[10px]">ACTIVE</span>}
              </button>
            </div>

            <div className="space-y-1 text-xs pt-1 border-t border-slate-800">
              <p className="text-[10px] font-mono text-slate-500 uppercase px-1">B2B Customers</p>
              <button
                type="button"
                onClick={() => handleSwitch("usr-cust-01", "CUSTOMER")}
                className={`w-full text-left p-2 rounded flex items-center justify-between transition-colors ${
                  user?.id === "usr-cust-01"
                    ? "bg-blue-950/60 border border-blue-700 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                <div>
                  <p className="font-bold text-xs">Rahul Sharma</p>
                  <p className="text-[10px] text-slate-400 font-mono">ABC Infrastructure Pvt Ltd</p>
                </div>
                {user?.id === "usr-cust-01" && <span className="text-blue-400 font-mono text-[10px]">ACTIVE</span>}
              </button>

              <button
                type="button"
                onClick={() => handleSwitch("usr-cust-05", "CUSTOMER")}
                className={`w-full text-left p-2 rounded flex items-center justify-between transition-colors ${
                  user?.id === "usr-cust-05"
                    ? "bg-blue-950/60 border border-blue-700 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                <div>
                  <p className="font-bold text-xs">Vikram Rathore</p>
                  <p className="text-[10px] text-slate-400 font-mono">JSW Energy Logistics</p>
                </div>
                {user?.id === "usr-cust-05" && <span className="text-blue-400 font-mono text-[10px]">ACTIVE</span>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
