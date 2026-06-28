"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { AuthShell } from "@/app/components/auth/AuthShell";
import { FormMessage } from "@/app/components/auth/FormMessage";

type MessageType = "error" | "success" | "info";

function isValidEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>("info");
  const [emailTouched, setEmailTouched] = useState(false);

  const emailError = useMemo(() => {
    if (!emailTouched) return null;
    if (!email.trim()) return "Email wajib diisi.";
    if (!isValidEmail(email)) return "Format email tidak valid.";
    return null;
  }, [email, emailTouched]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailTouched(true);

    if (!email.trim() || !isValidEmail(email)) {
      setMessageType("error");
      setMessage("Masukkan email yang valid terlebih dahulu.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // TODO: ketika backend tersedia, ganti simulasi ini dengan:
      // await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
      await new Promise((resolve) => window.setTimeout(resolve, 700));

      setMessageType("success");
      setMessage("Jika email terdaftar, instruksi reset password akan dikirim ke email tersebut.");
    } catch {
      setMessageType("error");
      setMessage("Gagal mengirim permintaan reset password. Coba lagi beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Lupa Password"
      description="Masukkan email akun untuk menerima instruksi reset password."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormMessage type={messageType} message={message} />

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-bold text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onBlur={() => setEmailTouched(true)}
            onChange={(event) => {
              setEmail(event.target.value);
              setMessage(null);
            }}
            placeholder="nama@hospital.com"
            aria-invalid={Boolean(emailError)}
            className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100 ${
              emailError ? "border-red-300" : "border-slate-200"
            }`}
          />
          {emailError ? <p className="text-xs font-semibold text-red-600">{emailError}</p> : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-2xl bg-[#156eea] px-5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#075acb] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Mengirim..." : "Kirim Instruksi Reset"}
        </button>

        <p className="text-center text-sm font-semibold text-slate-600">
          Ingat password?{" "}
          <Link href="/login" className="font-black text-[#156eea] hover:underline">
            Masuk di sini
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
