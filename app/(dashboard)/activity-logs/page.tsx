"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";

type LogStatus = "Berhasil" | "Gagal" | "Peringatan";

type ActivityLog = {
  id: string;
  user: string;
  role: string;
  action: string;
  module: string;
  status: LogStatus;
  ip: string;
  time: string;
};

const logs: ActivityLog[] = [
  { id: "LOG-1001", user: "dr. Azita Putri", role: "Dokter", action: "Melihat rekam medis pasien", module: "Pasien", status: "Berhasil", ip: "192.168.10.11", time: "2026-06-28 08:20" },
  { id: "LOG-1002", user: "Admin HIS", role: "Admin", action: "Mengubah role pengguna", module: "Role", status: "Peringatan", ip: "192.168.10.12", time: "2026-06-28 08:12" },
  { id: "LOG-1003", user: "Apoteker Satu", role: "Apoteker", action: "Validasi resep", module: "Farmasi", status: "Berhasil", ip: "192.168.10.21", time: "2026-06-28 07:58" },
  { id: "LOG-1004", user: "User Unknown", role: "-", action: "Login gagal", module: "Auth", status: "Gagal", ip: "182.1.22.90", time: "2026-06-28 07:41" },
  { id: "LOG-1005", user: "Perawat IGD", role: "Perawat", action: "Update triase pasien", module: "Rawat Jalan", status: "Berhasil", ip: "192.168.10.33", time: "2026-06-28 07:20" },
];

const statusOptions = ["Semua", "Berhasil", "Gagal", "Peringatan"] as const;

function statusClass(status: LogStatus) {
  if (status === "Berhasil") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "Gagal") return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export default function ActivityLogsPage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("Semua");
  const [selected, setSelected] = useState<ActivityLog | null>(null);

  const filteredLogs = useMemo(() => {
    const query = keyword.trim().toLowerCase();

    return logs.filter((log) => {
      const matchStatus = status === "Semua" || log.status === status;
      const matchKeyword =
        !query ||
        [log.id, log.user, log.role, log.action, log.module, log.ip].some((value) =>
          value.toLowerCase().includes(query)
        );

      return matchStatus && matchKeyword;
    });
  }, [keyword, status]);

  function handleExport() {
    const header = ["ID", "User", "Role", "Aksi", "Modul", "Status", "IP", "Waktu"];
    const rows = filteredLogs.map((log) => [log.id, log.user, log.role, log.action, log.module, log.status, log.ip, log.time]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "activity-logs.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardShell title="Log Aktivitas" activeMenu="activity-logs">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Log Aktivitas</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Pantau aktivitas pengguna, modul yang diakses, dan status aktivitas sistem.
          </p>
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_220px_auto]">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari user, aksi, modul, IP..."
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          >
            {statusOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleExport}
            className="h-12 rounded-2xl bg-[#156eea] px-5 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-[#075acb]"
          >
            Export CSV
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Aksi</th>
                  <th className="px-5 py-4">Modul</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Waktu</th>
                  <th className="px-5 py-4">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-black text-slate-700">{log.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-black text-slate-800">{log.user}</p>
                      <p className="text-xs font-semibold text-slate-500">{log.role}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{log.action}</td>
                    <td className="px-5 py-4 font-bold text-slate-700">{log.module}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(log.status)}`}>{log.status}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-500">{log.time}</td>
                    <td className="px-5 py-4">
                      <button type="button" onClick={() => setSelected(log)} className="font-black text-[#156eea] hover:underline">
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Detail Log</h3>
                  <p className="text-sm font-semibold text-slate-500">{selected.id}</p>
                </div>
                <button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-slate-600 hover:bg-slate-50">
                  Tutup
                </button>
              </div>

              <dl className="mt-5 grid gap-3 text-sm">
                {Object.entries(selected).map(([key, value]) => (
                  <div key={key} className="rounded-2xl bg-slate-50 p-3">
                    <dt className="text-xs font-black uppercase text-slate-400">{key}</dt>
                    <dd className="mt-1 font-bold text-slate-700">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}
