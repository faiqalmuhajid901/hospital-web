export type MenuItem = {
  key: string;
  label: string;
  href: string;
  icon: string;
};

export type SidebarGroupConfig = {
  title?: string;
  items: MenuItem[];
};

export type DashboardRole =
  | "guest"
  | "super_admin"
  | "admin"
  | "dokter"
  | "pasien"
  | "perawat"
  | "apoteker"
  | "laboratorium"