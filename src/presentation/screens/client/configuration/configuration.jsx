import { useState, useEffect } from "react";
import styles from "./configuration.module.css";
import Switch from "../../../components/switch";
import {
  getPreferenciasNotificaciones,
  updatePreferenciasNotificaciones,
} from "../../../../application/perfil/perfilUseCases";

const FIELDS = [
  {
    key: "notifConfirmacionReserva",
    label: "Confirmación de reserva",
    desc: "Recibe un correo cuando tu reserva sea confirmada.",
  },
  {
    key: "notifRecordatorioPrevio",
    label: "Recordatorio previo",
    desc: "Te avisamos 1 hora antes de tu reserva.",
  },
  {
    key: "notifCancelacionCancha",
    label: "Cancelación de cancha",
    desc: "Notificación si una cancha reservada se cancela.",
  },
  {
    key: "notifNovedadesPromociones",
    label: "Novedades y promociones",
    desc: "Descuentos y novedades del local.",
  },
];

const Configuration = ({ onBack }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const data = await getPreferenciasNotificaciones();
        if (activo) setSettings(data);
      } catch (err) {
        if (activo) setError("No se pudo cargar tu configuración.");
      } finally {
        if (activo) setLoading(false);
      }
    })();
    return () => { activo = false; };
  }, []);

  const update = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updatePreferenciasNotificaciones(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.screen}>Cargando configuración…</div>;
  }

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
        <section className={styles.panel}>
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            Notificaciones
          </h2>

          {FIELDS.map(({ key, label, desc }) => (
            <div key={key} className={styles.toggleRow}>
              <span>
                <strong>{label}</strong>
                <small>{desc}</small>
              </span>
              <Switch
                checked={settings[key]}
                onChange={(value) => update(key, value)}
              />
            </div>
          ))}
        </section>
      </div>

      <div className={styles.saveBar}>
        {error && <span className={styles.errorMsg}>{error}</span>}
        {saved && <span className={styles.savedMsg}>✓ Configuración guardada</span>}
        <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
};

export default Configuration;