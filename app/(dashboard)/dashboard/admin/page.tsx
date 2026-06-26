import { DashboardShell } from "../../../components/dashboard/DashboardShell";
import styles from "./adminDashboard.module.css";

const stats = [
  {
    label: "Total Pasien",
    value: "1.248",
    trend: "+13.5%",
  },
  {
    label: "Kunjungan Hari Ini",
    value: "342",
    trend: "+12.5%",
  },
  {
    label: "Rawat Inap",
    value: "87",
    trend: "+3.4%",
  },
];

const tasks = [
  { label: "Pendaftaran belum verifikasi", value: 15 },
  { label: "Hasil lab belum validasi", value: 12 },
  { label: "Resep belum diproses", value: 18 },
  { label: "Tagihan belum dibayar", value: 27 },
];

const latestPatients = [
  {
    no: 1,
    name: "Andi Pratama",
    mrn: "0001345",
    poli: "Poli Umum",
    time: "08:12",
  },
  {
    no: 2,
    name: "Siti Aisyah",
    mrn: "0002345",
    poli: "Poli Gigi",
    time: "08:06",
  },
  {
    no: 3,
    name: "Budi Santoso",
    mrn: "0003247",
    poli: "Poli Jantung",
    time: "08:59",
  },
  {
    no: 4,
    name: "Dedi Gunadi",
    mrn: "0003145",
    poli: "Poli Anak",
    time: "08:45",
  },
  {
    no: 5,
    name: "Rudi Herman",
    mrn: "0001349",
    poli: "Poli Ortopedi",
    time: "08:31",
  },
];

export default function AdminDashboardPage() {
  return (
    <DashboardShell title="Dashboard Admin" activeMenu="dashboard">
      <div className={styles.page}>
        <div className={styles.headerRow}>
          <div className={styles.greeting}>
            <div className={styles.avatar}>SA</div>
            <div>
              <p className={styles.kicker}>Selamat pagi,</p>
              <h2 className={styles.title}>Super Admin</h2>
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
              <p className={styles.statTrend}>{item.trend}</p>
            </div>
          ))}
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Kunjungan 7 Hari Terakhir</h3>

          <svg
            className={styles.chartSvg}
            viewBox="0 0 720 260"
            role="img"
            aria-label="Grafik kunjungan tujuh hari terakhir"
          >
            <line x1="45" y1="40" x2="690" y2="40" className={styles.gridLine} />
            <line x1="45" y1="90" x2="690" y2="90" className={styles.gridLine} />
            <line x1="45" y1="140" x2="690" y2="140" className={styles.gridLine} />
            <line x1="45" y1="190" x2="690" y2="190" className={styles.gridLine} />
            <line x1="45" y1="230" x2="690" y2="230" className={styles.gridLine} />

            <text x="10" y="44" className={styles.axisText}>
              400
            </text>
            <text x="10" y="94" className={styles.axisText}>
              300
            </text>
            <text x="10" y="144" className={styles.axisText}>
              200
            </text>
            <text x="10" y="194" className={styles.axisText}>
              100
            </text>
            <text x="25" y="232" className={styles.axisText}>
              0
            </text>

            <text x="70" y="252" className={styles.axisText}>
              6 Mei
            </text>
            <text x="170" y="252" className={styles.axisText}>
              7 Mei
            </text>
            <text x="270" y="252" className={styles.axisText}>
              8 Mei
            </text>
            <text x="370" y="252" className={styles.axisText}>
              9 Mei
            </text>
            <text x="470" y="252" className={styles.axisText}>
              10 Mei
            </text>
            <text x="570" y="252" className={styles.axisText}>
              11 Mei
            </text>
            <text x="650" y="252" className={styles.axisText}>
              12 Mei
            </text>

            <path
              className={styles.areaPath}
              d="M70 170 L170 130 L270 132 L370 95 L470 160 L570 82 L670 55 L670 230 L70 230 Z"
            />
            <path
              className={styles.linePath}
              d="M70 170 L170 130 L270 132 L370 95 L470 160 L570 82 L670 55"
            />

            {[70, 170, 270, 370, 470, 570, 670].map((x, index) => {
              const y = [170, 130, 132, 95, 160, 82, 55][index];

              return (
                <circle
                  key={`${x}-${y}`}
                  cx={x}
                  cy={y}
                  r="6"
                  className={styles.dot}
                />
              );
            })}
          </svg>
        </div>

        <div className={styles.gridTwo}>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Komposisi Kunjungan</h3>

            <div className={styles.donutWrap}>
              <div className={styles.donut} />

              <div className={styles.legendList}>
                <div className={styles.legendItem}>
                  <span className={styles.legendLeft}>
                    <span className={`${styles.legendDot} ${styles.blue}`} />
                    Rawat Jalan
                  </span>
                  <strong>43%</strong>
                </div>

                <div className={styles.legendItem}>
                  <span className={styles.legendLeft}>
                    <span className={`${styles.legendDot} ${styles.cyan}`} />
                    IGD
                  </span>
                  <strong>30%</strong>
                </div>

                <div className={styles.legendItem}>
                  <span className={styles.legendLeft}>
                    <span className={`${styles.legendDot} ${styles.green}`} />
                    Rawat Inap
                  </span>
                  <strong>26%</strong>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Tugas Menunggu</h3>

            <div className={styles.taskList}>
              {tasks.map((item) => (
                <div key={item.label} className={styles.taskItem}>
                  <span>{item.label}</span>
                  <span className={styles.taskValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Pasien Terbaru</h3>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Pasien</th>
                  <th>No. RM</th>
                  <th>Poli</th>
                  <th>Waktu</th>
                </tr>
              </thead>

              <tbody>
                {latestPatients.map((patient) => (
                  <tr key={patient.no}>
                    <td>{patient.no}</td>
                    <td>{patient.name}</td>
                    <td>{patient.mrn}</td>
                    <td>{patient.poli}</td>
                    <td>{patient.time}</td>
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