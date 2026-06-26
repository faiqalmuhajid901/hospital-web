import { DashboardShell } from "../../components/dashboard/DashboardShell";
import styles from "./roles.module.css";

const roles = [
  {
    no: 1,
    name: "Admin",
    description: "Administrator sistem",
    userCount: 4,
  },
  {
    no: 2,
    name: "Dokter",
    description: "Dokter medis",
    userCount: 10,
  },
  {
    no: 3,
    name: "Perawat",
    description: "Perawat & bidan",
    userCount: 32,
  },
  {
    no: 4,
    name: "Kasir",
    description: "Petugas kasir/billing",
    userCount: 6,
  },
  {
    no: 5,
    name: "Farmasi",
    description: "Petugas farmasi",
    userCount: 8,
  },
];

export default function RolesPage() {
  return (
    <DashboardShell title="Manajemen Role" activeMenu="roles">
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Manajemen Role</h2>
            <p className={styles.description}>
              Atur role pengguna dan hak akses berdasarkan kebutuhan sistem.
            </p>
          </div>

          <button type="button" className={styles.primaryButton}>
            + Tambah Role
          </button>
        </div>

        <section className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Role</th>
                  <th>Deskripsi</th>
                  <th>Jumlah User</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {roles.map((role) => (
                  <tr key={role.no}>
                    <td>{role.no}</td>
                    <td>{role.name}</td>
                    <td>{role.description}</td>
                    <td>{role.userCount}</td>
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
                ›
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}