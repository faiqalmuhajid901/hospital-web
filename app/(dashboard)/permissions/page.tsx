import { DashboardShell } from "../../components/dashboard/DashboardShell";
import styles from "./permissions.module.css";

type PermissionKey = "view" | "create" | "edit" | "delete" | "print" | "export";

type ModulePermission = {
  module: string;
  permissions: Record<PermissionKey, boolean>;
};

const permissionColumns: { key: PermissionKey; label: string }[] = [
  { key: "view", label: "Lihat" },
  { key: "create", label: "Tambah" },
  { key: "edit", label: "Ubah" },
  { key: "delete", label: "Hapus" },
  { key: "print", label: "Cetak" },
  { key: "export", label: "Export" },
];

const modulePermissions: ModulePermission[] = [
  {
    module: "Dashboard",
    permissions: {
      view: true,
      create: true,
      edit: false,
      delete: false,
      print: false,
      export: false,
    },
  },
  {
    module: "Pasien",
    permissions: {
      view: true,
      create: true,
      edit: false,
      delete: false,
      print: false,
      export: true,
    },
  },
  {
    module: "Pendaftaran",
    permissions: {
      view: true,
      create: true,
      edit: false,
      delete: false,
      print: false,
      export: true,
    },
  },
  {
    module: "Rawat Jalan",
    permissions: {
      view: true,
      create: false,
      edit: true,
      delete: true,
      print: true,
      export: false,
    },
  },
  {
    module: "Rawat Inap",
    permissions: {
      view: true,
      create: false,
      edit: true,
      delete: false,
      print: false,
      export: false,
    },
  },
  {
    module: "Billing",
    permissions: {
      view: false,
      create: false,
      edit: true,
      delete: false,
      print: false,
      export: false,
    },
  },
  {
    module: "Farmasi",
    permissions: {
      view: false,
      create: true,
      edit: true,
      delete: true,
      print: true,
      export: false,
    },
  },
  {
    module: "Laboratorium",
    permissions: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      print: false,
      export: false,
    },
  },
  {
    module: "Laporan",
    permissions: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      print: true,
      export: false,
    },
  },
  {
    module: "Pengaturan",
    permissions: {
      view: false,
      create: true,
      edit: true,
      delete: false,
      print: false,
      export: false,
    },
  },
];

export default function PermissionsPage() {
  return (
    <DashboardShell title="Manajemen Permission" activeMenu="permissions">
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Manajemen Permission</h2>
            <p className={styles.description}>
              Atur hak akses setiap role berdasarkan modul dan aksi pengguna.
            </p>
          </div>

          <button type="button" className={styles.primaryButton}>
            Simpan Perubahan
          </button>
        </div>

        <section className={styles.card}>
          <div className={styles.toolbar}>
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel} htmlFor="role">
                Pilih Role
              </label>

              <select id="role" className={styles.select} defaultValue="dokter">
                <option value="admin">Admin</option>
                <option value="dokter">Dokter</option>
                <option value="perawat">Perawat</option>
                <option value="kasir">Kasir</option>
                <option value="farmasi">Farmasi</option>
              </select>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Modul</th>
                  {permissionColumns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {modulePermissions.map((item) => (
                  <tr key={item.module}>
                    <td>{item.module}</td>
                    {permissionColumns.map((column) => (
                      <td key={column.key}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          defaultChecked={item.permissions[column.key]}
                          aria-label={`${column.label} ${item.module}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.footerNote}>
            <span className={styles.legend}>
              <span className={styles.legendBoxAllowed} />
              Diizinkan
            </span>

            <span className={styles.legend}>
              <span className={styles.legendBoxDenied} />
              Tidak diizinkan
            </span>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}