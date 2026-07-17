import styles from "./clients-table.module.css";

const ClientTable = ({ data = [] }) => {
  return (
    <div className={styles["table-card"]}>
      <div className={styles["table-header"]}>
        <h3>Listado de clientes</h3>
        <span className={styles["table-total"]}>{data.length} clientes</span>
      </div>

      <div className={styles["table-wrapper"]}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Reservas</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td className={styles["table-index"]}>{index + 1}</td>
                <td>
                  <div className={styles["client-name-cell"]}>
                    <div className={styles["client-avatar"]}>
                      {item.nombre.charAt(0).toUpperCase()}
                    </div>
                    <span>{item.nombre}</span>
                  </div>
                </td>
                <td>{item.telefono}</td>
                <td className={styles["table-email"]}>{item.email}</td>
                <td>
                  <span className={`${styles["reservas-badge"]} ${item.reservas === 0 ? styles["reservas-badge--cero"] : styles["reservas-badge--activo"]}`}>
                    {item.reservas} {item.reservas === 1 ? "reserva" : "reservas"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;