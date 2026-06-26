import { DashboardShell } from "../../components/dashboard/DashboardShell";
import styles from "./activityLogs.module.css";

const logs = [
  {
    time: "2026/03/06 10:15",
    user: "dr. Azita Putri",
    activity: "Melihat data pasien",
    module: "Pasien",
    ip: "192.168.1.10",
  },
  {
    time: "2026/03/06 10:27",
    user: "Siti Nurhaliza",
    activity: "Menambah data pendaftaran",
    module: "Pendaftaran",
    ip: "192.168.1.15",
  },
  {
    time: "2026/03/06 10:37",
    user: "Budi Santoso",
    activity: "Mengubah data user",
    module: "Pengguna",
    ip: "192.168.1.17",
  },
  {
    time: "2026/03/06 10:40",
    user: "Rina Marlina",
    activity: "Mencetak invoice",
    module: "Billing",
    ip: "192.168.1.20",
  },
  {
    time: "2026/03/06 10:52",
    user: "Andi Wijaya",
    activity: "Menghapus data stok",
    module: "Farmasi",
    ip: "192.168.1.26",
  },
];

export default function ActivityLogsPage() {
  return (
    <DashboardShell title="Log Aktivitas User" activeMenu="activity-logs">
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className={styles.title}>Log Aktivitas User</h2>
          <p className={styles.description}>
            Pantau riwayat aktivitas pengguna di seluruh modul sistem.
          </p>
        </div>

        <section className={styles.card}>
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>⌕</span>
              <input
                type="text"
                placeholder="Cari aktivitas atau user"
                className={styles.searchInput}
              />
            </div>

            <select className={styles.select} defaultValue="">
              <option value="">Filter Modul</option>
              <option value="pasien">Pasien</option>
              <option value="pendaftaran">Pendaftaran</option>
              <option value="billing">Billing</option>
              <option value="farmasi">Farmasi</option>
            </select>

            <input
              type="text"
              className={styles.dateInput}
              defaultValue="01/03/2026 - 06/03/2026"
            />
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>User</th>
                  <th>Aktivitas</th>
                  <th>Modul</th>
                  <th>IP Address</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={`${log.time}-${log.user}`}>
                    <td>{log.time}</td>
                    <td>
                      <div className={styles.userCell}>
                        <span className={styles.avatarDot} />
                        {log.user}
                      </div>
                    </td>
                    <td>{log.activity}</td>
                    <td>{log.module}</td>
                    <td>{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.footer}>
            <p className={styles.info}>Menampilkan 1 - 5 dari 150 data</p>

            <div className={styles.pagination}>
              <button type="button" className={styles.pageButton}>
                ‹
              </button>
              <button
                type="button"
                className={`${styles.pageButton} ${styles.pageButtonActive}`}
              >
                1
              </button>
              <button type="button" className={styles.pageButton}>
                2
              </button>
              <button type="button" className={styles.pageButton}>
                3
              </button>
              <button type="button" className={styles.pageButton}>
                4
              </button>
              <button type="button" className={styles.pageButton}>
                5
              </button>
              <button type="button" className={styles.pageButton}>
                ...
              </button>
              <button type="button" className={styles.pageButton}>
                30
              </button>
              <button type="button" className={styles.pageButton}>
                ›
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}