"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";

type Permission = {
  id: string;
  module: string;
  action: "view" | "create" | "update" | "delete" | "approve";
  description: string;
  enabled: boolean;
};

const initialPermissions: Permission[] = [
  { id: "PERM-001", module: "Pasien", action: "view", description: "Melihat data pasien", enabled: true },
  { id: "PERM-002", module: "Pasien", action: "update", description: "Mengubah data pasien", enabled: true },
  { id: "PERM-003", module: "Farmasi", action: "approve", description: "Validasi resep dan stok obat", enabled: false },
  { id: "PERM-004", module: "Laboratorium", action: "create", description: "Membuat permintaan pemeriksaan lab", enabled: true },
  { id: "PERM-005", module: "Role", action: "delete", description: "Menghapus role pengguna", enabled: false },
  { id: "PERM-006", module: "Billing", action: "view", description: "Melihat tagihan pasien", enabled: true },
];

const modules = ["Semua", "Pasien", "Farmasi", "Laboratorium", "Role", "Billing"] as const;

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [selectedModule, setSelectedModule] = useState<(typeof modules)[number]>("Semua");
  const [keyword, setKeyword] = useState("");

  const filteredPermissions = useMemo(() => {
    const query = keyword.trim().toLowerCase();

    return permissions.filter((permission) => {
      const matchModule = selectedModule === "Semua" || permission.module === selectedModule;
      const matchKeyword =
        !query ||
        [permission.id, permission.module, permission.action, permission.description].some((value) =>
          value.toLowerCase().includes(query)
        );

      return matchModule && matchKeyword;
    });
  }, [keyword, permissions, selectedModule]);

  function togglePermission(id: string) {
    setPermissions((current) =>
      current.map((permission) =>
        permission.id === id ? { ...permission, enabled: !permission.enabled } : permission
      )
    );
  }

  function setAll(value: boolean) {
    setPermissions((current) =>
      current.map((permission) => ({
        ...permission,
        enabled: filteredPermissions.some((item) => item.id === permission.id) ? value : permission.enabled,
      }))
    );
  }

  return (
    <DashboardShell title="Permission" activeMenu="permissions">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Permission</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Atur izin aksi sistem berdasarkan modul.
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setAll(true)} className="rounded-2xl bg-[#156eea] px-4 py-2 text-sm font-black text-white hover:bg-[#075acb]">
              Aktifkan Filter
            </button>
            <button type="button" onClick={() => setAll(false)} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50">
              Nonaktifkan Filter
            </button>
          </div>
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_220px]">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari permission..."
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          />
          <select
            value={selectedModule}
            onChange={(event) => setSelectedModule(event.target.value as typeof selectedModule)}
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          >
            {modules.map((module) => <option key={module} value={module}>{module}</option>)}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredPermissions.map((permission) => (
            <div key={permission.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">{permission.id}</p>
                  <h3 className="mt-1 text-lg font-black text-slate-900">{permission.module}.{permission.action}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{permission.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePermission(permission.id)}
                  aria-pressed={permission.enabled}
                  className={`relative h-9 w-16 rounded-full transition ${permission.enabled ? "bg-[#156eea]" : "bg-slate-300"}`}
                >
                  <span className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow transition ${permission.enabled ? "left-8" : "left-1"}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
