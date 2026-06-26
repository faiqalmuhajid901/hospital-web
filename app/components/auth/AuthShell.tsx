import type { ReactNode } from "react";
import { BrandMark } from "./BrandMark";
import styles from "./AuthShell.module.css";

type AuthShellProps = {
  children: ReactNode;
  title: string;
  description: string;
  mode?: "hospital" | "mail" | "lock";
};

function HospitalIllustration() {
  return (
    <div className="relative mx-auto mt-10 h-56 w-full max-w-[310px]">
      <div className="absolute bottom-0 left-8 h-36 w-48 rounded-t-3xl border border-blue-100 bg-white/85 shadow-xl shadow-blue-100">
        <div className="absolute left-5 top-5 h-5 w-20 rounded-full bg-blue-100" />

        <div className="absolute left-5 top-14 grid grid-cols-4 gap-2">
          {Array.from({ length: 16 }).map((_, index) => (
            <span
              key={index}
              className="h-4 w-6 rounded bg-linear-to-b from-[#d9f3ff] to-[#a9dcff]"
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 right-8 h-48 w-32 rounded-t-4xl border border-blue-100 bg-linear-to-b from-white to-[#dff4ff] shadow-2xl shadow-blue-100">
        <div className="mx-auto mt-5 h-6 w-16 rounded-full bg-[#156eea]/10" />

        <div className="mx-auto mt-6 grid w-20 grid-cols-3 gap-2">
          {Array.from({ length: 18 }).map((_, index) => (
            <span key={index} className="h-4 rounded bg-white shadow-sm" />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 h-14 w-16 -translate-x-1/2 rounded-t-2xl bg-[#156eea]" />
      <div className="absolute bottom-0 left-3 h-5 w-[92%] rounded-t-2xl bg-[#17bfd0]/20" />
    </div>
  );
}

function MailIllustration() {
  return (
    <div className="relative mx-auto mt-12 h-56 w-full max-w-[300px]">
      <div className="absolute left-1/2 top-12 h-32 w-48 -translate-x-1/2 rounded-3xl border border-blue-100 bg-white shadow-2xl shadow-blue-100">
        <div className="absolute inset-x-0 top-0 h-20 rounded-t-3xl bg-linear-to-br from-[#eaf7ff] to-white" />

        <div className="absolute left-8 top-12 h-12 w-32 rounded-2xl border border-blue-100 bg-white" />
        <div className="absolute left-10 top-16 h-2 w-20 rounded bg-blue-100" />
        <div className="absolute left-10 top-[5.5rem] h-2 w-28 rounded bg-cyan-100" />
      </div>

      <div className="absolute left-9 top-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-[#13bfd3] to-[#156eea] text-3xl font-black text-white shadow-xl shadow-cyan-100">
        ?
      </div>

      <div className="absolute bottom-5 right-10 h-12 w-12 rounded-2xl bg-white shadow-lg">
        <div className="mx-auto mt-3 h-6 w-6 rounded-full bg-[#156eea]/10" />
      </div>
    </div>
  );
}

function LockIllustration() {
  return (
    <div className="relative mx-auto mt-12 h-56 w-full max-w-[300px]">
      <div className="absolute bottom-8 left-1/2 h-28 w-36 -translate-x-1/2 rounded-3xl border border-blue-100 bg-white shadow-2xl shadow-blue-100">
        <div className="absolute left-1/2 top-8 h-14 w-14 -translate-x-1/2 rounded-2xl bg-linear-to-br from-[#13bfd3] to-[#156eea] shadow-xl shadow-cyan-100">
          <div className="absolute left-1/2 top-5 h-4 w-4 -translate-x-1/2 rounded-full bg-white" />
          <div className="absolute left-1/2 top-8 h-5 w-1.5 -translate-x-1/2 rounded-full bg-white" />
        </div>
      </div>

      <div className="absolute left-1/2 top-8 h-20 w-20 -translate-x-1/2 rounded-3xl bg-[#102033] shadow-xl">
        <div className="absolute left-1/2 top-[-22px] h-12 w-12 -translate-x-1/2 rounded-t-full border-[7px] border-[#102033] border-b-0" />
        <div className="absolute left-1/2 top-8 h-5 w-5 -translate-x-1/2 rounded-full bg-white" />
        <div className="absolute left-1/2 top-12 h-7 w-2 -translate-x-1/2 rounded-full bg-white" />
      </div>

      <div className="absolute bottom-10 left-11 h-8 w-8 rounded-full bg-cyan-100" />
      <div className="absolute bottom-16 right-12 h-10 w-10 rounded-2xl bg-blue-100" />
      <div className="absolute bottom-4 right-20 h-4 w-4 rounded-full bg-[#13bfd3]/30" />
    </div>
  );
}

function AuthIllustration({ mode }: { mode: "hospital" | "mail" | "lock" }) {
  if (mode === "mail") return <MailIllustration />;
  if (mode === "lock") return <LockIllustration />;

  return <HospitalIllustration />;
}

export function AuthShell({
  children,
  title,
  description,
  mode = "hospital",
}: AuthShellProps) {
  return (
    <main
      className={`${styles.gridBg} min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-8`}
    >
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-6xl items-center justify-center">
        <section
          className={`${styles.panelShadow} grid w-full overflow-hidden rounded-4xl border border-white/80 bg-white/72 backdrop-blur-xl lg:grid-cols-[0.92fr_1.08fr]`}
        >
          <aside className="relative hidden min-h-[690px] flex-col overflow-hidden bg-linear-to-br from-[#eef8ff] via-white to-[#f7fbff] px-10 py-9 lg:flex">
            <BrandMark />

            <div className="mt-16 max-w-[290px]">
              <p className="mb-4 text-sm font-bold text-[#156eea]">
                Sistem Informasi Manajemen Rumah Sakit
              </p>

              <h1 className="text-3xl font-black leading-tight tracking-tight text-[#102033]">
                {mode === "lock"
                  ? "Buat password baru yang lebih aman."
                  : "Terintegrasi, aman, dan mudah digunakan."}
              </h1>

              <p className="mt-5 text-sm leading-7 text-slate-500">
                {description}
              </p>
            </div>

            <AuthIllustration mode={mode} />

            <div className={styles.wave} />
          </aside>

          <section className="flex min-h-[690px] items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
            <div className="w-full max-w-[420px]">
              <div className="mb-8 flex justify-center lg:hidden">
                <BrandMark />
              </div>

              <div
                className={`${styles.cardShadow} rounded-[1.6rem] border border-white bg-white px-6 py-7 sm:px-8`}
              >
                <div className="mb-7">
                  <p className="text-sm font-bold text-[#156eea]">{title}</p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102033]">
                    {title}
                  </h2>
                </div>

                {children}
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}