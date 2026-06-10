// src/presentation/components/reservations-modal/index.jsx
import styles from "./reservations-modal.module.css";
import { useEffect, useState } from "react";

const STATUS_CONFIG = {
  confirmada: { label: "Confirmada", class: "badgeConfirmada", icon: "✓" },
  pendiente:  { label: "Pendiente",  class: "badgePendiente",  icon: "◷" },
  cancelada:  { label: "Cancelada",  class: "badgeCancelada",  icon: "✕" },
  completada: { label: "Completada", class: "badgeCompletada", icon: "★" },
  finalizada: { label: "Finalizada", class: "badgeCompletada", icon: "★" },
  en_curso:   { label: "En curso",   class: "badgePendiente",  icon: "▶" },
  no_asistio: { label: "No asistió", class: "badgeCancelada",  icon: "!" },
};

// ✅ Recibe onClearHistory como prop nuevo
const ReservationsModal = ({ reservations = [], onClose, onCancelled, onClearHistory }) => {
  const [cancelling,      setCancelling]      = useState(null);
  const [clearingHistory, setClearingHistory] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr + "T00:00:00").toLocaleDateString("es-PE", {
        weekday: "short", day: "numeric", month: "short",
      });
    } catch { return dateStr; }
  };

  const canCancel = (r) => {
    if (typeof r.puedeCancelar === "boolean") return r.puedeCancelar;
    const estado = String(r.estado ?? r.status ?? "").toLowerCase();
    return !["cancelada", "finalizada", "en_curso", "no_asistio"].includes(estado);
  };

  // ✅ ¿Hay reservas finalizadas/canceladas para mostrar el botón limpiar?
  const hasFinished = reservations.some((r) =>
    ["cancelada", "finalizada", "no_asistio"].includes(
      String(r.estado ?? r.status ?? "").toLowerCase()
    )
  );

  const handleCancel = async (r) => {
    if (!window.confirm(`¿Cancelar la reserva ${r.codigo ?? r.id}?`)) return;
    setCancelling(r.id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/reservas/${Number(r.id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        onCancelled?.(r.id);
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.message ?? body.error ?? "No se pudo cancelar la reserva.");
      }
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setCancelling(null);
    }
  };

  // ✅ Limpiar historial con confirmación
  const handleClearHistory = async () => {
    if (!window.confirm("¿Eliminar del historial todas las reservas canceladas y finalizadas?")) return;
    setClearingHistory(true);
    try {
      await onClearHistory?.();
    } catch {
      alert("Error al limpiar el historial.");
    } finally {
      setClearingHistory(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8"  y1="2" x2="8"  y2="6" />
                <line x1="3"  y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <h2 className={styles.title}>Mis reservas</h2>
              <p className={styles.subtitle}>
                {reservations.length} reserva{reservations.length !== 1 ? "s" : ""} registrada{reservations.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* ✅ Botón limpiar historial — solo visible si hay finalizadas/canceladas */}
            {hasFinished && (
              <button
                onClick={handleClearHistory}
                disabled={clearingHistory}
                title="Eliminar reservas canceladas y finalizadas"
                style={{
                  background: "transparent",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}
              >
                🗑️ {clearingHistory ? "Limpiando..." : "Limpiar historial"}
              </button>
            )}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6"  x2="6"  y2="18" />
                <line x1="6"  y1="6"  x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {reservations.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIconWrapper}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                  stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8"  y1="2" x2="8"  y2="6" />
                  <line x1="3"  y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className={styles.emptyTitle}>No tienes reservas aún</p>
              <p className={styles.emptyText}>Tus reservas aparecerán aquí</p>
            </div>
          ) : (
            reservations.map((r) => {
              const raw    = String(r.estado ?? r.status ?? "pendiente").toLowerCase();
              const status = STATUS_CONFIG[raw] ?? STATUS_CONFIG.pendiente;
              const isCancelling = cancelling === r.id;

              return (
                <div key={r.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>{r.court?.icono ?? "⚽"}</div>
                    <div className={styles.cardHeaderInfo}>
                      <span className={styles.cardCourtName}>
                        {r.nombreCancha ?? r.court?.titulo ?? r.cancha ?? "Cancha"}
                      </span>
                      <span className={`${styles.badge} ${styles[status.class]}`}>
                        <span className={styles.badgeIcon}>{status.icon}</span>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardDetails}>
                    <div className={styles.detailItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8"  y1="2" x2="8"  y2="6" />
                        <line x1="3"  y1="10" x2="21" y2="10" />
                      </svg>
                      <span>{formatDate(r.fecha ?? r.date)}</span>
                    </div>

                    <div className={styles.detailItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{r.horaInicio ?? "—"} – {r.horaFin ?? "—"}</span>
                    </div>

                    <div className={styles.detailItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>{r.clienteNombre ?? "Cliente"}</span>
                    </div>

                    {r.total != null && (
                      <div className={styles.detailItem}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="1" x2="12" y2="23" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        <span className={styles.priceValue}>S/ {Number(r.total).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {r.codigo && (
                    <div style={{
                      marginTop: 8, padding: "6px 10px",
                      background: "#f0fdf4", borderRadius: 6,
                      fontSize: 12, color: "#16a34a", fontWeight: 700, letterSpacing: 1,
                    }}>
                      {r.codigo}
                    </div>
                  )}

                  {canCancel(r) && (
                    <button
                      className={styles.cancelBtn}
                      disabled={isCancelling}
                      onClick={() => handleCancel(r)}
                    >
                      {isCancelling ? "Cancelando..." : "Cancelar reserva"}
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