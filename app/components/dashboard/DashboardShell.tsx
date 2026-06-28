"use client";

import type { ReactNode } from "react";
import { useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function toggleSidebar() {
    setSidebarOpen((current) => !current);
  }

  function closeMobileSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.layout}>
        <Sidebar
          activeMenu={activeMenu}
          isOpen={sidebarOpen}
          onClose={closeMobileSidebar}
        />

        <main className={styles.mainArea}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              {!sidebarOpen ? (
                <button
                  type="button"
                  className={styles.menuButton}
                  onClick={toggleSidebar}
                  aria-label="Buka sidebar"
                >
                  <span />
                  <span />
                  <span />
                </button>
              ) : null}

              <div>
                <p className={styles.topbarKicker}>Medisystem HIS</p>
                <h1 className={styles.topbarTitle}>{title}</h1>
              </div>
            </div>

            <div className={styles.topbarActions}>
              <div className={styles.actionWrapper}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setNotificationOpen((current) => !current)}
                  aria-label="Buka notifikasi"
                >
                  <span className={styles.dot} />
                </button>

                {notificationOpen ? (
                  <div className={styles.dropdown}>
                    <p className={styles.dropdownTitle}>Notifikasi</p>
                    <p className={styles.dropdownText}>
                      Belum ada notifikasi baru.
                    </p>
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                className={styles.iconButton}
                aria-label="Pesan sistem"
              >
                <span className={styles.dot} />
              </button>

              <div className={styles.actionWrapper}>
                <button
                  type="button"
                  className={styles.userChip}
                  onClick={() => setUserMenuOpen((current) => !current)}
                >
                  <span className={styles.userAvatarSmall}>AP</span>
                  <span className={styles.userText}>
                    <span className={styles.userName}>dr. Azita Putri</span>
                    <span className={styles.userRole}>Dokter Umum</span>
                  </span>
                </button>

                {userMenuOpen ? (
                  <div className={styles.userDropdown}>
                    <a href="/profile">Profil Saya</a>
                    <a href="/change-password">Ubah Password</a>
                    <a href="/logout">Logout</a>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <section className={styles.content}>{children}</section>
        </main>
      </div>
    </div>
  );
}

export default DashboardShell;