"use client";

import { FormEvent, useMemo, useState } from "react";
import { DashboardShell } from "../../components/dashboard/DashboardShell";
import { PasswordField } from "../../components/auth/PasswordField";
import { FormMessage } from "../../components/auth/FormMessage";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PasswordErrors = Partial<Record<keyof PasswordForm, string>>;

const initialForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function getPasswordStrength(password: string) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password) && /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  return checks.filter(Boolean).length;
}

function validatePasswordForm(form: PasswordForm) {
  const errors: PasswordErrors = {};

  if (!form.currentPassword) {
    errors.currentPassword = "Password lama wajib diisi.";
  }

  if (form.newPassword.length < 8) {
    errors.newPassword = "Password baru minimal 8 karakter.";
  }

  if (form.confirmPassword !== form.newPassword) {
    errors.confirmPassword = "Konfirmasi password tidak sama.";
  }

  if (form.currentPassword && form.currentPassword === form.newPassword) {
    errors.newPassword = "Password baru tidak boleh sama dengan password lama.";
  }

  return errors;
}

export default function ChangePasswordPage() {
  const [form, setForm] = useState<PasswordForm>(initialForm);
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | "info">("info");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(form.newPassword), [form.newPassword]);
  const strengthLabel = ["Belum diisi", "Lemah", "Cukup", "Kuat", "Sangat kuat"][strength];

  function updateField<K extends keyof PasswordForm>(field: K, value: PasswordForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validatePasswordForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessageType("error");
      setMessage("Periksa kembali data password.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Backend change-password belum terlihat di repo.
      // Jika endpoint sudah dibuat, ganti simulasi ini menjadi fetch("/api/auth/change-password", ...).
      await new Promise((resolve) => window.setTimeout(resolve, 700));

      setMessageType("success");
      setMessage("Password berhasil divalidasi di frontend. Sambungkan ke API change-password jika backend sudah tersedia.");
      setForm(initialForm);
      setErrors({});
    } catch {
      setMessageType("error");
      setMessage("Gagal mengubah password. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell title="Ubah Password" activeMenu="change-password">
      <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900">Ubah Password</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Gunakan password kuat agar akun lebih aman.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <FormMessage type={messageType} message={message} />

          <PasswordField
            id="currentPassword"
            name="currentPassword"
            label="Password Lama"
            value={form.currentPassword}
            onChange={(event) => updateField("currentPassword", event.target.value)}
            error={errors.currentPassword}
            autoComplete="current-password"
          />

          <PasswordField
            id="newPassword"
            name="newPassword"
            label="Password Baru"
            value={form.newPassword}
            onChange={(event) => updateField("newPassword", event.target.value)}
            error={errors.newPassword}
            autoComplete="new-password"
          />

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex justify-between text-xs font-black text-slate-600">
              <span>Kekuatan password</span>
              <span>{strengthLabel}</span>
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

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Konfirmasi Password Baru"
            value={form.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-[#156eea] px-5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#075acb] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}
