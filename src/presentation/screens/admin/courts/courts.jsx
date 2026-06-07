import { useState, useEffect, useCallback, useRef } from "react";
import { DSAButton, DSACourtsTable, DSAText, DSAInput } from "../../../components";
import {
  listarCanchasRequest,
  crearCanchaRequest,
  actualizarCanchaRequest,
  eliminarCanchaRequest,
  subirImagenCanchaRequest,
  stateToLabel,
  labelToState,
} from "../../../../infrastructure/api/cancha.api";
import styles from "./courts.module.css";

const toRow = (c) => ({
  id:     c.id,
  nombre: c.nombre,
  type:   c.tipo,
  state:  stateToLabel(c),
  _raw:   c,
});

const ESTADOS_UI    = ["Disponible", "Ocupada", "Mantenimiento"];
const ILUMINACION   = ["Iluminación LED", "Reflectores halógenos", "Sin iluminación nocturna"];
const TECHADA       = ["Techada", "Al aire libre"];
const VESTUARIOS    = ["Vestuarios incluidos", "Baños compartidos", "Sin vestuarios"];

const emptyForm = {
  nombre: "", type: "", state: "Disponible", precio: "",
  descripcion: "", location: "", capacidad: "",
  lighting: "", covered: "", size: "", bathrooms: "",
};

