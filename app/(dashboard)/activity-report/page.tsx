import { DashboardShell } from "../../components/dashboard/DashboardShell";
import styles from "./activityReport.module.css";

const summaryCards = [
  {
    label: "Total Aktivitas",
    value: "1.258",
    trend: "+12.8% dari periode sebelumnya",
    type: "positive",
  },
  {
    label: "User Aktif",
    value: "46",
    trend: "+6.3% dari periode sebelumnya",
    type: "positive",
  },
  {
    label: "Aktivitas Harian Rata-rata",
    value: "62,9",
    trend: "+8.7% dari periode sebelumnya",
    type: "positive",
  },
  {
    label: "Login Berhasil",
    value: "312",
    trend: "+10.1% dari periode sebelumnya",
    type: "positive",
  },
  {
    label: "Login Gagal",
    value: "18",
    trend: "-5.3% dari periode sebelumnya",
    type: "negative",
  },
];

const moduleActivities = [
  { module: "Pasien", value: 330, width: "100%" },
  { module: "Pendaftaran", value: 260, width: "78%" },
  { module: "Rawat Jalan", value: 210, width: "64%" },
  { module: "Billing", value: 180, width: "55%" },
  { module: "Farmasi", value: 150, width: "45%" },
  { module: "Laboratorium", value: 80, width: "25%" },
  { module: "Laporan", value: 28, width: "9%" },
];

const topUsers = [
  {
    no: 1,
    user: "dr. Azita Putri",
    role: "Dokter",
    total: 356,
    percent: "28.3%",
  },
  {
    no: 2,
    user: "Siti Nurhaliza",
    role: "Perawat",
    total: 245,
    percent: "19.5%",
  },
  {
    no: 3,
    user: "Budi Santoso",
    role: "Admin",
    total: 198,
    percent: "15.8%",
  },
  {
    no: 4,
    user: "Rina Marlina",
    role: "Kasir",
    total: 152,
    percent: "12.1%",
  },
  {
    no: 5,
    user: "Andi Wijaya",
    role: "Farmasi",
    total: 98,
    percent: "7.8%",
  },
];

const activityDistribution = [
  { label: "Lihat Data", value: "53%", colorClass: styles.blue },
  { label: "Tambah Data", value: "16%", colorClass: styles.cyan },
  { label: "Ubah Data", value: "17%", colorClass: styles.green },
  { label: "Hapus Data", value: "8%", colorClass: styles.purple },
  { label: "Lainnya", value: "6%", colorClass: styles.gray },
];

