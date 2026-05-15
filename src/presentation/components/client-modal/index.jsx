import { useState, useEffect } from "react";
import styles from "./client-modal.module.css";

/* ── Helpers ── */
const validateAge = (dateStr) => {
  if (!dateStr) return "";
  const birth = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age < 18 ? "Debes ser mayor de 18 años" : "";
};

const INITIAL = {
  nombre: "",
  apellido: "",
  dni: "",
  email: "",
  telefono: "",
  fechaNacimiento: "",
};

const ClientModal = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState(INITIAL);
  const [ageError, setAgeError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL);
      setAgeError("");
      setFormErrors({});
    }
  }, [isOpen]);

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

  const handleDateChange = (val) => {
    update("fechaNacimiento", val);
    setAgeError(validateAge(val));
  };

  const validate = () => {
    const errors = {};
    if (!form.nombre.trim()) errors.nombre = "Nombre es requerido";
    if (!form.apellido.trim()) errors.apellido = "Apellido es requerido";
    if (!form.dni.trim() || form.dni.trim().length < 8) errors.dni = "DNI válido (8 dígitos) es requerido";
    if (!form.email.trim()) errors.email = "Email es requerido";
    if (!form.telefono.trim()) errors.telefono = "Teléfono es requerido";
    if (!form.fechaNacimiento) errors.fechaNacimiento = "Fecha de nacimiento es requerida";
    const ageMsg = validateAge(form.fechaNacimiento);
    if (ageMsg) errors.fechaNacimiento = ageMsg;
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSaving(true);
    try {
      // Import dynamically to avoid circular deps
      const { clienteApi } = await import("../../../infrastructure/api/cliente.api");
      const created = await clienteApi.create({
        nombre: form.nombre,
        apellido: form.apellido,
        dni: form.dni,
        email: form.email,
        telefono: form.telefono,
      });
      onCreated?.({
        id: created.id,
        nombre: `${created.nombre} ${created.apellido ?? ''}`.trim(),
        dni: created.dni,
        email: created.email,
        telefono: created.telefono,
        reservas: 0,
      });
      onClose?.();
    } catch (err) {
      const msg = err.response?.data?.error ?? err.message ?? "Error al registrar";
      setFormErrors({ global: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconBox}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.title}>Registrar Cliente</h2>
              <p className={styles.subtitle}>Completa los datos del nuevo cliente</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className={styles.body}>
          {/* Nombre + Apellido */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nombre</label>
              <div className={`${styles.inputWrapper} ${formErrors.nombre ? styles.inputError : ""}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input type="text" placeholder="Juan" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} />
              </div>
              {formErrors.nombre && <span className={styles.fieldError}>{formErrors.nombre}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Apellido</label>
              <div className={`${styles.inputWrapper} ${formErrors.apellido ? styles.inputError : ""}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input type="text" placeholder="Pérez" value={form.apellido} onChange={(e) => update("apellido", e.target.value)} />
              </div>
              {formErrors.apellido && <span className={styles.fieldError}>{formErrors.apellido}</span>}
            </div>
          </div>

          {/* DNI */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>DNI</label>
            <div className={`${styles.inputWrapper} ${formErrors.dni ? styles.inputError : ""}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input type="text" placeholder="Ingrese el DNI" value={form.dni} onChange={(e) => update("dni", e.target.value)} maxLength={8} />
            </div>
            {formErrors.dni && <span className={styles.fieldError}>{formErrors.dni}</span>}
          </div>

          {/* Correo */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Correo electrónico</label>
            <div className={`${styles.inputWrapper} ${formErrors.email ? styles.inputError : ""}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            {formErrors.email && <span className={styles.fieldError}>{formErrors.email}</span>}
          </div>

          {/* Teléfono */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Teléfono</label>
            <div className={`${styles.inputWrapper} ${formErrors.telefono ? styles.inputError : ""}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <input type="tel" placeholder="+51 900 000 000" value={form.telefono} onChange={(e) => update("telefono", e.target.value)} />
            </div>
            {formErrors.telefono && <span className={styles.fieldError}>{formErrors.telefono}</span>}
          </div>

          {/* Fecha de Nacimiento */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Fecha de nacimiento</label>
            <div className={`${styles.inputWrapper} ${formErrors.fechaNacimiento || ageError ? styles.inputError : ""}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <input
                type="date"
                value={form.fechaNacimiento}
                onChange={(e) => handleDateChange(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            {(ageError || formErrors.fechaNacimiento) && (
              <div className={styles.ageError}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {ageError || formErrors.fechaNacimiento}
              </div>
            )}
          </div>

          {/* Global error */}
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
            <button type="submit" className={styles.btnSolid} disabled={saving || !!ageError}>
              {saving ? (
                <>
                  <span className={styles.spinner} />
                  Registrando...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Registrar Cliente
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
