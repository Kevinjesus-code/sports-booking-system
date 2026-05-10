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
    className={styles.paymentLogoImg}
    style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "10px" }}
  />
);

const PAYMENT_METHODS = [
  { id: "efectivo", label: "Efectivo" },
  { id: "tarjeta",  label: "Tarjeta"  },
  { id: "yape",     label: "Yape"     },
  { id: "plin",     label: "Plin"     },
];

// Props desde Client.jsx:
//   court      → objeto cancha
//   schedule   → { id, time, startTime, endTime, price, status }
//   date       → string "YYYY-MM-DD"
//   onBack     → vuelve a schedules
//   onConfirm  → (data) notifica reserva creada a Client.jsx

export default function ConfirmReserve({ court, schedule, date, onBack, onConfirm }) {

  // ✅ Lee el usuario desde localStorage — donde useAuth lo guarda al hacer login
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { create, loading, error: apiError } = useCreateReservation();

  const [nombre,        setNombre]        = useState(user?.nombre || user?.name  || "");
  const [telefono,      setTelefono]      = useState(user?.telefono || user?.phone || "");
  const [observaciones, setObservaciones] = useState("");
  const [payment,       setPayment]       = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "", cardExpiry: "", cardCvv: "", yapeOp: "", plinOp: "",
  });

  // Guardia: si no hay datos vuelve atrás
  if (!court || !schedule) {
    onBack?.();
    return null;
  }

  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("es-PE", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const price = schedule.price ?? 0;

  const handleConfirm = async () => {
    if (!payment) {
      alert("Por favor, selecciona un método de pago");
      return;
    }

    const reservationData = {
      courtId:       court.id,
      userId:        user?.id,
      date,
      startTime:     schedule.startTime,
      endTime:       schedule.endTime,
      customerName:  nombre,
      customerPhone: telefono,
      paymentMethod: payment,
      notes:         observaciones,
    };

    try {
      const newReservation = await create(reservationData);
      // Pasa datos al Client.jsx para que muestre el Resumen
      onConfirm?.({
        ...reservationData,
        id:       newReservation?.id,
        court,
        schedule,
        date,
      });
    } catch (err) {
      console.error("Error al crear reserva:", err);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Confirmar reserva</h1>
          <p className={styles.subtitle}>Verifica los detalles y completa tu pago</p>
        </div>
      </header>

      <div className={styles.mainGrid}>

        {/* ── COLUMNA IZQUIERDA ── */}
        <div className={styles.leftCol}>
          <section className={styles.summaryCard}>
            <div className={styles.summaryTitle}>Resumen de tu reserva</div>
            <div className={styles.summaryCourt}>
              <div className={styles.courtIcon}>{court.icono || "⚽"}</div>
              {court.name || court.titulo}
            </div>
            <div className={styles.summaryDetails}>
              <div className={styles.detailItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8"  y1="2" x2="8"  y2="6" />
                  <line x1="3"  y1="10" x2="21" y2="10" />
                </svg>
                {formattedDate}
              </div>
              <div className={styles.detailItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {schedule.startTime} – {schedule.endTime}
              </div>
            </div>
            <div className={styles.totalRow}>
              <span>Total a pagar:</span>
              <strong>S/ {price.toFixed(2)}</strong>
            </div>
          </section>

          <section className={styles.paymentContainer}>
            <h2 className={styles.formTitle}>Método de pago</h2>
            <div className={styles.paymentGrid}>
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  className={`${styles.paymentOption} ${
                    payment === method.id ? styles.paymentSelected : ""
                  }`}
                  onClick={() => setPayment(method.id)}
                >
                  <PaymentLogo id={method.id} />
                  <span className={styles.paymentLabel}>{method.label}</span>
                </button>
              ))}
            </div>

            {payment === "tarjeta" && (
              <div className={styles.paymentFields}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Número de tarjeta</label>
                  <input
                    className={styles.input} type="text"
                    placeholder="xxxx xxxx xxxx xxxx"
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {payment === "yape" && (
              <div className={styles.paymentFields}>
                <div className={styles.paymentInfo}
                  style={{ borderColor: "#7C3AED", background: "#FAF5FF" }}>
                  <p>Yapea al <strong>987 654 321</strong></p>
                </div>
                <input
                  className={styles.input} placeholder="Número de operación"
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, yapeOp: e.target.value })
                  }
                />
              </div>
            )}

            {payment === "plin" && (
              <div className={styles.paymentFields}>
                <div className={styles.paymentInfo}
                  style={{ borderColor: "#00A8E0", background: "#F0F9FF" }}>
                  <p>Plínea al <strong>987 654 321</strong></p>
                </div>
                <input
                  className={styles.input} placeholder="Número de operación"
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, plinOp: e.target.value })
                  }
                />
              </div>
            )}

            {payment === "efectivo" && (
              <div className={styles.paymentFields}>
                <div className={styles.paymentInfo}
                  style={{ borderColor: "#16A34A", background: "#F0FDF4" }}>
                  <p className={styles.paymentInfoTitle}>Pago en recepción</p>
                  <p className={styles.paymentInfoText}>
                    Paga al llegar al establecimiento.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ── COLUMNA DERECHA ── */}
        <div className={styles.rightCol}>
          <section className={styles.formContainer}>
            <h2 className={styles.formTitle}>Datos de contacto</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre completo</label>
              <input
                type="text" className={styles.input}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Teléfono</label>
              <input
                type="tel" className={styles.input}
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Observaciones (opcional)</label>
              <textarea
                className={styles.textarea}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </div>
          </section>

          {apiError && <p className={styles.errorMsg}>{apiError}</p>}

          <div className={styles.actions}>
            <button
              className={styles.cancelBtn}
              onClick={onBack}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              className={styles.confirmBtn}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Confirmar reserva"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}