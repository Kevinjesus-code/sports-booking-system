import { useState, useEffect, useCallback } from "react";
import { DSAText, DSAUsersTable, DSAInput } from "../../../components";
import {
  listarUsuariosRequest,
  crearUsuarioRequest,
  actualizarUsuarioRequest,
  eliminarUsuarioRequest,
  activarUsuarioRequest,
  desactivarUsuarioRequest,
} from "../../../../infrastructure/api/user.api";
import styles from "./users.module.css";

const ROLES_OPCIONES = ["Cliente", "Administrador", "Recepcionista"];
const ROLES_FILTRO    = ["Todos los roles", ...ROLES_OPCIONES];

// Backend devuelve rol en mayúsculas: "CLIENTE", "ADMIN", "RECEPCIONISTA"
// UI muestra: "Cliente", "Administrador", "Recepcionista"
const rolToLabel = (rol) => {
  const map = { CLIENTE: "Cliente", ADMIN: "Administrador", ADMINISTRADOR: "Administrador", RECEPCIONISTA: "Recepcionista" };
  return map[rol?.toUpperCase()] ?? rol ?? "—";
};

const labelToRol = (label) => {
  const map = { 
    Cliente: "CLIENTE", 
    Administrador: "ADMIN",
    Recepcionista: "RECEPCIONISTA" 
  };
  return map[label] ?? label?.toUpperCase() ?? "CLIENTE";
};
// Mapea la respuesta del backend a la fila que espera DSAUsersTable
const toRow = (u) => ({
  id:       u.id,
  nombre:   `${u.nombre ?? ""} ${u.apellido ?? ""}`.trim(),
  dni:      u.dni      ?? "—",
  correo:   u.email    ?? "—",
  telefono: u.telefono ?? "—",
  rol:      rolToLabel(u.rol),
  activo:   u.activo,
  _raw:     u,
});

const emptyForm = {
  nombre: "", apellido: "", dni: "", correo: "", telefono: "",
  rol: "Cliente", password: "",
};