export default function ActivityReportPage() {
  return (
    <DashboardShell title="Laporan Aktivitas User" activeMenu="activity-report">
      <div className={styles.page}>
        <h2 className={styles.title}>Laporan Aktivitas User</h2>

        <section className={styles.card}>
          <div className={styles.filterGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="period">
                Periode
              </label>
              <input
                id="period"
                type="text"
                className={styles.input}
                defaultValue="01/05/2024 - 20/05/2024"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="user">
                User
              </label>
              <select id="user" className={styles.select} defaultValue="">
                <option value="">Semua User</option>
                <option value="azita">dr. Azita Putri</option>
                <option value="siti">Siti Nurhaliza</option>
                <option value="budi">Budi Santoso</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="module">
                Modul
              </label>
              <select id="module" className={styles.select} defaultValue="">
                <option value="">Semua Modul</option>
                <option value="pasien">Pasien</option>
                <option value="pendaftaran">Pendaftaran</option>
                <option value="billing">Billing</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="action">
                Aksi
              </label>
              <select id="action" className={styles.select} defaultValue="">
                <option value="">Semua Aksi</option>
                <option value="view">Lihat Data</option>
                <option value="create">Tambah Data</option>
                <option value="update">Ubah Data</option>
                <option value="delete">Hapus Data</option>
              </select>
            </div>

            <button type="button" className={styles.primaryButton}>
              Tampilkan Laporan
            </button>

            <button type="button" className={styles.secondaryButton}>
              ⬇ Export Excel
            </button>
          </div>

          <div className={styles.summaryGrid}>
            {summaryCards.map((item) => (
              <div key={item.label} className={styles.summaryCard}>
                <p className={styles.summaryLabel}>{item.label}</p>
                <p className={styles.summaryValue}>{item.value}</p>
                <p
                  className={
                    item.type === "positive"
                      ? styles.summaryTrendPositive
                      : styles.summaryTrendNegative
                  }
                >
                  {item.trend}
                </p>
              </div>
            ))}
          </div>

          <div className={styles.chartGrid}>
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Aktivitas per Hari</h3>

              <svg
                className={styles.lineChart}
                viewBox="0 0 620 260"
                role="img"
                aria-label="Grafik aktivitas per hari"
              >
                <line
                  x1="40"
                  y1="40"
                  x2="600"
                  y2="40"
                  className={styles.gridLine}
                />
                <line
                  x1="40"
                  y1="90"
                  x2="600"
                  y2="90"
                  className={styles.gridLine}
                />
                <line
                  x1="40"
                  y1="140"
                  x2="600"
                  y2="140"
                  className={styles.gridLine}
                />
                <line
                  x1="40"
                  y1="190"
                  x2="600"
                  y2="190"
                  className={styles.gridLine}
                />
                <line
                  x1="40"
                  y1="230"
                  x2="600"
                  y2="230"
                  className={styles.gridLine}
                />

                <text x="8" y="44" className={styles.axisText}>
                  100
                </text>
                <text x="15" y="94" className={styles.axisText}>
                  75
                </text>
                <text x="15" y="144" className={styles.axisText}>
                  50
                </text>
                <text x="15" y="194" className={styles.axisText}>
                  25
                </text>
                <text x="22" y="232" className={styles.axisText}>
                  0
                </text>

                <text x="40" y="252" className={styles.axisText}>
                  01 Mei
                </text>
                <text x="185" y="252" className={styles.axisText}>
                  05 Mei
                </text>
                <text x="330" y="252" className={styles.axisText}>
                  09 Mei
                </text>
                <text x="465" y="252" className={styles.axisText}>
                  13 Mei
                </text>
                <text x="560" y="252" className={styles.axisText}>
                  20 Mei
                </text>

                <path
                  className={styles.areaPath}
                  d="M40 178 L70 166 L100 110 L130 128 L160 122 L190 150 L220 118 L250 138 L280 128 L310 92 L340 116 L370 152 L400 148 L430 142 L460 78 L490 100 L520 92 L550 128 L580 70 L600 104 L600 230 L40 230 Z"
                />

                <path
                  className={styles.linePath}
                  d="M40 178 L70 166 L100 110 L130 128 L160 122 L190 150 L220 118 L250 138 L280 128 L310 92 L340 116 L370 152 L400 148 L430 142 L460 78 L490 100 L520 92 L550 128 L580 70 L600 104"
                />

                {[40, 100, 160, 220, 310, 460, 580, 600].map((x, index) => {
                  const y = [178, 110, 122, 118, 92, 78, 70, 104][index];

                  return (
                    <circle
                      key={`${x}-${y}`}
                      cx={x}
                      cy={y}
                      r="5"
                      className={styles.dot}
                    />
                  );
                })}
              </svg>
            </div>

            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Aktivitas per Modul</h3>

              <div className={styles.barList}>
                {moduleActivities.map((item) => (
                  <div key={item.module} className={styles.barRow}>
                    <span className={styles.barLabel}>{item.module}</span>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{ width: item.width }}
                      />
                    </div>
                    <span className={styles.barValue}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.bottomGrid}>
            <div className={styles.tableCard}>
              <h3 className={styles.chartTitle}>
                Top 10 User dengan Aktivitas Terbanyak
              </h3>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>User</th>
                      <th>Role</th>
                      <th>Total Aktivitas</th>
                      <th>Persentase</th>
                    </tr>
                  </thead>

                  <tbody>
                    {topUsers.map((item) => (
                      <tr key={item.no}>
                        <td>{item.no}</td>
                        <td>{item.user}</td>
                        <td>{item.role}</td>
                        <td>{item.total}</td>
                        <td>{item.percent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.donutCard}>
              <h3 className={styles.chartTitle}>Distribusi Aktivitas</h3>

              <div className={styles.donutContent}>
                <div className={styles.donut} />

                <div className={styles.legendList}>
                  {activityDistribution.map((item) => (
                    <div key={item.label} className={styles.legendItem}>
                      <span className={styles.legendLeft}>
                        <span
                          className={`${styles.legendDot} ${item.colorClass}`}
                        />
                        {item.label}
                      </span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <p className={styles.footerText}>
          © 2024 Medisystem HIS. All rights reserved.
        </p>
      </div>
    </DashboardShell>
  );
}