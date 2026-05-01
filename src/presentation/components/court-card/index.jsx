import styles from "./court-card.module.css";

const CourtCard = ({ court, onViewDetails, onReserve }) => {
  return (
    <article className={styles.card}>
      {/* ── Imagen ── */}
      <div className={styles.imageWrapper}>
        <img
          src={court.image}
          alt={court.name}
          className={styles.image}
          loading="lazy"
        />

        {/* Badge de precio sobre la imagen */}
        <div className={styles.priceBadge}>
          <span className={styles.priceAmount}>S/ {court.price}</span>
          <span className={styles.priceUnit}> / hora</span>
        </div>
      </div>

      {/* ── Info ── */}
      <div className={styles.body}>
        {/* Nombre y ubicación */}
        <div className={styles.header}>
          <h3 className={styles.name}>{court.name}</h3>
          <div className={styles.location}>
            <svg
              width="13" height="13" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.2"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span>{court.location}</span>
          </div>
        </div>

        {/* Características resumidas */}
        <ul className={styles.chips}>
          {court.surface && (
            <li className={styles.chip}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              {court.surface}
            </li>
          )}
          {court.capacity && (
            <li className={styles.chip}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="9" cy="7" r="4" />
                <path d="M17 11c2 0 4 1.8 4 4v1H13v-1c0-2.2 2-4 4-4z" />
                <path d="M1 20v-1c0-2.2 1.8-4 4-4h4" />
              </svg>
              {court.capacity}
            </li>
          )}
          {court.lighting && (
            <li className={styles.chip}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              {court.lighting}
            </li>
          )}
        </ul>

        {/* Acciones */}
        <div className={styles.actions}>
          <button
            className={styles.btnOutline}
            onClick={() => onViewDetails?.(court)}
            type="button"
            aria-label={`Ver detalles de ${court.name}`}
          >
            Ver detalles
          </button>
          <button
            className={styles.btnSolid}
            onClick={() => onReserve?.(court)}
            type="button"
            aria-label={`Reservar ${court.name} ahora`}
          >
            Reservar ahora
          </button>
        </div>
      </div>
    </article>
  );
};

export default CourtCard;