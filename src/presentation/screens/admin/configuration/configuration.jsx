import { useState } from "react";
import styles from "./configuration.module.css";

const Configuration = ({ onBack }) => {
  const [settings, setSettings] = useState({
    // Negocio
    businessName: "Kancha",
    businessPhone: "987654321",
    businessEmail: "contacto@kancha.pe",
    businessAddress: "Av. Javier Prado 1234, Lima",

    // Políticas
    cancellationHours: 2,
    maxAdvanceDays: 30,
    requireDeposit: true,
    depositPercent: 50,
    autoConfirm: true,

    // Pagos
    yapeEnabled: true,
    plinEnabled: true,
    cardEnabled: false,
    cashEnabled: true,

    // Alertas al admin
    alertEmail: "",
    alertNewReservation: true,
    alertCancellation: true,
    alertDailyReport: false,

    // Sistema
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);

  const update = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
          <span>Parámetros globales del negocio.</span>
        </div>
      </div>

      <div className={styles.grid}>

        {/* Información del negocio */}
        <section className={styles.panel}>
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Información del negocio
          </h2>

          <label className={styles.field}>
            Nombre del establecimiento
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => update("businessName", e.target.value)}
            />
          </label>

          <label className={styles.field}>
            Teléfono de contacto
            <input
              type="tel"
              value={settings.businessPhone}
              onChange={(e) => update("businessPhone", e.target.value)}
            />
          </label>

          <label className={styles.field}>
            Correo de contacto
            <input
              type="email"
              value={settings.businessEmail}
              onChange={(e) => update("businessEmail", e.target.value)}
            />
          </label>

          <label className={styles.field}>
            Dirección
            <input
              type="text"
              value={settings.businessAddress}
              onChange={(e) => update("businessAddress", e.target.value)}
            />
          </label>
        </section>

        {/* Políticas */}
        <section className={styles.panel}>
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="15" y2="17" />
            </svg>
            Políticas
          </h2>

          <label className={styles.field}>
            Horas mínimas para cancelar
            <div className={styles.inputUnit}>
              <input
                type="number"
                min={0}
                value={settings.cancellationHours}
                onChange={(e) => update("cancellationHours", Number(e.target.value))}
              />
              <span>horas</span>
            </div>
          </label>

          <label className={styles.field}>
            Días máximos de anticipación para reservar
            <div className={styles.inputUnit}>
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

          <label className={styles.toggleRow}>
            <span>
              <strong>Requerir depósito al reservar</strong>
              <small>El cliente paga un porcentaje por adelantado.</small>
            </span>
            <input
              type="checkbox"
              checked={settings.requireDeposit}
              onChange={(e) => update("requireDeposit", e.target.checked)}
            />
          </label>

          {settings.requireDeposit && (
            <label className={styles.field}>
              Porcentaje de depósito
              <div className={styles.inputUnit}>
                <input
                  type="number"
                  min={10}
                  max={100}
                  step={5}
                  value={settings.depositPercent}
                  onChange={(e) => update("depositPercent", Number(e.target.value))}
                />
                <span>%</span>
              </div>
            </label>
          )}

          <label className={styles.toggleRow}>
            <span>
              <strong>Confirmación automática</strong>
              <small>Las reservas se aprueban sin revisión manual.</small>
            </span>
            <input
              type="checkbox"
              checked={settings.autoConfirm}
              onChange={(e) => update("autoConfirm", e.target.checked)}
            />
          </label>
        </section>

        {/* Métodos de pago */}
        <section className={styles.panel}>
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Métodos de pago habilitados
          </h2>
          <p className={styles.panelDesc}>Solo los métodos activos estarán disponibles para los clientes.</p>

          {[
            { key: "yapeEnabled",  label: "Yape",                    desc: "Pagos por código QR." },
            { key: "plinEnabled",  label: "Plin",                    desc: "Pagos por código QR." },
            { key: "cardEnabled",  label: "Tarjeta de crédito/débito", desc: "Visa, Mastercard y otras." },
            { key: "cashEnabled",  label: "Efectivo en cancha",       desc: "Cobro presencial al llegar." },
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

        {/* Alertas del sistema */}
        <section className={styles.panel}>
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            Alertas del sistema
          </h2>

          <label className={styles.field}>
            Correo que recibe las alertas
            <input
              type="email"
              placeholder="admin@kancha.pe"
              value={settings.alertEmail}
              onChange={(e) => update("alertEmail", e.target.value)}
            />
          </label>

          {[
            { key: "alertNewReservation", label: "Nueva reserva",   desc: "Notificar cuando un cliente reserva." },
            { key: "alertCancellation",   label: "Cancelación",     desc: "Notificar cuando se cancela una reserva." },
            { key: "alertDailyReport",    label: "Reporte diario",  desc: "Resumen automático al cierre del día." },
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

          <label className={`${styles.toggleRow} ${styles.danger}`}>
            <span>
              <strong>Modo mantenimiento</strong>
              <small>Bloquea el acceso de clientes al sistema.</small>
            </span>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => update("maintenanceMode", e.target.checked)}
            />
          </label>
        </section>

      </div>

      <div className={styles.saveBar}>
        {saved && <span className={styles.savedMsg}>✓ Configuración guardada</span>}
        <button className={styles.saveButton} onClick={handleSave}>
          Guardar configuración
        </button>
      </div>
    </div>
  );
};

export default Configuration;