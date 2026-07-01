"use client";

import { DashboardShell } from "@/app/components/dashboard/DashboardShell";
import { useDashboardUser } from "@/app/components/dashboard/useDashboardUser";

export default function ProfilePage() {
  const { user } = useDashboardUser("dokter");

  return (
    <DashboardShell
      title="Profil Saya"
      activeMenu="profile"
      role="dokter"
    >
      <div style={{ padding: 20 }}>
        <h2>Profil Saya</h2>

        <p>{user.name}</p>
        <p>{user.role}</p>
        <p>{user.username}</p>
        <p>{user.email}</p>
      </div>
    </DashboardShell>
  );
}