import { useState } from "react";
import { DSAButton, DSACourtsTable, DSAText, DSAInput } from "../../../components";
import "./courts.css";

const Courts = () => {
  const [tipoFiltro, setTipoFiltro]     = useState("Todos los tipos");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos los estados");
  const [showModal, setShowModal]       = useState(false);
  const [form, setForm] = useState({ nombre: "", type: "", state: "Disponible" });
  const [courts, setCourts] = useState([
    { id: 1, nombre: "Cancha A", type: "Fútbol 5",  state: "Disponible"    },
    { id: 2, nombre: "Cancha B", type: "Fútbol 7",  state: "Ocupada"       },
    { id: 3, nombre: "Cancha C", type: "Voley",      state: "Disponible"    },
    { id: 4, nombre: "Cancha D", type: "Fútbol 11", state: "Mantenimiento" },
    { id: 5, nombre: "Cancha E", type: "Fútbol 5",  state: "Disponible"    },
  ]);

  const tipos   = ["Todos los tipos",   ...new Set(courts.map((c) => c.type))];
  const estados = ["Todos los estados", ...new Set(courts.map((c) => c.state))];

  const filtered = courts.filter((c) => {
    const okTipo   = tipoFiltro   === "Todos los tipos"   || c.type  === tipoFiltro;
    const okEstado = estadoFiltro === "Todos los estados" || c.state === estadoFiltro;
    return okTipo && okEstado;
  });

  const handleCreate = () => {
    if (!form.nombre.trim() || !form.type.trim()) return;
    setCourts([...courts, { id: Date.now(), ...form }]);
    setForm({ nombre: "", type: "", state: "Disponible" });
    setShowModal(false);
  };

  return (
    <div>
      <div className="containerHeaderCourts">
        <div>
          <DSAText variant="title">Canchas</DSAText>
          <DSAText variant="text" color="#6B7280">Gestiona las canchas deportivas</DSAText>
        </div>
        <div className="containerButtonCourts">
          <DSAButton onClick={() => setShowModal(true)}>+ Crear Cancha</DSAButton>
        </div>
      </div>

      <div className="containerFiltersCourts">
        <select className="filterSelect" value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
          {tipos.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select className="filterSelect" value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
          {estados.map((e) => <option key={e}>{e}</option>)}
        </select>
      </div>

      <div className="containerTableCourts">
        <DSACourtsTable data={filtered} />
      </div>

      {showModal && (
        <div className="modalOverlay" onClick={() => setShowModal(false)}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <DSAText variant="subtitle">Crear Cancha</DSAText>
              <button className="modalClose" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <DSAInput
              label="Nombre"
              placeholder="Ej: Cancha F"
              value={form.nombre}
              onChange={(v) => setForm({ ...form, nombre: v })}
            />
            <DSAInput
              label="Tipo"
              placeholder="Ej: Fútbol 5, Voley..."
              value={form.type}
              onChange={(v) => setForm({ ...form, type: v })}
            />
            <div className="inputGroup">
              <label className="inputLabel">Estado</label>
              <select
                className="filterSelect fullWidth"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              >
                <option>Disponible</option>
                <option>Ocupada</option>
                <option>Mantenimiento</option>
              </select>
            </div>
            <div className="modalActions">
              <button className="cancelBtn" onClick={() => setShowModal(false)}>Cancelar</button>
              <DSAButton onClick={handleCreate}>Crear</DSAButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courts;