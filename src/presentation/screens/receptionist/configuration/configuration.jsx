import "./configuration.css";
import {
  DSAText,
  DSAFormSection,
  DSAInput,
  DSACard,
  DSAButton,
  DSATimeInput,
  DSASelectableItem,
} from "../../../components";
import { useState } from "react";
const Configuration = () => {
  //   const [enabled, setEnabled] = useState(false);
  const [form, setForm] = useState({
    name: "FieldBook Sports",
    address: "Av. Principal 123",
    phone: "555-9999",
  });
  const [fields, setFields] = useState({
    futbol5: true,
    futbol7: true,
    futbol11: true,
    voley: true,
  });

  const handleChange = (field) => (value) => {
    setForm({ ...form, [field]: value });
    setSchedule({ ...schedule, [field]: value });
    setFields({ ...fields, [field]: value });
  };
  const [schedule, setSchedule] = useState({
    open: "08:00",
    close: "22:00",
  });
  return (
    <>
      <div className="containerConfiguration">
        <DSAText variant="title">Configuración</DSAText>
        <DSAText variant="text" color={"#6B7280"}>
          Administra las opciones del sistema
        </DSAText>
        <div className="containerForm">
          <DSACard>
            <DSAFormSection title="General">
              <DSAInput
                label="Nombre del negocio"
                value={form.name}
                onChange={handleChange("name")}
              />
              <DSAInput
                label="Dirección"
                value={form.address}
                onChange={handleChange("address")}
              />
              <DSAInput
                label="Teléfono de contacto"
                value={form.phone}
                onChange={handleChange("phone")}
              />
            </DSAFormSection>
          </DSACard>
          <DSACard>
            <DSAFormSection title="Horarios de operación">
              <div className="form-row">
                <DSATimeInput
                  label="Hora de apertura"
                  value={schedule.open}
                  onChange={handleChange("open")}
                />

                <DSATimeInput
                  label="Hora de cierre"
                  value={schedule.close}
                  onChange={handleChange("close")}
                />
              </div>
            </DSAFormSection>
          </DSACard>
          <DSACard>
            <DSAFormSection title="Canchas disponibles">
              <div className="list">
                <DSASelectableItem
                  label="Fútbol 5"
                  checked={fields.futbol5}
                  onChange={handleChange("futbol5")}
                />
                <DSASelectableItem
                  label="Fútbol 7"
                  checked={fields.futbol7}
                  onChange={handleChange("futbol7")}
                />
                <DSASelectableItem
                  label="Fútbol 11"
                  checked={fields.futbol11}
                  onChange={handleChange("futbol11")}
                />
                <DSASelectableItem
                  label="Vóley"
                  checked={fields.voley}
                  onChange={handleChange("voley")}
                />
              </div>
            </DSAFormSection>
          </DSACard>
          <div className="containerButton">
            <DSAButton>Guardar Cambios</DSAButton>
          </div>
        </div>
      </div>
    </>
  );
};
export default Configuration;
