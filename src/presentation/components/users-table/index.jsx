import styles from "./users-table.module.css";

const UsersTable = ({ data = [], onEdit, onDelete, onToggleActivo }) => {
  const getRoleClass = (role) => {
    switch (role) {
      case "Administrador": return styles.admin;
      case "Recepcionista": return styles.receptionist;
      case "Cliente":       return styles.client;
      default:              return "";
    }
  };

  return (
    <div className={styles["table-card"]}>
      <div className={styles["table-wrapper"]}>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td className={styles.name}>
                  {user.nombre}
                  {/* Indicador visual si el usuario está inactivo */}
                  {user.activo === false && (
                    <span style={{
                      marginLeft: 6, fontSize: 10, color: "#9ca3af",
                      background: "#f3f4f6", borderRadius: 4, padding: "1px 5px"
                    }}>
                      inactivo
                    </span>
                  )}
                </td>
                <td>{user.dni}</td>
                <td className={styles.email}>{user.correo}</td>
                <td>{user.telefono}</td>

                <td>
                  <span className={`${styles.role} ${getRoleClass(user.rol)}`}>
                    {user.rol}
                  </span>
                </td>

                <td className={styles.actions}>
                  {/* Activar / Desactivar */}
                  {onToggleActivo && (
                    <button
                      className={`${styles["icon-btn"]}`}
                      style={{ color: user.activo !== false ? "#f59e0b" : "#22c55e" }}
                      onClick={() => onToggleActivo(user)}
                      title={user.activo !== false ? "Desactivar usuario" : "Activar usuario"}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {user.activo !== false ? (
                          // Ícono "pausar" — desactivar
                          <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>
                        ) : (
                          // Ícono "play" — activar
                          <><polygon points="5 3 19 12 5 21 5 3"/></>
                        )}
                      </svg>
                    </button>
                  )}

                  {/* Editar */}
                  <button
                    className={`${styles["icon-btn"]} ${styles.edit}`}
                    onClick={() => onEdit?.(user)}
                    title="Editar usuario"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21l3.5-1 11-11a2 2 0 0 0-3-3l-11 11L3 21z" />
                    </svg>
                  </button>

                  {/* Eliminar */}
                  <button
                    className={`${styles["icon-btn"]} ${styles.delete}`}
                    onClick={() => onDelete?.(user.id)}
                    title="Eliminar usuario"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;