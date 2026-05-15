import { useEffect, useState } from "react";
import styles from "./toast.module.css";

/**
 * DSAToast — notificación de feedback flotante.
 *
 * Props:
 *  - message   {string}
 *  - type      {"success"|"error"|"info"|"warning"}
 *  - isVisible {boolean}
 *  - onClose   {function}
 *  - duration  {number}  ms antes de auto-cerrar (default 3000)
 */
const Toast = ({ message, type = "success", isVisible, onClose, duration = 3000 }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    setExiting(false);
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onClose?.(), 280);
    }, duration);
    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 9" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  };

  return (
    <div className={`${styles.toast} ${styles[`toast-${type}`]} ${exiting ? styles.exit : ""}`}>
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={() => { setExiting(true); setTimeout(() => onClose?.(), 280); }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
