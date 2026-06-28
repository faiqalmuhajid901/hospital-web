"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/app/components/auth/AuthShell";
import { FormMessage } from "@/app/components/auth/FormMessage";
import { PasswordField } from "@/app/components/auth/PasswordField";

type LoginForm = {
  identifier: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({
    identifier: "",
    password: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | "info">("info");
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof LoginForm>(field: K, value: LoginForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.identifier.trim() || !form.password) {
      setMessageType("error");
      setMessage("Username/email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      // Backend login belum terlihat di repo. Register API yang sudah terlihat adalah /api/auth/register.
      // Jika endpoint login sudah dibuat, ganti simulasi ini menjadi fetch("/api/auth/login", ...).
      await new Promise((resolve) => window.setTimeout(resolve, 700));

      setMessageType("success");
      setMessage("Login frontend berhasil. Mengalihkan ke dashboard...");
      window.setTimeout(() => router.push("/dashboard/admin"), 600);
    } catch {
      setMessageType("error");
      setMessage("Gagal login. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Masuk Akun"
      description="Masuk untuk mengakses dashboard sistem rumah sakit."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormMessage type={messageType} message={message} />

        <div className="space-y-2">
          <label htmlFor="identifier" className="block text-sm font-bold text-slate-700">
            Username atau Email
          </label>
          <input
            id="identifier"
            name="identifier"
            value={form.identifier}
            onChange={(event) => updateField("identifier", event.target.value)}
            placeholder="username atau email"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <PasswordField
          id="password"
          name="password"
          label="Password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 font-semibold text-slate-600">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-[#156eea]" />
            Ingat saya
          </label>

          <Link href="/forgot-password" className="font-black text-[#156eea] hover:underline">
            Lupa password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-2xl bg-[#156eea] px-5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#075acb] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

        <p className="text-center text-sm font-semibold text-slate-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-black text-[#156eea] hover:underline">
            Daftar di sini
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
