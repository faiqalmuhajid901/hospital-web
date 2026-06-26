import Link from "next/link";
import { BrandMark } from "../../components/auth/BrandMark";
import styles from "../../components/auth/AuthShell.module.css";

export default function LogoutPage() {
  return (
    <main
      className={`${styles.gridBg} min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-8`}
    >
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-4xl items-center justify-center">
        <section
          className={`${styles.panelShadow} relative flex min-h-[640px] w-full items-center justify-center overflow-hidden rounded-4xl border border-white/80 bg-white/72 px-6 py-10 backdrop-blur-xl`}
        >
          <div className="absolute left-8 top-8">
            <BrandMark />
          </div>

          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-[#13bfd3] to-[#12b886] shadow-2xl shadow-emerald-100">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-16 w-16 fill-none stroke-white stroke-[2.8]"
              >
                <path
                  d="M5 12.5 9.2 16.5 19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#102033]">
              Anda telah berhasil keluar
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
              Terima kasih telah menggunakan Medisystem HIS. Silakan masuk
              kembali untuk melanjutkan pengelolaan data rumah sakit.
            </p>

            <Link
              href="/login"
              className="mt-9 flex h-12 min-w-48 items-center justify-center rounded-xl bg-linear-to-r from-[#156eea] to-[#075acb] px-8 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Kembali ke Login
            </Link>
          </div>

          <div className={styles.wave} />
        </section>
      </div>
    </main>
  );
}