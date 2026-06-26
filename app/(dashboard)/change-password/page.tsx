import { DashboardShell } from "../../components/dashboard/DashboardShell";
import styles from "./changePassword.module.css";

export default function ChangePasswordPage() {
  return (
    <DashboardShell title="Ubah Password" activeMenu="change-password">
      <div className={styles.page}>
        <h2 className={styles.title}>Ubah Password</h2>

        <p className={styles.description}>
          Pastikan password baru Anda kuat dan aman.
        </p>

        <section className={styles.card}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="oldPassword">
              Password Saat Ini
            </label>

            <div className={styles.inputWrap}>
              <input
                id="oldPassword"
                type="password"
                placeholder="Masukkan password saat ini"
                className={styles.input}
              />
              <span className={styles.inputIcon}>👁</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="newPassword">
              Password Baru
            </label>

            <div className={styles.inputWrap}>
              <input
                id="newPassword"
                type="password"
                placeholder="Minimal 8 karakter"
                className={styles.input}
              />
              <span className={styles.inputIcon}>👁</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="confirmPassword">
              Konfirmasi Password Baru
            </label>

            <div className={styles.inputWrap}>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi password baru"
                className={styles.input}
              />
              <span className={styles.inputIcon}>👁</span>
            </div>
          </div>

          <div className={styles.rules}>
            <p className={styles.rulesTitle}>Password harus mengandung:</p>

            <ul className={styles.rulesList}>
              <li>
                <span className={styles.checkDot}>✓</span>
                Minimal 8 karakter
              </li>
              <li>
                <span className={styles.checkDot}>✓</span>
                Huruf besar dan kecil
              </li>
              <li>
                <span className={styles.checkDot}>✓</span>
                Angka
              </li>
              <li>
                <span className={styles.checkDot}>✓</span>
                Simbol, contoh: !@#$%
              </li>
            </ul>
          </div>

          <button type="button" className={styles.primaryButton}>
            Simpan Password
          </button>
        </section>
      </div>
    </DashboardShell>
  );
}