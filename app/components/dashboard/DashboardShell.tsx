import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import styles from "./DashboardShell.module.css";

type DashboardShellProps = {
  children: ReactNode;
  title: string;
  activeMenu?: string;
};

export function DashboardShell({
  children,
  title,
  activeMenu,
}: DashboardShellProps) {
  return (
    <main className={styles.dashboard}>
      <div className={styles.layout}>
        <Sidebar activeMenu={activeMenu} />

        <section className={styles.mainArea}>
          <header className={styles.topbar}>
            <div>
              <p className={styles.topbarKicker}>Medisystem HIS</p>
              <h1 className={styles.topbarTitle}>{title}</h1>
            </div>

            <div className={styles.topbarActions}>
              <button type="button" className={styles.iconButton}>
                🔔
                <span className={styles.dot} />
              </button>

              <button type="button" className={styles.iconButton}>
                💬
                <span className={styles.dot} />
              </button>

              <div className={styles.userChip}>
                <div className={styles.userAvatarSmall}>AP</div>

                <div>
                  <p className={styles.userName}>dr. Azita Putri</p>
                  <p className={styles.userRole}>Dokter Umum</p>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.content}>{children}</div>
        </section>
      </div>
    </main>
  );
}