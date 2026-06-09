import styles from "./reservations-modal.module.css";
import { useEffect } from "react";

/* ── Status config ── */
const STATUS_CONFIG = {
  confirmada: { label: "Confirmada", class: "badgeConfirmada", icon: "✓" },
  pendiente: { label: "Pendiente", class: "badgePendiente", icon: "◷" },
  cancelada: { label: "Cancelada", class: "badgeCancelada", icon: "✕" },
  completada: { label: "Completada", class: "badgeCompletada", icon: "★" },
  finalizada: { label: "Finalizada", class: "badgeCompletada", icon: "★" },
  en_curso: { label: "En curso", class: "badgePendiente", icon: "▶" },
  no_asistio: { label: "No asistió", class: "badgeCancelada", icon: "!" },
};

const ReservationsModal = ({ reservations, onClose, onCancelled }) => {
  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ESC to close
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" });
    } catch { return dateStr; }
  };

  /* ── Cancelación ── */
  const canCancel = (r) => {
    const estado = String(r.estado ?? r.status ?? "").toLowerCase();
    return estado === "confirmada" || estado === "pendiente";
  };

  const isWithin2Hours = (r) => {
    const fecha = r.date ?? r.fecha;
    const hora  = r.schedule?.time ?? r.hora;
    if (!fecha || !hora) return false;
    const reservaDateTime = new Date(`${fecha}T${hora}`);
    const diff = reservaDateTime - new Date();
    return diff < 2 * 60 * 60 * 1000;
  };

  const handleCancel = async (reservationId) => {
    if (!window.confirm("¿Cancelar esta reserva?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/reservas/${reservationId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        onCancelled?.(reservationId);
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.message ?? "No se pudo cancelar la reserva.");
      }
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <h2 className={styles.title}>Mis reservas</h2>
              <p className={styles.subtitle}>{reservations.length} reserva{reservations.length !== 1 ? "s" : ""} registrada{reservations.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {reservations.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIconWrapper}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className={styles.emptyTitle}>No tienes reservas aún</p>
              <p className={styles.emptyText}>Tus reservas aparecerán aquí</p>
            </div>
          ) : (
            reservations.map((r) => {
              const raw = String(r.estado ?? r.status ?? "pendiente").toLowerCase();
              const status = STATUS_CONFIG[raw] || STATUS_CONFIG.pendiente;
              return (
                <div key={r.id} className={styles.card}>
                  {/* Card header */}
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                      {r.court?.icono || "⚽"}
                    </div>
                    <div className={styles.cardHeaderInfo}>
                      <span className={styles.cardCourtName}>
                        {r.court?.titulo || r.cancha || "Cancha"}
                      </span>
                      <span className={`${styles.badge} ${styles[status.class]}`}>
                        <span className={styles.badgeIcon}>{status.icon}</span>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Card details */}
                  <div className={styles.cardDetails}>
                    <div className={styles.detailItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>{formatDate(r.date || r.fecha)}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{r.schedule?.time || r.hora || "—"}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>{r.customer?.nombre || r.cliente || "Cliente"}</span>
                    </div>
                    {(r.precio || r.price) && (
                      <div className={styles.detailItem}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="1" x2="12" y2="23" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        <span className={styles.priceValue}>S/ {r.precio || r.price}.00</span>
                      </div>
                    )}
                  </div>

                  {/* Observaciones */}
                  {r.observaciones && (
                    <div className={styles.cardNote}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      {r.observaciones}
                    </div>
                  )}

                  {/* Botón cancelar */}
                  {canCancel(r) && (
                    <button
                      className={styles.cancelBtn}
                      onClick={() =>
                        isWithin2Hours(r)
                          ? alert("No puedes cancelar con menos de 2 horas de anticipación.")
                          : handleCancel(r.id)
                      }
                    >
                      Cancelar reserva
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationsModal;