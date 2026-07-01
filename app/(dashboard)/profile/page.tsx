"use client";

import { DashboardShell } from "@/app/components/dashboard/DashboardShell";
import { useDashboardUser } from "@/app/components/dashboard/useDashboardUser";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { user } = useDashboardUser();

  return (
    <DashboardShell
      title="Profil Saya"
      activeMenu="profile"
      role={user.role}
      user={user}
    >
      <div className={styles.page}>

        <div className={styles.header}>
          <div className={styles.avatar}>
            {user.avatarInitials}
          </div>

          <div>
            <h2 className={styles.name}>{user.name}</h2>
            <p className={styles.role}>{user.roleLabel}</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.row}>
            <span>Username</span>
            <b>{user.username}</b>
          </div>

          <div className={styles.row}>
            <span>Email</span>
            <b>{user.email}</b>
          </div>

          <div className={styles.row}>
            <span>Role</span>
            <b>{user.role}</b>
          </div>
        </div>

      </div>
    </DashboardShell>
  );
}