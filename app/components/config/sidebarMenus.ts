import type { MenuItem, SidebarGroupConfig } from "../types/menu";

const adminMainMenus: MenuItem[] = [
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
  { key: "dashboard-dokter", label: "Dashboard Dokter", href: "/dashboard/dokter", icon: "D" },
  { key: "dashboard-patient", label: "Dashboard Pasien", href: "/dashboard/patient", icon: "P" },
  { key: "dashboard-nurse", label: "Dashboard Perawat", href: "/dashboard/nurse", icon: "N" },
  { key: "dashboard-pharmacy", label: "Dashboard Farmasi", href: "/dashboard/pharmacy", icon: "F" },
  { key: "dashboard-lab", label: "Dashboard Lab", href: "/dashboard/laboratory", icon: "L" },
];

const adminSettingMenus: MenuItem[] = [
  { key: "profile", label: "Profil Saya", href: "/profile", icon: "◉" },
  { key: "change-password", label: "Ubah Password", href: "/change-password", icon: "◇" },
  { key: "users", label: "Pengguna", href: "/users", icon: "U" },
  { key: "roles", label: "Role & Hak Akses", href: "/roles", icon: "R" },
  { key: "permissions", label: "Permission", href: "/permissions", icon: "☑" },
  { key: "notifications", label: "Notifikasi", href: "/notifications", icon: "N" },
  { key: "notification-settings", label: "Pengaturan Notifikasi", href: "/notification-settings", icon: "⚙" },
  { key: "activity-logs", label: "Log Aktivitas", href: "/activity-logs", icon: "⌁" },
  { key: "login-history", label: "Riwayat Login", href: "/login-history", icon: "↪" },
  { key: "activity-report", label: "Laporan Aktivitas", href: "/activity-report", icon: "▥" },
];

const dokterMenus: MenuItem[] = [
  { key: "dashboard-dokter", label: "Dashboard", href: "/dashboard/dokter", icon: "D" },
  { key: "dokter-patients", label: "Pasien", href: "/dashboard/dokter/patients", icon: "◎" },
  { key: "dokter-examinations", label: "Pemeriksaan", href: "/dashboard/dokter/examinations", icon: "✚" },
  { key: "dokter-medical-records", label: "Rekam Medis", href: "/dashboard/dokter/medical-records", icon: "▣" },
  { key: "dokter-prescriptions", label: "Resep", href: "/dashboard/dokter/prescriptions", icon: "℞" },
  { key: "dokter-lab-requests", label: "Permintaan Lab", href: "/dashboard/dokter/lab-requests", icon: "⚕" },
];

const basicSettingMenus: MenuItem[] = [
  { key: "notifications", label: "Notifikasi", href: "/notifications", icon: "N" },
  { key: "profile", label: "Profil Saya", href: "/profile", icon: "◉" },
  { key: "change-password", label: "Ubah Password", href: "/change-password", icon: "◇" },
];

const patientMenus: MenuItem[] = [
  { key: "dashboard-patient", label: "Dashboard", href: "/dashboard/patient", icon: "P" },
];

const nurseMenus: MenuItem[] = [
  { key: "dashboard-nurse", label: "Dashboard", href: "/dashboard/nurse", icon: "N" },
  { key: "patients", label: "Pasien", href: "/patients", icon: "◎" },
  { key: "registration", label: "Pendaftaran", href: "/registration", icon: "✚" },
  { key: "outpatient", label: "Rawat Jalan", href: "/outpatient", icon: "▣" },
  { key: "inpatient", label: "Rawat Inap", href: "/inpatient", icon: "▤" },
];

const pharmacyMenus: MenuItem[] = [
  { key: "dashboard-pharmacy", label: "Dashboard", href: "/dashboard/pharmacy", icon: "F" },
  { key: "pharmacy", label: "Farmasi", href: "/dashboard/pharmacy", icon: "✦" },
];

const labMenus: MenuItem[] = [
  { key: "dashboard-lab", label: "Dashboard", href: "/dashboard/laboratory", icon: "L" },
  { key: "laboratory", label: "Laboratorium", href: "/dashboard/laboratory", icon: "⚕" },
];

function normalizeRole(role?: string) {
  const normalizedRole = role?.trim().toLowerCase();

  if (!normalizedRole) return "guest";

  if (["super_admin"].includes(normalizedRole)) {
    return "super_admin";
  }

  if (["admin" ].includes(normalizedRole)) {
    return "admin";
  }

  if (["dokter"].includes(normalizedRole)) {
    return "dokter";
  }

  if (["patient", "pasien"].includes(normalizedRole)) {
    return "pasien";
  }

  if (["nurse", "perawat"].includes(normalizedRole)) {
    return "perawat";
  }

  if (["pharmacy", "farmasi", "apoteker", "pharmacist"].includes(normalizedRole)) {
    return "apoteker";
  }

  if (["lab", "laboratory", "laboratorium"].includes(normalizedRole)) {
    return "laboratorium";
  }

  return "guest";
}

export function getSidebarGroups(role?: string): SidebarGroupConfig[] {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "guest") {
    return [];
  }

  if (normalizedRole === "super_admin") {
    return [
      { items: adminMainMenus },
      { items: adminSettingMenus },
      { title: "Dashboard Role", items: dashboardRoleMenus },
      { title: "Pengaturan", items: adminSettingMenus },
    ];
  }

  if (normalizedRole === "admin") {
    return [
      { items: adminMainMenus },
        { title: "Dashboard Role", items: dashboardRoleMenus },
        { title: "Pengaturan", items: adminSettingMenus },
    ];
  }

  if (normalizedRole === "dokter") {
    return [
      { items: dokterMenus },
      { title: "Pengaturan", items: basicSettingMenus },
    ];
  }

  if (normalizedRole === "pasien") {
    return [
      { items: patientMenus },
      { title: "Pengaturan", items: basicSettingMenus },
    ];
  }

  if (normalizedRole === "perawat") {
    return [
      { items: nurseMenus },
      { title: "Pengaturan", items: basicSettingMenus },
    ];
  }

  if (normalizedRole === "apoteker") {
    return [
      { items: pharmacyMenus },
      { title: "Pengaturan", items: basicSettingMenus },
    ];
  }

  if (normalizedRole === "laboratorium") {
    return [
      { items: labMenus },
      { title: "Pengaturan", items: basicSettingMenus },
    ];
  }

  return [
    { items: adminMainMenus },
    { title: "Dashboard Role", items: dashboardRoleMenus },
    { title: "Pengaturan", items: adminSettingMenus },
  ];
}