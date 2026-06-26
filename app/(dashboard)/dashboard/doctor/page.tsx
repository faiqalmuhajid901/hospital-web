import { DashboardShell } from "../../../components/dashboard/DashboardShell";
import styles from "./doctorDashboard.module.css";

const stats = [
  { label: "Pasien Hari Ini", value: "18" },
  { label: "Selesai", value: "10" },
  { label: "Menunggu", value: "8" },
  { label: "Rujukan", value: "2" },
];

const schedule = [
  {
    time: "08:00",
    patient: "Andi Pratama",
    mrn: "0001345",
    status: "Selesai",
  },
  {
    time: "08:30",
    patient: "Siti Aisyah",
    mrn: "0002345",
    status: "Selesai",
  },
  {
    time: "09:00",
    patient: "Budi Santoso",
    mrn: "0003247",
    status: "Menunggu",
  },
  {
    time: "09:30",
    patient: "Dewi Lestari",
    mrn: "0003048",
    status: "Menunggu",
  },
  {
    time: "10:00",
    patient: "Rudi Herman",
    mrn: "0001349",
    status: "Menunggu",
  },
];

const followUps = [
  {
    patient: "Andi Pratama",
    mrn: "0001345",
    diagnosis: "Hipertensi",
    time: "08:15",
  },
  {
    patient: "Siti Aisyah",
    mrn: "0002345",
    diagnosis: "Flu",
    time: "08:45",
  },
  {
    patient: "Budi Santoso",
    mrn: "0003248",
    diagnosis: "Gastritis",
    time: "09:30",
  },
];

export default function DoctorDashboardPage() {
  return (
    <DashboardShell title="Dashboard Dokter" activeMenu="dashboard">
      <div className={styles.page}>
        <div className={styles.headerRow}>
          <div className={styles.greeting}>
            <div className={styles.avatar}>AP</div>
            <div>
              <p className={styles.kicker}>Selamat datang,</p>
              <h2 className={styles.title}>dr. Aditya Pratama</h2>
            </div>
          </div>

          <select className={styles.dateSelect} defaultValue="12 Mei 2026">
            <option>12 Mei 2026</option>
            <option>13 Mei 2026</option>
            <option>14 Mei 2026</option>
          </select>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((item) => (
            <div key={item.label} className={styles.statCard}>
              <p className={styles.statLabel}>{item.label}</p>
              <p className={styles.statValue}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Jadwal Praktik Hari Ini</h3>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Nama Pasien</th>
                  <th>No. RM</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {schedule.map((item) => (
                  <tr key={`${item.time}-${item.patient}`}>
                    <td>{item.time}</td>
                    <td>{item.patient}</td>
                    <td>{item.mrn}</td>
                    <td>
                      <span
                        className={
                          item.status === "Selesai"
                            ? `${styles.status} ${styles.success}`
                            : `${styles.status} ${styles.warning}`
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

          <button type="button" className={styles.linkButton}>
            Lihat semua jadwal →
          </button>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Distribusi Diagnosa</h3>

          <div className={styles.donutWrap}>
            <div className={styles.donut} />

            <div className={styles.legendList}>
              <div className={styles.legendItem}>
                <span className={styles.legendLeft}>
                  <span className={`${styles.legendDot} ${styles.blue}`} />
                  Hipertensi
                </span>
                <strong>40%</strong>
              </div>

              <div className={styles.legendItem}>
                <span className={styles.legendLeft}>
                  <span className={`${styles.legendDot} ${styles.cyan}`} />
                  Diabetes
                </span>
                <strong>20%</strong>
              </div>

              <div className={styles.legendItem}>
                <span className={styles.legendLeft}>
                  <span className={`${styles.legendDot} ${styles.purple}`} />
                  ISPA
                </span>
                <strong>15%</strong>
              </div>

              <div className={styles.legendItem}>
                <span className={styles.legendLeft}>
                  <span className={`${styles.legendDot} ${styles.pink}`} />
                  Gastritis
                </span>
                <strong>10%</strong>
              </div>

              <div className={styles.legendItem}>
                <span className={styles.legendLeft}>
                  <span className={`${styles.legendDot} ${styles.gray}`} />
                  Lainnya
                </span>
                <strong>15%</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Tugas & Tindak Lanjut</h3>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nama Pasien</th>
                  <th>No. RM</th>
                  <th>Diagnosa</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {followUps.map((item) => (
                  <tr key={item.mrn}>
                    <td>{item.patient}</td>
                    <td>{item.mrn}</td>
                    <td>{item.diagnosis}</td>
                    <td>{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" className={styles.linkButton}>
            Lihat semua pasien →
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}