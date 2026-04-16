import "./clients-table.css";

const ClientTable = ({ data = [] }) => {
 return (
    <div className="table-card">
      <div className="table-header">
        <h3>Reservas de hoy</h3>
        <span className="view-all">Ver todas</span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Telefono</th>
              <th>Email</th>
              <th>Reservas</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{item.telefono}</td>
                <td>{item.email}</td>
                <td>
                  <span
                   className="status-green-reservation"
                  >
                    {item.reservas } reservas
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