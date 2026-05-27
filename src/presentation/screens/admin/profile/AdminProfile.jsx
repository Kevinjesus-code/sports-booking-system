import { useState, useEffect } from "react";
import {
  getPerfilRequest,
  updatePerfilRequest,
  changeEmailRequest,
  changePasswordRequest,
} from "../../../../infrastructure/api/user.api";
import styles from "./AdminProfile.module.css";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const UserIcon    = () => <Icon d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const ShieldIcon  = () => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const MailIcon    = () => <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />;
const EditIcon    = () => <Icon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const CheckIcon   = () => <Icon d="M20 6L9 17l-5-5" />;
const XIcon       = () => <Icon d="M18 6L6 18M6 6l12 12" />;
const EyeIcon     = () => <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;
const EyeOffIcon  = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (val) => val || "—";

const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "numeric", month: "long", year: "numeric",
  });
};

const initials = (nombre, apellido) =>
  ((nombre?.[0] || "") + (apellido?.[0] || "")).toUpperCase() || "A";

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type }) => (
  <div className={`${styles.apToast} ${styles[type]}`}>
    {type === "success" ? <CheckIcon /> : <XIcon />}
    {msg}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminProfile = ({ onBack }) => {
  const [tab, setTab]         = useState("info");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({});
  const [errors,  setErrors]  = useState({});
  const [toast,   setToast]   = useState(null);

  // Email change
  const [emailForm, setEmailForm] = useState({ emailActual: "", emailNuevo: "", password: "" });
  // Password change
  const [passForm, setPassForm]   = useState({ passwordActual: "", passwordNuevo: "", passwordConfirm: "" });
  // Show/hide password toggles
  const [showPass, setShowPass]   = useState({ actual: false, nuevo: false, confirm: false });
  const togglePass = (key) => setShowPass(s => ({ ...s, [key]: !s[key] }));

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    getPerfilRequest()
      .then((res) => {
        // Algunos backends envuelven en res.data, otros en res.data.data
        const raw = res?.data?.data ?? res?.data ?? res ?? {};
        console.log("[AdminProfile] respuesta API:", raw); // ← quitar en producción

        // Normalizar campos con posibles alias
        const normalizado = {
          ...raw,
          nombre:        raw.nombre        || raw.nombres    || raw.name       || "",
          apellido:      raw.apellido      || raw.apellidos  || raw.lastName   || "",
          dni:           raw.dni           || raw.documento  || raw.nroDoc     || "",
          telefono:      raw.telefono      || raw.phone      || raw.celular    || "",
          email:         raw.email         || raw.correo     || "",
          rol:           raw.rol           || raw.role       || raw.perfil     || "ADMIN",
          activo:        raw.activo        ?? raw.active     ?? (raw.estado === "activo") ?? false,
          id:            raw.id            || raw._id        || raw.userId     || "",
          fechaCreacion: raw.fechaCreacion || raw.createdAt  || raw.fecha_creacion || null,
        };

        setProfile(normalizado);
        setForm({
          nombre:   normalizado.nombre,
          apellido: normalizado.apellido,
          dni:      normalizado.dni,
          telefono: normalizado.telefono,
        });
      })
      .catch((err) => {
        console.error("[AdminProfile] error al cargar perfil:", err);
        showToast("No se pudo cargar el perfil", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Toast ────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Save info ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const errs = {};
    if (!form.nombre.trim())   errs.nombre   = "Requerido";
    if (!form.apellido.trim()) errs.apellido = "Requerido";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const { data } = await updatePerfilRequest(form);
      setProfile(data);
      setEditing(false);
      setErrors({});
      showToast("Perfil actualizado correctamente");
    } catch {
      showToast("Error al guardar los cambios", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Change email ─────────────────────────────────────────────────────────
  const handleEmailChange = async () => {
    if (!emailForm.emailNuevo || !emailForm.password) {
      showToast("Completa todos los campos", "error"); return;
    }
    setSaving(true);
    try {
      await changeEmailRequest(emailForm);
      showToast("Correo actualizado. Revisa tu bandeja.");
      setEmailForm({ emailActual: "", emailNuevo: "", password: "" });
    } catch {
      showToast("Error al cambiar el correo", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Change password ───────────────────────────────────────────────────────
  const handlePasswordChange = async () => {
    if (passForm.passwordNuevo !== passForm.passwordConfirm) {
      showToast("Las contraseñas no coinciden", "error"); return;
    }
    if (passForm.passwordNuevo.length < 6) {
      showToast("Mínimo 6 caracteres", "error"); return;
    }
    setSaving(true);
    try {
      await changePasswordRequest(passForm);
      showToast("Contraseña actualizada correctamente");
      setPassForm({ passwordActual: "", passwordNuevo: "", passwordConfirm: "" });
    } catch {
      showToast("Error al cambiar la contraseña", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Render panels ─────────────────────────────────────────────────────────
  const renderInfo = () => (
    <>
      <div className={styles.apPanelHeader}>
        <div>
          <div className={styles.apPanelTitle}>Información personal</div>
          <div className={styles.apPanelSub}>Datos de tu cuenta de administrador</div>
        </div>
        {!editing && (
          <button className={styles.apBtnEdit} onClick={() => setEditing(true)}>
            <EditIcon /> Editar
          </button>
        )}
      </div>

      <div className={styles.apPanelBody}>
        <div className={styles.apGrid}>
          {editing ? (
            <>
              {[
                { key: "nombre",   label: "Nombre" },
                { key: "apellido", label: "Apellido" },
                { key: "dni",      label: "DNI" },
                { key: "telefono", label: "Teléfono" },
              ].map(({ key, label }) => (
                <div className={styles.apField} key={key}>
                  <label>{label}</label>
                  <input
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className={errors[key] ? styles.error : ""}
                  />
                  {errors[key] && <p className={styles.apFieldErr}>{errors[key]}</p>}
                </div>
              ))}
            </>
          ) : (
            <>
              <div className={styles.apField}>
                <label>Nombre</label>
                <div className={styles.apFieldValue}>{fmt(profile?.nombre)}</div>
              </div>
              <div className={styles.apField}>
                <label>Apellido</label>
                <div className={styles.apFieldValue}>{fmt(profile?.apellido)}</div>
              </div>
              <div className={styles.apField}>
                <label>DNI</label>
                <div className={styles.apFieldValue}>{fmt(profile?.dni)}</div>
              </div>
              <div className={styles.apField}>
                <label>Teléfono</label>
                <div className={styles.apFieldValue}>{fmt(profile?.telefono)}</div>
              </div>
            </>
          )}

          <div className={styles.apSectionDivider} />
          <div className={styles.apSectionLabel}>Cuenta</div>

          <div className={styles.apField}>
            <label>Correo electrónico</label>
            <div className={styles.apFieldValue}>{fmt(profile?.email)}</div>
          </div>
          <div className={styles.apField}>
            <label>Rol</label>
            <div className={styles.apFieldValue}>{fmt(profile?.rol)}</div>
          </div>
          <div className={styles.apField}>
            <label>Estado</label>
            <div className={styles.apFieldValue}>{profile?.activo ? "Activo" : "Inactivo"}</div>
          </div>
          <div className={styles.apField}>
            <label>Miembro desde</label>
            <div className={styles.apFieldValue}>{fmtDate(profile?.fechaCreacion)}</div>
          </div>
        </div>

        {editing && (
          <div className={styles.apActions}>
            <button className={styles.apBtnPrimary} onClick={handleSave} disabled={saving}>
              <CheckIcon /> {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <button className={styles.apBtnSecondary} onClick={() => { setEditing(false); setErrors({}); }}>
              <XIcon /> Cancelar
            </button>
          </div>
        )}
      </div>
    </>
  );

  const renderSecurity = () => (
    <>
      <div className={styles.apPanelHeader}>
        <div>
          <div className={styles.apPanelTitle}>Seguridad</div>
          <div className={styles.apPanelSub}>Gestiona tu correo y contraseña</div>
        </div>
      </div>

      <div className={styles.apPanelBody}>
        {/* Email */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: "#555" }}>
            Cambiar correo electrónico
          </div>
          <div className={styles.apGrid}>
            <div className={styles.apField}>
              <label>Correo actual</label>
              <input
                type="email" placeholder={profile?.email || ""}
                value={emailForm.emailActual}
                onChange={e => setEmailForm(f => ({ ...f, emailActual: e.target.value }))}
              />
            </div>
            <div className={styles.apField}>
              <label>Nuevo correo</label>
              <input
                type="email" placeholder="nuevo@email.com"
                value={emailForm.emailNuevo}
                onChange={e => setEmailForm(f => ({ ...f, emailNuevo: e.target.value }))}
              />
            </div>
            <div className={styles.apField}>
              <label>Contraseña actual</label>
              <input
                type="password" placeholder="Tu contraseña"
                value={emailForm.password}
                onChange={e => setEmailForm(f => ({ ...f, password: e.target.value }))}
              />
            </div>
          </div>
          <div className={styles.apActions}>
            <button className={styles.apBtnPrimary} onClick={handleEmailChange} disabled={saving}>
              <MailIcon /> {saving ? "Guardando..." : "Actualizar correo"}
            </button>
          </div>
        </div>

        <div style={{ height: 1, background: "#f0f0f0", margin: "8px 0 24px" }} />

        {/* Password */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: "#555" }}>
            Cambiar contraseña
          </div>
          <div className={styles.apGrid}>
            <div className={styles.apField}>
              <label>Contraseña actual</label>
              <div className={styles.apFieldPassword}>
                <input
                  type={showPass.actual ? "text" : "password"}
                  placeholder="••••••••"
                  value={passForm.passwordActual}
                  onChange={e => setPassForm(f => ({ ...f, passwordActual: e.target.value }))}
                />
                <button type="button" className={styles.apEyeBtn} onClick={() => togglePass("actual")}>
                  {showPass.actual ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <div className={styles.apField}>
              <label>Nueva contraseña</label>
              <div className={styles.apFieldPassword}>
                <input
                  type={showPass.nuevo ? "text" : "password"}
                  placeholder="Mín. 6 caracteres"
                  value={passForm.passwordNuevo}
                  onChange={e => setPassForm(f => ({ ...f, passwordNuevo: e.target.value }))}
                />
                <button type="button" className={styles.apEyeBtn} onClick={() => togglePass("nuevo")}>
                  {showPass.nuevo ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <div className={styles.apField}>
              <label>Confirmar contraseña</label>
              <div className={styles.apFieldPassword}>
                <input
                  type={showPass.confirm ? "text" : "password"}
                  placeholder="Repetir contraseña"
                  value={passForm.passwordConfirm}
                  onChange={e => setPassForm(f => ({ ...f, passwordConfirm: e.target.value }))}
                />
                <button type="button" className={styles.apEyeBtn} onClick={() => togglePass("confirm")}>
                  {showPass.confirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          </div>
          <div className={styles.apActions}>
            <button className={styles.apBtnPrimary} onClick={handlePasswordChange} disabled={saving}>
              <ShieldIcon /> {saving ? "Guardando..." : "Cambiar contraseña"}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // ── Root render ───────────────────────────────────────────────────────────
  return (
    <div className={styles.apRoot}>
      <div className={styles.apHeader}>
        {onBack && (
          <button className={styles.apBack} onClick={onBack}>
            <Icon d="M15 18l-6-6 6-6" size={14} /> Volver
          </button>
        )}
        <h1 className={styles.apTitle}>Mi <span>perfil</span></h1>
      </div>

      {loading ? (
        <div className={styles.apLoading}>
          <div className={styles.apSpinner} /> Cargando perfil...
        </div>
      ) : (
        <div className={styles.apLayout}>
          {/* Sidebar */}
          <div className={styles.apSidebar}>
            <div className={styles.apAvatarCard}>
              <div className={styles.apAvatar}>
                {initials(profile?.nombre, profile?.apellido)}
              </div>
              <div className={styles.apAvatarName}>
                {profile?.nombre} {profile?.apellido}
              </div>
              <div className={styles.apAvatarRole}>{profile?.rol || "ADMIN"}</div>
              <div className={styles.apStatus}>
                <div className={styles.apStatusDot} />
                {profile?.activo ? "Cuenta activa" : "Cuenta inactiva"}
              </div>
            </div>

            <nav className={styles.apNav}>
              <button
                className={`${styles.apNavItem} ${tab === "info" ? styles.active : ""}`}
                onClick={() => { setTab("info"); setEditing(false); }}
              >
                <UserIcon /> Mi cuenta
              </button>
              <div className={styles.apNavDivider} />
              <button
                className={`${styles.apNavItem} ${tab === "security" ? styles.active : ""}`}
                onClick={() => setTab("security")}
              >
                <ShieldIcon /> Seguridad
              </button>
            </nav>

            <div className={styles.apMeta}>
              <p>ID: <strong>#{profile?.id}</strong></p>
              <p>Registro: <strong>{fmtDate(profile?.fechaCreacion)}</strong></p>
              <p>Email: <strong>{profile?.email}</strong></p>
            </div>
          </div>

          {/* Main panel */}
          <div className={styles.apMain}>
            {tab === "info" ? renderInfo() : renderSecurity()}
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
};

export default AdminProfile;