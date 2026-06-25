import Link from "next/link";
import { AuthShell } from "@/app/components/auth/AuthShell";
import { PasswordField } from "@/app/components/auth/PasswordField";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Buat Akun Baru"
      description="Daftarkan akun tenaga kesehatan atau staf administrasi untuk mulai menggunakan layanan Medisystem HIS."
    >
      <form className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-bold text-slate-700">
            Nama Lengkap
          </span>
          <input
            type="text"
            name="name"
            placeholder="Masukkan nama lengkap"
            className="h-11 w-full rounded-xl border border-[#dce8f6] bg-white px-4 text-sm outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold text-slate-700">
            Email
          </span>
          <input
            type="email"
            name="email"
            placeholder="email@rumahsakit.ac.id"
            className="h-11 w-full rounded-xl border border-[#dce8f6] bg-white px-4 text-sm outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold text-slate-700">
            Nomor HP
          </span>
          <input
            type="tel"
            name="phone"
            placeholder="08xxxxxxxxxx"
            className="h-11 w-full rounded-xl border border-[#dce8f6] bg-white px-4 text-sm outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold text-slate-700">
            Username
          </span>
          <input
            type="text"
            name="username"
            placeholder="Buat username"
            className="h-11 w-full rounded-xl border border-[#dce8f6] bg-white px-4 text-sm outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <PasswordField
          id="password"
          label="Password"
          placeholder="Minimal 8 karakter"
        />

        <PasswordField
          id="confirmPassword"
          label="Konfirmasi Password"
          placeholder="Ulangi password"
        />

        <label className="block">
          <span className="mb-2 block text-xs font-bold text-slate-700">
            Role Awal
          </span>
          <select
            name="role"
            className="h-11 w-full rounded-xl border border-[#dce8f6] bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
            defaultValue=""
          >
            <option value="" disabled>
              Pilih role
            </option>
            <option value="admin">Admin</option>
            <option value="dokter">Dokter</option>
            <option value="perawat">Perawat</option>
            <option value="apoteker">Apoteker</option>
            <option value="pasien">Pasien</option>
          </select>
        </label>

        <label className="flex items-start gap-2 text-xs font-medium leading-5 text-slate-500">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#156eea]"
          />
          <span>
            Saya menyetujui Syarat & Ketentuan dan Kebijakan Privasi.
          </span>
        </label>

        <button
          type="button"
          className="h-12 w-full rounded-xl bg-gradient-to-r from-[#156eea] to-[#075acb] text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          Daftar
        </button>

        <p className="text-center text-xs font-medium text-slate-500">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-extrabold text-[#156eea] hover:text-[#075acb]"
          >
            Masuk di sini
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}