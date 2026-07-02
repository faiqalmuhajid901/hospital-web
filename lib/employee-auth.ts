
export function normalizeRole(role: string | null | undefined) {
  return role?.trim().toLowerCase();
}

export function isEmployeeRole(role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) return false;

  return [
    "dokter",
    "perawat",
    "apoteker",
    "laboratorium",
    "akuntan",
    "admin",
    "super_admin",
    "employee",
    "pegawai",
  ].includes(normalizedRole);
}

export function getRedirectByRole(role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);

  switch (normalizedRole) {
    case "dokter":
      return "/dashboard/dokter";

    case "perawat":
      return "/dashboard/perawat";

    case "apoteker":
      return "/dashboard/apoteker";

    case "laboratorium":
      return "/dashboard/laboratorium";

    case "akuntan":
      return "/dashboard/akuntan";

    case "admin":
      return "/dashboard/admin";

    case "super_admin":
      return "/dashboard/super_admin";
    case "employee":
    case "pegawai":
      return "/dashboard/admin";

    default:
      return "login";
  }
}