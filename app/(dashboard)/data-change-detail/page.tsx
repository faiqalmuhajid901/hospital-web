import Link from "next/link";
import { DashboardShell } from "../../components/dashboard/DashboardShell";
import styles from "./dataChangeDetail.module.css";
import { Fragment } from "react";

const generalInfo = [
  { label: "Buat", value: "Pendaftaran" },
  { label: "Dihubungkan", value: "Pasien" },
  { label: "Data", value: "Andi Pratama (MRN: 0003345)" },
  { label: "Aksi", value: "Update Data" },
  { label: "User", value: "Siti Nurhaliza" },
  { label: "Waktu", value: "28 Mei 2024 10:35" },
  { label: "IP Address", value: "192.168.1.17" },
];

const changes = [
  {
    field: "Alamat",
    oldValue: "Jl. Mawar No. 15, Bandung",
    newValue: "Jl. Mawar No. 15, Bandung RT 01 RW 01",
  },
  {
    field: "No. Telepon",
    oldValue: "081234567890",
    newValue: "082223334444",
  },
  {
    field: "Email",
    oldValue: "andi.pratama@gmail.com",
    newValue: "andi.pratama@rsmail.com",
  },
  {
    field: "Pekerjaan",
    oldValue: "-",
    newValue: "Karyawan Swasta",
  },
];

export default function DataChangeDetailPage() {
  return (
    <DashboardShell title="Detail Perubahan Data" activeMenu="activity-logs">
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className={styles.title}>Detail Perubahan Data</h2>

          <Link href="/activity-logs" className={styles.backLink}>
            ← Kembali ke log
          </Link>
        </div>

        <section className={styles.card}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Informasi Umum</h3>

            <div className={styles.infoGrid}>
              {generalInfo.map((item) => (
                <Fragment key={`${item.label}-${item.value}`}>
                    <div className={styles.label}>{item.label}</div>
                    <div className={styles.value}>{item.value}</div>
                </Fragment>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Perubahan</h3>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Nilai Sebelum</th>
                    <th>Nilai Sesudah</th>
                  </tr>
                </thead>

                <tbody>
                  {changes.map((item) => (
                    <tr key={item.field}>
                      <td>{item.field}</td>
                      <td className={styles.oldValue}>{item.oldValue}</td>
                      <td className={styles.newValue}>{item.newValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}