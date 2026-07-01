"use client";

import { DashboardShell } from "../../../components/dashboard/DashboardShell";
import styles from "./superAdminDashboard.module.css";

const stats = [
  { label: "Total Pengguna", value: "128" },
  { label: "Dokter", value: "32" },
  { label: "Pasien", value: "845" },
  { label: "Transaksi Hari Ini", value: "54" },
];

const systemActivity = [
  {
    module: "User Management",
    action: "Tambah user baru",
    user: "Admin",
    time: "10:30",
  },
  {
    module: "Role Management",
    action: "Update role dokter",
    user: "Super Admin",
    time: "09:45",
  },
  {
    module: "Audit Log",
    action: "Melihat log sistem",
    user: "Admin",
    time: "08:20",
  },
];

export default function SuperAdmin() {
  return (
    <DashboardShell title="Super Admin Dashboard" activeMenu="dashboard-admin" role="admin">
      <div className={styles.page}>

        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>System Overview</h2>
            <p className={styles.subtitle}>
              Monitoring seluruh aktivitas sistem rumah sakit
            </p>
          </div>

          <div className={styles.badge}>
            Super Admin Panel
          </div>
        </div>

        {/* STATS */}
        <div className={styles.statsGrid}>
          {stats.map((item) => (
            <div key={item.label} className={styles.card}>
              <p className={styles.label}>{item.label}</p>
              <p className={styles.value}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* ACTIVITY */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Aktivitas Sistem</h3>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Action</th>
                  <th>User</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {systemActivity.map((item, index) => (
                  <tr key={index}>
                    <td>{item.module}</td>
                    <td>{item.action}</td>
                    <td>{item.user}</td>
                    <td>{item.time}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </DashboardShell>
  );
}