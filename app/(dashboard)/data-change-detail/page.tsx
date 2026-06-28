"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";

type TabKey = "ringkasan" | "sebelum" | "sesudah" | "audit";

const beforeData = {
  name: "Budi Santoso",
  phone: "081111111111",
  address: "Jl. Melati No. 12",
  status: "Pasien aktif",
};

const afterData = {
  name: "Budi Santoso",
  phone: "082222222222",
  address: "Jl. Melati No. 12 Blok B",
  status: "Pasien aktif",
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "ringkasan", label: "Ringkasan" },
  { key: "sebelum", label: "Data Sebelum" },
  { key: "sesudah", label: "Data Sesudah" },
  { key: "audit", label: "Audit" },
];

export default function DataChangeDetailPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("ringkasan");
  const [copied, setCopied] = useState(false);

  const changedFields = useMemo(() => {
    return Object.keys(afterData).filter((key) => beforeData[key as keyof typeof beforeData] !== afterData[key as keyof typeof afterData]);
  }, []);

  async function copyAuditId() {
    await navigator.clipboard.writeText("CHANGE-20260628-001");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <DashboardShell title="Detail Perubahan Data" activeMenu="data-change-detail">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Detail Perubahan Data</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Audit perubahan data pasien dan riwayat persetujuan.
            </p>
          </div>
          <button
            type="button"
            onClick={copyAuditId}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50"
          >
            {copied ? "ID tersalin" : "Salin ID Audit"}
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-2xl px-4 py-2 text-sm font-black transition ${
                  activeTab === tab.key ? "bg-[#156eea] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "ringkasan" ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-400">ID Audit</p>
              <p className="mt-2 font-black text-slate-900">CHANGE-20260628-001</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-400">Diubah Oleh</p>
              <p className="mt-2 font-black text-slate-900">Admin HIS</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-400">Field Berubah</p>
              <p className="mt-2 font-black text-slate-900">{changedFields.length} field</p>
            </div>
          </div>
        ) : null}

        {activeTab === "sebelum" || activeTab === "sesudah" ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-slate-900">
              {activeTab === "sebelum" ? "Data Sebelum" : "Data Sesudah"}
            </h3>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {Object.entries(activeTab === "sebelum" ? beforeData : afterData).map(([key, value]) => (
                <div key={key} className={`rounded-2xl border p-4 ${changedFields.includes(key) ? "border-amber-200 bg-amber-50" : "border-slate-100 bg-slate-50"}`}>
                  <p className="text-xs font-black uppercase text-slate-400">{key}</p>
                  <p className="mt-1 font-bold text-slate-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "audit" ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-slate-900">Jejak Audit</h3>
            <div className="mt-5 space-y-3">
              {[
                "Permintaan perubahan dibuat oleh Admin HIS.",
                "Sistem menandai perubahan nomor HP dan alamat.",
                "Perubahan disetujui supervisor data.",
              ].map((item, index) => (
                <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#156eea] text-xs font-black text-white">{index + 1}</span>
                  <p className="text-sm font-semibold text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}
