// presentation/screens/client/resumen/resumen.jsx
import { useEffect } from "react";
import styles from "./resumen.module.css";
import { reservationApi } from "../../../../infrastructure/api/reservation.api";

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
const handleDescargarComprobante = async () => {
    let data;
    try {
      data = await reservationApi.getComprobante(reservation.id);
    } catch (err) {
      console.error("Error al cargar comprobante:", err);
      alert("No se pudo cargar el comprobante. Intenta de nuevo.");
      return;
    }

    const win = window.open("", "_blank", "width=700,height=900");
    if (!win) return;

    const fechaFmt = new Date(data.fecha + "T00:00:00").toLocaleDateString("es-PE", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    win.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Comprobante ${data.numero}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0fdf4; padding: 30px; }
          .sheet {
            max-width: 560px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.10);
            border: 1px solid #e5e7eb;
          }
          .header {
            background: linear-gradient(135deg, #0a0a0a 0%, #16a34a 60%, #22c55e 100%);
            padding: 28px 24px;
            text-align: center;
          }
          .header img { width: 72px; height: auto; margin-bottom: 10px; }
          .header p {
            color: rgba(255,255,255,0.6);
            font-size: 11px;
            letter-spacing: 3px;
            text-transform: uppercase;
            font-weight: 600;
          }
          .body { padding: 32px 36px; }
          .badge {
            display: block;
            width: fit-content;
            margin: 0 auto 20px;
            background: #dcfce7;
            color: #16a34a;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            padding: 6px 18px;
            border-radius: 999px;
            border: 1px solid #86efac;
          }
          .title { text-align: center; font-size: 20px; font-weight: 800; color: #111827; margin-bottom: 24px; }
          .code-box {
            text-align: center;
            background: #f0fdf4;
            border: 2px dashed #86efac;
            border-radius: 12px;
            padding: 18px;
            margin-bottom: 24px;
          }
          .code-box .lbl { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
          .code-box .val { font-size: 24px; font-weight: 800; color: #16a34a; letter-spacing: 2px; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          td.label { color: #6b7280; }
          td.value { font-weight: 600; text-align: right; color: #111827; }
          .total-row td { border-bottom: none; border-top: 2px solid #111827; padding-top: 18px; font-size: 16px; }
          .total-row td.value { color: #16a34a; font-weight: 800; font-size: 20px; }
          .footer { text-align: center; padding: 20px; background: #0a0a0a; }
          .footer p:first-child { color: #22c55e; font-size: 13px; font-weight: 700; letter-spacing: 1px; }
          .footer p { color: #6b7280; font-size: 10px; margin-top: 6px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="header">
            <img src="https://res.cloudinary.com/dwz1bhkt9/image/upload/v1781067164/logo_vwflmq.png" alt="Kancha Sports" />
            <p>Sports Booking System</p>
          </div>
          <div class="body">
            <span class="badge">${data.estado}</span>
            <h1 class="title">Comprobante de Pago</h1>
            <div class="code-box">
              <p class="lbl">N° Comprobante</p>
              <p class="val">${data.numero}</p>
            </div>
            <table>
              <tr><td class="label">Código de reserva</td><td class="value">${data.codigoReserva}</td></tr>
              <tr><td class="label">Cliente</td><td class="value">${data.clienteNombre}</td></tr>
              <tr><td class="label">Cancha</td><td class="value">${data.nombreCancha}</td></tr>
              <tr><td class="label">Fecha</td><td class="value">${fechaFmt}</td></tr>
              <tr><td class="label">Horario</td><td class="value">${data.horaInicio} – ${data.horaFin}</td></tr>
              <tr><td class="label">Método de pago</td><td class="value">${data.metodoPago}</td></tr>
              <tr class="total-row"><td class="label">Total pagado</td><td class="value">S/ ${Number(data.montoTotal).toFixed(2)}</td></tr>
            </table>
          </div>
          <div class="footer">
            <p>KANCHA SPORTS</p>
            <p>Emitido el ${new Date(data.fechaEmision).toLocaleString("es-PE")}<br/>©Todos lo Derechos Reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  };

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
        <button className={styles.secondaryBtn} onClick={handleDescargarComprobante}>
           Descargar comprobante
        </button>
      </div>

    </div>
  );
};

export default Resumen;
