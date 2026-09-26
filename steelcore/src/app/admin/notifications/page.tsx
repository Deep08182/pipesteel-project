"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { db } from "@/lib/database/store";
import { Notification } from "@/types";
import { Bell, Check, ExternalLink } from "lucide-react";

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = () => {
    db.initialize();
    setNotifications(db.getNotifications());
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
            OPERATIONS LOGS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
            PLANT NOTIFICATION STREAM
          </h1>
        </div>

        {user && (
          <button
            type="button"
            onClick={() => {
              db.markAllNotificationsAsRead(user.id);
              loadNotifications();
            }}
            className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-orange-400 hover:text-white"
          >
            Mark All Read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs ${
              !n.is_read ? "bg-slate-900 border-orange-500/50" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase">{n.title}</span>
                <span className="text-[10px] text-slate-500">
                  {new Date(n.created_at).toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-slate-300 font-sans">{n.message}</p>
            </div>

            {n.link && (
              <Link
                href={n.link}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 shrink-0 text-center flex items-center justify-center gap-1"
              >
                <span>Open Link</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
