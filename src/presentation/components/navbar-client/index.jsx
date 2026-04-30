import styles from "./navbar.module.css";

const Navbar = ({ 
  initials = "U", 
  onOpenReservations, 
  reservationCount = 0,
  onHome,          // ← NUEVO
  onOpenProfile,   // ← NUEVO
}) => {
  return (
    <nav className={styles.navbar}>
      {/* Left */}
      <div className={styles.left}>
        <button className={styles.homeIcon} onClick={onHome} aria-label="Inicio">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 10v10h14V10" />
          </svg>
        </button>
        <span className={styles.brand}>Kancha</span>
      </div>

      {/* Center */}
      <div className={styles.center}>
        <div className={styles.searchWrapper}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar canchas..."
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Right */}
      <div className={styles.right}>
        <button
          className={styles.iconBtn}
          onClick={onOpenReservations}
          aria-label="Ver mis reservas"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          {reservationCount > 0 && (
            <span className={styles.badge}>{reservationCount}</span>
          )}
        </button>

        {/* Avatar como botón ← NUEVO */}
        <button 
          className={styles.avatar} 
          onClick={onOpenProfile}
          aria-label="Ver perfil"
        >
          {initials}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;