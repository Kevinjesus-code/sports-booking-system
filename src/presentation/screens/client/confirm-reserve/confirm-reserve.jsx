import { useState } from "react";
import { useCreateReservation } from "../../../hooks/useReservations";
import styles from "./confirm-reserve.module.css";

// ─── Logos ────────────────────────────────────────────────────────────────────
const PAYMENT_LOGOS = {
  efectivo:      "/assets/MetodoPago/pago_Efectivo.png",
  tarjeta:       "/assets/MetodoPago/visa.png",
  yape:          "/assets/MetodoPago/yape.webp",
  plin:          "/assets/MetodoPago/plin.png",
  transferencia: "/assets/MetodoPago/transferencia.jpeg",
};

const PAYMENT_METHODS = [
  { id: "efectivo",      label: "Efectivo"       },
  { id: "tarjeta",       label: "Tarjeta"        },
  { id: "yape",          label: "Yape"           },
  { id: "plin",          label: "Plin"           },
  { id: "transferencia", label: "Transferencia"  },
];

const toLocalTime = (t) => (t?.length === 5 ? t + ":00" : t ?? "");

// ─── QR simulado ─────────────────────────────────────────────────────────────
const QRCode = ({ color = "#7C3AED" }) => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ borderRadius: 8, border: `2px solid ${color}` }}>
    <rect width="80" height="80" fill="white" />
    {/* Esquina TL */}
    <rect x="8"  y="8"  width="20" height="20" rx="2" fill={color} />
    <rect x="12" y="12" width="12" height="12" rx="1" fill="white" />
    <rect x="14" y="14" width="8"  height="8"  rx="1" fill={color} />
    {/* Esquina TR */}
    <rect x="52" y="8"  width="20" height="20" rx="2" fill={color} />
    <rect x="56" y="12" width="12" height="12" rx="1" fill="white" />
    <rect x="58" y="14" width="8"  height="8"  rx="1" fill={color} />
    {/* Esquina BL */}
    <rect x="8"  y="52" width="20" height="20" rx="2" fill={color} />
    <rect x="12" y="56" width="12" height="12" rx="1" fill="white" />
    <rect x="14" y="58" width="8"  height="8"  rx="1" fill={color} />
    {/* Datos del centro */}
    <rect x="36" y="8"  width="4" height="4" fill={color} />
    <rect x="42" y="8"  width="4" height="4" fill={color} />
    <rect x="36" y="14" width="4" height="8" fill={color} />
    <rect x="8"  y="36" width="4" height="4" fill={color} />
    <rect x="14" y="36" width="8" height="4" fill={color} />
    <rect x="36" y="36" width="4" height="4" fill={color} />
    <rect x="42" y="36" width="4" height="4" fill={color} />
    <rect x="48" y="36" width="4" height="4" fill={color} />
    <rect x="36" y="42" width="8" height="4" fill={color} />
    <rect x="46" y="42" width="6" height="4" fill={color} />
    <rect x="54" y="36" width="4" height="4" fill={color} />
    <rect x="60" y="36" width="4" height="4" fill={color} />
    <rect x="66" y="36" width="4" height="4" fill={color} />
    <rect x="54" y="42" width="4" height="4" fill={color} />
    <rect x="60" y="42" width="10" height="4" fill={color} />
    <rect x="8"  y="42" width="4" height="4" fill={color} />
    <rect x="14" y="42" width="4" height="8" fill={color} />
    <rect x="20" y="42" width="4" height="4" fill={color} />
    <rect x="36" y="54" width="4" height="4" fill={color} />
    <rect x="42" y="54" width="8" height="4" fill={color} />
    <rect x="52" y="54" width="4" height="4" fill={color} />
    <rect x="58" y="54" width="4" height="8" fill={color} />
    <rect x="64" y="54" width="8" height="4" fill={color} />
    <rect x="36" y="60" width="4" height="12" fill={color} />
    <rect x="42" y="60" width="4" height="4"  fill={color} />
    <rect x="48" y="60" width="8" height="4"  fill={color} />
    <rect x="42" y="66" width="8" height="6"  fill={color} />
    <rect x="52" y="60" width="4" height="12" fill={color} />
    <rect x="64" y="60" width="8" height="12" fill={color} />
  </svg>
);

