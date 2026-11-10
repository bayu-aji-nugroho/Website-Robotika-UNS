/*
-----------------------------------------
nama file: [ NavNotificationBell.tsx ]
fungsi [ Komponen molekul lonceng notifikasi di Navbar: menampilkan pengumuman dari admin, badge jumlah yang belum dibaca, dan menandai sudah dibaca saat dibuka. Diperbarui otomatis tiap menit dan saat tab kembali aktif. ]
-----------------------------------------------
*/

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bell, ExternalLink } from "lucide-react";
import {
  ApplicantNotification,
  MyNotifications,
  getMyNotifications,
  markNotificationsRead,
} from "@/src/services";

const REFRESH_MS = 60_000;

function formatRelative(iso: string, nowMs: number) {
  const diffMin = Math.floor((nowMs - new Date(iso).getTime()) / 60_000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

function NotificationItem({
  item,
  isNew,
  nowMs,
}: {
  item: ApplicantNotification;
  isNew: boolean;
  nowMs: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = item.body.length > 160 || item.body.split("\n").length > 3;

  return (
    <li className={`p-3 ${isNew ? "bg-[#FCF2F3]/70 dark:bg-[#B22234]/10" : ""}`}>
      <div className="flex items-start gap-2">
        <span
          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${isNew ? "bg-[#B22234]" : "bg-transparent"}`}
          aria-hidden
        />
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 break-words">{item.title}</p>
          <p
            className={`text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-line break-words ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {item.body}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
              >
                {expanded ? "Tutup" : "Selengkapnya"}
              </button>
            )}
            {item.link_url && (
              <a
                href={item.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B22234] dark:text-red-400 hover:underline"
              >
                Buka tautan <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <p className="text-[10px] text-zinc-400">{formatRelative(item.created_at, nowMs)}</p>
        </div>
      </div>
    </li>
  );
}

export const NavNotificationBell: React.FC = () => {
  const [data, setData] = useState<MyNotifications | null>(null);
  const [nowMs, setNowMs] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  // Batas "baru" untuk penanda titik merah saat panel dibuka (sebelum ditandai dibaca)
  const [highlightAfter, setHighlightAfter] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => {
    return getMyNotifications().then((res) => {
      if (res.error) return;
      setData(res.data);
      setNowMs(Date.now());
    });
  }, []);

  // Muat awal + periksa berkala + saat tab kembali aktif
  useEffect(() => {
    let active = true;
    getMyNotifications().then((res) => {
      if (!active || res.error) return;
      setData(res.data);
      setNowMs(Date.now());
    });
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const unread = data?.unread_count || 0;
  const items = data?.items || [];

  const handleToggle = () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);
    if (!willOpen) return;

    setNowMs(Date.now());
    setHighlightAfter(data?.last_read_at ?? "1970-01-01T00:00:00Z");
    if (unread > 0) {
      setData((prev) => (prev ? { ...prev, unread_count: 0 } : prev));
      markNotificationsRead().then((readAt) => {
        if (readAt) setData((prev) => (prev ? { ...prev, last_read_at: readAt } : prev));
      });
    }
  };

  const isNew = (item: ApplicantNotification) =>
    highlightAfter !== null && new Date(item.created_at).getTime() > new Date(highlightAfter).getTime();

  return (
    <div className="relative sm:inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-2 rounded-md text-[#3f3f46] dark:text-zinc-300 hover:bg-[#f4f4f5] dark:hover:bg-zinc-800 hover:text-[#18181b] dark:hover:text-white transition-colors cursor-pointer"
        aria-label={unread > 0 ? `Notifikasi, ${unread} belum dibaca` : "Notifikasi"}
        aria-expanded={isOpen}
      >
        <Bell className="w-4.5 h-4.5" />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#B22234] text-white text-[9px] font-bold leading-4 text-center ring-2 ring-white dark:ring-[#121316]">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Notifikasi pengumuman"
          className="max-sm:fixed max-sm:inset-x-3 max-sm:top-full max-sm:mt-2 sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-[22rem] rounded-xl bg-white dark:bg-[#141518] border border-zinc-200/90 dark:border-zinc-800 shadow-xl z-50 text-left overflow-hidden animate-in fade-in duration-150"
        >
          <div className="px-3.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Pengumuman</p>
            <span className="text-[10px] text-zinc-400">dari Panitia OPREC</span>
          </div>
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center space-y-1.5">
              <Bell className="w-6 h-6 mx-auto text-zinc-300 dark:text-zinc-600" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Belum ada pengumuman.</p>
            </div>
          ) : (
            <ul className="max-h-[min(70vh,28rem)] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {items.map((item) => (
                <NotificationItem key={item.id} item={item} isNew={isNew(item)} nowMs={nowMs} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
