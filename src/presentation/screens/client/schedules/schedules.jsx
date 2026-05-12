// presentation/screens/client/schedules/schedules.jsx
//
// FIX precio S/0.00:
// Horario.java NO tiene campo precio — el precio pertenece a Cancha.
// → price se toma de court.precio ?? court.precioPorHora ?? 0
//   y se inyecta en cada slot al mapear la respuesta del backend.

import { useState } from "react";
import styles from "./schedules.module.css";
import { useAvailableSlots } from "../../../../hooks/useReservations";

const Schedules = ({ court, onBack, onSelectSchedule }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { slots: rawSlots, loading, error } = useAvailableSlots(court?.id, selectedDate);

  // El precio vive en Cancha, no en Horario → lo tomamos del prop court
  // Soporta los nombres más comunes del campo en el backend Java
  const courtPrice =
    court?.precio          ??
    court?.precioPorHora   ??
    court?.precio_por_hora ??
    court?.price           ??
    0;

  // Mapea TimeSlot al shape que usa la UI, inyectando el precio de la cancha
  const schedules = rawSlots.map((s) => ({
    id:        s.id,
    time:      `${s.startTime} - ${s.endTime}`,
    status:    s.available ? "disponible" : "ocupado",
    startTime: s.startTime,
    endTime:   s.endTime,
    price:     s.price > 0 ? s.price : courtPrice,
  }));

  const getStatusText = (status) => {
    switch (status) {
      case "disponible": return "Disponible";
      case "ocupado":    return "Ocupado";
      case "reservado":  return "Reservado";
      default:           return "";
    }
  };

  const handleSelect = (schedule) => {
    if (schedule.status !== "disponible") return;
    onSelectSchedule?.(schedule, selectedDate);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className={styles.title}>{court?.titulo || court?.nombre || "Cancha"}</h1>
          <p className={styles.subtitle}>Selecciona fecha y horario disponible</p>
        </div>
      </header>

      <section className={styles.dateSection}>
        <div className={styles.dateLabel}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Selecciona la fecha
        </div>
        <div className={styles.dateInputContainer}>
          <input
            type="date"
            className={styles.dateInput}
            value={selectedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </section>

      <section className={styles.schedulesSection}>
        <div className={styles.schedulesHeader}>
          <h2 className={styles.schedulesTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Horarios disponibles
          </h2>
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.dotDisponible}`} /> Disponible
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.dotOcupado}`} /> Ocupado
            </span>
          </div>
        </div>

        {loading && <p className={styles.loadingText}>Cargando horarios...</p>}
        {error   && <p className={styles.errorText}>{error}</p>}
        {!loading && !error && schedules.length === 0 && (
          <p className={styles.emptyText}>No hay horarios disponibles para esta fecha.</p>
        )}

        <div className={styles.grid}>
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`${styles.card} ${styles[schedule.status]}`}
              onClick={() => handleSelect(schedule)}
            >
              <div className={styles.time}>{schedule.time}</div>
              {schedule.status === "disponible" && courtPrice > 0 && (
                <div className={styles.price}>S/ {courtPrice.toFixed(2)}</div>
              )}
              <span className={`${styles.badge} ${styles["badge-" + schedule.status]}`}>
                {getStatusText(schedule.status)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Schedules;