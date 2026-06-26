import { DashboardShell } from "../../components/dashboard/DashboardShell";
import styles from "./notificationSettings.module.css";

type SettingItem = {
  title: string;
  description: string;
  defaultChecked: boolean;
};

const channelSettings: SettingItem[] = [
  {
    title: "Notifikasi In-App",
    description: "Terima notifikasi di dalam aplikasi",
    defaultChecked: true,
  },
  {
    title: "Email",
    description: "Terima notifikasi melalui email",
    defaultChecked: true,
  },
  {
    title: "SMS",
    description: "Terima notifikasi melalui SMS",
    defaultChecked: false,
  },
  {
    title: "Push Notification",
    description: "Terima notifikasi push di browser",
    defaultChecked: true,
  },
];

const preferenceSettings: SettingItem[] = [
  {
    title: "Pendaftaran Pasien Baru",
    description: "Notifikasi saat ada pasien baru mendaftar",
    defaultChecked: true,
  },
  {
    title: "Hasil Laboratorium",
    description: "Notifikasi saat hasil lab tersedia",
    defaultChecked: true,
  },
  {
    title: "Pengingat Jadwal",
    description: "Notifikasi pengingat jadwal dokter dan pasien",
    defaultChecked: true,
  },
  {
    title: "Stok Obat Menipis",
    description: "Notifikasi saat stok obat mencapai batas minimum",
    defaultChecked: true,
  },
  {
    title: "Pembayaran & Tagihan",
    description: "Notifikasi pembayaran dan status tagihan",
    defaultChecked: true,
  },
];

function NotificationSwitch({ item }: { item: SettingItem }) {
  return (
    <div className={styles.settingItem}>
      <div className={styles.settingText}>
        <p className={styles.settingTitle}>{item.title}</p>
        <p className={styles.settingDescription}>{item.description}</p>
      </div>

      <label className={styles.switch} aria-label={item.title}>
        <input type="checkbox" defaultChecked={item.defaultChecked} />
        <span className={styles.slider} />
      </label>
    </div>
  );
}

export default function NotificationSettingsPage() {
  return (
    <DashboardShell
      title="Pengaturan Notifikasi"
      activeMenu="notification-settings"
    >
      <div className={styles.page}>
        <h2 className={styles.title}>Pengaturan Notifikasi</h2>

        <p className={styles.description}>
          Atur saluran dan jenis notifikasi yang ingin diterima pengguna.
        </p>

        <section className={styles.card}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Saluran Notifikasi</h3>

            <div className={styles.settingList}>
              {channelSettings.map((item) => (
                <NotificationSwitch key={item.title} item={item} />
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Preferensi Notifikasi</h3>

            <div className={styles.settingList}>
              {preferenceSettings.map((item) => (
                <NotificationSwitch key={item.title} item={item} />
              ))}
            </div>
          </div>

          <button type="button" className={styles.primaryButton}>
            Simpan Pengaturan
          </button>
        </section>
      </div>
    </DashboardShell>
  );
}