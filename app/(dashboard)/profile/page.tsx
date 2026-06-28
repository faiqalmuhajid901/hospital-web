"use client";

import { FormEvent, useState } from "react";
import { DashboardShell } from "../../components/dashboard/DashboardShell";
import { FormMessage } from "../../components/auth/FormMessage";

type ProfileForm = {
  name: string;
  job: string;
  unit: string;
  email: string;
  phone: string;
  username: string;
  nik: string;
  birthDate: string;
  address: string;
};

const initialProfile: ProfileForm = {
  name: "dr. Azita Putri",
  job: "Dokter Umum",
  unit: "Poli Umum",
  email: "azita.putri@rumahsakit.ac.id",
  phone: "0813-3456-7900",
  username: "azita.putri",
  nik: "3273046607980001",
  birthDate: "1990-01-15",
  address: "Jl. Melati No. 12, Bandung",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileForm>(initialProfile);
  const [draft, setDraft] = useState<ProfileForm>(initialProfile);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function openEdit() {
    setDraft(profile);
    setMessage(null);
    setEditing(true);
  }

  function updateField<K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.name.trim() || !draft.email.trim() || !draft.username.trim()) {
      setMessage("Nama, email, dan username wajib diisi.");
      return;
    }

    setProfile({
      ...draft,
      name: draft.name.trim(),
      email: draft.email.trim().toLowerCase(),
      username: draft.username.trim(),
    });

    setEditing(false);
    setMessage("Profil berhasil diperbarui di state frontend.");
  }

  const profileRows = [
    { label: "Email", value: profile.email },
    { label: "No. HP", value: profile.phone },
    { label: "Username", value: profile.username },
    { label: "NIK", value: profile.nik },
    { label: "Tanggal Lahir", value: profile.birthDate },
    { label: "Alamat", value: profile.address },
    { label: "Bergabung Sejak", value: "12 Mei 2022 08:35" },
  ];

  return (
    <DashboardShell title="Profil Saya" activeMenu="profile">
      <div className="max-w-5xl space-y-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Profil Saya</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Kelola informasi akun dan identitas pengguna.
          </p>
        </div>

        <FormMessage type={message?.includes("wajib") ? "error" : "success"} message={message} />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#156eea] text-2xl font-black text-white">
                  AP
                </div>
                <span className="absolute -bottom-2 left-4 rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                  Aktif
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">{profile.name}</h3>
                <p className="mt-1 text-sm font-bold text-slate-600">{profile.job}</p>
                <p className="text-sm font-semibold text-slate-500">{profile.unit}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={openEdit}
              className="rounded-2xl bg-[#156eea] px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 hover:bg-[#075acb]"
            >
              Edit Profil
            </button>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-3">
              {profileRows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-[180px_1fr]"
                >
                  <p className="text-sm font-black text-slate-500">{row.label}</p>
                  <p className="text-sm font-bold text-slate-800">{row.value}</p>
                </div>
              ))}
            </div>

            <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-black text-slate-900">Ringkasan Akun</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">Role</p>
                  <p className="mt-1 font-black text-slate-800">Dokter</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">Hak Akses</p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    Rekam Medis, Appointment, Rawat Jalan
                  </p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">Status Akun</p>
                  <span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                    Aktif
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {editing ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <form
              onSubmit={handleSubmit}
              className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Edit Profil</h3>
                  <p className="text-sm font-semibold text-slate-500">
                    Perubahan ini masih frontend state. Sambungkan ke API profile jika backend sudah tersedia.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-slate-600"
                >
                  Tutup
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["name", "Nama Lengkap"],
                  ["job", "Jabatan"],
                  ["unit", "Unit"],
                  ["email", "Email"],
                  ["phone", "No. HP"],
                  ["username", "Username"],
                  ["nik", "NIK"],
                  ["birthDate", "Tanggal Lahir"],
                ].map(([field, label]) => (
                  <label key={field} className="space-y-2">
                    <span className="block text-sm font-black text-slate-700">{label}</span>
                    <input
                      type={field === "birthDate" ? "date" : "text"}
                      value={draft[field as keyof ProfileForm]}
                      onChange={(event) =>
                        updateField(field as keyof ProfileForm, event.target.value)
                      }
                      className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-800 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                ))}

                <label className="space-y-2 md:col-span-2">
                  <span className="block text-sm font-black text-slate-700">Alamat</span>
                  <textarea
                    value={draft.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    rows={3}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-[#156eea] px-5 py-3 text-sm font-black text-white"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}