// ─── Panel de información por método ─────────────────────────────────────────
const PaymentDetails = ({ method, price }) => {
  const [cardNumber,  setCardNumber]  = useState("");
  const [cardExpiry,  setCardExpiry]  = useState("");
  const [cardCvv,     setCardCvv]     = useState("");
  const [cardHolder,  setCardHolder]  = useState("");

  const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  if (method === "efectivo") return (
    <div className={`${styles.paymentInfo} ${styles.paymentCash}`}>
      <span style={{ fontSize: 28 }}></span>
      <div>
        <p className={styles.paymentInfoTitle}>Pago en recepción</p>
        <p className={styles.paymentInfoText}>
          Presenta tu código de reserva al llegar al establecimiento.<br />
          El pago se realiza en efectivo antes de ingresar a la cancha.
        </p>
      </div>
    </div>
  );

  if (method === "tarjeta") return (
    <div style={{ marginTop: 12, padding: "16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10 }}>
      <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 14, color: "#111827" }}>
         Datos de la tarjeta
      </p>
      {[
        { label: "Titular de la tarjeta", value: cardHolder, setter: setCardHolder, placeholder: "Nombre como aparece en la tarjeta", maxLength: 40 },
      ].map(({ label, value, setter, placeholder, maxLength }) => (
        <div key={label} style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{label}</label>
          <input
            value={value}
            onChange={(e) => setter(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            style={{ width: "100%", padding: "10px 12px", marginTop: 4, border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
          />
        </div>
      ))}
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>Número de tarjeta</label>
        <input
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCard(e.target.value))}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          style={{ width: "100%", padding: "10px 12px", marginTop: 4, border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, letterSpacing: 2, boxSizing: "border-box" }}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>Fecha de vencimiento</label>
          <input
            value={cardExpiry}
            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
            placeholder="MM/AA"
            maxLength={5}
            style={{ width: "100%", padding: "10px 12px", marginTop: 4, border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>CVV</label>
          <input
            value={cardCvv}
            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="123"
            maxLength={4}
            type="password"
            style={{ width: "100%", padding: "10px 12px", marginTop: 4, border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
          />
        </div>
      </div>
      <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
         Tus datos están protegidos con encriptación SSL
      </p>
    </div>
  );

  if (method === "yape") return (
    <div className={`${styles.paymentInfo} ${styles.paymentYape}`} style={{ flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12 }}>
      <p className={styles.paymentInfoTitle} style={{ color: "#7C3AED" }}>
        Yapea tu reserva
      </p>
      <QRCode color="#7C3AED" />
      <div>
        <p className={styles.paymentInfoText}>
          Escanea el código QR o yapea al número:
        </p>
        <p style={{ fontSize: 20, fontWeight: 800, color: "#7C3AED", margin: "4px 0" }}>
          987 654 321
        </p>
        <p className={styles.paymentInfoText}>
          Monto: <strong style={{ color: "#7C3AED" }}>S/ {Number(price).toFixed(2)}</strong>
        </p>
        <p className={styles.paymentInfoText} style={{ marginTop: 6 }}>
          Concepto: <strong>Reserva Kancha Sports</strong>
        </p>
      </div>
      <p style={{ fontSize: 11, color: "#9ca3af" }}>
        Envía el comprobante a recepción al llegar
      </p>
    </div>
  );

  if (method === "plin") return (
    <div className={`${styles.paymentInfo} ${styles.paymentPlin}`} style={{ flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12 }}>
      <p className={styles.paymentInfoTitle} style={{ color: "#0284C7" }}>
        Plínea tu reserva
      </p>
      <QRCode color="#0284C7" />
      <div>
        <p className={styles.paymentInfoText}>
          Escanea el código QR o plínea al número:
        </p>
        <p style={{ fontSize: 20, fontWeight: 800, color: "#0284C7", margin: "4px 0" }}>
          987 654 321
        </p>
        <p className={styles.paymentInfoText}>
          Monto: <strong style={{ color: "#0284C7" }}>S/ {Number(price).toFixed(2)}</strong>
        </p>
        <p className={styles.paymentInfoText} style={{ marginTop: 6 }}>
          Concepto: <strong>Reserva Kancha Sports</strong>
        </p>
      </div>
      <p style={{ fontSize: 11, color: "#9ca3af" }}>
        Envía el comprobante a recepción al llegar
      </p>
    </div>
  );

  if (method === "transferencia") return (
    <div style={{ marginTop: 12, padding: "16px", background: "#fffbeb", border: "1px solid #f59e0b", borderRadius: 10 }}>
      <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 14, color: "#92400e" }}>
         Datos para transferencia interbancaria
      </p>
      {[
        { label: "Banco",    value: "BCP — Banco de Crédito del Perú" },
        { label: "Titular",  value: "Kancha Sports S.A.C."            },
        { label: "Cuenta",   value: "194 - 123456789 - 0 - 12"        },
        { label: "CCI",      value: "00219400123456789012"             },
        { label: "Monto",    value: `S/ ${Number(price).toFixed(2)}`   },
        { label: "Concepto", value: "Reserva de cancha"                },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "6px 0", borderBottom: "1px solid #fde68a" }}>
          <span style={{ fontSize: 12, color: "#92400e", fontWeight: 600, minWidth: 70 }}>{label}</span>
          <span style={{ fontSize: 13, color: "#1f2937", textAlign: "right", fontWeight: 500 }}>{value}</span>
        </div>
      ))}
      <p style={{ fontSize: 11, color: "#92400e", marginTop: 10 }}>
         Envía el comprobante de transferencia a <strong>pagos@kancha.pe</strong> o muéstralo en recepción.
      </p>
    </div>
  );

  return null;
};

// ─── Componente principal ─────────────────────────────────────────────────────
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
    const horaInicio = toLocalTime(schedule.startTime);
    const horaFin    = toLocalTime(schedule.endTime);
    const courtName  = court.name || court.titulo || court.nombre || "Cancha";
    try {
      const reservation = await create({
        canchaId:   court.id,
        fecha:      date,
        horaInicio,
        horaFin,
        metodoPago: payment,
      });
      onConfirm?.({
        ...reservation,
        canchaId:    court.id,
        courtName:   reservation?.courtName || reservation?.nombreCancha || courtName,
        court,
        schedule,
        fecha:       date,
        date,
        horaInicio:  reservation?.horaInicio || horaInicio,
        horaFin:     reservation?.horaFin    || horaFin,
        startTime:   reservation?.horaInicio || schedule.startTime,
        endTime:     reservation?.horaFin    || schedule.endTime,
        hora:        schedule.time || `${schedule.startTime} - ${schedule.endTime}`,
        totalAmount: reservation?.total ?? reservation?.totalAmount ?? reservation?.montoTotal ?? price,
        metodoPago:  payment,
        estado:      reservation?.estado,   // ✅ sin fallback — viene "confirmada" del backend
        customer:    { nombre, telefono },
        observaciones,
      });
    } catch {
      // apiError capturado por el hook
    }
  };
  
  return (
    <div className={styles.container}>

      {/* Header */}
      <header className={styles.header}>
        <button type="button" onClick={onBack} className={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Confirmar reserva</h1>
          <p className={styles.subtitle}>Verifica los detalles y completa tu pago</p>
        </div>
      </header>

      {/* Columna izquierda */}
      <div className={styles.leftCol}>

        {/* Resumen */}
        <div className={styles.summaryCard}>
          <p className={styles.summaryTitle}>Resumen de tu reserva</p>
          <div className={styles.summaryCourt}>
            <div className={styles.courtIcon}>{court.icono || "⚽"}</div>
            {court.name || court.titulo || court.nombre}
          </div>
          <div className={styles.summaryDetails}>
            <div className={styles.detailItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {formattedDate}
            </div>
            <div className={styles.detailItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {schedule.startTime} – {schedule.endTime}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
              <span style={{ fontWeight: 600 }}>Total a pagar</span>
              <span style={{ fontWeight: 800, fontSize: 18 }}>
                {price > 0 ? `S/ ${price.toFixed(2)}` : "Consultar"}
              </span>
            </div>
          </div>
        </div>

        {/* Datos de contacto */}
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Datos de contacto</h2>
          {[
            { label: "Nombre completo", value: nombre,   setter: setNombre,   type: "text", placeholder: "Tu nombre completo" },
            { label: "Teléfono",        value: telefono, setter: setTelefono, type: "tel",  placeholder: "+51 999 888 777"    },
          ].map(({ label, value, setter, type, placeholder }) => (
            <div key={label} className={styles.formGroup}>
              <label className={styles.label}>{label}</label>
              <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => setter(e.target.value)}
                className={styles.input}
              />
            </div>
          ))}
          <div className={styles.formGroup}>
            <label className={styles.label}>Observaciones (opcional)</label>
            <textarea
              value={observaciones}
              placeholder="Algún comentario adicional..."
              onChange={(e) => setObservaciones(e.target.value)}
              className={styles.textarea}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Columna derecha */}
      <div className={styles.rightCol}>

        {/* Método de pago */}
        <div className={styles.paymentContainer}>
          <h2 className={styles.formTitle}>Método de pago</h2>

          <div className={styles.paymentGrid}>
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPayment(method.id)}
                className={`${styles.paymentOption} ${payment === method.id ? styles.paymentSelected : ""}`}
              >
                <img
                  src={PAYMENT_LOGOS[method.id]}
                  alt={method.label}
                  style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 8 }}
                />
                <span className={styles.paymentLabel}>{method.label}</span>
                {payment === method.id && (
                  <span className={styles.paymentCheck}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Detalle del método seleccionado */}
          {payment && <PaymentDetails method={payment} price={price} />}
        </div>

        {/* Error API */}
        {apiError && (
          <div style={{ color: "#dc2626", background: "#fef2f2", padding: "10px 14px", borderRadius: 8, fontSize: 14 }}>
             {apiError}
          </div>
        )}

        {/* Botones */}
        <div className={styles.actions}>
          <button type="button" onClick={onBack} disabled={loading} className={styles.cancelBtn}>
            Cancelar
          </button>
          <button type="button" onClick={handleConfirm} disabled={loading} className={styles.confirmBtn}>
            {loading ? "Procesando..." : "Confirmar reserva"}
          </button>
        </div>

        <p className={styles.note}>
           Tu reserva está protegida. Recibirás un código de confirmación.
        </p>
      </div>
    </div>
  );
}