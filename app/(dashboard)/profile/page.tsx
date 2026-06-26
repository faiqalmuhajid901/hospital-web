import { DashboardShell } from "../../components/dashboard/DashboardShell";
import styles from "./profile.module.css";

type ProfileRowProps = {
  label: string;
  value: string;
};

const profileRows: ProfileRowProps[] = [
  {
    label: "Email",
    value: "azita.putri@rumahsakit.ac.id",
  },
  {
    label: "No. HP",
    value: "0813-3456-7900",
  },
  {
    label: "Username",
    value: "azita.putri",
  },
  {
    label: "NIK",
    value: "3273046607980001",
  },
  {
    label: "Tanggal Lahir",
    value: "15 Januari 1990",
  },
  {
    label: "Alamat",
    value: "Jl. Melati No. 12, Bandung",
  },
  {
    label: "Bergabung Sejak",
    value: "12 Mei 2022 08:35",
  },
];

function ProfileRow({ label, value }: ProfileRowProps) {
  return (
    <div className={styles.row}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <DashboardShell title="Profil Saya" activeMenu="profile">
      <div className={styles.wrap}>
        <h2 className={styles.pageTitle}>Profil Saya</h2>

        <p className={styles.pageDescription}>
          Kelola informasi akun dan identitas pengguna.
        </p>

        <section className={styles.card}>
          <div className={styles.header}>
            <div className={styles.identity}>
              <div className={styles.avatarWrap}>
                <div className={styles.avatar}>AP</div>
                <span className={styles.statusBadge}>Aktif</span>
              </div>

              <div>
                <h3 className={styles.name}>dr. Azita Putri</h3>
                <p className={styles.job}>Dokter Umum</p>
                <p className={styles.unit}>Poli Umum</p>
              </div>
            </div>

            <button type="button" className={styles.editButton}>
              Edit Profil
            </button>
          </div>

          <div className={styles.grid}>
            <div className={styles.detail}>
              {profileRows.map((row) => (
                <ProfileRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                />
              ))}
            </div>

            <aside className={styles.summary}>
              <p className={styles.summaryTitle}>Ringkasan Akun</p>

              <div className={styles.summaryList}>
                <div className={styles.summaryItem}>
                  <p className={styles.summaryLabel}>Role</p>
                  <p className={styles.summaryValue}>Dokter</p>
                </div>

                <div className={styles.summaryItem}>
                  <p className={styles.summaryLabel}>Hak Akses</p>
                  <p className={styles.summaryValue}>
                    Rekam Medis, Appointment, Rawat Jalan
                  </p>
                </div>

                <div className={styles.summaryItem}>
                  <p className={styles.summaryLabel}>Status Akun</p>
                  <span className={styles.summaryStatus}>Aktif</span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}