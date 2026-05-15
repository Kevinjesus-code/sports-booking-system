// presentation/screens/client/resumen/resumen.jsx
//
// FIX: "Cannot update a component (Client) while rendering (Resumen)"
// → Guard usa useEffect — el setState del padre ocurre DESPUÉS del render.

import { useEffect } from "react";
import styles from "./resumen.module.css";

const Resumen = ({ reservation, onNewReservation, onViewReservations }) => {

  // ✅ Correcto: useEffect garantiza que el callback del padre
  //    se ejecute después del render, nunca durante él.
  useEffect(() => {
    if (!reservation) {
      onViewReservations?.();
    }
  }, []);

  if (!reservation) return null;

  // Helpers con fallback (funciona con entidad Reservation o con objeto plano)
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

  // monto_total de la BD → totalAmount en la entidad
  const total = reservation.totalAmount ?? reservation.totalPrice ?? 0;
  const reservationCode = reservation.codigo ?? reservation.code ?? `RSV-${String(reservation.id).slice(-6).padStart(6, "0")}`;

  return (
    <div className={styles.container}>

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

      <div className={styles.card}>
        <div className={styles.cardHeader}>Detalles de la reserva</div>
        <div className={styles.cardBody}>

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

          <div className={styles.gridRow}>
            <div className={styles.infoItem}>
              <div className={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

          <div className={styles.contactRow}>
            <div className={styles.infoItem}>
              <div className={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
              </div>
              <div className={styles.infoContent}>
                <span className={styles.label}>Estado</span>
                <span className={styles.value} style={{
                  color: statusColor, fontWeight: 600,
                  padding: "2px 8px", borderRadius: "12px",
                  background: statusColor + "20", display: "inline-block",
                }}>
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

          <div className={styles.confirmationBox}>
            <div className={styles.label}>Código de reserva</div>
            <p className={styles.confNumber}>{reservationCode}</p>
          </div>

        </div>
      </div>

      <div className={styles.nextSteps}>
        <h3 className={styles.nextStepsTitle}>¿Qué sigue?</h3>
        <ul className={styles.stepsList}>
          {[
            "Recibirás un SMS de confirmación en breve",
            "Te enviaremos un recordatorio 24 horas antes",
            "Puedes cancelar hasta 2 horas antes sin cargo",
          ].map((step) => (
            <li key={step} className={styles.stepItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.primaryBtn}   onClick={onViewReservations}>Ver mis reservas</button>
        <button className={styles.secondaryBtn} onClick={onNewReservation}>Nueva reserva</button>
      </div>

    </div>
  );
};

export default Resumen;
