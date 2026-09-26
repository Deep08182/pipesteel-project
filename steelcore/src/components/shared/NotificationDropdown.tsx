"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { db } from "@/lib/database/store";
import { Notification } from "@/types";
import { Bell, Check, ExternalLink } from "lucide-react";

export const NotificationDropdown: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const notifs = db.getNotifications(user.id);
    setNotifications(notifs);
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 3000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = () => {
    if (user) {
      db.markAllNotificationsAsRead(user.id);
      loadNotifications();
    }
  };

  const handleItemClick = (n: Notification) => {
    db.markNotificationAsRead(n.id);
    loadNotifications();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
        title="Industrial Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold font-mono text-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between p-3.5 bg-slate-850 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-orange-950 text-orange-400 border border-orange-800 text-[11px] font-mono px-2 py-0.5 rounded font-semibold">
                  {unreadCount} New
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs text-slate-400 hover:text-orange-400 flex items-center gap-1 font-mono transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 font-mono">
                No notifications logged.
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || "#"}
                  onClick={() => handleItemClick(n)}
                  className={`block p-3.5 hover:bg-slate-800/80 transition-colors ${
                    !n.is_read ? "bg-slate-800/40 border-l-2 border-orange-500" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-white tracking-wide">{n.title}</h5>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {new Date(n.created_at).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-1 text-[11px] text-orange-400 font-mono mt-2">
                    <span>View details</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
