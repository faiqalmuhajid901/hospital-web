import Link from "next/link";
import { AuthShell } from "../../components/auth/AuthShell";
import { PasswordField } from "../../components/auth/PasswordField";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Reset Password"
      mode="lock"
      description="Buat password baru untuk mengamankan akun Medisystem HIS Anda."
    >
      <form className="space-y-5">
        <PasswordField
          id="newPassword"
          label="Password Baru"
          placeholder="Minimal 8 karakter"
        />

        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="mb-3 text-xs font-extrabold text-slate-700">
            Password harus mengandung:
          </p>

          <ul className="space-y-2 text-xs font-medium text-slate-500">
            <li className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-600">
                ✓
              </span>
              Minimal 8 karakter
            </li>

            <li className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-600">
                ✓
              </span>
              Huruf besar dan kecil
            </li>

            <li className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-600">
                ✓
              </span>
              Angka
            </li>

            <li className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-600">
                ✓
              </span>
              Simbol, contoh: !@#$%
            </li>
          </ul>
        </div>

        <PasswordField
          id="confirmNewPassword"
          label="Konfirmasi Password"
          placeholder="Ulangi password baru"
        />

        <button
          type="button"
          className="h-12 w-full rounded-xl bg-linear-to-r from-[#156eea] to-[#075acb] text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          Reset Password
        </button>

        <p className="text-center text-xs font-medium text-slate-500">
          Sudah ingat password?{" "}
          <Link
            href="/login"
            className="font-extrabold text-[#156eea] hover:text-[#075acb]"
          >
            Kembali ke login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}