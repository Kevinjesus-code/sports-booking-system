import { useState } from "react";
import styles from "./configuration.module.css";

const Configuration = ({ onBack }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    reservationReminders: true,
    whatsappUpdates: false,
    defaultPayment: "Yape",
    preferredSport: "Futbol 5",
  });

  const updateSetting = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }));
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
          <h1>Configuracion</h1>
          <span>Administra tus preferencias de reservas y avisos.</span>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.panel}>
          <h2>Notificaciones</h2>
          <label className={styles.toggleRow}>
            <span>
              <strong>Correos de reserva</strong>
              <small>Recibe confirmaciones y cambios por correo.</small>
            </span>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(event) => updateSetting("emailNotifications", event.target.checked)}
            />
          </label>

          <label className={styles.toggleRow}>
            <span>
              <strong>Recordatorios</strong>
              <small>Te avisaremos antes de tu horario reservado.</small>
            </span>
            <input
              type="checkbox"
              checked={settings.reservationReminders}
              onChange={(event) => updateSetting("reservationReminders", event.target.checked)}
            />
          </label>

          <label className={styles.toggleRow}>
            <span>
              <strong>Actualizaciones por WhatsApp</strong>
              <small>Recibe avisos rapidos en tu telefono.</small>
            </span>
            <input
              type="checkbox"
              checked={settings.whatsappUpdates}
              onChange={(event) => updateSetting("whatsappUpdates", event.target.checked)}
            />
          </label>
        </section>

        <section className={styles.panel}>
          <h2>Preferencias</h2>
          <label className={styles.field}>
            Metodo de pago preferido
            <select
              value={settings.defaultPayment}
              onChange={(event) => updateSetting("defaultPayment", event.target.value)}
            >
              <option>Yape</option>
              <option>Plin</option>
              <option>Tarjeta</option>
              <option>Efectivo</option>
            </select>
          </label>

          <label className={styles.field}>
            Deporte favorito
            <select
              value={settings.preferredSport}
              onChange={(event) => updateSetting("preferredSport", event.target.value)}
            >
              <option>Futbol 5</option>
              <option>Futbol 7</option>
              <option>Futbol 11</option>
              <option>Voley</option>
            </select>
          </label>

          <button className={styles.saveButton} onClick={() => alert("Configuracion guardada")}>
            Guardar cambios
          </button>
        </section>
      </div>
    </div>
  );
};

export default Configuration;
