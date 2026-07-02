import { DashboardShell } from "../../../components/dashboard/DashboardShell";
import styles from "./laboratoriumDashboard.module.css";

const stats = [
  { label: "Order Hari Ini", value: "38" },
  { label: "Selesai", value: "24" },
  { label: "Proses", value: "10" },
  { label: "Belum Dikerjakan", value: "4" },
];

const labOrders = [
  {
    no: 1,
    order: "LAB-250710-001",
    patient: "Andi Pratama",
    exam: "Darah Lengkap",
    status: "Proses",
  },
  {
    no: 2,
    order: "LAB-250710-002",
    patient: "Siti Aisyah",
    exam: "Gula Darah",
    status: "Proses",
  },
  {
    no: 3,
    order: "LAB-250710-013",
    patient: "Budi Santoso",
    exam: "Urinalisis",
    status: "Proses",
  },
  {
    no: 4,
    order: "LAB-250710-014",
    patient: "Dewi Lestari",
    exam: "SGOT/SGPT",
    status: "Baru",
  },
  {
    no: 5,
    order: "LAB-250710-015",
    patient: "Rudi Herman",
    exam: "Kreatinin",
    status: "Baru",
  },
];

const tatList = [
  { label: "Hematologi", value: "45 menit" },
  { label: "Kimia Klinik", value: "60 menit" },
  { label: "Mikrobiologi", value: "90 menit" },
];

export default function LaboratoryDashboardPage() {
  return (
    <DashboardShell title="Dashboard Laboratorium" activeMenu="dashboard">
      <div className={styles.page}>
        <div className={styles.headerRow}>
          <div className={styles.greeting}>
            <div className={styles.avatar}>PL</div>
            <div>
              <p className={styles.kicker}>Selamat pagi,</p>
              <h2 className={styles.title}>Petugas Lab</h2>
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
          <h3 className={styles.panelTitle}>Order Pemeriksaan Terbaru</h3>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>No. Order</th>
                  <th>Pasien</th>
                  <th>Pemeriksaan</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {labOrders.map((item) => (
                  <tr key={item.order}>
                    <td>{item.no}</td>
                    <td>{item.order}</td>
                    <td>{item.patient}</td>
                    <td>{item.exam}</td>
                    <td>
                      <span
                        className={
                          item.status === "Proses"
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
            Lihat semua order →
          </button>
        </div>

        <div className={styles.bottomGrid}>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Statistik Pemeriksaan</h3>

            <div className={styles.donutWrap}>
              <div className={styles.donut} />

              <div className={styles.legendList}>
                <div className={styles.legendItem}>
                  <span className={styles.legendLeft}>
                    <span className={`${styles.legendDot} ${styles.blue}`} />
                    Hematologi
                  </span>
                </div>

                <div className={styles.legendItem}>
                  <span className={styles.legendLeft}>
                    <span className={`${styles.legendDot} ${styles.cyan}`} />
                    Tes Serologi
                  </span>
                </div>

                <div className={styles.legendItem}>
                  <span className={styles.legendLeft}>
                    <span className={`${styles.legendDot} ${styles.purple}`} />
                    Mikrobiologi
                  </span>
                </div>

                <div className={styles.legendItem}>
                  <span className={styles.legendLeft}>
                    <span className={`${styles.legendDot} ${styles.green}`} />
                    Imunologi
                  </span>
                </div>

                <div className={styles.legendItem}>
                  <span className={styles.legendLeft}>
                    <span className={`${styles.legendDot} ${styles.gray}`} />
                    Lainnya
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>TAT Rata-rata</h3>

            <div className={styles.tatList}>
              {tatList.map((item) => (
                <div key={item.label} className={styles.tatItem}>
                  <span>{item.label}</span>
                  <span className={styles.tatValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}