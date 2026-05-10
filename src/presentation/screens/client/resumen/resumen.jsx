// presentation/screens/client/resumen/resumen.jsx
//
// CORRECCIONES respecto a la versión anterior:
// 1. Eliminados useNavigate/useLocation — la app usa props callbacks (igual que confirm-reserve)
// 2. navigate() durante render eliminado — era un infinite loop. Ahora es un guard con return
// 3. reservation.totalPrice → reservation.totalAmount (campo real de la entidad/BD)
// 4. reservation.getFormattedDate() → se protege con fallback por si la entidad llega plana
// 5. Estado con color dinámico usando reservation.getStatusColor()
//
// Props desde Client.jsx (componente padre):
//   reservation       → entidad Reservation devuelta por el backend
//   onNewReservation  → navega a schedules
//   onViewReservations→ navega al dashboard / historial

import styles from "./resumen.module.css";

const Resumen = ({ reservation, onNewReservation, onViewReservations }) => {

  // Guard sin navigate — simplemente no renderiza y avisa al padre
  if (!reservation) {
    onViewReservations?.();   // vuelve a un estado seguro sin llamar hooks
    return null;
  }

  // Compatibilidad: si llega como entidad usa el método, si llega plana formatea directo
  const formattedDate =
    typeof reservation.getFormattedDate === "function"
      ? reservation.getFormattedDate()
      : new Date((reservation.date ?? reservation.fecha) + "T00:00:00")
          .toLocaleDateString("es-PE", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          });

  const statusColor =
    typeof reservation.getStatusColor === "function"
      ? reservation.getStatusColor()
      : "#97C459";

  const formattedStatus =
    typeof reservation.getFormattedStatus === "function"
      ? reservation.getFormattedStatus()
      : reservation.status ?? reservation.estado ?? "—";

  // totalAmount es el campo real de la entidad (monto_total en BD)
  const total = reservation.totalAmount ?? reservation.totalPrice ?? 0;

  return (
    <div className={styles.container}>

      {/* ── Encabezado de éxito ─────────────────────────────── */}
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

      {/* ── Tarjeta de detalles ─────────────────────────────── */}
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
              <span className={styles.value}>
                {reservation.courtName ?? reservation.canchaName ?? "—"}
              </span>
            </div>
          </div>

          {/* Fecha y horario */}
          <div className={styles.gridRow}>
            <div className={styles.infoItem}>
              <div className={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
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
                <span className={styles.value}>
                  {reservation.startTime ?? reservation.horaInicio ?? "—"}
                  {" – "}
                  {reservation.endTime   ?? reservation.horaFin    ?? "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Estado y monto */}
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
                {/* Color dinámico según el estado de la entidad */}
                <span
                  className={styles.value}
                  style={{
                    color: statusColor,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "12px",
                    background: statusColor + "20",  // 12% opacity
                    display: "inline-block",
                  }}
                >
                  {formattedStatus}
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
                  S/ {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Número de confirmación */}
          <div className={styles.confirmationBox}>
            <div className={styles.label}>Número de confirmación</div>
            <p className={styles.confNumber}>#{reservation.id}</p>
          </div>

        </div>
      </div>

      {/* ── Próximos pasos ──────────────────────────────────── */}
      <div className={styles.nextSteps}>
        <h3 className={styles.nextStepsTitle}>¿Qué sigue?</h3>
        <ul className={styles.stepsList}>
          <li className={styles.stepItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Recibirás un SMS de confirmación en breve
          </li>
          <li className={styles.stepItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Te enviaremos un recordatorio 24 horas antes
          </li>
          <li className={styles.stepItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Puedes cancelar hasta 2 horas antes sin cargo
          </li>
        </ul>
      </div>

      {/* ── Botones ─────────────────────────────────────────── */}
      <div className={styles.actionButtons}>
        <button className={styles.primaryBtn} onClick={onViewReservations}>
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