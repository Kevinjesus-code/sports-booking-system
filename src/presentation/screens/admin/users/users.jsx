import { useState } from "react";
import { DSAText, DSAUsersTable, DSAInput } from "../../../components";
import styles from "./users.module.css";

const rolesOpciones = ["Cliente", "Administrador", "Recepcionista"];
const rolesFiltro   = ["Todos los roles", ...rolesOpciones];

const initialUsers = [
  { id: 1,  nombre: "Juan Pérez",        dni: "12345678-9", correo: "juan.perez@gmail.com",       telefono: "+569 1234 5678", rol: "Cliente"       },
  { id: 2,  nombre: "María González",    dni: "23456789-0", correo: "maria.gonzalez@outlook.com", telefono: "+569 8765 4321", rol: "Cliente"       },
  { id: 3,  nombre: "Admin Principal",   dni: "99999999-9", correo: "admin@sistema.com",           telefono: "+569 9999 9999", rol: "Administrador" },
  { id: 4,  nombre: "Carlos Ramírez",    dni: "34567890-1", correo: "carlos.ramirez@yahoo.com",   telefono: "+569 5555 5555", rol: "Cliente"       },
  { id: 5,  nombre: "Ana Martínez",      dni: "45678901-2", correo: "ana.martinez@gmail.com",     telefono: "+569 4444 4444", rol: "Cliente"       },
  { id: 6,  nombre: "Laura Torres",      dni: "56789012-3", correo: "laura.torres@recep.com",     telefono: "+569 3333 3333", rol: "Recepcionista" },
  { id: 7,  nombre: "Diego Silva",       dni: "67890123-4", correo: "diego.silva@recep.com",      telefono: "+569 2222 2222", rol: "Recepcionista" },
  { id: 8,  nombre: "Sofía Herrera",     dni: "78901234-5", correo: "sofia.herrera@gmail.com",    telefono: "+569 1111 1111", rol: "Cliente"       },
  { id: 9,  nombre: "Pedro Rojas",       dni: "89012345-6", correo: "pedro.rojas@hotmail.com",    telefono: "+569 7777 8888", rol: "Cliente"       },
  { id: 10, nombre: "Valentina Castro",  dni: "90123456-7", correo: "valentina.castro@gmail.com", telefono: "+569 6666 9999", rol: "Cliente"       },
];

const emptyForm = { nombre: "", dni: "", correo: "", telefono: "", rol: "Cliente" };

const Users = () => {
  const [users, setUsers]       = useState(initialUsers);
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState("Todos los roles");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(emptyForm);

  const filtered = users.filter((u) => {
    const okRol      = rolFiltro === "Todos los roles" || u.rol === rolFiltro;
    const okBusqueda = u.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return okRol && okBusqueda;
  });

  const handleCreate = () => {
    if (!form.nombre.trim() || !form.correo.trim()) return;
    setUsers([...users, { id: Date.now(), ...form }]);
    setForm(emptyForm);
    setShowModal(false);
  };

  return (
    <div>
      <div className={styles["containerHeaderUsers"]}>
        <div>
          <DSAText variant="title">Usuarios</DSAText>
          <DSAText variant="text" color="#6B7280">Gestiona los usuarios del sistema</DSAText>
        </div>
        <button className={styles["createUserBtn"]} onClick={() => setShowModal(true)}>
          + Crear Usuario
        </button>
      </div>

      <div className={styles["containerFiltersUsers"]}>
        <div className={styles["searchWrapper"]}>
          <svg className={styles["searchIcon"]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles["searchInput"]}
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <select className={styles["filterSelect"]} value={rolFiltro} onChange={(e) => setRolFiltro(e.target.value)}>
          {rolesFiltro.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className={styles["containerTableUsers"]}>
        <DSAUsersTable data={filtered} />
      </div>

      {showModal && (
        <div className={styles["modalOverlay"]} onClick={() => setShowModal(false)}>
          <div className={styles["modalBox"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modalHeader"]}>
              <DSAText variant="subtitle">Crear Usuario</DSAText>
              <button className={styles["modalClose"]} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <DSAInput label="Nombre" placeholder="Nombre completo" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
            <DSAInput label="DNI"    placeholder="12345678-9"       value={form.dni}    onChange={(v) => setForm({ ...form, dni: v })} />
            <DSAInput label="Correo" placeholder="correo@email.com" value={form.correo} onChange={(v) => setForm({ ...form, correo: v })} type="email" />
            <DSAInput label="Teléfono" placeholder="+569 1234 5678" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} />
            <div className={styles["inputGroup"]}>
              <label className={styles["inputLabel"]}>Rol</label>
              <select
                className={`${styles["filterSelect"]} ${styles["fullWidth"]}`}
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
              >
                {rolesOpciones.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className={styles["modalActions"]}>
              <button className={styles["cancelBtn"]} onClick={() => setShowModal(false)}>Cancelar</button>
              <button className={styles["createUserBtn"]} onClick={handleCreate}>Crear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;