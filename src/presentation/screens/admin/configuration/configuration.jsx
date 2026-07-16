import { useState, useEffect } from "react";
import styles from "./configuration.module.css";
import { getConfiguracionRequest, updateConfiguracionRequest } from "../../../../infrastructure/api/configuration.api";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await getConfiguracionRequest();
        if (response.data) {
          // Extraer la hora sin los segundos si es necesario
          const data = { ...response.data };
          if (data.horaApertura && data.horaApertura.length > 5) data.horaApertura = data.horaApertura.slice(0, 5);
          if (data.horaCierre && data.horaCierre.length > 5) data.horaCierre = data.horaCierre.slice(0, 5);
          
          setSettings(data);
        }
      } catch (error) {
        console.error("Error fetching config:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const update = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      const response = await updateConfiguracionRequest(settings);
      if (response.data) {
        const data = { ...response.data };
        if (data.horaApertura && data.horaApertura.length > 5) data.horaApertura = data.horaApertura.slice(0, 5);
        if (data.horaCierre && data.horaCierre.length > 5) data.horaCierre = data.horaCierre.slice(0, 5);
        setSettings(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving config:", error);
      alert("Error al guardar la configuración");
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Cargando...</div>;

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

        {/* Horarios de operación */}
        <section className={styles.panel}>
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Horarios de operación
          </h2>
          <p className={styles.panelDesc}>Define las horas de apertura y cierre. Al guardar se generarán los intervalos de 1 hora para todas las canchas.</p>

          <div className={styles.timeRow}>
            <label className={styles.field}>
              Hora de apertura
              <input
                type="time"
                value={settings.horaApertura || "08:00"}
                onChange={(e) => update("horaApertura", e.target.value)}
              />
            </label>

            <label className={styles.field}>
              Hora de cierre
              <input
                type="time"
                value={settings.horaCierre || "22:00"}
                onChange={(e) => update("horaCierre", e.target.value)}
              />
            </label>
          </div>
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