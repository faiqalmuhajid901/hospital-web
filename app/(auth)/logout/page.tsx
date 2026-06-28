"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell } from "@/app/components/auth/AuthShell";
import { FormMessage } from "@/app/components/auth/FormMessage";

export default function LogoutPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Menghapus sesi pengguna...");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;

    async function runLogout() {
      try {
        // TODO: ketika backend logout tersedia, ganti simulasi ini dengan fetch("/api/auth/logout", { method: "POST" })
        window.localStorage.removeItem("hospital-web-session");
        window.localStorage.removeItem("hospital-web-user");
        await new Promise((resolve) => window.setTimeout(resolve, 650));

        if (!active) return;
        setMessage("Logout berhasil. Mengalihkan ke halaman login...");
        setDone(true);

        window.setTimeout(() => {
          router.push("/login");
        }, 700);
      } catch {
        if (!active) return;
        setMessage("Logout gagal. Silakan kembali ke login secara manual.");
        setDone(true);
      }
    }

    runLogout();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <AuthShell title="Logout" description="Sistem sedang mengakhiri sesi Anda.">
      <div className="space-y-5">
        <FormMessage type={done ? "success" : "info"} message={message} />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
          Jangan tutup halaman ini sampai proses selesai.
        </div>

        <Link
          href="/login"
          className="block h-12 w-full rounded-2xl bg-[#156eea] px-5 py-3 text-center text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#075acb]"
        >
          Kembali ke Login
        </Link>
      </div>
    </AuthShell>
  );
}
