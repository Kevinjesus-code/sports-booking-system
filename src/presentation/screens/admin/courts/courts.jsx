import { useState, useEffect, useCallback } from "react";
import { DSAButton, DSACourtsTable, DSAText, DSAInput } from "../../../components";
import {
  listarCanchasRequest,
  crearCanchaRequest,
  actualizarCanchaRequest,
  eliminarCanchaRequest,
  stateToLabel,
  labelToState,
} from "../../../../infrastructure/api/cancha.api";
import styles from "./courts.module.css";

// ─── Mapeo backend → fila de tabla ────────────────────────────────────────
const toRow = (c) => ({
  id:     c.id,
  nombre: c.nombre,
  type:   c.tipo,
  state:  stateToLabel(c),
  // guardamos el objeto completo por si el modal de edición lo necesita
  _raw:   c,
});

const ESTADOS_UI = ["Disponible", "Ocupada", "Mantenimiento"];

const emptyForm = { nombre: "", type: "", state: "Disponible" };

// ─── Componente ───────────────────────────────────────────────────────────
const Courts = () => {
  const [courts,       setCourts]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [tipoFiltro,   setTipoFiltro]   = useState("Todos los tipos");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos los estados");

  // Modal crear
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState(emptyForm);
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState(null);

  // Modal editar
  const [editModal,  setEditModal]  = useState(false);
  const [editForm,   setEditForm]   = useState(emptyForm);
  const [editId,     setEditId]     = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  // ── Cargar canchas ──────────────────────────────────────────────────────
  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await listarCanchasRequest();
      // el backend puede devolver el array directo o envuelto en data.data
      const lista = Array.isArray(data) ? data : (data?.data ?? []);
      setCourts(lista.map(toRow));
    } catch (err) {
      setError("No se pudieron cargar las canchas. Intenta de nuevo.");
      console.error("[Courts] error al cargar:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  // ── Filtros ─────────────────────────────────────────────────────────────
  const tipos   = ["Todos los tipos",   ...new Set(courts.map((c) => c.type))];
  const estados = ["Todos los estados", ...new Set(courts.map((c) => c.state))];

  const filtered = courts.filter((c) => {
    const okTipo   = tipoFiltro   === "Todos los tipos"   || c.type  === tipoFiltro;
    const okEstado = estadoFiltro === "Todos los estados" || c.state === estadoFiltro;
    return okTipo && okEstado;
  });

  // ── Crear ────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.nombre.trim() || !form.type.trim()) {
      setFormError("Nombre y tipo son obligatorios.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const stateFields = labelToState(form.state);
      await crearCanchaRequest({
        nombre:      form.nombre.trim(),
        tipo:        form.type.trim(),
        descripcion: "",
        precioPorHora: 0,
        capacidad:   0,
        ...stateFields,
      });
      setForm(emptyForm);
      setShowModal(false);
      await cargar();
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.response?.data ?? "Error al crear la cancha.";
      setFormError(typeof msg === "string" ? msg : "Error al crear la cancha.");
      console.error("[Courts] error al crear:", err);
    } finally {
      setSaving(false);
    }
  };

  // ── Abrir modal editar ───────────────────────────────────────────────────
  const handleOpenEdit = (court) => {
    setEditId(court.id);
    setEditForm({ nombre: court.nombre, type: court.type, state: court.state });
    setEditModal(true);
  };

  // ── Guardar edición ──────────────────────────────────────────────────────
  const handleEdit = async () => {
    if (!editForm.nombre.trim() || !editForm.type.trim()) return;
    setEditSaving(true);
    try {
      const stateFields = labelToState(editForm.state);
      // Necesitamos el objeto original para no perder campos que el form no edita
      const original = courts.find((c) => c.id === editId)?._raw ?? {};
      await actualizarCanchaRequest(editId, {
        ...original,
        nombre:      editForm.nombre.trim(),
        tipo:        editForm.type.trim(),
        descripcion: original.descripcion ?? "",
        precioPorHora: original.precioPorHora ?? 0,
        capacidad:   original.capacidad ?? 0,
        ...stateFields,
      });
      setEditModal(false);
      await cargar();
    } catch (err) {
      console.error("[Courts] error al editar:", err);
    } finally {
      setEditSaving(false);
    }
  };

  // ── Eliminar ─────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta cancha? Esta acción no se puede deshacer.")) return;
    try {
      await eliminarCanchaRequest(id);
      await cargar();
    } catch (err) {
      console.error("[Courts] error al eliminar:", err);
      alert("No se pudo eliminar la cancha.");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className={styles["containerHeaderCourts"]}>
        <div>
          <DSAText variant="title">Canchas</DSAText>
          <DSAText variant="text" color="#6B7280">Gestiona las canchas deportivas</DSAText>
        </div>
        <div className={styles["containerButtonCourts"]}>
          <DSAButton onClick={() => { setForm(emptyForm); setFormError(null); setShowModal(true); }}>
            + Crear Cancha
          </DSAButton>
        </div>
      </div>

      {/* Filtros */}
      <div className={styles["containerFiltersCourts"]}>
        <select
          className={styles["filterSelect"]}
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
        >
          {tipos.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select
          className={styles["filterSelect"]}
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
        >
          {estados.map((e) => <option key={e}>{e}</option>)}
        </select>
      </div>

      {/* Tabla / estados */}
      <div className={styles["containerTableCourts"]}>
        {loading ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#6B7280" }}>
            Cargando canchas...
          </div>
        ) : error ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#ef4444" }}>
            {error}
            <br />
            <button
              onClick={cargar}
              style={{ marginTop: 12, cursor: "pointer", color: "#22c55e", background: "none", border: "none" }}
            >
              Reintentar
            </button>
          </div>
        ) : (
          <DSACourtsTable
            data={filtered}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* ── Modal Crear ── */}
      {showModal && (
        <div className={styles["modalOverlay"]} onClick={() => setShowModal(false)}>
          <div className={styles["modalBox"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modalHeader"]}>
              <DSAText variant="subtitle">Crear Cancha</DSAText>
              <button className={styles["modalClose"]} onClick={() => setShowModal(false)}>✕</button>
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
            <div className={styles["inputGroup"]}>
              <label className={styles["inputLabel"]}>Estado</label>
              <select
                className={`${styles["filterSelect"]} ${styles["fullWidth"]}`}
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              >
                {ESTADOS_UI.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {formError && (
              <p style={{ color: "#ef4444", fontSize: 13, marginTop: 8 }}>{formError}</p>
            )}

            <div className={styles["modalActions"]}>
              <button className={styles["cancelBtn"]} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <DSAButton onClick={handleCreate} disabled={saving}>
                {saving ? "Creando..." : "Crear"}
              </DSAButton>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Editar ── */}
      {editModal && (
        <div className={styles["modalOverlay"]} onClick={() => setEditModal(false)}>
          <div className={styles["modalBox"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modalHeader"]}>
              <DSAText variant="subtitle">Editar Cancha</DSAText>
              <button className={styles["modalClose"]} onClick={() => setEditModal(false)}>✕</button>
            </div>

            <DSAInput
              label="Nombre"
              placeholder="Ej: Cancha A"
              value={editForm.nombre}
              onChange={(v) => setEditForm({ ...editForm, nombre: v })}
            />
            <DSAInput
              label="Tipo"
              placeholder="Ej: Fútbol 5, Voley..."
              value={editForm.type}
              onChange={(v) => setEditForm({ ...editForm, type: v })}
            />
            <div className={styles["inputGroup"]}>
              <label className={styles["inputLabel"]}>Estado</label>
              <select
                className={`${styles["filterSelect"]} ${styles["fullWidth"]}`}
                value={editForm.state}
                onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
              >
                {ESTADOS_UI.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className={styles["modalActions"]}>
              <button className={styles["cancelBtn"]} onClick={() => setEditModal(false)}>
                Cancelar
              </button>
              <DSAButton onClick={handleEdit} disabled={editSaving}>
                {editSaving ? "Guardando..." : "Guardar"}
              </DSAButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courts;
