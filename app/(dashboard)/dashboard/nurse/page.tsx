import { DashboardShell } from "../../../components/dashboard/DashboardShell";
import styles from "./nurseDashboard.module.css";

const stats = [
  { label: "Pasien Dirawat", value: "24" },
  { label: "Obat Hari Ini", value: "36" },
  { label: "Tindakan Hari Ini", value: "12" },
  { label: "Serah Terima", value: "2" },
];

const patientOrders = [
  {
    patient: "Andi Pratama",
    room: "301",
    condition: "Stabil",
  },
  {
    patient: "Siti Aisyah",
    room: "302",
    condition: "Stabil",
  },
  {
    patient: "Budi Santoso",
    room: "303",
    condition: "Perhatian",
  },
  {
    patient: "Dewi Lestari",
    room: "306",
    condition: "Stabil",
  },
  {
    patient: "Rudi Herman",
    room: "306",
    condition: "Perhatian",
  },
];

const nursingTasks = [
  { label: "Pemberian Obat", value: 8 },
  { label: "Cek Tanda Vital", value: 10 },
  { label: "Tindakan Keperawatan", value: 6 },
  { label: "Edukasi Pasien", value: 3 },
];

export default function NurseDashboardPage() {
  return (
    <DashboardShell title="Dashboard Perawat" activeMenu="dashboard">
      <div className={styles.page}>
        <div className={styles.headerRow}>
          <div className={styles.greeting}>
            <div className={styles.avatar}>PR</div>
            <div>
              <p className={styles.kicker}>Selamat pagi,</p>
              <h2 className={styles.title}>Perawat Rina</h2>
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
          <h3 className={styles.panelTitle}>Order Pasien Dirawat</h3>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nama Pasien</th>
                  <th>Ruangan</th>
                  <th>Kondisi</th>
                </tr>
              </thead>

              <tbody>
                {patientOrders.map((item) => (
                  <tr key={`${item.patient}-${item.room}`}>
                    <td>{item.patient}</td>
                    <td>{item.room}</td>
                    <td>
                      <span
                        className={
                          item.condition === "Stabil"
                            ? `${styles.status} ${styles.stable}`
                            : `${styles.status} ${styles.attention}`
                        }
                      >
                        {item.condition}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" className={styles.linkButton}>
            Lihat semua pasien →
          </button>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Grafik Tanda Vital Hari Ini</h3>

          <div className={styles.legendRow}>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.blue}`} />
              Sistolik
            </span>

            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.purple}`} />
              Diastolik
            </span>
          </div>

          <svg
            className={styles.chartSvg}
            viewBox="0 0 640 260"
            role="img"
            aria-label="Grafik tanda vital"
          >
            <line x1="45" y1="40" x2="620" y2="40" className={styles.gridLine} />
            <line x1="45" y1="90" x2="620" y2="90" className={styles.gridLine} />
            <line x1="45" y1="140" x2="620" y2="140" className={styles.gridLine} />
            <line x1="45" y1="190" x2="620" y2="190" className={styles.gridLine} />
            <line x1="45" y1="230" x2="620" y2="230" className={styles.gridLine} />

            <text x="10" y="44" className={styles.axisText}>200</text>
            <text x="10" y="94" className={styles.axisText}>150</text>
            <text x="10" y="144" className={styles.axisText}>100</text>
            <text x="17" y="194" className={styles.axisText}>50</text>
            <text x="24" y="232" className={styles.axisText}>0</text>

            <text x="50" y="252" className={styles.axisText}>00:00</text>
            <text x="155" y="252" className={styles.axisText}>04:00</text>
            <text x="260" y="252" className={styles.axisText}>08:00</text>
            <text x="365" y="252" className={styles.axisText}>12:00</text>
            <text x="470" y="252" className={styles.axisText}>16:00</text>
            <text x="570" y="252" className={styles.axisText}>20:00</text>

            <path
              className={styles.linePrimary}
              d="M60 162 L140 125 L220 138 L300 132 L380 82 L460 128 L540 142 L610 118"
            />

            <path
              className={styles.lineSecondary}
              d="M60 190 L140 165 L220 172 L300 166 L380 144 L460 170 L540 180 L610 156"
            />

            {[
              [60, 162],
              [140, 125],
              [220, 138],
              [300, 132],
              [380, 82],
              [460, 128],
              [540, 142],
              [610, 118],
            ].map(([x, y]) => (
              <circle
                key={`primary-${x}-${y}`}
                cx={x}
                cy={y}
                r="5"
                className={styles.dotPrimary}
              />
            ))}

            {[
              [60, 190],
              [140, 165],
              [220, 172],
              [300, 166],
              [380, 144],
              [460, 170],
              [540, 180],
              [610, 156],
            ].map(([x, y]) => (
              <circle
                key={`secondary-${x}-${y}`}
                cx={x}
                cy={y}
                r="5"
                className={styles.dotSecondary}
              />
            ))}
          </svg>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Tugas Perawat</h3>

          <div className={styles.taskList}>
            {nursingTasks.map((item) => (
              <div key={item.label} className={styles.taskItem}>
                <span>{item.label}</span>
                <span className={styles.taskValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}