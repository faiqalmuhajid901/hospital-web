import { DashboardShell } from "../../../components/dashboard/DashboardShell";
import styles from "./patientDashboard.module.css";

const patientStats = [
  {
    label: "Janji Temu",
    value: "1",
    trend: "Akan datang",
  },
  {
    label: "Riwayat Kunjungan",
    value: "5",
    trend: "Total",
  },
  {
    label: "Resep Aktif",
    value: "2",
    trend: "Obat",
  },
];

const healthHistory = [
  {
    date: "12 Mei 2026",
    title: "Konsultasi Poli Jantung",
  },
  {
    date: "05 Mei 2026",
    title: "Pemeriksaan Laboratorium",
  },
  {
    date: "29 Apr 2026",
    title: "Konsultasi Poli Umum",
  },
];

const medicines = [
  {
    name: "Amlodipine",
    dose: "1x sehari",
    amount: "3 Tablet",
  },
  {
    name: "Simvastatin",
    dose: "1x malam",
    amount: "10 Tablet",
  },
];

const bills = [
  {
    invoice: "INV-250512-001",
    description: "Konsultasi Poli Jantung",
    amount: "Rp 250.000",
  },
];

export default function PatientDashboardPage() {
  return (
    <DashboardShell title="Dashboard Pasien" activeMenu="dashboard">
      <div className={styles.page}>
        <div className={styles.headerRow}>
          <div className={styles.greeting}>
            <div className={styles.avatar}>AP</div>
            <div>
              <p className={styles.kicker}>Halo,</p>
              <h2 className={styles.title}>Andi Pratama</h2>
            </div>
          </div>

          <select className={styles.dateSelect} defaultValue="12 Mei 2026">
            <option>12 Mei 2026</option>
            <option>13 Mei 2026</option>
            <option>14 Mei 2026</option>
          </select>
        </div>

        <div className={styles.statsGrid}>
          {patientStats.map((item) => (
            <div key={item.label} className={styles.statCard}>
              <p className={styles.statLabel}>{item.label}</p>
              <p className={styles.statValue}>{item.value}</p>
              <p className={styles.statTrend}>{item.trend}</p>
            </div>
          ))}
        </div>

        <div className={styles.stack}>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Janji Temu Berikutnya</h3>

            <div className={styles.patientCard}>
              <h4 className={styles.patientCardTitle}>
                Kamis, 15 Mei 2026 - 09:00
              </h4>
              <p className={styles.patientCardText}>Poli Jantung</p>

              <div className={styles.patientCardFooter}>
                <span>dr. Aditya Pratama</span>
                <button type="button" className={styles.linkButton}>
                  Lihat Detail
                </button>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Riwayat Kesehatan</h3>

            <div className={styles.cardList}>
              {healthHistory.map((item) => (
                <div
                  key={`${item.date}-${item.title}`}
                  className={styles.patientCard}
                >
                  <h4 className={styles.patientCardTitle}>{item.date}</h4>
                  <p className={styles.patientCardText}>{item.title}</p>
                </div>
              ))}
            </div>

            <button type="button" className={styles.linkButton}>
              Lihat semua riwayat →
            </button>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Resep Aktif</h3>

            {medicines.map((medicine) => (
              <div key={medicine.name} className={styles.medicineRow}>
                <div>
                  <p className={styles.medicineName}>{medicine.name}</p>
                  <p className={styles.medicineDose}>{medicine.dose}</p>
                </div>

                <strong>{medicine.amount}</strong>
              </div>
            ))}

            <button type="button" className={styles.linkButton}>
              Lihat semua resep →
            </button>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Tagihan Belum Dibayar</h3>

            {bills.map((bill) => (
              <div key={bill.invoice} className={styles.billRow}>
                <div>
                  <p className={styles.billTitle}>{bill.invoice}</p>
                  <p className={styles.billText}>{bill.description}</p>
                </div>

                <strong className={styles.billAmount}>{bill.amount}</strong>
              </div>
            ))}

            <button type="button" className={styles.linkButton}>
              Lihat semua tagihan →
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}