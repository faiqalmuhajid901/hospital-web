"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";

type LoginSession = {
  id: string;
  user: string;
  device: string;
  location: string;
  ip: string;
  time: string;
  status: "Aktif" | "Selesai" | "Diblokir";
};

const sessions: LoginSession[] = [
  { id: "SES-001", user: "dr. Azita Putri", device: "Chrome Windows", location: "Jakarta", ip: "192.168.10.11", time: "2026-06-28 08:20", status: "Aktif" },
  { id: "SES-002", user: "Admin HIS", device: "Edge Windows", location: "Bandung", ip: "192.168.10.12", time: "2026-06-28 07:52", status: "Selesai" },
  { id: "SES-003", user: "Unknown", device: "Firefox Linux", location: "Unknown", ip: "180.10.11.12", time: "2026-06-28 06:40", status: "Diblokir" },
  { id: "SES-004", user: "Perawat IGD", device: "Chrome Android", location: "Jakarta", ip: "192.168.10.44", time: "2026-06-27 21:14", status: "Selesai" },
];

function statusClass(status: LoginSession["status"]) {
  if (status === "Aktif") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "Diblokir") return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-50 text-slate-600 border-slate-200";
}

export default function LoginHistoryPage() {
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState(sessions);

  const filteredSessions = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    return data.filter((session) =>
      !query ||
      [session.id, session.user, session.device, session.location, session.ip, session.status].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [data, keyword]);

  function endSession(id: string) {
    setData((current) =>
      current.map((session) =>
        session.id === id ? { ...session, status: "Selesai" } : session
      )
    );
  }

  return (
    <DashboardShell title="Riwayat Login" activeMenu="login-history">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Riwayat Login</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Lihat sesi login, perangkat, lokasi, dan status akses pengguna.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari user, perangkat, lokasi, IP..."
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="grid gap-4">
          {filteredSessions.map((session) => (
            <div key={session.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{session.user}</h3>
                    <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{session.device} • {session.location}</p>
                </div>

                {session.status === "Aktif" ? (
                  <button
                    type="button"
                    onClick={() => endSession(session.id)}
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700 hover:bg-red-100"
                  >
                    Akhiri Sesi
                  </button>
                ) : null}
              </div>

              <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-600 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-3">ID: {session.id}</div>
                <div className="rounded-2xl bg-slate-50 p-3">IP: {session.ip}</div>
                <div className="rounded-2xl bg-slate-50 p-3">Waktu: {session.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
