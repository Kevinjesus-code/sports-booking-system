import { useEffect } from "react";
import styles from "./court-modal.module.css";

/* ── Íconos inline reutilizables ── */
const IconPin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* Mapa de íconos por clave de característica */
const FEATURE_ICONS = {
  surface: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
  ),
  capacity: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="7" r="4" />
      <path d="M17 11c2 0 4 1.8 4 4v1H13v-1c0-2.2 2-4 4-4z" />
      <path d="M1 20v-1c0-2.2 1.8-4 4-4h4" />
    </svg>
  ),
  lighting: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  covered: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  size: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  ),
  bathrooms: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12h16" />
      <path d="M4 12V6a2 2 0 0 1 2-2h2" />
      <path d="M4 12v4a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4" />
    </svg>
  ),
};

const FEATURE_LABELS = {
  surface:   "Superficie",
  capacity:  "Capacidad",
  lighting:  "Iluminación",
  covered:   "Techado",
  size:      "Tamaño",
  bathrooms: "Baños",
};

/* ── Componente principal ── */
const CourtModal = ({ court, onClose, onReserve }) => {
  /* Cerrar con Escape */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  /* Bloquear scroll del body mientras el modal está abierto */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!court) return null;

  const featureKeys = ["surface", "capacity", "lighting", "covered", "size", "bathrooms"];

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles de ${court.name}`}
      onClick={handleOverlayClick}
    >
      <div className={styles.panel}>

        {/* ── Cabecera flotante con botón cerrar ── */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          type="button"
          aria-label="Cerrar modal"
        >
          <IconClose />
        </button>

        {/* ── Imagen grande ── */}
        <div className={styles.imageWrapper}>
          <img
            src={court.image}
            alt={court.name}
            className={styles.image}
          />

          {/* Badge de precio sobre imagen */}
          <div className={styles.priceBadge}>
            <span className={styles.priceAmount}>S/ {court.price}</span>
            <span className={styles.priceUnit}> / hora</span>
          </div>
        </div>

        {/* ── Contenido principal ── */}
        <div className={styles.content}>

          {/* Nombre */}
          <h2 className={styles.name}>{court.name}</h2>

          {/* Dirección completa */}
          {court.address && (
            <div className={styles.addressRow}>
              <IconPin />
              <span>{court.address}</span>
            </div>
          )}

          {/* ── Características completas ── */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Características</h3>
            <ul className={styles.featuresGrid}>
              {featureKeys.map((key) =>
                court[key] ? (
                  <li key={key} className={styles.featureItem}>
                    <span className={styles.featureIcon}>{FEATURE_ICONS[key]}</span>
                    <div className={styles.featureText}>
                      <span className={styles.featureLabel}>{FEATURE_LABELS[key]}</span>
                      <span className={styles.featureValue}>{court[key]}</span>
                    </div>
                  </li>
                ) : null
              )}
            </ul>
          </section>

          {/* ── Reglas ── */}
          {court.rules && court.rules.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Reglas y condiciones</h3>
              <ul className={styles.rulesList}>
                {court.rules.map((rule, i) => (
                  <li key={i} className={styles.ruleItem}>
                    <span className={styles.ruleDot} aria-hidden="true" />
                    {rule}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* ── Pie de acciones ── */}
        <div className={styles.footer}>
          <button
            className={styles.btnOutline}
            onClick={onClose}
            type="button"
          >
            Cerrar
          </button>
          <button
            className={styles.btnSolid}
            onClick={() => { onReserve?.(court); onClose?.(); }}
            type="button"
          >
            Ver disponibilidad
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourtModal;
