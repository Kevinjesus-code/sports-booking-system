import styles from "./users-table.module.css";

const UsersTable = ({ data = [] }) => {
  const getRoleClass = (role) => {
    switch (role) {
      case "Administrador":
        return styles.admin;
      case "Recepcionista":
        return styles.receptionist;
      case "Cliente":
        return styles.client;
      default:
        return "";
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
                <td className={styles.name}>{user.nombre}</td>
                <td>{user.dni}</td>
                <td className={styles.email}>{user.correo}</td>
                <td>{user.telefono}</td>

                <td>
                  <span
                    className={`${styles.role} ${getRoleClass(user.rol)}`}
                  >
                    {user.rol}
                  </span>
                </td>

                <td className={styles.actions}>
                  {/* Edit */}
                  <button className={`${styles["icon-btn"]} ${styles.edit}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 21l3.5-1 11-11a2 2 0 0 0-3-3l-11 11L3 21z" />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button className={`${styles["icon-btn"]} ${styles.delete}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
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