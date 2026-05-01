import styles from "./courts-table.module.css";

const CourtsTable = ({ data = [] }) => {
  const getStatusClass = (state) => {
    switch (state) {
      case "Disponible":
        return styles["status-available"];
      case "Ocupada":
        return styles["status-occupied"];
      case "Mantenimiento":
        return styles["status-maintenance"];
      default:
        return "";
    }
  };

  return (
    <div className={styles[styles["table-card"]]}>
      <div className={styles[styles["table-wrapper"]]}>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{item.type}</td>
                <td>
                  <span
                    className={`${styles.status} ${getStatusClass(
                      item.state
                    )}`}
                  >
                    {item.state}
                  </span>
                </td>

                <td className={styles.actions}>
                  <button className={`${styles["icon-btn"]} ${styles.edit}`}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 21l3.5-1 11-11a2 2 0 0 0-3-3l-11 11L3 21z" />
                    </svg>
                  </button>

                  <button className={`${styles["icon-btn"]} ${styles.delete}`}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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

export default CourtsTable;