"use client";

import Link from "next/link";
import {
  Suspense,
  type FormEvent,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/app/components/auth/AuthShell";
import { FormMessage } from "@/app/components/auth/FormMessage";
import { PasswordField } from "@/app/components/auth/PasswordField";

type MessageType = "error" | "success" | "info";

type ResetForm = {
  password: string;
  confirmPassword: string;
};

function passwordStrength(password: string) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password) && /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  return checks.filter(Boolean).length;
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [form, setForm] = useState<ResetForm>({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] =
    useState<MessageType>("info");

  const strength = useMemo(
    () => passwordStrength(form.password),
    [form.password]
  );

  const strengthLabel = [
    "Lemah",
    "Lemah",
    "Cukup",
    "Kuat",
    "Sangat kuat",
  ][strength];

  function updateField<K extends keyof ResetForm>(
    field: K,
    value: ResetForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage(null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!token) {
      setMessageType("error");
      setMessage(
        "Token reset password tidak ditemukan. Buka kembali link reset password dari email."
      );
      return;
    }

    if (form.password.length < 8) {
      setMessageType("error");
      setMessage("Password baru minimal 8 karakter.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessageType("error");
      setMessage("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      /*
       * Ganti simulasi berikut dengan API reset password
       * ketika endpoint backend sudah tersedia.
       *
       * Contoh:
       *
       * const response = await fetch("/api/auth/reset-password", {
       *   method: "POST",
       *   headers: {
       *     "Content-Type": "application/json",
       *   },
       *   body: JSON.stringify({
       *     token,
       *     password: form.password,
       *   }),
       * });
       *
       * const result = await response.json();
       *
       * if (!response.ok) {
       *   throw new Error(
       *     result.message ?? "Gagal memperbarui password."
       *   );
       * }
       */

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 700);
      });

      setMessageType("success");
      setMessage(
        "Password berhasil diperbarui. Silakan login kembali."
      );

      setForm({
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal memperbarui password. Coba lagi beberapa saat lagi.";

      setMessageType("error");
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset Password"
      description="Masukkan password baru untuk akun Anda."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        noValidate
      >
        <FormMessage
          type={messageType}
          message={message}
        />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
          Token:{" "}
          {token
            ? "Token terdeteksi dari URL"
            : "Belum ada token di URL"}
        </div>

        <PasswordField
          id="password"
          name="password"
          label="Password Baru"
          value={form.password}
          onChange={(event) =>
            updateField("password", event.target.value)
          }
          autoComplete="new-password"
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Konfirmasi Password Baru"
          value={form.confirmPassword}
          onChange={(event) =>
            updateField(
              "confirmPassword",
              event.target.value
            )
          }
          autoComplete="new-password"
          error={
            form.confirmPassword &&
            form.confirmPassword !== form.password
              ? "Konfirmasi password tidak sama."
              : undefined
          }
        />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-600">
            <span>Kekuatan password</span>

            <span>
              {form.password
                ? strengthLabel
                : "Belum diisi"}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={`h-2 rounded-full ${
                  step <= strength
                    ? "bg-[#156eea]"
                    : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-2xl bg-[#156eea] px-5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#075acb] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading
            ? "Menyimpan..."
            : "Simpan Password Baru"}
        </button>

        <p className="text-center text-sm font-semibold text-slate-600">
          Sudah berhasil reset?{" "}
          <Link
            href="/login"
            className="font-black text-[#156eea] hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

function ResetPasswordFallback() {
  return (
    <AuthShell
      title="Reset Password"
      description="Memuat data reset password..."
    >
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center text-sm font-semibold text-slate-600">
        Memuat halaman...
      </div>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}