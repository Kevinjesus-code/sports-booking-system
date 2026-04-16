import "./customers.css";
import { DSAText, DSAClientsTable } from "../../../components";
const Customers = () => {
  const clients = [
    {
      id: 1,
      nombre: "Juan Pérez",
      telefono: "1234567890",
      email: "email@gmail.com",
      reservas: 14,
    },
    {
      id: 2,
      nombre: "María González",
      telefono: "984156456",
      email: "hola@gmail.com",
      reservas: 54,
    },
    {
      id: 3,
      nombre: "María Josefa González",
      telefono: "984156456",
      email: "Josefa@gmail.com",
      reservas: 2,
    },
  ];
  return (
    <>
      <div className="containerClients">
        <div>
          <DSAText variant="title">Clientes</DSAText>
          <DSAText variant="text" color={"#6B7280"}>
            Gestiona la base de datos de clientes
          </DSAText>
        </div>
        <DSAClientsTable data={clients} />
      </div>
    </>
  );
};
export default Customers;
