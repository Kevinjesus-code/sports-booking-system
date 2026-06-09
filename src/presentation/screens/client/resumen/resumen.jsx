// presentation/screens/client/resumen/resumen.jsx
import { useEffect } from "react";
import styles from "./resumen.module.css";

// ── Mapa de estados igual que reservations-modal ─────────────────────────────
const STATUS_CONFIG = {
  confirmada: { label: "Confirmada", color: "#16a34a", bg: "#dcfce7" },
  pendiente:  { label: "Pendiente",  color: "#d97706", bg: "#fef3c7" },
  cancelada:  { label: "Cancelada",  color: "#dc2626", bg: "#fee2e2" },
  finalizada: { label: "Finalizada", color: "#6b7280", bg: "#f3f4f6" },
  completada: { label: "Completada", color: "#6b7280", bg: "#f3f4f6" },
  en_curso:   { label: "En curso",   color: "#2563eb", bg: "#dbeafe" },
  no_asistio: { label: "No asistió", color: "#dc2626", bg: "#fee2e2" },
};

const Resumen = ({ reservation, onNewReservation, onViewReservations }) => {

  useEffect(() => {
    if (!reservation) {
      onViewReservations?.();
    }
  }, []);

  if (!reservation) return null;

  // ── Fecha formateada ──────────────────────────────────────────────────────
  const rawDate = reservation.date ?? reservation.fecha;
  const formattedDate = rawDate
    ? new Date(rawDate + "T00:00:00").toLocaleDateString("es-PE", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  // ── Estado real desde el backend (ya llega "confirmada") ─────────────────
  const rawEstado = (reservation.estado ?? reservation.status ?? "confirmada").toLowerCase();
  const statusCfg = STATUS_CONFIG[rawEstado] ?? STATUS_CONFIG.confirmada;

  // ── Monto ─────────────────────────────────────────────────────────────────
  const total = reservation.total ?? reservation.totalAmount ?? reservation.montoTotal ?? 0;

  // ── Código ───────────────────────────────────────────────────────────────
  const reservationCode =
    reservation.codigo ??
    reservation.code ??
    `RSV-${String(reservation.id ?? "").padStart(6, "0")}`;

  // ── Horario ───────────────────────────────────────────────────────────────
  const horaInicio = reservation.horaInicio ?? reservation.startTime ?? "—";
  const horaFin    = reservation.horaFin    ?? reservation.endTime   ?? "—";

  // ── Cancha ────────────────────────────────────────────────────────────────
  const nombreCancha =
    reservation.nombreCancha ??
    reservation.courtName ??
    reservation.canchaName ??
    "—";

  return (
    <div className={styles.container}>

      {/* ── Encabezado de éxito ── */}
      <div className={styles.successHeader}>
        <div className={styles.checkCircle}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className={styles.title}>¡Reserva confirmada!</h1>
        <p className={styles.subtitle}>Tu reserva ha sido registrada exitosamente</p>
      </div>

      {/* ── Tarjeta de detalles ── */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>Detalles de la reserva</div>
        <div className={styles.cardBody}>

          {/* Cancha */}
          <div className={styles.courtRow}>
            <div className={styles.courtIconBg}>
              {reservation.courtIcon ?? reservation.icono ?? "⚽"}
            </div>
            <div className={styles.courtInfo}>
              <span className={styles.label}>Cancha</span>
              <span className={styles.value}>{nombreCancha}</span>
            </div>
          </div>

          {/* Fecha + Horario */}
          <div className={styles.gridRow}>
            <div className={styles.infoItem}>
              <div className={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8"  y1="2" x2="8"  y2="6" />
                  <line x1="3"  y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className={styles.infoContent}>
                <span className={styles.label}>Fecha</span>
                <span className={styles.value}>{formattedDate}</span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className={styles.infoContent}>
                <span className={styles.label}>Horario</span>
                <span className={styles.value}>{horaInicio} – {horaFin}</span>
              </div>
            </div>
          </div>

          {/* Estado + Monto */}
          <div className={styles.contactRow}>
            <div className={styles.infoItem}>
              <div className={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
              </div>
              <div className={styles.infoContent}>
                <span className={styles.label}>Estado</span>
                {/* ✅ Badge con color real del estado que devuelve el backend */}
                <span style={{
                  color: statusCfg.color,
                  fontWeight: 600,
                  padding: "2px 10px",
                  borderRadius: "12px",
                  background: statusCfg.bg,
                  display: "inline-block",
                  fontSize: 13,
                }}>
                  {statusCfg.label}
                </span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconContainer}>
                <span style={{ fontWeight: "bold", fontSize: "14px", color: "#374151" }}>S/</span>
              </div>
              <div className={styles.infoContent}>
                <span className={styles.label}>Monto total</span>
                <span className={styles.value} style={{ color: "#16a34a", fontWeight: 700 }}>
                  S/ {Number(total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Código de reserva */}
          <div className={styles.confirmationBox}>
            <div className={styles.label}>Código de reserva</div>
            <p className={styles.confNumber}>{reservationCode}</p>
          </div>

        </div>
      </div>

      {/* ── Qué sigue ── */}
      <div className={styles.nextSteps}>
        <h3 className={styles.nextStepsTitle}>¿Qué sigue?</h3>
        <ul className={styles.stepsList}>
          {[
            "Recibirás un email de confirmación con los detalles",
            "Te enviaremos un recordatorio 1 hora antes de tu reserva",
            "Puedes cancelar hasta 2 horas antes sin cargo",
          ].map((step) => (
            <li key={step} className={styles.stepItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Acciones ── */}
      <div className={styles.actionButtons}>
        <button className={styles.primaryBtn}   onClick={onViewReservations}>
          Ver mis reservas
        </button>
        <button className={styles.secondaryBtn} onClick={onNewReservation}>
          Nueva reserva
        </button>
      </div>

    </div>
  );
};

export default Resumen;
