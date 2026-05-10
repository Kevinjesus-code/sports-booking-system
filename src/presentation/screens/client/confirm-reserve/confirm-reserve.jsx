// presentation/screens/client/confirm-reserve/confirm-reserve.jsx
import { useState } from "react";
import { useCreateReservation } from "../../../../hooks/useReservations";
import styles from "./confirm-reserve.module.css";

const PAYMENT_LOGOS = {
  efectivo: "/assets/MetodoPago/efectivo.png",
  tarjeta:  "/assets/MetodoPago/visa.png",
  yape:     "/assets/MetodoPago/yape.webp",
  plin:     "/assets/MetodoPago/plin.png",
};

const PaymentLogo = ({ id }) => (
  <img
    src={PAYMENT_LOGOS[id]}
    alt={id}
    style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "8px" }}
  />
);

const PAYMENT_METHODS = [
  { id: "efectivo", label: "Efectivo" },
  { id: "tarjeta",  label: "Tarjeta"  },
  { id: "yape",     label: "Yape"     },
  { id: "plin",     label: "Plin"     },
];

// Props desde Client.jsx:
//   court      → objeto cancha { id, name/titulo, icono }
//   schedule   → { id, time, startTime, endTime, price, status }
//   date       → "YYYY-MM-DD"
//   onBack     → vuelve a schedules
//   onConfirm  → (data) notifica reserva creada

export default function ConfirmReserve({ court, schedule, date, onBack, onConfirm }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { create, loading, error: apiError } = useCreateReservation();

  const [nombre,        setNombre]        = useState(user?.nombre || user?.name || "");
  const [telefono,      setTelefono]      = useState(user?.telefono || user?.phone || "");
  const [observaciones, setObservaciones] = useState("");
  const [payment,       setPayment]       = useState(null);

  if (!court || !schedule) { onBack?.(); return null; }

  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("es-PE", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const price = schedule.price ?? 0;

  const handleConfirm = async () => {
    if (!payment) { alert("Selecciona un método de pago"); return; }

    // ✅ Solo los 3 campos que ReservaRequest.java espera
    const body = {
      canchaId:  court.id,
      horarioId: schedule.id,
      fecha:     date,          // "YYYY-MM-DD" → LocalDate en el backend
    };

    try {
      const newReservation = await create(body);
      onConfirm?.({ ...body, id: newReservation?.id, court, schedule, date });
    } catch (err) {
      console.error("Error al crear reserva:", err);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "16px 20px",
        background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={onBack} style={{
          background: "#f1f5f9", border: "none", borderRadius: "50%",
          width: "36px", height: "36px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#374151" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>
            Confirmar reserva
          </h1>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
            Verifica los detalles y completa tu pago
          </p>
        </div>
      </header>

      {/* Contenido centrado */}
      <div style={{
        flex: 1,
        maxWidth: "480px",
        width: "100%",
        margin: "0 auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}>

        {/* Resumen */}
        <div style={{
          background: "#fff", borderRadius: "12px",
          padding: "16px", border: "1px solid #e2e8f0",
        }}>
          <p style={{ margin: "0 0 12px", fontWeight: 700, color: "#111827" }}>
            Resumen de tu reserva
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ fontSize: "24px" }}>{court.icono || "⚽"}</span>
            <span style={{ fontWeight: 600, color: "#1f2937" }}>
              {court.name || court.titulo}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", color: "#6b7280", fontSize: "14px" }}>
            <span>📅 {formattedDate}</span>
            <span>🕐 {schedule.startTime} – {schedule.endTime}</span>
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e2e8f0",
          }}>
            <span style={{ color: "#374151", fontWeight: 600 }}>Total a pagar:</span>
            <span style={{ color: "#16a34a", fontWeight: 700, fontSize: "18px" }}>
              S/ {price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Datos de contacto */}
        <div style={{
          background: "#fff", borderRadius: "12px",
          padding: "16px", border: "1px solid #e2e8f0",
        }}>
          <p style={{ margin: "0 0 12px", fontWeight: 700, color: "#111827" }}>
            Datos de contacto
          </p>
          {[
            { label: "Nombre completo", value: nombre, setter: setNombre, type: "text" },
            { label: "Teléfono",        value: telefono, setter: setTelefono, type: "tel" },
          ].map(({ label, value, setter, type }) => (
            <div key={label} style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}>
                {label}
              </label>
              <input
                type={type} value={value}
                onChange={(e) => setter(e.target.value)}
                style={{
                  width: "100%", padding: "10px 12px", marginTop: "4px",
                  border: "1px solid #d1d5db", borderRadius: "8px",
                  fontSize: "14px", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
          ))}
          <div>
            <label style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}>
              Observaciones (opcional)
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              style={{
                width: "100%", padding: "10px 12px", marginTop: "4px",
                border: "1px solid #d1d5db", borderRadius: "8px",
                fontSize: "14px", resize: "none", outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Método de pago */}
        <div style={{
          background: "#fff", borderRadius: "12px",
          padding: "16px", border: "1px solid #e2e8f0",
        }}>
          <p style={{ margin: "0 0 12px", fontWeight: 700, color: "#111827" }}>
            Método de pago
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setPayment(method.id)}
                style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: "6px", padding: "12px 8px",
                  border: payment === method.id ? "2px solid #16a34a" : "1px solid #e2e8f0",
                  borderRadius: "10px", background: payment === method.id ? "#f0fdf4" : "#fff",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <PaymentLogo id={method.id} />
                <span style={{ fontSize: "12px", fontWeight: 500, color: "#374151" }}>
                  {method.label}
                </span>
              </button>
            ))}
          </div>

          {payment === "yape" && (
            <div style={{
              marginTop: "12px", padding: "10px 14px",
              background: "#FAF5FF", border: "1px solid #7C3AED",
              borderRadius: "8px", fontSize: "14px",
            }}>
              Yapea al <strong>987 654 321</strong>
            </div>
          )}
          {payment === "plin" && (
            <div style={{
              marginTop: "12px", padding: "10px 14px",
              background: "#F0F9FF", border: "1px solid #00A8E0",
              borderRadius: "8px", fontSize: "14px",
            }}>
              Plínea al <strong>987 654 321</strong>
            </div>
          )}
          {payment === "efectivo" && (
            <div style={{
              marginTop: "12px", padding: "10px 14px",
              background: "#F0FDF4", border: "1px solid #16A34A",
              borderRadius: "8px", fontSize: "14px",
            }}>
              <strong>Pago en recepción</strong>
              <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
                Paga al llegar al establecimiento.
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {apiError && (
          <p style={{
            color: "#dc2626", background: "#fef2f2",
            padding: "10px 14px", borderRadius: "8px",
            fontSize: "14px", margin: 0,
          }}>
            ⚠ {apiError}
          </p>
        )}

        {/* Botones */}
        <div style={{ display: "flex", gap: "12px", paddingBottom: "24px" }}>
          <button
            onClick={onBack} disabled={loading}
            style={{
              flex: 1, padding: "14px",
              border: "1px solid #d1d5db", borderRadius: "10px",
              background: "#fff", color: "#374151",
              fontWeight: 600, fontSize: "14px", cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm} disabled={loading}
            style={{
              flex: 2, padding: "14px",
              border: "none", borderRadius: "10px",
              background: loading ? "#86efac" : "#16a34a",
              color: "#fff", fontWeight: 700,
              fontSize: "14px", cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Procesando..." : "Confirmar reserva"}
          </button>
        </div>
      </div>
    </div>
  );
}