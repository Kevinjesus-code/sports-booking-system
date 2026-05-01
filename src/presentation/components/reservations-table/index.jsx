import styles from "./reservation-table.module.css";

const ReservationsTable = ({ data = [] }) => {
  return (
    <div className={styles["table-card"]}>
      <div className={styles["table-wrapper"]}>
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Hora</th>
              <th>Cancha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.cliente}</td>
                <td>{item.hora}</td>
                <td>{item.cancha}</td>
                <td>
                  <span className={`${styles["status"]} ${item.estado === "disponible" ? styles["status-green"] : styles["status-red"]}`}>
                    {item.estado === "disponible" ? "Disponible" : "Ocupado"}
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

export default ReservationsTable;