const Users = () => {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [busqueda,   setBusqueda]   = useState("");
  const [rolFiltro,  setRolFiltro]  = useState("Todos los roles");

  // Modal crear
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState(emptyForm);
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState(null);

  // Modal editar
  const [editModal,  setEditModal]  = useState(false);
  const [editForm,   setEditForm]   = useState({});
  const [editId,     setEditId]     = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  // ── Cargar ──────────────────────────────────────────────────────────────
  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await listarUsuariosRequest();
      const lista = Array.isArray(data) ? data : (data?.data ?? []);
      setUsers(lista.map(toRow));
    } catch (err) {
      setError("No se pudieron cargar los usuarios.");
      console.error("[Users] error al cargar:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  // ── Filtros ─────────────────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const okRol     = rolFiltro === "Todos los roles" || u.rol === rolFiltro;
    const okBusqueda = u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                       u.correo.toLowerCase().includes(busqueda.toLowerCase());
    return okRol && okBusqueda;
  });

  // ── Crear ────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.nombre.trim() || !form.correo.trim() || !form.password.trim()) {
      setFormError("Nombre, correo y contraseña son obligatorios.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await crearUsuarioRequest({
        nombre:   form.nombre.trim(),
        apellido: form.apellido.trim(),
        email:    form.correo.trim(),
        password: form.password.trim(),
        telefono: form.telefono.trim(),
        dni:      form.dni.trim(),
        rol:      labelToRol(form.rol),
      });
      setForm(emptyForm);
      setShowModal(false);
      await cargar();
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.response?.data ?? "Error al crear el usuario.";
      setFormError(typeof msg === "string" ? msg : "Error al crear el usuario.");
    } finally {
      setSaving(false);
    }
  };

  // ── Abrir editar ─────────────────────────────────────────────────────────
  const handleOpenEdit = (user) => {
    const raw = user._raw ?? user;
    setEditId(raw.id);
    setEditForm({
      nombre:   raw.nombre   ?? "",
      apellido: raw.apellido ?? "",
      email:    raw.email    ?? "",
      telefono: raw.telefono ?? "",
      dni:      raw.dni      ?? "",
      rol:      rolToLabel(raw.rol),
      activo:   raw.activo   ?? true,
    });
    setEditModal(true);
  };

  // ── Guardar edición ──────────────────────────────────────────────────────
  const handleEdit = async () => {
    if (!editForm.nombre.trim() || !editForm.email.trim()) return;
    setEditSaving(true);
    try {
      await actualizarUsuarioRequest(editId, {
        nombre:   editForm.nombre.trim(),
        apellido: editForm.apellido.trim(),
        email:    editForm.email.trim(),
        telefono: editForm.telefono.trim(),
        dni:      editForm.dni.trim(),
        rol:      labelToRol(editForm.rol),
        activo:   editForm.activo,
      });
      setEditModal(false);
      await cargar();
    } catch (err) {
      console.error("[Users] error al editar:", err);
    } finally {
      setEditSaving(false);
    }
  };

  // ── Activar / desactivar ─────────────────────────────────────────────────
  const handleToggleActivo = async (user) => {
    try {
      if (user.activo) {
        await desactivarUsuarioRequest(user.id);
      } else {
        await activarUsuarioRequest(user.id);
      }
      await cargar();
    } catch (err) {
      console.error("[Users] error al cambiar estado:", err);
    }
  };

  // ── Eliminar ─────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return;
    try {
      await eliminarUsuarioRequest(id);
      await cargar();
    } catch (err) {
      console.error("[Users] error al eliminar:", err);
      alert("No se pudo eliminar el usuario.");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className={styles["containerHeaderUsers"]}>
        <div>
          <DSAText variant="title">Usuarios</DSAText>
          <DSAText variant="text" color="#6B7280">Gestiona los usuarios del sistema</DSAText>
        </div>
        <button
          className={styles["createUserBtn"]}
          onClick={() => { setForm(emptyForm); setFormError(null); setShowModal(true); }}
        >
          + Crear Usuario
        </button>
      </div>

      {/* Filtros */}
      <div className={styles["containerFiltersUsers"]}>
        <div className={styles["searchWrapper"]}>
          <svg className={styles["searchIcon"]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles["searchInput"]}
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <select
          className={styles["filterSelect"]}
          value={rolFiltro}
          onChange={(e) => setRolFiltro(e.target.value)}
        >
          {ROLES_FILTRO.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className={styles["containerTableUsers"]}>
        {loading ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#6B7280" }}>
            Cargando usuarios...
          </div>
        ) : error ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#ef4444" }}>
            {error}
            <br />
            <button onClick={cargar} style={{ marginTop: 12, cursor: "pointer", color: "#22c55e", background: "none", border: "none" }}>
              Reintentar
            </button>
          </div>
        ) : (
          <DSAUsersTable
            data={filtered}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onToggleActivo={handleToggleActivo}
          />
        )}
      </div>

      {/* ── Modal Crear ── */}
      {showModal && (
        <div className={styles["modalOverlay"]} onClick={() => setShowModal(false)}>
          <div className={styles["modalBox"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modalHeader"]}>
              <DSAText variant="subtitle">Crear Usuario</DSAText>
              <button className={styles["modalClose"]} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <DSAInput label="Nombre"    placeholder="Nombre"         value={form.nombre}    onChange={(v) => setForm({ ...form, nombre: v })} />
            <DSAInput label="Apellido"  placeholder="Apellido"       value={form.apellido}  onChange={(v) => setForm({ ...form, apellido: v })} />
            <DSAInput label="DNI"       placeholder="12345678"       value={form.dni}       onChange={(v) => setForm({ ...form, dni: v })} />
            <DSAInput label="Correo"    placeholder="correo@email.com" value={form.correo}  onChange={(v) => setForm({ ...form, correo: v })} type="email" />
            <DSAInput label="Teléfono"  placeholder="+51 999 888 777" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} />
            <DSAInput label="Contraseña" placeholder="Mín. 6 caracteres" value={form.password} onChange={(v) => setForm({ ...form, password: v })} type="password" />

            <div className={styles["inputGroup"]}>
              <label className={styles["inputLabel"]}>Rol</label>
              <select
                className={`${styles["filterSelect"]} ${styles["fullWidth"]}`}
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
              >
                {ROLES_OPCIONES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>

            {formError && (
              <p style={{ color: "#ef4444", fontSize: 13, marginTop: 8 }}>{formError}</p>
            )}

            <div className={styles["modalActions"]}>
              <button className={styles["cancelBtn"]} onClick={() => setShowModal(false)}>Cancelar</button>
              <button className={styles["createUserBtn"]} onClick={handleCreate} disabled={saving}>
                {saving ? "Creando..." : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Editar ── */}
      {editModal && (
        <div className={styles["modalOverlay"]} onClick={() => setEditModal(false)}>
          <div className={styles["modalBox"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modalHeader"]}>
              <DSAText variant="subtitle">Editar Usuario</DSAText>
              <button className={styles["modalClose"]} onClick={() => setEditModal(false)}>✕</button>
            </div>

            <DSAInput label="Nombre"   placeholder="Nombre"   value={editForm.nombre}   onChange={(v) => setEditForm({ ...editForm, nombre: v })} />
            <DSAInput label="Apellido" placeholder="Apellido" value={editForm.apellido} onChange={(v) => setEditForm({ ...editForm, apellido: v })} />
            <DSAInput label="DNI"      placeholder="12345678" value={editForm.dni}      onChange={(v) => setEditForm({ ...editForm, dni: v })} />
            <DSAInput label="Correo"   placeholder="correo@email.com" value={editForm.email} onChange={(v) => setEditForm({ ...editForm, email: v })} type="email" />
            <DSAInput label="Teléfono" placeholder="+51 999 888 777"  value={editForm.telefono} onChange={(v) => setEditForm({ ...editForm, telefono: v })} />

            <div className={styles["inputGroup"]}>
              <label className={styles["inputLabel"]}>Rol</label>
              <select
                className={`${styles["filterSelect"]} ${styles["fullWidth"]}`}
                value={editForm.rol}
                onChange={(e) => setEditForm({ ...editForm, rol: e.target.value })}
              >
                {ROLES_OPCIONES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>

            <label className={styles["toggleRow"] ?? styles["inputGroup"]} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <input
                type="checkbox"
                checked={editForm.activo}
                onChange={(e) => setEditForm({ ...editForm, activo: e.target.checked })}
              />
              <span style={{ fontSize: 13 }}>Usuario activo</span>
            </label>

            <div className={styles["modalActions"]}>
              <button className={styles["cancelBtn"]} onClick={() => setEditModal(false)}>Cancelar</button>
              <button className={styles["createUserBtn"]} onClick={handleEdit} disabled={editSaving}>
                {editSaving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
