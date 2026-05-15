import { useEffect } from "react";
import styles from "./modal.module.css";

/**
 * DSAModal — componente modal base reutilizable.
 *
 * Props:
 *  - isOpen      {boolean}    Controla la visibilidad
 *  - onClose     {function}   Callback al cerrar
 *  - title       {string}     Título del modal
 *  - subtitle    {string}     Subtítulo opcional
 *  - size        {"sm"|"md"|"lg"}  Ancho del modal (default "md")
 *  - children    {ReactNode}  Contenido del cuerpo
 *  - footer      {ReactNode}  Contenido del footer (botones)
 */
const Modal = ({ isOpen, onClose, title, subtitle, size = "md", children, footer }) => {
  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Bloquear scroll del body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${styles[`modal-${size}`]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>{children}</div>

        {/* Footer */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
