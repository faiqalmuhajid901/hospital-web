import { DashboardShell } from "../../components/dashboard/DashboardShell";

type ProfileRowProps = {
  label: string;
  value: string;
};

const profileRows: ProfileRowProps[] = [
  {
    label: "Email",
    value: "azita.putri@rumahsakit.ac.id",
  },
  {
    label: "No. HP",
    value: "0813-3456-7900",
  },
  {
    label: "Username",
    value: "azita.putri",
  },
  {
    label: "NIK",
    value: "3273046607980001",
  },
  {
    label: "Tanggal Lahir",
    value: "15 Januari 1990",
  },
  {
    label: "Alamat",
    value: "Jl. Melati No. 12, Bandung",
  },
  {
    label: "Bergabung Sejak",
    value: "12 Mei 2022 08:35",
  },
];

function ProfileRow({ label, value }: ProfileRowProps) {
  return (
    <div className="his-profile-row">
      <p className="his-profile-label">{label}</p>
      <p className="his-profile-value">{value}</p>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <DashboardShell title="Profil Saya">
      <div className="his-profile-wrap">
        <h2 className="his-page-title">Profil Saya</h2>

        <p className="his-page-description">
          Kelola informasi akun dan identitas pengguna.
        </p>

        <section className="his-profile-card">
          <div className="his-profile-header">
            <div className="his-profile-identity">
              <div className="his-profile-avatar-wrap">
                <div className="his-profile-avatar">AP</div>
                <span className="his-status-badge">Aktif</span>
              </div>

              <div>
                <h3 className="his-profile-name">dr. Azita Putri</h3>
                <p className="his-profile-job">Dokter Umum</p>
                <p className="his-profile-unit">Poli Umum</p>
              </div>
            </div>

            <button type="button" className="his-edit-button">
              Edit Profil
            </button>
          </div>

          <div className="his-profile-grid">
            <div className="his-profile-detail">
              {profileRows.map((row) => (
                <ProfileRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                />
              ))}
            </div>

            <aside className="his-account-summary">
              <p className="his-summary-title">Ringkasan Akun</p>

              <div className="his-summary-list">
                <div className="his-summary-item">
                  <p className="his-summary-label">Role</p>
                  <p className="his-summary-value">Dokter</p>
                </div>

                <div className="his-summary-item">
                  <p className="his-summary-label">Hak Akses</p>
                  <p className="his-summary-value">
                    Rekam Medis, Appointment, Rawat Jalan
                  </p>
                </div>

                <div className="his-summary-item">
                  <p className="his-summary-label">Status Akun</p>
                  <span className="his-summary-status">Aktif</span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}