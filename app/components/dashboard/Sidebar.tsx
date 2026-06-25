import Link from "next/link";
import { BrandMark } from "../auth/BrandMark";

type MenuItem = {
  label: string;
  href: string;
  icon: string;
  active?: boolean;
};

const mainMenus: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "▦" },
  { label: "Pasien", href: "/patients", icon: "◎" },
  { label: "Pendaftaran", href: "/registration", icon: "✚" },
  { label: "Rawat Jalan", href: "/outpatient", icon: "▣" },
  { label: "Rawat Inap", href: "/inpatient", icon: "▤" },
  { label: "Farmasi", href: "/pharmacy", icon: "✦" },
  { label: "Laboratorium", href: "/laboratory", icon: "⚕" },
  { label: "Billing", href: "/billing", icon: "◈" },
  { label: "Inventori", href: "/inventory", icon: "▧" },
  { label: "Laporan", href: "/reports", icon: "☷" },
];

const settingMenus: MenuItem[] = [
  { label: "Pengguna", href: "/profile", icon: "◉", active: true },
  { label: "Role & Hak Akses", href: "/roles", icon: "◇" },
  { label: "Audit Trail", href: "/audit-trail", icon: "⌁" },
];

function SidebarItem({ item }: { item: MenuItem }) {
  return (
    <Link
      href={item.href}
      className={
        item.active
          ? "his-sidebar-link his-sidebar-link-active"
          : "his-sidebar-link"
      }
    >
      <span className="his-sidebar-icon">{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="his-sidebar">
      <div className="his-sidebar-logo">
        <BrandMark />
      </div>

      <nav className="his-sidebar-nav">
        {mainMenus.map((item) => (
          <SidebarItem key={item.href} item={item} />
        ))}
      </nav>

      <div className="his-sidebar-group">
        <p className="his-sidebar-title">Pengaturan</p>

        <nav className="his-sidebar-nav">
          {settingMenus.map((item) => (
            <SidebarItem key={item.href} item={item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}