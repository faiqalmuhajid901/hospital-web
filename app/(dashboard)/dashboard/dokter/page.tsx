"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";
import styles from "./dokterDashboard.module.css";

type User = {
  name: string;
  role: string;
  avatar: string;
};

export default function DokterDashboardPage() {
  const [user, setUser] = useState<User>({
    name: "Loading...",
    role: "dokter",
    avatar: "DR",
  });

  const [selectedDate, setSelectedDate] = useState("12 Mei 2026");

  const dateOptions = ["12 Mei 2026", "13 Mei 2026", "14 Mei 2026"];

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (data?.user) {
          setUser({
            name: data.user.name || data.user.username,
            role: data.user.role,
            avatar:
              data.user.avatarInitials ||
              (data.user.name?.substring(0, 2).toUpperCase() ?? "DR"),
          });
        }
      } catch (err) {
        console.log(err);
      }
    }

    loadUser();
  }, []);

  const stats = [
    { label: "Pasien Hari Ini", value: "18" },
    { label: "Selesai", value: "10" },
    { label: "Menunggu", value: "8" },
    { label: "Rujukan", value: "2" },
  ];

  const schedule = [
    { time: "08:00", patient: "Andi Pratama", mrn: "0001345", status: "Selesai" },
    { time: "08:30", patient: "Siti Aisyah", mrn: "0002345", status: "Selesai" },
    { time: "09:00", patient: "Budi Santoso", mrn: "0003247", status: "Menunggu" },
    { time: "09:30", patient: "Dewi Lestari", mrn: "0003048", status: "Menunggu" },
  ];

  const followUps = [
    { patient: "Andi Pratama", mrn: "0001345", diagnosis: "Hipertensi", time: "08:15" },
    { patient: "Siti Aisyah", mrn: "0002345", diagnosis: "Flu", time: "08:45" },
  ];

  return (
    <DashboardShell
      title="Dashboard Dokter"
      activeMenu="dashboard-dokter"
      role="dokter"
      user={{
        name: user.name,
        roleLabel: "Dokter",
        avatarInitials: user.avatar,
      }}
    >
      <div className={styles.page}>

        {/* HEADER */}
        <div className={styles.headerRow}>
          <div className={styles.greeting}>
            <div className={styles.avatar}>{user.avatar}</div>

            <div>
              <p className={styles.kicker}>Selamat datang,</p>
              <h2 className={styles.title}>{user.name}</h2>
            </div>
          </div>

          <select
            className={styles.dateSelect}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {dateOptions.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* STATS */}
        <div className={styles.statsGrid}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <p className={styles.statLabel}>{s.label}</p>
              <p className={styles.statValue}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* JADWAL */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Jadwal Praktik Hari Ini</h3>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Pasien</th>
                  <th>No RM</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {schedule.map((item, i) => (
                  <tr key={i}>
                    <td>{item.time}</td>
                    <td>{item.patient}</td>
                    <td>{item.mrn}</td>
                    <td>
                      <span
                        className={
                          item.status === "Selesai"
                            ? styles.success
                            : styles.warning
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOLLOW UP */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Tugas & Tindak Lanjut</h3>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Pasien</th>
                  <th>No RM</th>
                  <th>Diagnosa</th>
                  <th>Waktu</th>
                </tr>
              </thead>

              <tbody>
                {followUps.map((item, i) => (
                  <tr key={i}>
                    <td>{item.patient}</td>
                    <td>{item.mrn}</td>
                    <td>{item.diagnosis}</td>
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