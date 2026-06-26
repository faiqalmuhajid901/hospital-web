import { DashboardShell } from "../../components/dashboard/DashboardShell";
import styles from "./loginHistory.module.css";

const loginHistory = [
  {
    time: "2026/03/04 08:15",
    user: "dr. Azita Putri",
    ip: "192.168.1.10",
    device: "Chrome (Windows)",
    status: "Berhasil",
  },
  {
    time: "2026/03/04 08:31",
    user: "dr. Azita Putri",
    ip: "192.168.1.10",
    device: "Chrome (Windows)",
    status: "Berhasil",
  },
  {
    time: "2026/03/04 10:04",
    user: "dr. Azita Putri",
    ip: "192.168.1.15",
    device: "Mobile Safari (iOS)",
    status: "Berhasil",
  },
  {
    time: "2026/03/04 11:10",
    user: "dr. Azita Putri",
    ip: "192.168.1.10",
    device: "Chrome (Windows)",
    status: "Berhasil",
  },
  {
    time: "2026/03/04 13:15",
    user: "dr. Azita Putri",
    ip: "192.168.1.12",
    device: "Chrome (Windows)",
    status: "Gagal",
  },
];

export default function LoginHistoryPage() {
  return (
    <DashboardShell title="Riwayat Login" activeMenu="login-history">
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className={styles.title}>Riwayat Login</h2>
          <p className={styles.description}>
            Lihat riwayat akses masuk pengguna ke dalam sistem.
          </p>
        </div>

        <section className={styles.card}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Waktu Login</th>
                  <th>User</th>
                  <th>IP Address</th>
                  <th>Perangkat</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loginHistory.map((item) => (
                  <tr key={`${item.time}-${item.ip}`}>
                    <td>{item.time}</td>
                    <td>
                      <div className={styles.userCell}>
                        <span className={styles.avatarDot} />
                        {item.user}
                      </div>
                    </td>
                    <td>{item.ip}</td>
                    <td>{item.device}</td>
                    <td>
                      <span
                        className={
                          item.status === "Berhasil"
                            ? `${styles.status} ${styles.success}`
                            : `${styles.status} ${styles.failed}`
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

          <div className={styles.footer}>
            <p className={styles.info}>Menampilkan 1 - 5 dari 30 data</p>

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