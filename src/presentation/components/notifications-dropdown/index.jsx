import styles from "./notifications-dropdown.module.css";

const CheckAllIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/**
 * NotificationsDropdown
 *
 * Props:
 *  - notifications: array de objetos { id, text, sub, unread }
 *                   o array de strings (compatibilidad con el formato original)
 *  - onItemClick(item): callback al hacer click en un item
 *  - onMarkAll(): callback opcional para marcar todo como leído
 */
const NotificationsDropdown = ({ notifications = [], onItemClick, onMarkAll }) => {
  // Normalizar: soporta tanto strings como objetos
  const items = notifications.map((n, i) =>
    typeof n === "string"
      ? { id: i, text: n, sub: null, unread: true }
      : n
  );

  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <div className={styles["notif-dropdown"]}>
      {/* Header */}
      <div className={styles["notif-dropdown-header"]}>
        <div className={styles["notif-dropdown-title-wrap"]}>
          <span className={styles["notif-dropdown-title"]}>Notificaciones</span>
          {unreadCount > 0 && (
            <span className={styles["notif-dropdown-count"]}>{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && onMarkAll && (
          <button className={styles["notif-mark-all-btn"]} onClick={onMarkAll}>
            <CheckAllIcon />
            Marcar todo
          </button>
        )}
      </div>

      {/* List */}
      <div className={styles["notif-dropdown-list"]}>
        {items.length === 0 ? (
          <div className={styles["notif-empty"]}>
            <span>Sin notificaciones</span>
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              className={`${styles["notif-item"]} ${item.unread ? styles["notif-item--unread"] : ""}`}
              onClick={() => onItemClick && onItemClick(item)}
            >
              <span className={`${styles["notif-item-dot"]} ${item.unread ? styles["notif-item-dot--active"] : ""}`} />
              <span className={styles["notif-item-body"]}>
                <span className={styles["notif-item-text"]}>{item.text}</span>
                {item.sub && <span className={styles["notif-item-sub"]}>{item.sub}</span>}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className={styles["notif-dropdown-footer"]}>
        <button className={styles["notif-see-all-btn"]}>Ver todas</button>
      </div>
    </div>
  );
};

export default NotificationsDropdown;