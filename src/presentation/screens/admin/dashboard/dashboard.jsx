import "./dashboard.css";
import { useState } from "react";
import { DSAText, DSAReservationsTable, DSAStatCard } from "../../../components";
const Dashboard = () => {
  const [fecha, setFecha] = useState("2026-04-02");

  const reservations = [
    { id: 1, cliente: "Juan Pérez",     hora: "14:00 - 15:00", cancha: "Fútbol 5 - A",  estado: "ocupado"    },
    { id: 2, cliente: "María González", hora: "15:00 - 16:00", cancha: "Fútbol 7 - B",  estado: "ocupado"    },
    { id: 3, cliente: "Carlos Ramírez", hora: "16:00 - 17:00", cancha: "Voley - C",      estado: "ocupado"    },
    { id: 4, cliente: "—",              hora: "17:00 - 18:00", cancha: "Fútbol 5 - A",  estado: "disponible" },
    { id: 5, cliente: "Ana Martínez",   hora: "18:00 - 19:00", cancha: "Fútbol 11 - B", estado: "ocupado"    },
    { id: 6, cliente: "—",              hora: "19:00 - 20:00", cancha: "Fútbol 7 - B",  estado: "disponible" },
  ];

  const stats = [
    {
      title: "Reservas del día",
      value: 12,
      iconBg: "#dcfce7",
      iconColor: "#16a34a",
      icon: (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </>
      ),
    },
    {
      title: "Canchas disponibles",
      value: 5,
      iconBg: "#dcfce7",
      iconColor: "#16a34a",
      icon: (
        <>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </>
      ),
    },
    {
      title: "Canchas ocupadas",
      value: 3,
      iconBg: "#dcfce7",
      iconColor: "#16a34a",
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="containerHeader">
        <div className="headerTop">
          <div>
            <DSAText variant="title">Dashboard</DSAText>
            <DSAText variant="text" color="#6B7280">
              Resumen de reservas y estado de canchas
            </DSAText>
          </div>
          <div className="headerActions">
            <input
              type="date"
              className="dateInput"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <button className="filterBtn">Filter</button>
          </div>
        </div>
      </div>

      <div className="containerCards">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <div className="containerReservations">
        <DSAText variant="subtitle">Reservas de Hoy</DSAText>
        <DSAReservationsTable data={reservations} />
      </div>
    </div>
  );
};

export default Dashboard;