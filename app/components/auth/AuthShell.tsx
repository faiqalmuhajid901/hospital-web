import type { ReactNode } from "react";

import { BrandMark } from "./BrandMark";
import styles from "./AuthShell.module.css";


type AuthMode =
  | "hospital"
  | "mail"
  | "lock";


type AuthShellProps = {
  children: ReactNode;
  title: string;
  description: string;
  mode?: AuthMode;
};


function HospitalIllustration() {
  return (
    <div className={styles.hospitalIllustration}>
      <div className={styles.hospitalBuildingLeft}>
        <div className={styles.buildingHeader} />

        <div className={styles.buildingWindows}>
          {Array.from({ length: 16 }).map(
            (_, index) => (
              <span
                key={index}
                className={styles.window}
              />
            )
          )}
        </div>
      </div>

      <div className={styles.hospitalBuildingRight}>
        <div className={styles.rightBuildingHeader} />

        <div className={styles.rightBuildingWindows}>
          {Array.from({ length: 18 }).map(
            (_, index) => (
              <span
                key={index}
                className={styles.rightWindow}
              />
            )
          )}
        </div>
      </div>

      <div className={styles.entrance} />
      <div className={styles.ground} />
    </div>
  );
}


function MailIllustration() {
  return (
    <div className={styles.mailIllustration}>
      <div className={styles.mailCard}>
        <div className={styles.mailCardTop} />
        <div className={styles.mailInner} />

        <div className={styles.mailLinePrimary} />
        <div className={styles.mailLineSecondary} />
      </div>

      <div className={styles.questionBadge}>
        ?
      </div>

      <div className={styles.mailDecoration}>
        <div className={styles.mailDecorationInner} />
      </div>
    </div>
  );
}


function LockIllustration() {
  return (
    <div className={styles.lockIllustration}>
      <div className={styles.lockCard}>
        <div className={styles.lockBadge}>
          <div className={styles.lockBadgeCircle} />
          <div className={styles.lockBadgeStem} />
        </div>
      </div>

      <div className={styles.mainLock}>
        <div className={styles.lockShackle} />
        <div className={styles.lockKeyCircle} />
        <div className={styles.lockKeyStem} />
      </div>

      <div className={styles.lockDecorationLeft} />
      <div className={styles.lockDecorationRight} />
      <div className={styles.lockDecorationSmall} />
    </div>
  );
}


function AuthIllustration({
  mode,
}: {
  mode: AuthMode;
}) {
  if (mode === "mail") {
    return <MailIllustration />;
  }

  if (mode === "lock") {
    return <LockIllustration />;
  }

  return <HospitalIllustration />;
}


export function AuthShell({
  children,
  title,
  description,
  mode = "hospital",
}: AuthShellProps) {
  return (
    <main className={styles.root}>
      <div className={styles.container}>
        <section className={styles.panel}>
          <aside className={styles.leftPanel}>
            <BrandMark />

            <div className={styles.intro}>
              <p className={styles.eyebrow}>
                Sistem Informasi Manajemen Rumah Sakit
              </p>

              <h1 className={styles.heading}>
                {mode === "lock"
                  ? "Buat password baru yang lebih aman."
                  : "Terintegrasi, aman, dan mudah digunakan."}
              </h1>

              <p className={styles.description}>
                {description}
              </p>
            </div>

            <AuthIllustration mode={mode} />

            <div
              aria-hidden="true"
              className={styles.wave}
            />
          </aside>

          <section className={styles.rightPanel}>
            <div className={styles.formContainer}>
              <div className={styles.mobileBrand}>
                <BrandMark />
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <p className={styles.cardEyebrow}>
                    {title}
                  </p>

                  <h2 className={styles.cardTitle}>
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