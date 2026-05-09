import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./schedules.module.css";
import { useAvailableSlots } from "../../../../hooks/useReservations";

// ── Adaptación: mockSchedules eliminado, reemplazado por useAvailableSlots ──
// El componente ya no recibe props; obtiene `court` del estado de navegación
// y los horarios del hook que llama al backend.

const Schedules = () => {
  const navigate      = useNavigate();
  const { state }     = useLocation();
  const court         = state?.court; // { id, titulo, icono, ... } viene de courts.jsx

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // ← hook real: llama getAvailableSlots → ReservationRepositoryImpl → API
  const { slots: rawSlots, loading, error } = useAvailableSlots(court?.id, selectedDate);

  // Mapea la entidad TimeSlot al formato que espera la UI existente
  const schedules = rawSlots.map((s) => ({
    id:        s.id,
    time:      `${s.startTime} - ${s.endTime}`,
    status:    s.available ? "disponible" : "ocupado",
    // Conservamos start/end para pasarlos al siguiente paso
    startTime: s.startTime,
    endTime:   s.endTime,
    price:     s.price,
  }));

  const getStatusText = (status) => {
    switch (status) {
      case "disponible": return "Disponible";
      case "ocupado":    return "Ocupado";
      case "reservado":  return "Reservado";
      default:           return "";
    }
  };

  // Al seleccionar un horario navega a confirm-reserve pasando el estado
  const handleSelectSchedule = (schedule) => {
    navigate("/client/confirm-reserve", {
      state: { court, schedule, date: selectedDate },
    });
  };

  // ── JSX original preservado íntegramente ──────────────────────────────────
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className={styles.title}>{court?.titulo || "Cancha"}</h1>
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

        {/* Estados de carga y error */}
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
              onClick={() => {
                if (schedule.status === "disponible") {
                  handleSelectSchedule(schedule);
                }
              }}
            >
              <div className={styles.time}>{schedule.time}</div>
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