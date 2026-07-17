import styles from "./configuration.module.css";
import {
  DSAText,
  DSAFormSection,
  DSAInput,
  DSACard,
  DSAButton,
  DSATimeInput,
  DSASelectableItem,
} from "../../../components";
import { useState, useEffect } from "react";
import { courtRepository } from "../../../../infrastructure/repositories/courtRepositoryImpl";
import { getConfiguracionRequest, updateConfiguracionRequest } from "../../../../infrastructure/api/configuration.api";

const Configuration = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });
  
  const [schedule, setSchedule] = useState({
    open: "08:00",
    close: "22:00",
  });

  const [configId, setConfigId] = useState(null);
  const [fullConfig, setFullConfig] = useState(null);
  const [courts, setCourts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configRes, courtsData] = await Promise.all([
          getConfiguracionRequest(),
          courtRepository.getAll(),
        ]);
        
        if (configRes.data) {
          const cfg = configRes.data;
          setFullConfig(cfg);
          setConfigId(cfg.id);
          setForm({
            name: cfg.businessName || "",
            address: cfg.businessAddress || "",
            phone: cfg.businessPhone || "",
          });
          setSchedule({
            open: cfg.horaApertura ? cfg.horaApertura.slice(0, 5) : "08:00",
            close: cfg.horaCierre ? cfg.horaCierre.slice(0, 5) : "22:00",
          });
        }
        
        setCourts(courtsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChangeForm = (field) => (value) => {
    setForm({ ...form, [field]: value });
  };

  const handleChangeSchedule = (field) => (value) => {
    setSchedule({ ...schedule, [field]: value });
  };

  const handleCourtToggle = (id) => (value) => {
    setCourts(courts.map(c => c.id === id ? { ...c, disponible: value } : c));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Guardar configuración del negocio
      const configToSave = {
        ...fullConfig,
        businessName: form.name,
        businessAddress: form.address,
        businessPhone: form.phone,
        horaApertura: schedule.open,
        horaCierre: schedule.close,
      };
      
      const configRes = await updateConfiguracionRequest(configToSave);
      if (configRes.data) {
        setFullConfig(configRes.data);
      }
      
      // Guardar estado de canchas
      await Promise.all(
        courts.map(c => courtRepository.updateStatus(c.id, c.disponible))
      );
      
      alert("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>Cargando configuración...</div>;

  return (
    <>
      <div className={styles["containerConfiguration"]}>
        <DSAText variant="title">Configuración</DSAText>
        <DSAText variant="text" color={"#6B7280"}>
          Administra las opciones del sistema
        </DSAText>
        <div className={styles["containerForm"]}>
          <DSACard>
            <DSAFormSection title="General">
              <DSAInput
                label="Nombre del negocio"
                value={form.name}
                onChange={handleChangeForm("name")}
              />
              <DSAInput
                label="Dirección"
                value={form.address}
                onChange={handleChangeForm("address")}
              />
              <DSAInput
                label="Teléfono de contacto"
                value={form.phone}
                onChange={handleChangeForm("phone")}
              />
            </DSAFormSection>
          </DSACard>
          <DSACard>
            <DSAFormSection title="Horarios de operación">
              <div className={styles["form-row"]}>
                <DSATimeInput
                  label="Hora de apertura"
                  value={schedule.open}
                  onChange={handleChangeSchedule("open")}
                />

                <DSATimeInput
                  label="Hora de cierre"
                  value={schedule.close}
                  onChange={handleChangeSchedule("close")}
                />
              </div>
            </DSAFormSection>
          </DSACard>
          <DSACard>
            <DSAFormSection title="Canchas disponibles">
              <div className={styles["list"]}>
                {courts.map(court => (
                  <DSASelectableItem
                    key={court.id}
                    label={court.name}
                    checked={court.disponible}
                    onChange={handleCourtToggle(court.id)}
                  />
                ))}
              </div>
            </DSAFormSection>
          </DSACard>
          <div className={styles["containerButton"]}>
            <DSAButton onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </DSAButton>
          </div>
        </div>
      </div>
    </>
  );
};
export default Configuration;
