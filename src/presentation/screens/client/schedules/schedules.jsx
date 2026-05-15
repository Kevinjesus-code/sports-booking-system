// presentation/screens/client/schedules/schedules.jsx
//
// Horarios dinámicos desde GET /api/canchas/{id}/disponibilidad (disponible/ocupado en servidor).

import { useMemo, useState } from "react";
import styles from "./schedules.module.css";
import { useCourtAvailability } from "../../../hooks/useReservations";

const getToday = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().split("T")[0];
};

const normalizeTime = (time) => (time ? String(time).slice(0, 5) : "");

const normalizeScheduleSlot = (slot) => {
  const startTime = normalizeTime(slot.startTime ?? slot.horaInicio);
  const endTime = normalizeTime(slot.endTime ?? slot.horaFin);
  return {
    ...slot,
    id: slot.id ?? `${startTime}-${endTime}`,
    startTime,
    endTime,
  };
};

const Schedules = ({ court, onBack, onSelectSchedule }) => {
  const today = getToday();
  const [selectedDate, setSelectedDate] = useState(today);

  const {
    slots: availabilitySlots,
    loading,
    error,
  } = useCourtAvailability(court?.id ?? court?.canchaId, selectedDate);

  const courtPrice =
    court?.precio ??
    court?.precioPorHora ??
    court?.precio_por_hora ??
    court?.price ??
    0;

  const schedules = useMemo(() => {
    return availabilitySlots
      .map(normalizeScheduleSlot)
      .filter((slot) => slot.startTime && slot.endTime)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map((slot) => {
        const libre = slot.disponible !== false && slot.available !== false;
        return {
          ...slot,
          time: `${slot.startTime} - ${slot.endTime}`,
          status: libre ? "disponible" : "ocupado",
          price: courtPrice,
        };
      });
  }, [availabilitySlots, courtPrice]);

  const getStatusText = (status) => {
    switch (status) {
      case "disponible":
        return "Disponible";
      case "ocupado":
        return "Ocupado";
      default:
        return "";
    }
  };

  const handleSelect = (schedule) => {
    if (schedule.status !== "disponible") return;
    onSelectSchedule?.(schedule, selectedDate);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button type="button" onClick={onBack} className={styles.backButton}>
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
            min={today}
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

        {loading && <p className={styles.loadingText}>Consultando horarios...</p>}
        {error && <p className={styles.errorText}>{error}</p>}
        {!loading && !error && schedules.length === 0 && (
          <p className={styles.emptyText}>No hay horarios disponibles para esta fecha.</p>
        )}
        {!loading && !error && schedules.length > 0 && (
          <div className={styles.grid} aria-busy={loading}>
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`${styles.card} ${styles[schedule.status]}`}
                onClick={() => handleSelect(schedule)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleSelect(schedule);
                }}
                role="button"
                aria-disabled={schedule.status !== "disponible"}
                tabIndex={schedule.status === "disponible" ? 0 : -1}
              >
                <div className={styles.time}>{schedule.time}</div>
                {schedule.status === "disponible" && courtPrice > 0 && (
                  <div className={styles.price}>S/ {Number(courtPrice).toFixed(2)}</div>
                )}
                <span className={`${styles.badge} ${styles["badge-" + schedule.status]}`}>
                  {getStatusText(schedule.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Schedules;
