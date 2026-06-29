"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/app/components/auth/AuthShell";
import { FormMessage } from "@/app/components/auth/FormMessage";

type LoginStep = "email" | "otp";

type EmployeeSsoResponse = {
  message?: string;
  redirectTo?: string;
  user?: {
    id?: number | string;
    name?: string | null;
    email?: string | null;
    username?: string | null;
    role?: string | null;
    status?: string | null;
  };
};

export default function LoginEmployeePage() {
  const router = useRouter();

  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | "info">("info");
  const [loading, setLoading] = useState(false);

  async function handleRequestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setMessageType("error");
      setMessage("Email karyawan wajib diisi.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setMessageType("error");
      setMessage("Format email tidak valid.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/sso/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          accountType: "employee",
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as EmployeeSsoResponse;

      if (!response.ok) {
        setMessageType("error");
        setMessage(payload.message ?? "Gagal mengirim OTP ke email karyawan.");
        return;
      }

      setEmail(cleanEmail);
      setStep("otp");
      setMessageType("success");
      setMessage(payload.message ?? "Kode OTP telah dikirim ke email karyawan.");
    } catch {
      setMessageType("error");
      setMessage("Tidak bisa terhubung ke server. Pastikan server aktif.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      setMessageType("error");
      setMessage("Kode OTP wajib diisi.");
      return;
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      setMessageType("error");
      setMessage("Kode OTP harus 6 digit angka.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/sso/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          otp: cleanOtp,
          accountType: "employee",
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as EmployeeSsoResponse;

      if (!response.ok) {
        setMessageType("error");
        setMessage(payload.message ?? "Verifikasi OTP gagal.");
        return;
      }

      setMessageType("success");
      setMessage(payload.message ?? "Login employee berhasil. Mengalihkan...");

      window.setTimeout(() => {
        router.push(payload.redirectTo ?? "/dashboard/admin");
      }, 600);
    } catch {
      setMessageType("error");
      setMessage("Tidak bisa terhubung ke server. Pastikan server aktif.");
    } finally {
      setLoading(false);
    }
  }

  function handleChangeEmail() {
    setStep("email");
    setOtp("");
    setMessage(null);
    setMessageType("info");
  }

  function handleOtpChange(value: string) {
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setOtp(numericValue);
    setMessage(null);
  }

  return (
    <AuthShell
      title="Login Employee"
      description="Masuk sebagai karyawan rumah sakit menggunakan email dan kode OTP."
    >
      <div className="space-y-5">
        <FormMessage type={messageType} message={message} />

        {step === "email" ? (
          <form onSubmit={handleRequestOtp} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                Email Karyawan
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setMessage(null);
                }}
                placeholder="nama@hospital.com"
                autoComplete="email"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
              />

              <p className="text-xs font-semibold text-slate-500">
                Gunakan email karyawan yang sudah terdaftar di sistem rumah sakit.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-2xl bg-[#156eea] px-5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#075acb] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Mengirim OTP..." : "Kirim OTP"}
            </button>

            <Link
              href="/login"
              className="block text-center text-sm font-black text-[#156eea] hover:underline"
            >
              Kembali ke login biasa
            </Link>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              Kode OTP dikirim ke <span className="font-black">{email}</span>.
            </div>

            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-bold text-slate-700">
                Kode OTP
              </label>

              <input
                id="otp"
                name="otp"
                inputMode="numeric"
                value={otp}
                onChange={(event) => handleOtpChange(event.target.value)}
                placeholder="Masukkan 6 digit OTP"
                maxLength={6}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-center text-lg font-black tracking-[0.35em] text-slate-800 outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
              />

              <p className="text-xs font-semibold text-slate-500">
                OTP hanya berlaku sementara. Jangan berikan kode ini kepada siapa pun.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-2xl bg-[#156eea] px-5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#075acb] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Memverifikasi..." : "Verifikasi OTP"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleChangeEmail}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Ganti Email
            </button>

            <Link
              href="/login"
              className="block text-center text-sm font-black text-[#156eea] hover:underline"
            >
              Kembali ke login biasa
            </Link>
          </form>
        )}
      </div>
    </AuthShell>
  );
}