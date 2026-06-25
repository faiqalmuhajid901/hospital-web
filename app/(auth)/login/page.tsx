import Link from "next/link";
import { AuthShell } from "@/app/components/auth/AuthShell";
import { PasswordField } from "@/app/components/auth/PasswordField";

export default function LoginPage() {
  return (
    <AuthShell
      title="Selamat Datang 👋"
      description="Masuk ke dashboard rumah sakit untuk mengelola pasien, dokter, jadwal, antrean, apotek, pembayaran, dan laporan operasional."
    >
      <form className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-bold text-slate-700">
            Email atau Username
          </span>
          <input
            type="text"
            name="identity"
            placeholder="contoh@rumahsakit.ac.id"
            className="h-12 w-full rounded-xl border border-[#dce8f6] bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <PasswordField id="password" label="Password" />

        <div className="flex items-center justify-between gap-4 text-xs">
          <label className="flex items-center gap-2 font-medium text-slate-500">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 accent-[#156eea]"
            />
            Ingat saya
          </label>

          <Link
            href="/forgot-password"
            className="font-bold text-[#156eea] hover:text-[#075acb]"
          >
            Lupa password?
          </Link>
        </div>

        <button
          type="button"
          className="h-12 w-full rounded-xl bg-gradient-to-r from-[#156eea] to-[#075acb] text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          Masuk
        </button>

        <div className="relative py-1 text-center">
          <span className="relative z-10 bg-white px-3 text-xs font-semibold text-slate-400">
            atau masuk dengan
          </span>
          <div className="absolute left-0 top-1/2 h-px w-full bg-slate-100" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="h-11 rounded-xl border border-[#dce8f6] bg-white text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
          >
            SSO Hospital
          </button>

          <button
            type="button"
            className="h-11 rounded-xl border border-[#dce8f6] bg-white text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
          >
            Google
          </button>
        </div>

        <p className="text-center text-xs font-medium text-slate-500">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-extrabold text-[#156eea] hover:text-[#075acb]"
          >
            Daftar sekarang
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}