import { useState } from "react";
import styles from "./schedules.module.css";

const mockSchedules = [
  { id: 1, time: "08:00 - 09:00", status: "disponible" },
  { id: 2, time: "09:00 - 10:00", status: "disponible" },
  { id: 3, time: "10:00 - 11:00", status: "ocupado" },
  { id: 4, time: "11:00 - 12:00", status: "disponible" },
  { id: 5, time: "12:00 - 13:00", status: "reservado" },
  { id: 6, time: "13:00 - 14:00", status: "disponible" },
  { id: 7, time: "14:00 - 15:00", status: "disponible" },
  { id: 8, time: "15:00 - 16:00", status: "ocupado" },
  { id: 9, time: "16:00 - 17:00", status: "disponible" },
  { id: 10, time: "17:00 - 18:00", status: "disponible" },
  { id: 11, time: "18:00 - 19:00", status: "ocupado" },
  { id: 12, time: "19:00 - 20:00", status: "disponible" },
  { id: 13, time: "20:00 - 21:00", status: "disponible" },
  { id: 14, time: "21:00 - 22:00", status: "disponible" },
];

const Schedules = ({ court, onBack, onSelectSchedule }) => {
  const [selectedDate, setSelectedDate] = useState("2026-04-10");

  const getStatusText = (status) => {
    switch (status) {
      case "disponible":
        return "Disponible";
      case "ocupado":
        return "Ocupado";
      case "reservado":
        return "Reservado";
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className={styles.title}>{court?.titulo || "Cancha"}</h1>
          <p className={styles.subtitle}>
            Selecciona fecha y horario disponible
          </p>
        </div>
      </header>

      <section className={styles.dateSection}>
        <div className={styles.dateLabel}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </section>

      <section className={styles.schedulesSection}>
        <div className={styles.schedulesHeader}>
          <h2 className={styles.schedulesTitle}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Horarios disponibles
          </h2>
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span
                className={`${styles.legendDot} ${styles.dotDisponible}`}
              ></span>{" "}
              Disponible
            </span>
            <span className={styles.legendItem}>
              <span
                className={`${styles.legendDot} ${styles.dotOcupado}`}
              ></span>{" "}
              Ocupado
            </span>
          </div>
        </div>

        <div className={styles.grid}>
          {mockSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`${styles.card} ${styles[schedule.status]}`}
              onClick={() => {
                if (schedule.status === "disponible" && onSelectSchedule) {
                  onSelectSchedule(schedule, selectedDate);
                }
              }}
            >
              <div className={styles.time}>{schedule.time}</div>
              <span
                className={`${styles.badge} ${
                  styles["badge-" + schedule.status]
                }`}
              >
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