// ─── ImageUploader ────────────────────────────────────────────────────────────
const ImageUploader = ({ canchaId, currentImage, onUploaded }) => {
  const inputRef                = useRef(null);
  const [preview, setPreview]   = useState(currentImage ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    setUploading(true);
    try {
      const { data } = await subirImagenCanchaRequest(canchaId, file);
      const url = data?.imagenUrl ?? data?.data?.imagenUrl ?? null;
      if (url) { setPreview(url); onUploaded?.(url); }
    } catch (err) {
      console.error("[ImageUploader] error:", err);
      setError("No se pudo subir la imagen.");
    } finally { setUploading(false); }
  };

  return (
    <div style={{ marginTop: 12 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Imagen de la cancha</label>
      {preview && (
        <div style={{ margin: "8px 0", borderRadius: 8, overflow: "hidden", maxHeight: 160 }}>
          <img src={preview} alt="preview" style={{ width: "100%", objectFit: "cover", maxHeight: 160 }} />
        </div>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
        style={{
          border: "2px dashed #d1d5db", borderRadius: 8, padding: "16px",
          textAlign: "center", cursor: uploading ? "not-allowed" : "pointer",
          background: "#f9fafb", fontSize: 13, color: "#6b7280", marginTop: 6,
        }}
      >
        {uploading ? "Subiendo imagen..." : "Haz clic o arrastra una imagen aquí"}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])} />
      {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
};

// ─── Sección de campos con título ─────────────────────────────────────────────
const FormSection = ({ title, children }) => (
  <div style={{ marginBottom: 8 }}>
    <p style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", textTransform: "uppercase",
      letterSpacing: "0.05em", margin: "16px 0 8px" }}>{title}</p>
    {children}
  </div>
);

// ─── Select reutilizable ──────────────────────────────────────────────────────
const FormSelect = ({ label, value, onChange, options, placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
    <label style={{ fontSize: 14, color: "#111827", fontWeight: 700 }}>{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%", padding: "12px 16px", border: "1px solid #e5e7eb",
        borderRadius: 12, fontSize: 14, color: value ? "#111827" : "#9ca3af",
        background: "#fff", outline: "none", cursor: "pointer",
      }}
    >
      <option value="">{placeholder ?? "Seleccionar..."}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

// ─── Textarea reutilizable ────────────────────────────────────────────────────
const FormTextarea = ({ label, value, onChange, placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
    <label style={{ fontSize: 14, color: "#111827", fontWeight: 700 }}>{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      style={{
        width: "100%", padding: "12px 16px", border: "1px solid #e5e7eb",
        borderRadius: 12, fontSize: 14, color: "#111827", background: "#fff",
        outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box",
      }}
    />
  </div>
);

// ─── Campos del formulario (crear y editar comparten esto) ────────────────────
const CanchaFormFields = ({ form, setForm }) => (
  <>
    <FormSection title="Información básica">
      <DSAInput label="Nombre" placeholder="Ej: Cancha A" value={form.nombre}
        onChange={(v) => setForm({ ...form, nombre: v })} />
      <DSAInput label="Tipo" placeholder="Ej: Fútbol 5, Voley..." value={form.type}
        onChange={(v) => setForm({ ...form, type: v })} />
      <DSAInput label="Precio por hora (S/)" placeholder="Ej: 50" value={form.precio}
        onChange={(v) => setForm({ ...form, precio: v })} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
        <label style={{ fontSize: 14, color: "#111827", fontWeight: 700 }}>Estado</label>
        <select
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          style={{
            width: "100%", padding: "12px 16px", border: "1px solid #e5e7eb",
            borderRadius: 12, fontSize: 14, color: "#111827", background: "#fff",
            outline: "none", cursor: "pointer",
          }}
        >
          {ESTADOS_UI.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
    </FormSection>

    <FormSection title="Descripción y ubicación">
      <FormTextarea label="Descripción" value={form.descripcion}
        placeholder="Describe la cancha, características especiales, reglas, etc."
        onChange={(v) => setForm({ ...form, descripcion: v })} />
      <DSAInput label="Ubicación" placeholder="Ej: Av. La Marina 2345, San Miguel, Lima"
        value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
    </FormSection>

    <FormSection title="Características">
      <DSAInput label="Capacidad (jugadores)" placeholder="Ej: 10" value={form.capacidad}
        onChange={(v) => setForm({ ...form, capacidad: v })} />
      <DSAInput label="Tamaño" placeholder="Ej: 30 × 20 m" value={form.size}
        onChange={(v) => setForm({ ...form, size: v })} />
      <FormSelect label="Iluminación" value={form.lighting} options={ILUMINACION}
        placeholder="Seleccionar iluminación..." onChange={(v) => setForm({ ...form, lighting: v })} />
      <FormSelect label="Techada" value={form.covered} options={TECHADA}
        placeholder="Seleccionar..." onChange={(v) => setForm({ ...form, covered: v })} />
      <FormSelect label="Vestuarios" value={form.bathrooms} options={VESTUARIOS}
        placeholder="Seleccionar vestuarios..." onChange={(v) => setForm({ ...form, bathrooms: v })} />
    </FormSection>
  </>
);

// ─── Componente principal ─────────────────────────────────────────────────────
const Courts = () => {
  const [courts,       setCourts]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [tipoFiltro,   setTipoFiltro]   = useState("Todos los tipos");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos los estados");

  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState(emptyForm);
  const [newCourtId, setNewCourtId] = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState(null);

  const [editModal,  setEditModal]  = useState(false);
  const [editForm,   setEditForm]   = useState(emptyForm);
  const [editId,     setEditId]     = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await listarCanchasRequest();
      const lista = Array.isArray(data) ? data : (data?.data ?? []);
      setCourts(lista.map(toRow));
    } catch (err) {
      setError("No se pudieron cargar las canchas.");
      console.error("[Courts] error al cargar:", err);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const tipos   = ["Todos los tipos",   ...new Set(courts.map((c) => c.type))];
  const estados = ["Todos los estados", ...new Set(courts.map((c) => c.state))];
  const filtered = courts.filter((c) => {
    const okTipo   = tipoFiltro   === "Todos los tipos"   || c.type  === tipoFiltro;
    const okEstado = estadoFiltro === "Todos los estados" || c.state === estadoFiltro;
    return okTipo && okEstado;
  });

  const handleCreate = async () => {
    if (!form.nombre.trim() || !form.type.trim()) {
      setFormError("Nombre y tipo son obligatorios."); return;
    }
    setSaving(true); setFormError(null);
    try {
      const stateFields = labelToState(form.state);
      const { data } = await crearCanchaRequest({
        nombre:        form.nombre.trim(),
        tipo:          form.type.trim(),
        descripcion:   form.descripcion.trim(),
        precioPorHora: parseFloat(form.precio) || 0,
        capacidad:     parseInt(form.capacidad) || 1,
        location:      form.location.trim(),
        lighting:      form.lighting,
        covered:       form.covered,
        size:          form.size.trim(),
        bathrooms:     form.bathrooms,
        ...stateFields,
      });
      const id = data?.id ?? data?.data?.id ?? null;
      setNewCourtId(id);
      await cargar();
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.response?.data ?? "Error al crear la cancha.";
      setFormError(typeof msg === "string" ? msg : "Error al crear la cancha.");
    } finally { setSaving(false); }
  };

  const handleImageUploaded = () => {
    setNewCourtId(null); setForm(emptyForm); setShowModal(false); cargar();
  };

  const handleSkipImage = () => {
    setNewCourtId(null); setForm(emptyForm); setShowModal(false);
  };

  const handleOpenEdit = (court) => {
    const r = court._raw;
    setEditId(court.id);
    setEditForm({
      nombre:      r.nombre      ?? "",
      type:        r.tipo        ?? "",
      state:       court.state,
      precio:      r.precioPorHora ?? "",
      descripcion: r.descripcion  ?? "",
      location:    r.location     ?? "",
      capacidad:   r.capacidad    ?? "",
      lighting:    r.lighting     ?? "",
      covered:     r.covered      ?? "",
      size:        r.size         ?? "",
      bathrooms:   r.bathrooms    ?? "",
    });
    setEditModal(true);
  };

 const handleEdit = async () => {
  if (!editForm?.nombre?.trim() || !editForm?.type?.trim()) return;
  setEditSaving(true);
  try {
    const stateFields = labelToState(editForm.state ?? "Disponible");
    const original = courts.find((c) => c.id === editId)?._raw ?? {};
    await actualizarCanchaRequest(editId, {
      ...original,
      nombre:        (editForm.nombre      ?? "").trim(),
      tipo:          (editForm.type        ?? "").trim(),
      descripcion:   (editForm.descripcion ?? "").trim(),
      precioPorHora: parseFloat(editForm.precio)    || 0,
      capacidad:     parseInt(editForm.capacidad)   || 1,
      location:      (editForm.location    ?? "").trim(),
      lighting:      editForm.lighting     ?? "",
      covered:       editForm.covered      ?? "",
      size:          (editForm.size        ?? "").trim(),
      bathrooms:     editForm.bathrooms    ?? "",
      ...stateFields,
    });
    setEditModal(false);
    await cargar();
  } catch (err) {
    console.error("[Courts] error al editar:", err);
  } finally { setEditSaving(false); }
};

  const handleDelete = async (court) => {
    const id = court?.id ?? court;
    if (!window.confirm("¿Eliminar esta cancha? Esta acción no se puede deshacer.")) return;
    try {
      await eliminarCanchaRequest(id);
      await cargar();
    } catch (err) {
      console.error("[Courts] error al eliminar:", err);
      alert("No se pudo eliminar la cancha.");
    }
  };

  // ── Estilos del modal con scroll ──────────────────────────────────────────
  const modalBoxStyle = {
    background: "#ffffff", borderRadius: 16, padding: "28px 24px",
    width: "100%", maxWidth: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    boxSizing: "border-box", maxHeight: "90vh", overflowY: "auto",
  };

  return (
    <div>
      {/* Header */}
      <div className={styles["containerHeaderCourts"]}>
        <div>
          <DSAText variant="title">Canchas</DSAText>
          <DSAText variant="text" color="#6B7280">Gestiona las canchas deportivas</DSAText>
        </div>
        <div className={styles["containerButtonCourts"]}>
          <DSAButton onClick={() => { setForm(emptyForm); setFormError(null); setNewCourtId(null); setShowModal(true); }}>
            + Crear Cancha
          </DSAButton>
        </div>
      </div>

      {/* Filtros */}
      <div className={styles["containerFiltersCourts"]}>
        <select className={styles["filterSelect"]} value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
          {tipos.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select className={styles["filterSelect"]} value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
          {estados.map((e) => <option key={e}>{e}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className={styles["containerTableCourts"]}>
        {loading ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#6B7280" }}>Cargando canchas...</div>
        ) : error ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#ef4444" }}>
            {error}<br />
            <button onClick={cargar} style={{ marginTop: 12, cursor: "pointer", color: "#22c55e", background: "none", border: "none" }}>
              Reintentar
            </button>
          </div>
        ) : (
          <DSACourtsTable data={filtered} onEdit={handleOpenEdit} onDelete={handleDelete} />
        )}
      </div>

      {/* ── Modal Crear ── */}
      {showModal && (
        <div className={styles["modalOverlay"]} onClick={() => !newCourtId && setShowModal(false)}>
          <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modalHeader"]}>
              <DSAText variant="subtitle">{newCourtId ? "Agregar imagen" : "Crear Cancha"}</DSAText>
              {!newCourtId && (
                <button className={styles["modalClose"]} onClick={() => setShowModal(false)}>✕</button>
              )}
            </div>

            {!newCourtId && (
              <>
                <CanchaFormFields form={form} setForm={setForm} />
                {formError && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 8 }}>{formError}</p>}
                <div className={styles["modalActions"]}>
                  <button className={styles["cancelBtn"]} onClick={() => setShowModal(false)}>Cancelar</button>
                  <DSAButton onClick={handleCreate} disabled={saving}>
                    {saving ? "Creando..." : "Siguiente →"}
                  </DSAButton>
                </div>
              </>
            )}

            {newCourtId && (
              <>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
                  La cancha fue creada. Ahora puedes agregar una imagen.
                </p>
                <ImageUploader canchaId={newCourtId} onUploaded={handleImageUploaded} />
                <div className={styles["modalActions"]} style={{ marginTop: 16 }}>
                  <button className={styles["cancelBtn"]} onClick={handleSkipImage}>Omitir imagen</button>
                  <DSAButton onClick={handleImageUploaded}>Finalizar</DSAButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Modal Editar ── */}
      {editModal && (
        <div className={styles["modalOverlay"]} onClick={() => setEditModal(false)}>
          <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modalHeader"]}>
              <DSAText variant="subtitle">Editar Cancha</DSAText>
              <button className={styles["modalClose"]} onClick={() => setEditModal(false)}>✕</button>
            </div>

            <CanchaFormFields form={editForm} setForm={setEditForm} />

            <ImageUploader
              canchaId={editId}
              currentImage={courts.find((c) => c.id === editId)?._raw?.imagenUrl ?? null}
              onUploaded={() => cargar()}
            />

            <div className={styles["modalActions"]}>
              <button className={styles["cancelBtn"]} onClick={() => setEditModal(false)}>Cancelar</button>
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