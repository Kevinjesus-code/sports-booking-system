import { useState } from "react";
import styles from "./configuration.module.css";

const Configuration = ({ onBack }) => {
  const [settings, setSettings] = useState({
    notifConfirmacion: true,
    notifRecordatorio: true,
    notifCancelacion: true,
    notifPromociones: false,
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
          <p className={styles.eyebrow}>Cliente</p>
          <h1>Configuración</h1>
          <span>Personaliza tu experiencia de reservas.</span>
        </div>
      </div>

      <div className={styles.grid}>

        {/* Panel — Notificaciones */}
        <section className={styles.panel}>
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            Notificaciones
          </h2>

          {[
            {
              key: "notifConfirmacion",
              label: "Confirmación de reserva",
              desc: "Recibe un correo cuando tu reserva sea confirmada.",
            },
            {
              key: "notifRecordatorio",
              label: "Recordatorio previo",
              desc: "Te avisamos 1 hora antes de tu reserva.",
            },
            {
              key: "notifCancelacion",
              label: "Cancelación de cancha",
              desc: "Notificación si una cancha reservada se cancela.",
            },
            {
              key: "notifPromociones",
              label: "Novedades y promociones",
              desc: "Descuentos y novedades del local.",
            },
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

      <div className={styles.saveBar}>
        {saved && <span className={styles.savedMsg}>✓ Configuración guardada</span>}
        <button className={styles.saveButton} onClick={handleSave}>
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

export default Configuration;