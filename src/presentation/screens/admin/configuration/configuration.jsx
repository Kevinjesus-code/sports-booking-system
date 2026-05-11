import { useState } from "react";
import styles from "./configuration.module.css";

const Configuration = ({ onBack }) => {
  const [settings, setSettings] = useState({
    // General
    systemName: "Kancha",
    currency: "PEN",
    timezone: "America/Lima",
    language: "es",

    // Reservas
    maxAdvanceDays: 30,
    minDurationMinutes: 60,
    maxDurationMinutes: 120,
    cancellationHours: 2,
    autoConfirm: true,

    // Pagos
    yapeEnabled: true,
    plinEnabled: true,
    cardEnabled: false,
    cashEnabled: true,

    // Notificaciones admin
    alertNewReservation: true,
    alertCancellation: true,
    alertDailyReport: false,
    alertEmail: "",

    // Sistema
    maintenanceMode: false,
    maxCourts: 10,
  });

  const [saved, setSaved] = useState(false);

  const update = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        <div>
          <p className={styles.eyebrow}>Sistema</p>
          <h1>Configuración</h1>
          <span>Parámetros globales del sistema de reservas.</span>
        </div>
      </div>

      <div className={styles.grid}>

        {/* Panel 1 — General */}
        <section className={styles.panel}>
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            General
          </h2>

          <label className={styles.field}>
            Nombre del sistema
            <input
              type="text"
              value={settings.systemName}
              onChange={(e) => update("systemName", e.target.value)}
            />
          </label>

          <label className={styles.field}>
            Moneda
            <select value={settings.currency} onChange={(e) => update("currency", e.target.value)}>
              <option value="PEN">PEN — Sol peruano</option>
              <option value="USD">USD — Dólar</option>
            </select>
          </label>

          <label className={styles.field}>
            Zona horaria
            <select value={settings.timezone} onChange={(e) => update("timezone", e.target.value)}>
              <option value="America/Lima">America/Lima (UTC-5)</option>
              <option value="America/Bogota">America/Bogota (UTC-5)</option>
              <option value="America/Santiago">America/Santiago (UTC-3)</option>
            </select>
          </label>

          <label className={styles.toggleRow}>
            <span>
              <strong>Modo mantenimiento</strong>
              <small>Desactiva el acceso de clientes al sistema.</small>
            </span>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => update("maintenanceMode", e.target.checked)}
            />
          </label>
        </section>

        {/* Panel 2 — Reservas */}
        <section className={styles.panel}>
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Reservas
          </h2>

          <label className={styles.field}>
            Días máximos de anticipación
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                min={1}
                max={90}
                value={settings.maxAdvanceDays}
                onChange={(e) => update("maxAdvanceDays", Number(e.target.value))}
              />
              <span>días</span>
            </div>
          </label>

          <label className={styles.field}>
            Duración mínima por reserva
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                min={30}
                step={30}
                value={settings.minDurationMinutes}
                onChange={(e) => update("minDurationMinutes", Number(e.target.value))}
              />
              <span>min</span>
            </div>
          </label>

          <label className={styles.field}>
            Duración máxima por reserva
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                min={60}
                step={30}
                value={settings.maxDurationMinutes}
                onChange={(e) => update("maxDurationMinutes", Number(e.target.value))}
              />
              <span>min</span>
            </div>
          </label>

          <label className={styles.field}>
            Horas mínimas para cancelar
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                min={0}
                value={settings.cancellationHours}
                onChange={(e) => update("cancellationHours", Number(e.target.value))}
              />
              <span>hrs</span>
            </div>
          </label>

          <label className={styles.toggleRow}>
            <span>
              <strong>Confirmación automática</strong>
              <small>Las reservas se confirman sin aprobación manual.</small>
            </span>
            <input
              type="checkbox"
              checked={settings.autoConfirm}
              onChange={(e) => update("autoConfirm", e.target.checked)}
            />
          </label>
        </section>

        {/* Panel 3 — Métodos de pago */}
        <section className={styles.panel}>
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Métodos de pago
          </h2>
          <p className={styles.panelDesc}>Activa los métodos disponibles para los clientes.</p>

          {[
            { key: "yapeEnabled", label: "Yape", desc: "Pagos por código QR Yape." },
            { key: "plinEnabled", label: "Plin", desc: "Pagos por código QR Plin." },
            { key: "cardEnabled", label: "Tarjeta de crédito / débito", desc: "Visa, Mastercard y otras." },
            { key: "cashEnabled", label: "Efectivo en cancha", desc: "Pago presencial al llegar." },
          ].map(({ key, label, desc }) => (
            <label key={key} className={styles.toggleRow}>
              <span>
                <strong>{label}</strong>
                <small>{desc}</small>
              </span>
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => update(key, e.target.checked)}
              />
            </label>
          ))}
        </section>

        {/* Panel 4 — Notificaciones admin */}
        <section className={styles.panel}>
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            Alertas del administrador
          </h2>

          <label className={styles.field}>
            Correo para alertas del sistema
            <input
              type="email"
              placeholder="admin@kancha.pe"
              value={settings.alertEmail}
              onChange={(e) => update("alertEmail", e.target.value)}
            />
          </label>

          {[
            { key: "alertNewReservation", label: "Nueva reserva", desc: "Notificar al admin cuando se crea una reserva." },
            { key: "alertCancellation", label: "Cancelación", desc: "Notificar al admin cuando un cliente cancela." },
            { key: "alertDailyReport", label: "Reporte diario", desc: "Recibir un resumen automático cada día." },
          ].map(({ key, label, desc }) => (
            <label key={key} className={styles.toggleRow}>
              <span>
                <strong>{label}</strong>
                <small>{desc}</small>
              </span>
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => update(key, e.target.checked)}
              />
            </label>
          ))}
        </section>

      </div>

      {/* Barra de guardar fija abajo */}
      <div className={styles.saveBar}>
        {saved && <span className={styles.savedMsg}>✓ Cambios guardados correctamente</span>}
        <button className={styles.saveButton} onClick={handleSave}>
          Guardar configuración
        </button>
      </div>
    </div>
  );
};

export default Configuration;