"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  isOpen?: boolean;
  onClose?: () => void;
};

const mainMenus: MenuItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard/admin", icon: "▦" },
  { key: "patients", label: "Pasien", href: "/patients", icon: "◎" },
  { key: "registration", label: "Pendaftaran", href: "/registration", icon: "✚" },
  { key: "outpatient", label: "Rawat Jalan", href: "/outpatient", icon: "▣" },
  { key: "inpatient", label: "Rawat Inap", href: "/inpatient", icon: "▤" },
  { key: "pharmacy", label: "Farmasi", href: "/dashboard/pharmacy", icon: "✦" },
  { key: "laboratory", label: "Laboratorium", href: "/dashboard/laboratory", icon: "⚕" },
  { key: "billing", label: "Billing", href: "/billing", icon: "◈" },
  { key: "inventory", label: "Inventori", href: "/inventory", icon: "▧" },
  { key: "reports", label: "Laporan", href: "/reports", icon: "☷" },
];

const dashboardRoleMenus: MenuItem[] = [
  { key: "dashboard-doctor", label: "Dashboard Dokter", href: "/dashboard/doctor", icon: "D" },
  { key: "dashboard-patient", label: "Dashboard Pasien", href: "/dashboard/patient", icon: "P" },
  { key: "dashboard-nurse", label: "Dashboard Perawat", href: "/dashboard/nurse", icon: "N" },
  { key: "dashboard-pharmacy", label: "Dashboard Farmasi", href: "/dashboard/pharmacy", icon: "F" },
  { key: "dashboard-lab", label: "Dashboard Lab", href: "/dashboard/laboratory", icon: "L" },
];

const settingMenus: MenuItem[] = [
  { key: "profile", label: "Profil Saya", href: "/profile", icon: "◉" },
  { key: "change-password", label: "Ubah Password", href: "/change-password", icon: "◇" },
  { key: "users", label: "Pengguna", href: "/users", icon: "U" },
  { key: "roles", label: "Role & Hak Akses", href: "/roles", icon: "R" },
  { key: "permissions", label: "Permission", href: "/permissions", icon: "☑" },
  { key: "notifications", label: "Notifikasi", href: "/notifications", icon: "N" },
  {
    key: "notification-settings",
    label: "Pengaturan Notifikasi",
    href: "/notification-settings",
    icon: "⚙",
  },
  { key: "activity-logs", label: "Log Aktivitas", href: "/activity-logs", icon: "⌁" },
  { key: "login-history", label: "Riwayat Login", href: "/login-history", icon: "↪" },
  { key: "activity-report", label: "Laporan Aktivitas", href: "/activity-report", icon: "▥" },
];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isActiveMenu(pathname: string, item: MenuItem, activeMenu?: string) {
  if (activeMenu === item.key || activeMenu === item.label) return true;
  if (pathname === item.href) return true;
  if (item.href !== "/" && pathname.startsWith(`${item.href}/`)) return true;

  return false;
}

function SidebarItem({
  item,
  active,
  onClose,
}: {
  item: MenuItem;
  active: boolean;
  onClose?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={classNames(styles.link, active && styles.active)}
      title={item.label}
    >
      <span className={styles.icon}>{item.icon}</span>
      <span className={styles.label}>{item.label}</span>
    </Link>
  );
}

function SidebarGroup({
  title,
  items,
  activeMenu,
  onClose,
}: {
  title?: string;
  items: MenuItem[];
  activeMenu?: string;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className={title ? styles.group : undefined}>
      {title ? <p className={styles.title}>{title}</p> : null}

      <nav className={styles.nav}>
        {items.map((item) => (
          <SidebarItem
            key={item.key}
            item={item}
            active={isActiveMenu(pathname, item, activeMenu)}
            onClose={onClose}
          />
        ))}
      </nav>
    </div>
  );
}

export function Sidebar({ activeMenu, isOpen = true, onClose }: SidebarProps) {
  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Tutup sidebar"
          className={styles.overlay}
          onClick={onClose}
        />
      ) : null}

      <aside
        className={classNames(
          styles.sidebar,
          isOpen ? styles.open : styles.closed
        )}
      >
        <button
          type="button"
          className={styles.logoButton}
          onClick={onClose}
          aria-label="Tutup sidebar"
          title="Klik untuk menutup sidebar"
        >
          <BrandMark />
        </button>

        <div className={styles.scrollArea}>
          <SidebarGroup
            items={mainMenus}
            activeMenu={activeMenu}
            onClose={onClose}
          />

          <SidebarGroup
            title="Dashboard Role"
            items={dashboardRoleMenus}
            activeMenu={activeMenu}
            onClose={onClose}
          />

          <SidebarGroup
            title="Pengaturan"
            items={settingMenus}
            activeMenu={activeMenu}
            onClose={onClose}
          />
        </div>
      </aside>
    </>
  );
}

export default Sidebar;