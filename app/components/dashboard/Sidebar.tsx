"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "../auth/BrandMark";
import { getSidebarGroups } from "../config/sidebarMenus";
import type { MenuItem } from "../types/menu";
import styles from "./Sidebar.module.css";

type SidebarProps = {
  activeMenu?: string;
  isOpen?: boolean;
  onClose?: () => void;
  role?: string;
};

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isActiveMenu(pathname: string, item: MenuItem, activeMenu?: string) {
  if (activeMenu === item.key || activeMenu === item.label) {
    return true;
  }

  if (pathname === item.href) {
    return true;
  }

  if (item.href !== "/" && pathname.startsWith(`${item.href}/`)) {
    return true;
  }

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

  if (items.length === 0) {
    return null;
  }

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

export function Sidebar({
  activeMenu,
  isOpen = true,
  onClose,
  role = "guest",
}: SidebarProps) {
  const sidebarGroups = getSidebarGroups(role);

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
          {sidebarGroups.map((group, index) => (
            <SidebarGroup
              key={`${group.title ?? "main"}-${index}`}
              title={group.title}
              items={group.items}
              activeMenu={activeMenu}
              onClose={onClose}
            />
          ))}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;