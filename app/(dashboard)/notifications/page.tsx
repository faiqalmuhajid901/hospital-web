"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  category: "Appointment" | "Lab" | "Farmasi" | "Keamanan";
  time: string;
  read: boolean;
};

const initialNotifications: NotificationItem[] = [
  { id: "N-001", title: "Jadwal pasien baru", description: "Pasien Ahmad dijadwalkan konsultasi pukul 10.00.", category: "Appointment", time: "5 menit lalu", read: false },
  { id: "N-002", title: "Hasil lab tersedia", description: "Hasil pemeriksaan darah pasien Budi sudah selesai.", category: "Lab", time: "20 menit lalu", read: false },
  { id: "N-003", title: "Stok obat menipis", description: "Stok Paracetamol 500mg kurang dari batas minimum.", category: "Farmasi", time: "1 jam lalu", read: true },
  { id: "N-004", title: "Login perangkat baru", description: "Akun Anda login dari perangkat Chrome Windows.", category: "Keamanan", time: "2 jam lalu", read: true },
];

const categoryOptions = ["Semua", "Appointment", "Lab", "Farmasi", "Keamanan"] as const;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [category, setCategory] = useState<(typeof categoryOptions)[number]>("Semua");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchCategory = category === "Semua" || item.category === category;
      const matchRead = !showUnreadOnly || !item.read;
      return matchCategory && matchRead;
    });
  }, [category, notifications, showUnreadOnly]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  function markAllRead() {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  }

  function toggleRead(id: string) {
    setNotifications((current) =>
      current.map((item) => item.id === id ? { ...item, read: !item.read } : item)
    );
  }

  function removeNotification(id: string) {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }

  return (
    <DashboardShell title="Notifikasi" activeMenu="notifications">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Notifikasi</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Ada {unreadCount} notifikasi yang belum dibaca.
            </p>
          </div>
          <button
            type="button"
            onClick={markAllRead}
            className="rounded-2xl bg-[#156eea] px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 hover:bg-[#075acb]"
          >
            Tandai Semua Dibaca
          </button>
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[220px_auto]">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as typeof category)}
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          >
            {categoryOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(event) => setShowUnreadOnly(event.target.checked)}
              className="h-4 w-4 accent-[#156eea]"
            />
            Tampilkan yang belum dibaca saja
          </label>
        </div>

        <div className="grid gap-4">
          {filteredNotifications.map((item) => (
            <div key={item.id} className={`rounded-3xl border p-5 shadow-sm ${item.read ? "border-slate-200 bg-white" : "border-blue-200 bg-blue-50"}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                    {!item.read ? <span className="rounded-full bg-[#156eea] px-2 py-1 text-[10px] font-black text-white">BARU</span> : null}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-600">{item.description}</p>
                  <p className="mt-2 text-xs font-bold text-slate-400">{item.category} • {item.time}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleRead(item.id)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-50"
                  >
                    {item.read ? "Belum Dibaca" : "Sudah Dibaca"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeNotification(item.id)}
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-black text-red-700 hover:bg-red-100"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500 shadow-sm">
              Tidak ada notifikasi sesuai filter.
            </div>
          ) : null}
        </div>
      </div>
    </DashboardShell>
  );
}
