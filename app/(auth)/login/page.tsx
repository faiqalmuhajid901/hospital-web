"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/app/components/auth/AuthShell";
import { FormMessage } from "@/app/components/auth/FormMessage";
import { PasswordField } from "@/app/components/auth/PasswordField";

type LoginForm = {
  identity: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({
    identity: "",
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

    if (!form.identity.trim() || !form.password) {
      setMessageType("error");
      setMessage("Username/email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          identity: form.identity.trim(),
          password: form.password,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessageType("error");
        setMessage(payload.message || "Gagal login. 123.");
        return;
      }
      else {
        setMessageType("success");
        setMessage("Berhasil login. Mengalihkan...");
        router.push("/dashboard");
      }
    } catch {
      setMessageType("error");
      setMessage("Gagal login. 456.");
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
          <label htmlFor="identity" className="block text-sm font-bold text-slate-700">
            Username atau Email
          </label>
          <input
            id="identity"
            name="identity"
            value={form.identity}
            onChange={(event) => updateField("identity", event.target.value)}
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

        <button
          type="button"
          onClick={() => router.push("/login-employee")}
          className="h-12 w-full rounded-2xl bg-[#156eea] px-5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#075acb] disabled:cursor-not-allowed disabled:opacity-70"
        >
          Login SSO
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
