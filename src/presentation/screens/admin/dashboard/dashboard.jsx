import "./dashboard.css";
import {
  DSAText,
  DSAReservationsTable,
} from "../../../components";
const Dashboard = () => {
  const reservations = [
    {
      id: 1,
      cliente: "Juan Pérez",
      telefono: "1234567890",
      fecha: "2026-04-08",
      hora: "14:00 - 15:00",
      cancha: "Fútbol 5",
      estado: "disponible",
    },
    {
      id: 2,
      telefono: "912123321",
      fecha: "2026-01-08",
      cliente: "María González",
      hora: "15:00 - 16:00",
      cancha: "Fútbol 7",
      estado: "ocupado",
    },
  ];
  return (
    <>
      <div>
        <div className="containerHeader">
          <DSAText variant="title">Dashboard</DSAText>
          <DSAText variant="text" color={"#6B7280"}>
            Resumen de reservas y estado de canchas
          </DSAText>
        </div>
        <div className="containerReservations">
          <DSAReservationsTable data={reservations} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
