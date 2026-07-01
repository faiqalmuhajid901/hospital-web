"use client";

import { useEffect, useState } from "react";
import type { DashboardRole } from "../types/menu";

export type DashboardUser = {
  id?: number | string;
  name: string;
  username?: string | null;
  email?: string | null;
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
    role?: string | null;
    roleLabel?: string | null;
    avatarInitials?: string | null;
  };
};

function normalizeRole(role?: string | null): DashboardRole {
  const normalizedRole = role?.trim().toLowerCase();

  if (!normalizedRole) return "guest";
  if (normalizedRole === "admin") return "admin";
  if (["super_admin"].includes(normalizedRole)) return "super_admin";
  if (["dokter"].includes(normalizedRole)) return "dokter";
  if (["pasien"].includes(normalizedRole)) return "pasien";
  if (["perawat"].includes(normalizedRole)) return "perawat";
  if (["apoteker"].includes(normalizedRole)) return "apoteker";
  if (["laboratorium"].includes(normalizedRole)) return "laboratorium";

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

  return labels[role];
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

function getDisplayName(user?: AuthMeResponse["user"]) {
  if (!user) return "User";

  if (user.name && user.name.trim()) {
    return user.name;
  }

  if (user.username && user.username.trim()) {
    return user.username;
  }

  return "User";
}

export function useDashboardUser(fallbackRole?: DashboardRole) {
  const [loading, setLoading] = useState(true);
  const [dashboardUser, setDashboardUser] = useState<DashboardUser>({
    name: "User",
    role: fallbackRole ?? "guest",
    roleLabel: getRoleLabel(fallbackRole ?? "guest"),
    avatarInitials: "U",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (isMounted) setLoading(false);
          return;
        }

        const data = (await response.json()) as AuthMeResponse;

        if (!isMounted || !data.authenticated || !data.user) {
          if (isMounted) setLoading(false);
          return;
        }

        const role = normalizeRole(data.user.role);
        const name = getDisplayName(data.user);

        setDashboardUser({
          id: data.user.id,
          name,
          username: data.user.username,
          role,
          roleLabel: data.user.roleLabel ?? getRoleLabel(role),
          avatarInitials: data.user.avatarInitials ?? getInitials(name),
        });
      } catch {
        // fallback tetap dipakai
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [fallbackRole]);

  return {
    loading,
    user: dashboardUser,
  };
}