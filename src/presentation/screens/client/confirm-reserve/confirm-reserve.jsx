import styles from "./confirm-reserve.module.css";
import { useState } from "react";

const PAYMENT_METHODS = [
  { id: "efectivo", label: "Efectivo", icon: "💵" },
  { id: "tarjeta",  label: "Tarjeta",  icon: "💳" },
  { id: "yape",     label: "Yape",     icon: "📱" },
  { id: "plin",     label: "Plin",     icon: "📲" },
];

const ConfirmReserve = ({ court, schedule, date, onBack, onConfirm }) => {
  const [nombre,        setNombre]        = useState("");
  const [telefono,      setTelefono]      = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [payment,       setPayment]       = useState(null);

  // Campos extra por método
  const [cardNumber,    setCardNumber]    = useState("");
  const [cardExpiry,    setCardExpiry]    = useState("");
  const [cardCvv,       setCardCvv]       = useState("");
  const [yapePhone,     setYapePhone]     = useState("");
  const [plinPhone,     setPlinPhone]     = useState("");

  const handleConfirm = () => {
    if (!payment) { alert("Selecciona un método de pago"); return; }
    if (onConfirm) {
      onConfirm({
        nombre:   nombre   || "Juan",
        telefono: telefono || "912123123",
        observaciones,
        payment,
        paymentDetails: {
          cardNumber, cardExpiry, cardCvv,
          yapePhone, plinPhone,
        },
      });
    }
  };

  return (
    <div className={styles.container}>

      {/* Header */}
      <header className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Confirmar reserva</h1>
          <p className={styles.subtitle}>Completa tus datos para reservar</p>
        </div>
      </header>

      {/* Columna izquierda */}
      <div className={styles.leftCol}>

        {/* Resumen */}
        <section className={styles.summaryCard}>
          <div className={styles.summaryTitle}>Resumen de tu reserva</div>
          <div className={styles.summaryCourt}>
            <div className={styles.courtIcon}>{court?.icono || "⚽"}</div>
            {court?.titulo || "Cancha seleccionada"}
          </div>
          <div className={styles.summaryDetails}>
            <div className={styles.detailItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {date || "2026-04-10"}
            </div>
            <div className={styles.detailItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {schedule?.time || "00:00 - 00:00"}
            </div>
          </div>
        </section>

        {/* Método de pago */}
        <section className={styles.paymentContainer}>
          <h2 className={styles.formTitle}>Método de pago</h2>
          <div className={styles.paymentGrid}>
            {PAYMENT_METHODS.map(method => (
              <button key={method.id} type="button"
                className={`${styles.paymentOption} ${payment === method.id ? styles.paymentSelected : ""}`}
                onClick={() => setPayment(method.id)}
              >
                <span className={styles.paymentIcon}>{method.icon}</span>
                <span className={styles.paymentLabel}>{method.label}</span>
                {payment === method.id && (
                  <span className={styles.paymentCheck}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Campos dinámicos ── */}
          {payment === "tarjeta" && (
            <div className={styles.paymentFields}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Número de tarjeta</label>
                <input className={styles.input} type="text"
                  placeholder="1234 5678 9012 3456" maxLength={19}
                  value={cardNumber}
                  onChange={e => setCardNumber(
                    e.target.value.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim()
                  )}
                />
              </div>
              <div className={styles.cardRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Vencimiento</label>
                  <input className={styles.input} type="text"
                    placeholder="MM/AA" maxLength={5}
                    value={cardExpiry}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g,"");
                      if (v.length >= 3) v = v.slice(0,2) + "/" + v.slice(2,4);
                      setCardExpiry(v);
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>CVV</label>
                  <input className={styles.input} type="password"
                    placeholder="•••" maxLength={4}
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value.replace(/\D/g,""))}
                  />
                </div>
              </div>
            </div>
          )}

          {payment === "yape" && (
            <div className={styles.paymentFields}>
              <div className={styles.paymentInfo}>
                <span className={styles.paymentInfoIcon}>📱</span>
                <div>
                  <p className={styles.paymentInfoTitle}>Paga con Yape</p>
                  <p className={styles.paymentInfoText}>
                    Yapea al número <strong>987 654 321</strong> y adjunta el número de operación.
                  </p>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>N° de operación Yape</label>
                <input className={styles.input} type="text"
                  placeholder="Ej: 123456789"
                  value={yapePhone}
                  onChange={e => setYapePhone(e.target.value)}
                />
              </div>
            </div>
          )}

          {payment === "plin" && (
            <div className={styles.paymentFields}>
              <div className={styles.paymentInfo}>
                <span className={styles.paymentInfoIcon}>📲</span>
                <div>
                  <p className={styles.paymentInfoTitle}>Paga con Plin</p>
                  <p className={styles.paymentInfoText}>
                    Envía el pago al número <strong>987 654 321</strong> y adjunta el número de operación.
                  </p>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>N° de operación Plin</label>
                <input className={styles.input} type="text"
                  placeholder="Ej: 123456789"
                  value={plinPhone}
                  onChange={e => setPlinPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          {payment === "efectivo" && (
            <div className={styles.paymentFields}>
              <div className={styles.paymentInfo}>
                <span className={styles.paymentInfoIcon}>💵</span>
                <div>
                  <p className={styles.paymentInfoTitle}>Pago en efectivo</p>
                  <p className={styles.paymentInfoText}>
                    Realiza el pago directamente en recepción al momento de llegar.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Columna derecha */}
      <div className={styles.rightCol}>

        {/* Datos de contacto */}
        <section className={styles.formContainer}>
          <h2 className={styles.formTitle}>Datos de contacto</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Nombre completo
            </label>
            <input type="text" className={styles.input} placeholder="Juan Pérez"
              value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Teléfono
            </label>
            <input type="tel" className={styles.input} placeholder="+51 900 000 000"
              value={telefono} onChange={e => setTelefono(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Observaciones (opcional)
            </label>
            <textarea className={styles.textarea}
              placeholder="Agrega cualquier comentario adicional..."
              value={observaciones} onChange={e => setObservaciones(e.target.value)} />
          </div>
        </section>

        {/* Botones */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onBack}>Cancelar</button>
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            Confirmar reserva
          </button>
        </div>

        <div className={styles.note}>
          Nota: Recibirás una confirmación por SMS con los detalles de tu reserva.
        </div>
      </div>

    </div>
  );
};

export default ConfirmReserve;