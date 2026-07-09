import styles from "./BrandMark.module.css";


export function BrandMark() {
  return (
    <div className={styles.root}>
      <div className={styles.logo}>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={styles.icon}
        >
          <path
            d="
              M12 21
              s-7.5-4.28-7.5-11.3
              V5.6
              L12 3
              l7.5 2.6
              v4.1
              C19.5 16.72 12 21 12 21
              Z

              m-3.7-10.2
              h2.45
              V8.35
              h2.5
              v2.45
              h2.45
              v2.5
              h-2.45
              v2.45
              h-2.5
              V13.3
              H8.3
              v-2.5
              Z
            "
          />
        </svg>
      </div>

      <div className={styles.text}>
        <p className={styles.title}>
          Medisystem{" "}
          <span className={styles.highlight}>
            HIS
          </span>
        </p>

        <p className={styles.subtitle}>
          Hospital Information System
        </p>
      </div>
    </div>
  );
}