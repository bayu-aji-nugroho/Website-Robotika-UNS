/*
-----------------------------------------
nama file: [ SelfCheckInCard.tsx ]
fungsi [ Absen mandiri: dibuka dari QR acara yang ditampilkan panitia; mencatat kehadiran akun yang login ]
-----------------------------------------------
*/

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { getAuthenticatedUser, signInWithGoogle, supabase } from "@/src/services";
import { NonSsoLoginOption } from "@/src/components/molecules";

type Result = { ok?: boolean; code?: string; status?: string; message?: string; applicant?: { full_name?: string; nim?: string } };

export const SelfCheckInCard: React.FC = () => {
  const params = useSearchParams();
  const eventId = params.get("e");
  const code = params.get("c");
  const [state, setState] = useState<"loading" | "login" | "done">("loading");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!eventId || !code) {
        if (active) {
          setResult({ code: "invalid", message: "Tautan absen tidak lengkap. Pindai ulang QR acara." });
          setState("done");
        }
        return;
      }
      const user = await getAuthenticatedUser();
      if (!active) return;
      if (!user) {
        setState("login");
        return;
      }
      const { data, error } = await supabase.rpc("self_check_in_event", { p_event_id: eventId, p_code: code });
      if (!active) return;
      setResult(error ? { code: "error", message: error.message } : (data as Result));
      setState("done");
    })();
    return () => {
      active = false;
    };
  }, [eventId, code]);

  const box = "bg-white dark:bg-[#18191e] border border-[#e4e4e7] dark:border-zinc-800 rounded-2xl p-8 text-center shadow-xs max-w-md mx-auto space-y-3";

  if (state === "loading") {
    return (
      <div className={box}>
        <Loader2 className="w-10 h-10 mx-auto animate-spin text-zinc-400" />
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Mencatat kehadiran...</p>
      </div>
    );
  }

  if (state === "login") {
    return (
      <div className={box}>
        <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">Login untuk absen</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Masuk dengan akun yang dipakai mendaftar OPREC.</p>
        <button
          type="button"
          onClick={() => void signInWithGoogle(window.location.href)}
          className="w-full px-5 py-3 bg-[#B22234] hover:bg-[#8B0000] text-white text-sm font-bold rounded-lg cursor-pointer min-h-[48px]"
        >
          Masuk dengan Google
        </button>
        <NonSsoLoginOption redirectTo={window.location.href} />
        <p className="text-xs text-zinc-500">Setelah login Anda kembali ke halaman ini dan langsung tercatat hadir.</p>
      </div>
    );
  }

  const ok = result?.ok && result.code === "checked_in";
  const late = result?.status === "late";
  const warn = result?.code === "already_present" || (ok && late);
  const Icon = ok && !late ? CheckCircle2 : warn ? AlertTriangle : XCircle;
  const title = ok
    ? late
      ? "Tercatat Terlambat"
      : "Hadir Tepat Waktu"
    : result?.code === "already_present"
      ? "Sudah Absen"
      : "Absen Gagal";

  return (
    <div className={box} role="status">
      <Icon className={`w-12 h-12 mx-auto ${ok && !late ? "text-emerald-600" : warn ? "text-amber-500" : "text-rose-600"}`} />
      <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{title}</p>
      {result?.applicant?.full_name && (
        <p className="text-sm text-zinc-700 dark:text-zinc-200">
          {result.applicant.full_name} · <span className="font-mono">{result.applicant.nim}</span>
        </p>
      )}
      <p className="text-sm text-zinc-600 dark:text-zinc-300">{result?.message}</p>
      <Link href="/dashboard" className="inline-block text-sm font-semibold text-[#B22234] hover:underline">
        Ke Dashboard
      </Link>
    </div>
  );
};
