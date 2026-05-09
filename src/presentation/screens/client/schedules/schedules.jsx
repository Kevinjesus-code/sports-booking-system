import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./schedules.module.css";
import { useAvailableSlots } from "../../../../hooks/useReservations";

const Schedules = () => {
  const navigate  = useNavigate();
  const { state } = useLocation();
  const court     = state?.court;

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // ── Guard: si no viene court (recarga de página) → redirige a courts ──
  useEffect(() => {
    if (!court) {
      navigate("/client/courts", { replace: true });
    }
  }, [court, navigate]);

  const { slots: rawSlots, loading, error } = useAvailableSlots(
    court?.id,
    selectedDate
  );

  // Mapea TimeSlot → formato UI (protegido con ?? [] por si rawSlots es undefined)
  const schedules = (rawSlots ?? []).map((s) => ({
    id:        s.id,
    time:      `${s.startTime} - ${s.endTime}`,
    status:    s.available ? "disponible" : "ocupado",
    startTime: s.startTime,
    endTime:   s.endTime,
    price:     s.price ?? 0,
  }));

  const getStatusText = (status) => {
    switch (status) {
      case "disponible": return "Disponible";
      case "ocupado":    return "Ocupado";
      case "reservado":  return "Reservado";
      default:           return "";
    }
  };

  const handleSelectSchedule = (schedule) => {
    navigate("/client/confirm-reserve", {
      state: { court, schedule, date: selectedDate },
    });
  };

  // ── Back button robusto: historial si existe, sino va directo a courts ──
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/client/courts");
    }
  };

  if (!court) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
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

        {loading && (
          <p className={styles.loadingText}>Cargando horarios...</p>
        )}

        {/* Muestra el error real para poder debuggear */}
        {error && (
          <p className={styles.errorText}>
            ⚠ {error}
          </p>
        )}

        {!loading && !error && schedules.length === 0 && (
          <p className={styles.emptyText}>
            No hay horarios disponibles para esta fecha.
          </p>
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