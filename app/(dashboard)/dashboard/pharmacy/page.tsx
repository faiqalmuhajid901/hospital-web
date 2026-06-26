import { DashboardShell } from "../../../components/dashboard/DashboardShell";
import styles from "./pharmacyDashboard.module.css";

const stats = [
  { label: "Resep Hari Ini", value: "45" },
  { label: "Resep Selesai", value: "32" },
  { label: "Stok Menipis", value: "18" },
  { label: "Kedaluarsa", value: "6" },
];

const weeklyPrescriptions = [
  { day: "6 Mei", height: "45%" },
  { day: "7 Mei", height: "68%" },
  { day: "8 Mei", height: "56%" },
  { day: "9 Mei", height: "66%" },
  { day: "10 Mei", height: "44%" },
  { day: "11 Mei", height: "70%" },
  { day: "12 Mei", height: "36%" },
];

const latestPrescriptions = [
  {
    no: 1,
    nurse: "Prasetyo Wibowo",
    patient: "Andi Pratama",
    status: "Siap",
  },
  {
    no: 2,
    nurse: "Annazwan Sitorus",
    patient: "Ria Kanjadi",
    status: "Siap",
  },
  {
    no: 3,
    nurse: "Amelia Weng",
    patient: "Budi Santoso",
    status: "Proses",
  },
  {
    no: 4,
    nurse: "Omganda Zing",
    patient: "Dewi Lestari",
    status: "Proses",
  },
  {
    no: 5,
    nurse: "Safitri Wulan",
    patient: "Rudi Herman",
    status: "Baru",
  },
];

export default function PharmacyDashboardPage() {
  return (
    <DashboardShell title="Dashboard Apotek" activeMenu="dashboard">
      <div className={styles.page}>
        <div className={styles.headerRow}>
          <div className={styles.greeting}>
            <div className={styles.avatar}>AD</div>
            <div>
              <p className={styles.kicker}>Selamat pagi,</p>
              <h2 className={styles.title}>Apoteker Dini</h2>
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
          <h3 className={styles.panelTitle}>Resep 7 Hari Terakhir</h3>

          <div className={styles.barChart}>
            {weeklyPrescriptions.map((item) => (
              <div key={item.day} className={styles.barItem}>
                <div className={styles.bar} style={{ height: item.height }} />
                <span className={styles.barLabel}>{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Pasien Terakhir</h3>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama Staf</th>
                  <th>No. RM</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {latestPrescriptions.map((item) => (
                  <tr key={item.no}>
                    <td>{item.no}</td>
                    <td>{item.nurse}</td>
                    <td>{item.patient}</td>
                    <td>
                      <span
                        className={
                          item.status === "Siap"
                            ? `${styles.status} ${styles.ready}`
                            : item.status === "Proses"
                              ? `${styles.status} ${styles.process}`
                              : `${styles.status} ${styles.new}`
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
            Lihat semua stok →
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}