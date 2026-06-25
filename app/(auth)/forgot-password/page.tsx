import Link from "next/link";
import { AuthShell } from "@/app/components/auth/AuthShell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Lupa Password"
      mode="mail"
      description="Masukkan email akun Anda. Sistem akan mengirimkan tautan pemulihan untuk membuat password baru."
    >
      <form className="space-y-5">
        <p className="rounded-2xl bg-blue-50 px-4 py-3 text-sm leading-6 text-slate-600">
          Masukkan email yang terdaftar pada akun Medisystem HIS. Tautan reset
          password akan dikirimkan ke email Anda.
        </p>

        <label className="block">
          <span className="mb-2 block text-xs font-bold text-slate-700">
            Email
          </span>
          <input
            type="email"
            name="email"
            placeholder="email@rumahsakit.ac.id"
            className="h-12 w-full rounded-xl border border-[#dce8f6] bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <button
          type="button"
          className="h-12 w-full rounded-xl bg-gradient-to-r from-[#156eea] to-[#075acb] text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          Kirim Tautan Reset
        </button>

        <p className="text-center text-xs font-medium text-slate-500">
          Ingat password?{" "}
          <Link
            href="/login"
            className="font-extrabold text-[#156eea] hover:text-[#075acb]"
          >
            Kembali ke halaman login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}