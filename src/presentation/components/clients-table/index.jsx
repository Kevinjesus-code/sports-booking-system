import "./clients-table.css";

const ClientTable = ({ data = [] }) => {
  return (
    <div className="table-card">
      <div className="table-header">
        <h3>Listado de clientes</h3>
        <span className="table-total">{data.length} clientes</span>
      </div>

      <div className="table-wrapper">
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
                <td className="table-index">{index + 1}</td>
                <td>
                  <div className="client-name-cell">
                    <div className="client-avatar">
                      {item.nombre.charAt(0).toUpperCase()}
                    </div>
                    <span>{item.nombre}</span>
                  </div>
                </td>
                <td>{item.telefono}</td>
                <td className="table-email">{item.email}</td>
                <td>
                  <span className={`reservas-badge ${item.reservas === 0 ? "reservas-badge--cero" : "reservas-badge--activo"}`}>
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