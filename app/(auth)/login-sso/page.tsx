"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/app/components/auth/AuthShell";
import { FormMessage } from "@/app/components/auth/FormMessage";

type Step = "email" | "otp";

type SsoResponse = {
  message?: string;
  redirectTo?: string;
};

export default function LoginSsoPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | "info">("info");
  const [loading, setLoading] = useState(false);

  async function handleRequestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setMessageType("error");
      setMessage("Email karyawan wajib diisi.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
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
          email: trimmedEmail,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as SsoResponse;

      if (!response.ok) {
        setMessageType("error");
        setMessage(payload.message ?? "Gagal mengirim OTP.");
        return;
      }

      setEmail(trimmedEmail);
      setStep("otp");
      setMessageType("success");
      setMessage(payload.message ?? "Kode OTP telah dikirim ke email karyawan.");
    } catch {
      setMessageType("error");
      setMessage("Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedOtp = otp.trim();

    if (!trimmedOtp) {
      setMessageType("error");
      setMessage("Kode OTP wajib diisi.");
      return;
    }

    if (!/^\d{6}$/.test(trimmedOtp)) {
      setMessageType("error");
      setMessage("Kode OTP harus terdiri dari 6 digit angka.");
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
          email,
          otp: trimmedOtp,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as SsoResponse;

      if (!response.ok) {
        setMessageType("error");
        setMessage(payload.message ?? "Verifikasi OTP gagal.");
        return;
      }

      setMessageType("success");
      setMessage(payload.message ?? "Login SSO berhasil. Mengalihkan...");

      window.setTimeout(() => {
        router.push(payload.redirectTo ?? "/dashboard/admin");
      }, 600);
    } catch {
      setMessageType("error");
      setMessage("Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Login SSO"
      description="Masuk menggunakan email karyawan dan verifikasi OTP."
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
                Gunakan email karyawan yang terdaftar di sistem rumah sakit.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-2xl bg-[#156eea] px-5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#075acb] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Mengirim OTP..." : "Kirim OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              OTP dikirim ke <span className="font-black">{email}</span>
            </div>

            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-bold text-slate-700">
                Kode OTP
              </label>

              <input
                id="otp"
                name="otp"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, "");
                  setOtp(value);
                  setMessage(null);
                }}
                placeholder="Masukkan 6 digit OTP"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-center text-lg font-black tracking-[0.35em] text-slate-800 outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
              />
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
              onClick={() => {
                setStep("email");
                setOtp("");
                setMessage(null);
              }}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Ganti Email
            </button>
          </form>
        )}

        <p className="text-center text-sm font-semibold text-slate-600">
          Ingin login biasa?{" "}
          <Link href="/login" className="font-black text-[#156eea] hover:underline">
            Kembali ke login
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}