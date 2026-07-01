
export function normalizeRole(role: string | null | undefined) {
  return role?.trim().toLowerCase();
}

export function isEmployeeRole(role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) return false;

  return [
    "dokter",
    "doctor",
    "perawat",
    "nurse",
    "apoteker",
    "pharmacist",
    "laboratorium",
    "laboratory",
    "lab",
    "akuntan",
    "accountant",
    "admin",
    "super admin",
    "employee",
    "pegawai",
  ].includes(normalizedRole);
}

export function getRedirectByRole(role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);

  switch (normalizedRole) {
    case "dokter":
    case "doctor":
      return "/dashboard/doctor";

    case "perawat":
    case "nurse":
      return "/dashboard/nurse";

    case "apoteker":
    case "pharmacist":
      return "/dashboard/pharmacy";

    case "laboratorium":
    case "laboratory":
    case "lab":
      return "/dashboard/laboratory";

    case "akuntan":
    case "accountant":
      return "/dashboard/billing";

    case "admin":
    case "super_admin":
    case "super admin":
    case "employee":
    case "pegawai":
      return "/dashboard/admin";

    default:
      return "/dashboard/admin";
  }
}