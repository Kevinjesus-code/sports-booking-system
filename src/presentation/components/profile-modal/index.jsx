import styles from "./profile-modal.module.css";

const ProfileModal = ({ client, reservationCount = 0, onClose, onViewAccount }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.modalHeader}>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
          <div className={styles.avatarLarge}>
            {client.nombre
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <h2 className={styles.clientName}>{client.nombre}</h2>
          <span className={styles.clientTag}>Cliente</span>
        </div>

        {/* BODY */}
        <div className={styles.modalBody}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Correo</span>
            <span className={styles.infoValue}>{client.email}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Teléfono</span>
            <span className={styles.infoValue}>{client.telefono}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Reservas</span>
            <span className={styles.infoValue}>{reservationCount}</span>
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={styles.accountBtn}
              onClick={() => {
                onViewAccount?.();
                onClose();
              }}
            >
              👁️ Ver cuenta
            </button>

            <button className={styles.logoutBtn}>🚪 Cerrar sesión</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
