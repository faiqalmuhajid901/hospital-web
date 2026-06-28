"use client";

import { useState } from "react";
import { DashboardShell } from "../../components/dashboard/DashboardShell";
import { FormMessage } from "../../components/auth/FormMessage";

type SettingKey =
  | "appointment"
  | "labResult"
  | "pharmacy"
  | "security"
  | "email"
  | "sms";

type NotificationSetting = {
  key: SettingKey;
  title: string;
  description: string;
  enabled: boolean;
};

const initialSettings: NotificationSetting[] = [
  {
    key: "appointment",
    title: "Appointment pasien",
    description: "Notifikasi saat ada jadwal baru, perubahan jadwal, atau pembatalan.",
    enabled: true,
  },
  {
    key: "labResult",
    title: "Hasil laboratorium",
    description: "Notifikasi saat hasil laboratorium pasien sudah tersedia.",
    enabled: true,
  },
  {
    key: "pharmacy",
    title: "Farmasi",
    description: "Notifikasi terkait resep, stok obat, dan validasi obat.",
    enabled: false,
  },
  {
    key: "security",
    title: "Keamanan akun",
    description: "Notifikasi login baru, perubahan password, dan aktivitas sensitif.",
    enabled: true,
  },
  {
    key: "email",
    title: "Kirim melalui email",
    description: "Kirim ringkasan notifikasi penting ke email terdaftar.",
    enabled: true,
  },
  {
    key: "sms",
    title: "Kirim melalui SMS",
    description: "Kirim notifikasi prioritas tinggi melalui SMS.",
    enabled: false,
  },
];

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState<string | null>(null);

  function toggleSetting(key: SettingKey) {
    setSettings((current) =>
      current.map((item) =>
        item.key === key ? { ...item, enabled: !item.enabled } : item
      )
    );
    setMessage(null);
  }

  async function handleSave() {
    // Backend notification-settings belum terlihat di repo.
    // Jika endpoint sudah dibuat, ganti simulasi ini menjadi fetch("/api/notification-settings", ...).
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    setMessage("Pengaturan notifikasi berhasil disimpan.");
  }

  return (
    <DashboardShell title="Pengaturan Notifikasi" activeMenu="notification-settings">
      <div className="max-w-4xl space-y-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Pengaturan Notifikasi</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Atur jenis notifikasi yang ingin diterima oleh pengguna.
          </p>
        </div>

        <FormMessage type="success" message={message} />

        <div className="grid gap-4">
          {settings.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div>
                <h3 className="font-black text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleSetting(item.key)}
                className={`relative h-8 w-14 rounded-full transition ${
                  item.enabled ? "bg-[#156eea]" : "bg-slate-300"
                }`}
                aria-pressed={item.enabled}
                aria-label={`Toggle ${item.title}`}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                    item.enabled ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="rounded-2xl bg-[#156eea] px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#075acb]"
        >
          Simpan Pengaturan
        </button>
      </div>
    </DashboardShell>
  );
}
