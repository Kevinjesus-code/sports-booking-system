import "./dashboard.css";
import { DSAStatCard, DSAText, DSAReservationsTable } from "../../../components";
const Dashboard = () => {
  const stats = [
    {
      id: "reservas_hoy",
      title: "Reservas del día",
      value: 12,
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      id: "canchas_disponibles",
      title: "Canchas disponibles",
      value: 8,
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12l3 3 5-5" />
        </svg>
      ),
    },
    {
      id: "canchas_ocupadas",
      title: "Canchas ocupadas",
      value: 4,
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      ),
    },
  ];
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
            Resumen de reservas y disponibilidad
          </DSAText>
        </div>
        <div className="containerCards">
          {stats.map((item) => (
            <DSAStatCard
              key={item.id}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </div>
        <div className="containerReservations">
            <DSAReservationsTable data={reservations} />
        </div>
      </div>
    </>
  );
};
export default Dashboard;
