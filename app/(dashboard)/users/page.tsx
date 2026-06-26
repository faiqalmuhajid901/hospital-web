import { DashboardShell } from "../../components/dashboard/DashboardShell";
import styles from "./users.module.css";

const users = [
  {
    no: 1,
    name: "dr. Azita Putri",
    username: "azita.putri",
    role: "Dokter",
    status: "Aktif",
  },
  {
    no: 2,
    name: "Siti Nurhaliza",
    username: "siti.nur",
    role: "Perawat",
    status: "Aktif",
  },
  {
    no: 3,
    name: "Budi Santoso",
    username: "budi.santoso",
    role: "Admin",
    status: "Aktif",
  },
  {
    no: 4,
    name: "Rina Marlina",
    username: "rina.marlina",
    role: "Kasir",
    status: "Aktif",
  },
  {
    no: 5,
    name: "Andi Wijaya",
    username: "andi.wijaya",
    role: "Farmasi",
    status: "Nonaktif",
  },
];

export default function UsersPage() {
  return (
    <DashboardShell title="Manajemen User" activeMenu="users">
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Manajemen User</h2>
            <p className={styles.description}>
              Kelola akun pengguna, role, dan status akses sistem.
            </p>
          </div>

          <button type="button" className={styles.primaryButton}>
            + Tambah User
          </button>
        </div>

        <section className={styles.tableCard}>
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>⌕</span>
              <input
                type="text"
                placeholder="Cari nama, email, atau username"
                className={styles.searchInput}
              />
            </div>

            <button type="button" className={styles.filterButton}>
              ⚙ Filter
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.no}>
                    <td>{user.no}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>
                      <span
                        className={
                          user.status === "Aktif"
                            ? `${styles.status} ${styles.statusActive}`
                            : `${styles.status} ${styles.statusInactive}`
                        }
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <button type="button" className={styles.actionButton}>
                          ✎
                        </button>
                        <button type="button" className={styles.actionButton}>
                          👁
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.footer}>
            <p className={styles.info}>Menampilkan 1 - 5 dari 23 data</p>

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
                ›
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}