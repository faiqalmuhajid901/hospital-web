"use client";

import type { ReactNode } from "react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
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

function normalizeRole(
  role?: string | null
): DashboardRole {
  const normalizedRole = role
    ?.trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");

  if (!normalizedRole) {
    return "guest";
  }

  if (normalizedRole === "super_admin") {
    return "super_admin";
  }

  if (normalizedRole === "admin") {
    return "admin";
  }

  if (
    normalizedRole === "dokter" ||
    normalizedRole === "doctor"
  ) {
    return "dokter";
  }

  if (
    normalizedRole === "pasien" ||
    normalizedRole === "patient"
  ) {
    return "pasien";
  }

  if (
    normalizedRole === "perawat" ||
    normalizedRole === "nurse"
  ) {
    return "perawat";
  }

  if (
    [
      "apoteker",
      "pharmacist",
      "pharmacy",
      "farmasi",
    ].includes(normalizedRole)
  ) {
    return "apoteker";
  }

  if (
    [
      "laboratorium",
      "laboratory",
      "lab",
    ].includes(normalizedRole)
  ) {
    return "laboratorium";
  }

  return "guest";
}

function getRoleLabel(role: DashboardRole) {
  const labels: Record<DashboardRole, string> = {
    guest: "Tamu",
    admin: "Admin",
    super_admin: "Super Admin",
    dokter: "Dokter",
    pasien: "Pasien",
    perawat: "Perawat",
    apoteker: "Apoteker",
    laboratorium: "Laboratorium",
  };

  return labels[role] ?? "Tamu";
}

function getInitials(name?: string | null) {
  if (!name?.trim()) {
    return "U";
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
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
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const [
    isClientReady,
    setIsClientReady,
  ] = useState(false);

  const [
    sessionUser,
    setSessionUser,
  ] = useState<DashboardUser | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCurrentUser() {
      let resolvedSessionUser: DashboardUser | null =
        null;

      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Gagal mengambil data pengguna: ${response.status}`
          );
        }

        const data =
          (await response.json()) as AuthMeResponse;

        if (
          data.authenticated &&
          data.user
        ) {
          const resolvedRole = normalizeRole(
            data.user.role
          );

          const resolvedName =
            data.user.name?.trim() ||
            user?.name?.trim() ||
            defaultUser.name;

          resolvedSessionUser = {
            id: data.user.id,
            name: resolvedName,
            role: resolvedRole,
            roleLabel:
              data.user.roleLabel?.trim() ||
              user?.roleLabel?.trim() ||
              getRoleLabel(resolvedRole),
            avatarInitials:
              data.user.avatarInitials?.trim() ||
              user?.avatarInitials?.trim() ||
              getInitials(resolvedName),
          };
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        resolvedSessionUser = null;
      }

      if (!controller.signal.aborted) {
        setSessionUser(resolvedSessionUser);
        setIsClientReady(true);
      }
    }

    void loadCurrentUser();

    return () => {
      controller.abort();
    };
  }, [
    user?.name,
    user?.roleLabel,
    user?.avatarInitials,
  ]);

  const currentUser =
    useMemo<DashboardUser>(() => {
      if (sessionUser) {
        return sessionUser;
      }

      const resolvedRole = isClientReady
        ? normalizeRole(role)
        : "guest";

      const resolvedName =
        user?.name?.trim() ||
        defaultUser.name;

      return {
        id: user?.id,
        name: resolvedName,
        role: resolvedRole,
        roleLabel:
          user?.roleLabel?.trim() ||
          getRoleLabel(resolvedRole),
        avatarInitials:
          user?.avatarInitials?.trim() ||
          getInitials(resolvedName),
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

  function toggleNotification() {
    setNotificationOpen((current) => !current);
    setUserMenuOpen(false);
  }

  function toggleUserMenu() {
    setUserMenuOpen((current) => !current);
    setNotificationOpen(false);
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
                  aria-expanded={sidebarOpen}
                >
                  <span />
                  <span />
                  <span />
                </button>
              ) : null}

              <div>
                <p className={styles.topbarKicker}>
                  Medisystem HIS
                </p>

                <h1 className={styles.topbarTitle}>
                  {title}
                </h1>
              </div>
            </div>

            <div className={styles.topbarActions}>
              <div className={styles.actionWrapper}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={toggleNotification}
                  aria-label="Buka notifikasi"
                  aria-expanded={notificationOpen}
                >
                  <span className={styles.dot} />
                </button>

                {notificationOpen ? (
                  <div className={styles.dropdown}>
                    <p
                      className={
                        styles.dropdownTitle
                      }
                    >
                      Notifikasi
                    </p>

                    <p
                      className={
                        styles.dropdownText
                      }
                    >
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
                  onClick={toggleUserMenu}
                  aria-label="Buka menu pengguna"
                  aria-expanded={userMenuOpen}
                >
                  <span
                    className={
                      styles.userAvatarSmall
                    }
                  >
                    {currentUser.avatarInitials}
                  </span>

                  <span className={styles.userText}>
                    <span
                      className={styles.userName}
                    >
                      {currentUser.name}
                    </span>

                    <span
                      className={styles.userRole}
                    >
                      {currentUser.roleLabel}
                    </span>
                  </span>
                </button>

                {userMenuOpen ? (
                  <div
                    className={styles.userDropdown}
                  >
                    <a href="/profile">
                      Profil Saya
                    </a>

                    <a href="/change-password">
                      Ubah Password
                    </a>

                    <a href="/logout">
                      Logout
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <section className={styles.content}>
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}

export default DashboardShell;