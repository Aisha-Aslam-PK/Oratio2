import styles from './Header.module.css'

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>
        </div>
        <span className={styles.appTitle}>Oratio2.0</span>
      </div>
      <div className={styles.appSubtitle}>Academic presentation coach for postgraduate researchers</div>
      <div>
        <span className={styles.tedBadge}>
          <span className={styles.tedDot} />
          Inspired by TED Talks &amp; 3MT standards
        </span>
      </div>
    </div>
  )
}
