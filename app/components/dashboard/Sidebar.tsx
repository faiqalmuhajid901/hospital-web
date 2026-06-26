import Link from "next/link";
import { BrandMark } from "../auth/BrandMark";
import styles from "./Sidebar.module.css";

type MenuItem = {
  key: string;
  label: string;
  href: string;
  icon: string;
};

type SidebarProps = {
  activeMenu?: string;
};

const mainMenus: MenuItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: "▦" },
  { key: "patients", label: "Pasien", href: "/patients", icon: "◎" },
  {
    key: "registration",
    label: "Pendaftaran",
    href: "/registration",
    icon: "✚",
  },
  { key: "outpatient", label: "Rawat Jalan", href: "/outpatient", icon: "▣" },
  { key: "inpatient", label: "Rawat Inap", href: "/inpatient", icon: "▤" },
  { key: "pharmacy", label: "Farmasi", href: "/pharmacy", icon: "✦" },
  {
    key: "laboratory",
    label: "Laboratorium",
    href: "/laboratory",
    icon: "⚕",
  },
  { key: "billing", label: "Billing", href: "/billing", icon: "◈" },
  { key: "inventory", label: "Inventori", href: "/inventory", icon: "▧" },
  { key: "reports", label: "Laporan", href: "/reports", icon: "☷" },
];

const settingMenus: MenuItem[] = [
  { key: "profile", label: "Profil Saya", href: "/profile", icon: "◉" },
  {
    key: "change-password",
    label: "Ubah Password",
    href: "/change-password",
    icon: "◇",
  },
  { key: "users", label: "Pengguna", href: "/users", icon: "👤" },
  { key: "roles", label: "Role & Hak Akses", href: "/roles", icon: "▣" },
  {
    key: "permissions",
    label: "Permission",
    href: "/permissions",
    icon: "☑",
  },
  {
    key: "notifications",
    label: "Notifikasi",
    href: "/notifications",
    icon: "🔔",
  },
  {
    key: "notification-settings",
    label: "Pengaturan Notifikasi",
    href: "/notification-settings",
    icon: "⚙",
  },
  {
    key: "activity-logs",
    label: "Log Aktivitas",
    href: "/activity-logs",
    icon: "⌁",
  },
  {
    key: "login-history",
    label: "Riwayat Login",
    href: "/login-history",
    icon: "↪",
  },
  {
  key: "activity-report",
  label: "Laporan Aktivitas",
  href: "/activity-report",
  icon: "▥",
  },
];

function SidebarItem({
  item,
  active,
}: {
  item: MenuItem;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={active ? `${styles.link} ${styles.active}` : styles.link}
    >
      <span className={styles.icon}>{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );
}

export function Sidebar({ activeMenu }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <BrandMark />
      </div>

      <nav className={styles.nav}>
        {mainMenus.map((item) => (
          <SidebarItem
            key={item.key}
            item={item}
            active={activeMenu === item.key}
          />
        ))}
      </nav>

      <div className={styles.group}>
        <p className={styles.title}>Pengaturan</p>

        <nav className={styles.nav}>
          {settingMenus.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              active={activeMenu === item.key}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}