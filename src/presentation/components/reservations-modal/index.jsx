import styles from "./reservations-modal.module.css";

const ReservationsModal = ({ reservations, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Mis reservas</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          {reservations.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>📋</span>
              <p>No tienes reservas aún</p>
            </div>
          ) : (
            reservations.map((r) => (
              <div key={r.id} className={styles.reservationItem}>
                <div className={styles.itemIcon}>{r.court?.icono || "⚽"}</div>
                <div className={styles.itemInfo}>
                  <span className={styles.itemCourt}>
                    {r.court?.titulo || "Cancha"}
                  </span>
                  <span className={styles.itemMeta}>
                    📅 {r.date} &nbsp;·&nbsp; 🕐 {r.schedule?.time}
                  </span>
                  <span className={styles.itemCustomer}>
                    👤 {r.customer?.nombre}
                  </span>
                </div>
                <span className={styles.itemBadge}>Confirmada</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default ReservationsModal;