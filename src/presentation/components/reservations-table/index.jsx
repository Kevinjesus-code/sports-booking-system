import "./reservation-table.css";

const ReservationsTable = ({ data = [] }) => {
  return (
    <div className="table-card">
      <div className="table-wrapper">
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
                  <span className={`status ${item.estado === "disponible" ? "status-green" : "status-red"}`}>
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