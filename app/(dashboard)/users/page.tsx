"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "../../components/dashboard/DashboardShell";

type UserStatus = "Aktif" | "Nonaktif";

type UserItem = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  status: UserStatus;
};

const initialUsers: UserItem[] = [
  {
    id: 1,
    name: "dr. Azita Putri",
    username: "azita.putri",
    email: "azita.putri@rumahsakit.ac.id",
    role: "Dokter",
    status: "Aktif",
  },
  {
    id: 2,
    name: "Nadia Laras",
    username: "nadia.laras",
    email: "nadia.laras@rumahsakit.ac.id",
    role: "Perawat",
    status: "Aktif",
  },
  {
    id: 3,
    name: "Bagas Pratama",
    username: "bagas.pratama",
    email: "bagas.pratama@rumahsakit.ac.id",
    role: "Admin",
    status: "Nonaktif",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState("all");

  const filteredUsers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return users.filter((user) => {
      const matchKeyword =
        !normalizedKeyword ||
        user.name.toLowerCase().includes(normalizedKeyword) ||
        user.username.toLowerCase().includes(normalizedKeyword) ||
        user.email.toLowerCase().includes(normalizedKeyword);

      const matchRole = role === "all" || user.role.toLowerCase() === role;

      return matchKeyword && matchRole;
    });
  }, [keyword, role, users]);

  function toggleStatus(id: number) {
    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "Aktif" ? "Nonaktif" : "Aktif" }
          : user
      )
    );
  }

  return (
    <DashboardShell title="Pengguna" activeMenu="users">
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Manajemen Pengguna</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Cari, filter, dan ubah status pengguna dari sisi frontend.
          </p>
        </div>

        <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_220px]">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari nama, username, atau email..."
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-800 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          />

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-800 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="dokter">Dokter</option>
            <option value="perawat">Perawat</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Nama</th>
                <th className="px-5 py-4">Username</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-5 py-4">
                    <p className="font-black text-slate-900">{user.name}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{user.email}</p>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-700">{user.username}</td>
                  <td className="px-5 py-4 font-bold text-slate-700">{user.role}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        user.status === "Aktif"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => toggleStatus(user.id)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"
                    >
                      {user.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center font-bold text-slate-500">
                    Tidak ada pengguna yang cocok.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
