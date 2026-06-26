import { DashboardShell } from "../../components/dashboard/DashboardShell";
import styles from "./notifications.module.css";

type NotificationItem = {
  id: number;
  icon: string;
  color: "blue" | "green" | "red" | "gray";
  title: string;
  text: string;
  time: string;
  badge?: string;
};

const notifications: NotificationItem[] = [
  {
    id: 1,
    icon: "🧾",
    color: "blue",
    title: "Pasien baru telah mendaftar",
    text: "Pasien atas nama Aria Melina telah mendaftar di Poli Umum.",
    time: "09:15",
  },
  {
    id: 2,
    icon: "🧪",
    color: "blue",
    title: "Hasil laboratorium tersedia",
    text: "Hasil lab pasien dr. Alya Putri telah tersedia.",
    time: "09:45",
  },
  {
    id: 3,
    icon: "!",
    color: "red",
    title: "Stok obat menipis",
    text: "Paracetamol 500mg tersisa 12 box.",
    time: "09:30",
    badge: "Penting",
  },
  {
    id: 4,
    icon: "🔒",
    color: "gray",
    title: "Jadwal dokter diubah",
    text: "Jadwal dr. Budi Santoso pada 28 Mei 2024 telah diubah.",
    time: "Kemarin",
  },
  {
    id: 5,
    icon: "✓",
    color: "green",
    title: "Pembayaran berhasil",
    text: "Pembayaran tagihan INV-0004-000213 telah berhasil.",
    time: "Kemarin",
  },
];

function getIconClass(color: NotificationItem["color"]) {
  if (color === "blue") return `${styles.icon} ${styles.iconBlue}`;
  if (color === "green") return `${styles.icon} ${styles.iconGreen}`;
  if (color === "red") return `${styles.icon} ${styles.iconRed}`;

  return `${styles.icon} ${styles.iconGray}`;
}

export default function NotificationsPage() {
  return (
    <DashboardShell title="Daftar Notifikasi" activeMenu="notifications">
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Daftar Notifikasi</h2>
            <p className={styles.description}>
              Pantau pemberitahuan terbaru dari aktivitas sistem rumah sakit.
            </p>
          </div>

          <button type="button" className={styles.primaryButton}>
            Tandai Semua Dibaca
          </button>
        </div>

        <section className={styles.card}>
          <div className={styles.tabs}>
            <button type="button" className={styles.activeTab}>
              Semua
            </button>
            <button type="button" className={styles.tab}>
              Belum Dibaca (3)
            </button>
            <button type="button" className={styles.tab}>
              Penting
            </button>
          </div>

          <div className={styles.list}>
            {notifications.map((notification) => (
              <article key={notification.id} className={styles.item}>
                <div className={getIconClass(notification.color)}>
                  {notification.icon}
                </div>

                <div className={styles.content}>
                  <h3 className={styles.itemTitle}>{notification.title}</h3>
                  <p className={styles.itemText}>{notification.text}</p>
                </div>

                <div className={styles.meta}>
                  {notification.badge ? (
                    <span className={styles.badge}>{notification.badge}</span>
                  ) : null}
                  <span className={styles.time}>{notification.time}</span>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.footer}>
            <p className={styles.info}>Menampilkan 1 - 5 dari 25 notifikasi</p>

            <button type="button" className={styles.linkButton}>
              Lihat lebih banyak
            </button>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}