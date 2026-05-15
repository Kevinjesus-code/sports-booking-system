import { useState, useEffect, useRef } from "react";
import styles from "./court-form-modal.module.css";
import Switch from "../switch";

/* ── Icons ── */
const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
  </svg>
);

const IconUpload = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const TIPO_OPTIONS = [
  { value: "Fútbol 5", label: "Fútbol 5" },
  { value: "Fútbol 7", label: "Fútbol 7" },
  { value: "Fútbol 11", label: "Fútbol 11" },
  { value: "Voley", label: "Voley" },
  { value: "Basketball", label: "Basketball" },
];

const ESTADO_OPTIONS = [
  { value: "Disponible", label: "Disponible" },
  { value: "Mantenimiento", label: "Mantenimiento" },
];

const CourtFormModal = ({ isOpen, onClose, onSave, court = null }) => {
  const isEdit = !!court;
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    nombre: "",
    type: "",
    state: "Disponible",
    capacidad: "",
    precioPorHora: "",
    location: "",
    lighting: "",
    covered: false,
    size: "",
    bathrooms: false,
    rules: [],
    imageFile: null,
    imagePreview: "",
  });

  const [newRule, setNewRule] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Populate form on edit
  useEffect(() => {
    if (isOpen && court) {
      setForm({
        nombre: court.nombre || "",
        type: court.type || "",
        state: court.state || "Disponible",
        capacidad: String(court.capacidad || ""),
        precioPorHora: String(court.precioPorHora || ""),
        location: court.location || "",
        lighting: court.lighting || "",
        covered: court.covered === "Sí" || court.covered === true,
        size: court.size || "",
        bathrooms: court.bathrooms === "Sí" || court.bathrooms === true,
        rules: Array.isArray(court.rules) ? [...court.rules] : [],
        imageFile: null,
        imagePreview: court.image || "",
      });
      setFormErrors({});
      setNewRule("");
    } else if (isOpen && !court) {
      setForm({
        nombre: "",
        type: "",
        state: "Disponible",
        capacidad: "",
        precioPorHora: "",
        location: "",
        lighting: "",
        covered: false,
        size: "",
        bathrooms: false,
        rules: [],
        imageFile: null,
        imagePreview: "",
      });
      setFormErrors({});
      setNewRule("");
    }
  }, [isOpen, court]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const update = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (formErrors[field]) setFormErrors((p) => ({ ...p, [field]: "" }));
  };

  // ── Image handling ──
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((p) => ({ ...p, imageFile: file, imagePreview: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((p) => ({ ...p, imageFile: file, imagePreview: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((p) => ({ ...p, imageFile: null, imagePreview: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Rules ──
  const addRule = () => {
    const r = newRule.trim();
    if (!r) return;
    setForm((p) => ({ ...p, rules: [...p.rules, r] }));
    setNewRule("");
  };

  const removeRule = (index) => {
    setForm((p) => ({ ...p, rules: p.rules.filter((_, i) => i !== index) }));
  };

  // ── Validate ──
  const validate = () => {
    const errors = {};
    if (!form.nombre.trim()) errors.nombre = "Nombre es requerido";
    if (!form.type) errors.type = "Tipo es requerido";
    if (!form.precioPorHora || Number(form.precioPorHora) <= 0) errors.precioPorHora = "Precio válido es requerido";
    return errors;
  };

  // ── Submit ──
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      onSave?.({
        id: court?.id || Date.now(),
        nombre: form.nombre,
        type: form.type,
        state: form.state,
        capacidad: Number(form.capacidad) || 0,
        precioPorHora: Number(form.precioPorHora),
        image: court?.image || "",
        location: form.location,
        lighting: form.lighting,
        covered: form.covered ? "Sí" : "No",
        size: form.size,
        bathrooms: form.bathrooms ? "Sí" : "No",
        rules: form.rules,
        imageFile: form.imageFile,
      });
      setSaving(false);
    }, 500);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconBox}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <line x1="12" y1="7" x2="12" y2="21" />
                <circle cx="12" cy="14" r="2" />
              </svg>
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.title}>{isEdit ? "Editar Cancha" : "Crear Cancha"}</h2>
              <p className={styles.subtitle}>
                {isEdit ? `Editando: ${court.nombre}` : "Completa los datos de la nueva cancha deportiva"}
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <IconClose />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className={styles.body}>

          {/* ─── Sección: Información General ─── */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span className={styles.sectionTitle}>Información General</span>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nombre de la cancha *</label>
                <input
                  className={`${styles.input} ${formErrors.nombre ? styles.inputError : ""}`}
                  type="text"
                  placeholder="Ej: Cancha F"
                  value={form.nombre}
                  onChange={(e) => update("nombre", e.target.value)}
                />
                {formErrors.nombre && <span className={styles.fieldError}>{formErrors.nombre}</span>}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tipo de cancha *</label>
                <select
                  className={`${styles.select} ${formErrors.type ? styles.inputError : ""}`}
                  value={form.type}
                  onChange={(e) => update("type", e.target.value)}
                >
                  <option value="">Selecciona un tipo</option>
                  {TIPO_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {formErrors.type && <span className={styles.fieldError}>{formErrors.type}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Capacidad (jugadores)</label>
                <input
                  className={styles.input}
                  type="number"
                  placeholder="Ej: 10"
                  value={form.capacidad}
                  onChange={(e) => update("capacidad", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Precio por hora (S/) *</label>
                <input
                  className={`${styles.input} ${formErrors.precioPorHora ? styles.inputError : ""}`}
                  type="number"
                  placeholder="Ej: 80"
                  value={form.precioPorHora}
                  onChange={(e) => update("precioPorHora", e.target.value)}
                />
                {formErrors.precioPorHora && <span className={styles.fieldError}>{formErrors.precioPorHora}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ubicación</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Ej: Sede Norte"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Estado</label>
                <select
                  className={styles.select}
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                >
                  {ESTADO_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ─── Sección: Características ─── */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <span className={styles.sectionTitle}>Características</span>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Iluminación</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Ej: LED"
                  value={form.lighting}
                  onChange={(e) => update("lighting", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tamaño</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Ej: 15x25m"
                  value={form.size}
                  onChange={(e) => update("size", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.switchRow}>
              <div className={styles.switchItem}>
                <div className={styles.switchInfo}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                  <div>
                    <span className={styles.switchLabel}>Techado</span>
                    <span className={styles.switchDesc}>¿La cancha tiene techo?</span>
                  </div>
                </div>
                <Switch checked={form.covered} onChange={(v) => update("covered", v)} />
              </div>
              <div className={styles.switchItem}>
                <div className={styles.switchInfo}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <path d="M4 12h16" />
                    <path d="M4 12V6a2 2 0 0 1 2-2h2" />
                    <path d="M4 12v4a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4" />
                  </svg>
                  <div>
                    <span className={styles.switchLabel}>Baños / Duchas</span>
                    <span className={styles.switchDesc}>¿Disponibles para uso?</span>
                  </div>
                </div>
                <Switch checked={form.bathrooms} onChange={(v) => update("bathrooms", v)} />
              </div>
            </div>
          </div>

          {/* ─── Sección: Imagen ─── */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className={styles.sectionTitle}>Imagen</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className={styles.fileInput}
              onChange={handleImageSelect}
            />

            {form.imagePreview ? (
              <div className={styles.imagePreviewContainer}>
                <img src={form.imagePreview} alt="Preview" className={styles.imagePreview} />
                <div className={styles.imagePreviewOverlay}>
                  <button type="button" className={styles.imageChangeBtn} onClick={() => fileInputRef.current?.click()}>
                    Cambiar imagen
                  </button>
                  <button type="button" className={styles.imageRemoveBtn} onClick={removeImage}>
                    <IconTrash />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={styles.dropZone}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleImageDrop}
              >
                <IconUpload />
                <span className={styles.dropZoneTitle}>Arrastra una imagen aquí</span>
                <span className={styles.dropZoneText}>o haz clic para seleccionar</span>
                <span className={styles.dropZoneHint}>PNG, JPG, WEBP (máx. 5MB)</span>
              </div>
            )}
          </div>

          {/* ─── Sección: Reglas y condiciones ─── */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span className={styles.sectionTitle}>Reglas y condiciones</span>
            </div>

            {/* Existing rules */}
            {form.rules.length > 0 && (
              <div className={styles.rulesList}>
                {form.rules.map((rule, i) => (
                  <div key={i} className={styles.ruleItem}>
                    <span className={styles.ruleDot} />
                    <span className={styles.ruleText}>{rule}</span>
                    <button
                      type="button"
                      className={styles.ruleRemove}
                      onClick={() => removeRule(i)}
                      title="Eliminar regla"
                    >
                      <IconTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new rule */}
            <div className={styles.addRuleRow}>
              <input
                className={styles.input}
                type="text"
                placeholder="Ej: Uso obligatorio de chimpunes"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRule(); } }}
              />
              <button type="button" className={styles.addRuleBtn} onClick={addRule} disabled={!newRule.trim()}>
                <IconPlus />
                Agregar
              </button>
            </div>
          </div>

          {/* Global Error */}
          {Object.keys(formErrors).length > 0 && (
            <div className={styles.globalError}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Completa todos los campos requeridos
            </div>
          )}

          {/* Footer */}
          <div className={styles.footer}>
            <button type="button" className={styles.btnOutline} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSolid} disabled={saving}>
              {saving ? (
                <>
                  <span className={styles.spinner} />
                  {isEdit ? "Guardando..." : "Creando..."}
                </>
              ) : (
                isEdit ? "Guardar Cambios" : "Crear Cancha"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourtFormModal;
