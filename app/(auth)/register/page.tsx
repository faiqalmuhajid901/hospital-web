"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { AuthShell } from "@/app/components/auth/AuthShell";
import { FormMessage } from "@/app/components/auth/FormMessage";
import { PasswordField } from "@/app/components/auth/PasswordField";

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

type FieldErrors = Partial<Record<keyof RegisterForm, string[]>>;

type RegisterResponse = {
  message?: string;
  errors?: FieldErrors;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    username: string | null;
    phone: string | null;
    status: string | null;
  };
};

const initialForm: RegisterForm = {
  name: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

function firstError(errors: FieldErrors, field: keyof RegisterForm) {
  return errors[field]?.[0];
}

function validateClient(form: RegisterForm): FieldErrors {
  const errors: FieldErrors = {};

  if (form.name.trim().length < 3) errors.name = ["Nama wajib diisi."];
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = ["Format email tidak valid."];
  if (!/^[0-9+ -]{10,13}$/.test(form.phone.trim())) errors.phone = ["Nomor HP minimal 10 digit."];
  if (!/^[a-zA-Z0-9_]{4,100}$/.test(form.username.trim())) {
    errors.username = ["Username minimal 4 karakter dan hanya huruf, angka, _."];
  }
  if (form.password.length < 8) errors.password = ["Password minimal 8 karakter."];
  if (form.confirmPassword !== form.password) errors.confirmPassword = ["Konfirmasi password tidak sama."];
  if (!form.terms) errors.terms = ["Syarat dan Ketentuan wajib disetujui."];

  return errors;
}

function passwordStrength(password: string) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password) && /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  return checks.filter(Boolean).length;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | "info">("info");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => passwordStrength(form.password), [form.password]);
  const strengthLabel = ["Lemah", "Lemah", "Cukup", "Kuat", "Sangat kuat"][strength];

  function updateField<K extends keyof RegisterForm>(field: K, value: RegisterForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const clientErrors = validateClient(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setMessageType("error");
      setMessage("Periksa kembali data yang masih salah.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          username: form.username.trim().toLowerCase(),
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as RegisterResponse;

      if (!response.ok) {
        setMessageType("error");
        setMessage(payload.message ?? "Registrasi gagal. Coba lagi.");
        setErrors(payload.errors ?? {});
        return;
      }

      setMessageType("success");
      setMessage(payload.message ?? "Registrasi berhasil.");
      setForm(initialForm);

      window.setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch {
      setMessageType("error");
      setMessage("Tidak bisa terhubung ke server. Pastikan aplikasi Next.js dan database aktif.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Daftar Akun"
      description="Buat akun pasien rumah sakit."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormMessage type={messageType} message={message} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-bold text-slate-700">
              Nama Lengkap
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Contoh: dr. Azita Putri"
              aria-invalid={Boolean(errors.name)}
              className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100 ${
                errors.name ? "border-red-300" : "border-slate-200"
              }`}
            />
            {firstError(errors, "name") ? <p className="text-xs font-semibold text-red-600">{firstError(errors, "name")}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-bold text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="nama@hospital.com"
              aria-invalid={Boolean(errors.email)}
              className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100 ${
                errors.email ? "border-red-300" : "border-slate-200"
              }`}
            />
            {firstError(errors, "email") ? <p className="text-xs font-semibold text-red-600">{firstError(errors, "email")}</p> : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-bold text-slate-700">
              Nomor HP
            </label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="081234567890"
              aria-invalid={Boolean(errors.phone)}
              className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100 ${
                errors.phone ? "border-red-300" : "border-slate-200"
              }`}
            />
            {firstError(errors, "phone") ? <p className="text-xs font-semibold text-red-600">{firstError(errors, "phone")}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-bold text-slate-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
              placeholder="azita_putri"
              aria-invalid={Boolean(errors.username)}
              className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100 ${
                errors.username ? "border-red-300" : "border-slate-200"
              }`}
            />
            {firstError(errors, "username") ? <p className="text-xs font-semibold text-red-600">{firstError(errors, "username")}</p> : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <PasswordField
            id="password"
            name="password"
            label="Password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            error={firstError(errors, "password")}
            autoComplete="new-password"
          />

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Konfirmasi Password"
            value={form.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            error={firstError(errors, "confirmPassword")}
            autoComplete="new-password"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-600">
            <span>Kekuatan password</span>
            <span>{form.password ? strengthLabel : "Belum diisi"}</span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={`h-2 rounded-full ${step <= strength ? "bg-[#156eea]" : "bg-slate-200"}`}
              />
            ))}
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-600">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(event) => updateField("terms", event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#156eea]"
          />
          <span>
            Saya menyetujui Syarat & Ketentuan dan Kebijakan Privasi.
            {firstError(errors, "terms") ? (
              <span className="mt-1 block text-xs font-semibold text-red-600">{firstError(errors, "terms")}</span>
            ) : null}
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-2xl bg-[#156eea] px-5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#075acb] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Mendaftarkan..." : "Daftar"}
        </button>

        <p className="text-center text-sm font-semibold text-slate-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-black text-[#156eea] hover:underline">
            Masuk di sini
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
