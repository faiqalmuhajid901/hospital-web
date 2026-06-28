"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";

type ReportRow = {
  module: string;
  total: number;
  success: number;
  warning: number;
  failed: number;
};

const baseRows: ReportRow[] = [
  { module: "Auth", total: 320, success: 285, warning: 12, failed: 23 },
  { module: "Pasien", total: 214, success: 205, warning: 6, failed: 3 },
  { module: "Farmasi", total: 142, success: 136, warning: 4, failed: 2 },
  { module: "Laboratorium", total: 98, success: 95, warning: 2, failed: 1 },
  { module: "Role & Permission", total: 63, success: 54, warning: 7, failed: 2 },
];

const periodOptions = ["Hari ini", "7 Hari", "30 Hari", "90 Hari"] as const;

export default function ActivityReportPage() {
  const [period, setPeriod] = useState<(typeof periodOptions)[number]>("7 Hari");
  const [moduleKeyword, setModuleKeyword] = useState("");

  const rows = useMemo(() => {
    const keyword = moduleKeyword.trim().toLowerCase();
    const multiplier = period === "Hari ini" ? 0.22 : period === "7 Hari" ? 1 : period === "30 Hari" ? 3.4 : 8.2;

    return baseRows
      .filter((row) => !keyword || row.module.toLowerCase().includes(keyword))
      .map((row) => ({
        ...row,
        total: Math.round(row.total * multiplier),
        success: Math.round(row.success * multiplier),
        warning: Math.round(row.warning * multiplier),
        failed: Math.round(row.failed * multiplier),
      }));
  }, [period, moduleKeyword]);

  const summary = useMemo(() => {
    return rows.reduce(
      (acc, row) => ({
        total: acc.total + row.total,
        success: acc.success + row.success,
        warning: acc.warning + row.warning,
        failed: acc.failed + row.failed,
      }),
      { total: 0, success: 0, warning: 0, failed: 0 }
    );
  }, [rows]);

  function handleExport() {
    const header = ["Modul", "Total", "Berhasil", "Peringatan", "Gagal"];
    const csv = [header, ...rows.map((row) => [row.module, row.total, row.success, row.warning, row.failed])]
      .map((row) => row.map(String).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `activity-report-${period.toLowerCase().replaceAll(" ", "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardShell title="Laporan Aktivitas" activeMenu="activity-report">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Laporan Aktivitas</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Ringkasan aktivitas sistem berdasarkan modul dan periode.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Total Aktivitas", summary.total],
            ["Berhasil", summary.success],
            ["Peringatan", summary.warning],
            ["Gagal", summary.failed],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_220px_auto]">
          <input
            value={moduleKeyword}
            onChange={(event) => setModuleKeyword(event.target.value)}
            placeholder="Cari modul..."
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          />
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value as typeof period)}
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          >
            {periodOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button
            type="button"
            onClick={handleExport}
            className="h-12 rounded-2xl bg-[#156eea] px-5 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-[#075acb]"
          >
            Export CSV
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-4">
            {rows.map((row) => {
              const successRate = row.total ? Math.round((row.success / row.total) * 100) : 0;

              return (
                <div key={row.module} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900">{row.module}</h3>
                      <p className="text-xs font-semibold text-slate-500">{row.total} aktivitas dalam periode {period}</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#156eea]">
                      Success rate {successRate}%
                    </span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-[#156eea]" style={{ width: `${successRate}%` }} />
                  </div>
                  <div className="mt-3 grid gap-2 text-xs font-bold text-slate-500 md:grid-cols-3">
                    <span>Berhasil: {row.success}</span>
                    <span>Peringatan: {row.warning}</span>
                    <span>Gagal: {row.failed}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
