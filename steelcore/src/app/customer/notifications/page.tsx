"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { db } from "@/lib/database/store";
import { Notification } from "@/types";
import { Bell, Check, ExternalLink } from "lucide-react";

export default function CustomerNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = () => {
    if (!user) return;
    db.initialize();
    setNotifications(db.getNotifications(user.id));
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkAll = () => {
    if (user) {
      db.markAllNotificationsAsRead(user.id);
      loadNotifications();
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-500">
              ALERT CENTER
            </span>
            <h1 className="text-2xl sm:text-3xl font-mono font-black text-white uppercase tracking-tight mt-1">
              NOTIFICATIONS & STATUS UPDATES
            </h1>
          </div>

          {notifications.some((n) => !n.is_read) && (
            <button
              type="button"
              onClick={handleMarkAll}
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-orange-400 hover:text-white flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Mark All as Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="p-12 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-xs text-slate-400">
            No notifications logged for your account.
          </div>
        ) : (
          <div className="space-y-3 font-mono text-xs">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-lg border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !n.is_read
                    ? "bg-slate-900 border-orange-500/50"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                    )}
                    <h3 className="font-bold text-white uppercase text-xs">{n.title}</h3>
                    <span className="text-[10px] text-slate-500">
                      {new Date(n.created_at).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">{n.message}</p>
                </div>

                {n.link && (
                  <Link
                    href={n.link}
                    onClick={() => db.markNotificationAsRead(n.id)}
                    className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-orange-400 hover:text-orange-300 border border-slate-700 shrink-0 text-center flex items-center justify-center gap-1"
                  >
                    <span>View Record</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
