"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "./Sidebar";
import type { DashboardRole } from "../types/menu";
import styles from "./DashboardShell.module.css";

type DashboardUser = {
  id?: number | string;
  name: string;
  role: DashboardRole;
  roleLabel: string;
  avatarInitials: string;
};

type AuthMeResponse = {
  authenticated: boolean;
  user?: {
    id?: number | string;
    name?: string | null;
    username?: string | null;
    email?: string | null;
    phone?: string | null;
    status?: string | null;
    role?: string | null;
    roleLabel?: string | null;
    avatarInitials?: string | null;
  };
};

type DashboardShellProps = {
  children: ReactNode;
  title: string;
  activeMenu?: string;
  role?: DashboardRole;
  user?: Partial<DashboardUser>;
};

function normalizeRole(role?: string | null): DashboardRole {
  const normalizedRole = role?.trim().toLowerCase();

  if (!normalizedRole) return "guest";

  if (["super-admin"].includes(normalizedRole)) {
    return "super_admin";
  }

  if (["admin"].includes(normalizedRole)) {
    return "admin";
  }

  if (["dokter"].includes(normalizedRole)) {
    return "dokter";
  }

  if (["patient", "pasien"].includes(normalizedRole)) {
    return "pasien";
  }

  if (["nurse", "perawat"].includes(normalizedRole)) {
    return "perawat";
  }

  if (
    ["pharmacy", "farmasi", "apoteker", "pharmacist"].includes(normalizedRole)
  ) {
    return "apoteker";
  }

  if (["lab", "laboratory", "laboratorium"].includes(normalizedRole)) {
    return "laboratorium";
  }

  return "guest";
}

function getRoleLabel(role: DashboardRole) {
  const labels: Record<DashboardRole, string> = {
    guest: "Tamu",
    admin: "Admin",
    super_admin: "Super-admin",
    dokter: "Dokter",
    pasien: "Pasien",
    perawat: "Perawat",
    apoteker: "Apoteker",
    laboratorium: "Laboratorium",
  };

  return labels[role] ?? "Tamu";
}

function getInitials(name?: string | null) {
  if (!name) return "U";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "U";
}

const defaultUser: DashboardUser = {
  name: "User",
  role: "guest",
  roleLabel: "Tamu",
  avatarInitials: "U",
};

export function DashboardShell({
  children,
  title,
  activeMenu,
  role,
  user,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const [isClientReady, setIsClientReady] = useState(false);
  const [sessionUser, setSessionUser] = useState<DashboardUser | null>(null);

  useEffect(() => {
    let isMounted = true;

    setHasMounted(true);

    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (isMounted) {
            setSessionUser(null);
            setIsClientReady(true);
          }

          return;
        }

        const data = (await response.json()) as AuthMeResponse;

        if (!isMounted) return;

        if (!data.authenticated || !data.user) {
          setSessionUser(null);
          setIsClientReady(true);
          return;
        }

        const resolvedRole = normalizeRole(data.user.role);
        const resolvedName = data.user.name ?? user?.name ?? defaultUser.name;

        setSessionUser({
          id: data.user.id,
          name: resolvedName,
          role: resolvedRole,
          roleLabel:
            data.user.roleLabel ??
            user?.roleLabel ??
            getRoleLabel(resolvedRole),
          avatarInitials:
            data.user.avatarInitials ??
            user?.avatarInitials ??
            getInitials(resolvedName),
        });

        setIsClientReady(true);
      } catch {
        if (isMounted) {
          setSessionUser(null);
          setIsClientReady(true);
        }
      }
    }

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [user?.name, user?.roleLabel, user?.avatarInitials]);

  const currentUser = useMemo<DashboardUser>(() => {
    if (!hasMounted) {
      return defaultUser;
    }
    if (sessionUser) {
      return sessionUser;
    }

    const resolvedRole = isClientReady ? normalizeRole(role) : "guest";
    const resolvedName = user?.name ?? defaultUser.name;

    return {
      id: user?.id,
      name: resolvedName,
      role: resolvedRole,
      roleLabel: user?.roleLabel ?? getRoleLabel(resolvedRole),
      avatarInitials: user?.avatarInitials ?? getInitials(resolvedName),
    };
  }, [
    sessionUser,
    isClientReady,
    role,
    user?.id,
    user?.name,
    user?.roleLabel,
    user?.avatarInitials,
  ]);

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
          role={currentUser.role}
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
                  <span className={styles.userAvatarSmall}>
                    {currentUser.avatarInitials}
                  </span>

                  <span className={styles.userText}>
                    <span className={styles.userName}>{currentUser.name}</span>
                    <span className={styles.userRole}>
                      {currentUser.roleLabel}
                    </span>
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