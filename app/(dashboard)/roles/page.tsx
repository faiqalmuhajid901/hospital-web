"use client";

import { FormEvent, useMemo, useState } from "react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";

type Role = {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: string[];
  active: boolean;
};

const permissionOptions = ["pasien.view", "pasien.update", "farmasi.approve", "lab.create", "role.manage", "billing.view"];

const initialRoles: Role[] = [
  { id: "ROLE-001", name: "Super Admin", description: "Akses penuh ke seluruh sistem", users: 1, permissions: permissionOptions, active: true },
  { id: "ROLE-002", name: "Admin", description: "Mengelola data dasar dan pengguna", users: 4, permissions: ["pasien.view", "pasien.update", "role.manage"], active: true },
  { id: "ROLE-003", name: "Dokter", description: "Akses pemeriksaan dan rekam medis", users: 12, permissions: ["pasien.view", "lab.create"], active: true },
  { id: "ROLE-004", name: "Apoteker", description: "Validasi resep dan stok obat", users: 5, permissions: ["farmasi.approve"], active: true },
];

export default function RolesPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [keyword, setKeyword] = useState("");
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const filteredRoles = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    return roles.filter((role) => !query || [role.name, role.description].some((value) => value.toLowerCase().includes(query)));
  }, [keyword, roles]);

  function toggleRole(id: string) {
    setRoles((current) => current.map((role) => role.id === id ? { ...role, active: !role.active } : role));
  }

  function togglePermission(permission: string) {
    setEditingRole((current) => {
      if (!current) return current;
      const exists = current.permissions.includes(permission);
      return {
        ...current,
        permissions: exists
          ? current.permissions.filter((item) => item !== permission)
          : [...current.permissions, permission],
      };
    });
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingRole) return;
    setRoles((current) => current.map((role) => role.id === editingRole.id ? editingRole : role));
    setEditingRole(null);
  }

  return (
    <DashboardShell title="Role & Hak Akses" activeMenu="roles">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Role & Hak Akses</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Kelola role pengguna dan permission yang melekat pada setiap role.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari role..."
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredRoles.map((role) => (
            <div key={role.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{role.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{role.description}</p>
                  <p className="mt-3 text-xs font-black uppercase text-slate-400">{role.users} pengguna • {role.permissions.length} permission</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${role.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {role.active ? "Aktif" : "Nonaktif"}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => setEditingRole(role)} className="rounded-2xl bg-[#156eea] px-4 py-2 text-sm font-black text-white hover:bg-[#075acb]">
                  Edit Permission
                </button>
                <button type="button" onClick={() => toggleRole(role.id)} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50">
                  {role.active ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {editingRole ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
            <form onSubmit={handleSave} className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Edit Role</h3>
                  <p className="text-sm font-semibold text-slate-500">{editingRole.name}</p>
                </div>
                <button type="button" onClick={() => setEditingRole(null)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-slate-600 hover:bg-slate-50">
                  Tutup
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-black text-slate-700">Nama Role</label>
                  <input
                    value={editingRole.name}
                    onChange={(event) => setEditingRole({ ...editingRole, name: event.target.value })}
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700">Deskripsi</label>
                  <textarea
                    value={editingRole.description}
                    onChange={(event) => setEditingRole({ ...editingRole, description: event.target.value })}
                    className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {permissionOptions.map((permission) => (
                    <label key={permission} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 text-sm font-bold text-slate-600">
                      <input
                        type="checkbox"
                        checked={editingRole.permissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        className="h-4 w-4 accent-[#156eea]"
                      />
                      {permission}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="mt-6 h-12 w-full rounded-2xl bg-[#156eea] text-sm font-black text-white hover:bg-[#075acb]">
                Simpan Role
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}
