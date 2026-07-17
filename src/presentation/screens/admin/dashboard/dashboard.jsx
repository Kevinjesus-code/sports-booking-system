import styles from "./dashboard.module.css";
import { useState, useEffect, useCallback } from "react";
import { DSAText, DSAReservationsTable, DSAStatCard } from "../../../components";
import {
  getDashboardResumenRequest,
  getReservasPorFechaRequest,
} from "../../../../infrastructure/api/dashboard.api";

// ─── Fecha local YYYY-MM-DD sin desfase de zona horaria ───────────────────
const fechaHoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// ─── Mapea ReservaResponse del backend a la fila que espera DSAReservationsTable
const toRow = (r) => ({
  id:      r.id,
  cliente: r.clienteNombre ?? "—",
  fecha:   r.fecha         ?? "—",
  hora:    r.horaInicio && r.horaFin ? `${r.horaInicio.slice(0, 5)} - ${r.horaFin.slice(0, 5)}` : "—",
  cancha:  r.nombreCancha  ?? "—",
  estado:  r.estado        ?? "—",
});

// ─── Íconos de las stat cards ─────────────────────────────────────────────
const iconReservas = (
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8"  y1="2" x2="8"  y2="6" />
    <line x1="3"  y1="10" x2="21" y2="10" />
  </>
);
const iconDisponibles = (
  <>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </>
);
const iconOcupadas = (
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8"  x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </>
);

// ─── Componente ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const [fecha,        setFecha]        = useState(fechaHoy());
  const [resumen,      setResumen]      = useState(null);
  const [reservas,     setReservas]     = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [errorStats,   setErrorStats]   = useState(null);
  const [errorTable,   setErrorTable]   = useState(null);

  // ── Cargar KPIs ──────────────────────────────────────────────────────────
  const cargarResumen = useCallback(async () => {
    setLoadingStats(true);
    setErrorStats(null);
    try {
      const { data } = await getDashboardResumenRequest();
      setResumen(data?.data ?? data);
    } catch (err) {
      setErrorStats("No se pudo cargar el resumen.");
      console.error("[Dashboard] resumen:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // ── Cargar tabla de reservas ──────────────────────────────────────────────
  const cargarReservas = useCallback(async (f) => {
    setLoadingTable(true);
    setErrorTable(null);
    try {
      const { data } = await getReservasPorFechaRequest(f);
      const lista = Array.isArray(data) ? data : (data?.data ?? []);
      setReservas(lista.map(toRow));
    } catch (err) {
      setErrorTable("No se pudieron cargar las reservas.");
      console.error("[Dashboard] reservas:", err);
    } finally {
      setLoadingTable(false);
    }
  }, []);

  useEffect(() => {
    cargarResumen();
    cargarReservas(fechaHoy());
  }, [cargarResumen, cargarReservas]);

  const handleFilter = () => cargarReservas(fecha);

  // ── Stats cards ───────────────────────────────────────────────────────────
  const stats = [
    {
      title:     "Reservas del día",
      value:     loadingStats ? "..." : (resumen?.reservasDelDia     ?? 0),
      icon:      iconReservas,
      iconBg:    "#dcfce7",
      iconColor: "#16a34a",
    },
    {
      title:     "Canchas disponibles",
      value:     loadingStats ? "..." : (resumen?.canchasDisponibles ?? 0),
      icon:      iconDisponibles,
      iconBg:    "#dcfce7",
      iconColor: "#16a34a",
    },
    {
      title:     "Canchas ocupadas",
      value:     loadingStats ? "..." : (resumen?.canchasOcupadas    ?? 0),
      icon:      iconOcupadas,
      iconBg:    "#dcfce7",
      iconColor: "#16a34a",
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className={styles["containerHeader"]}>
        <div className={styles["headerTop"]}>
          <div>
            <DSAText variant="title">Dashboard</DSAText>
            <DSAText variant="text" color="#6B7280">
              Resumen de reservas y estado de canchas
            </DSAText>
          </div>
          <div className={styles["headerActions"]}>
            <input
              type="date"
              className={styles["dateInput"]}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <button className={styles["filterBtn"]} onClick={handleFilter}>
              Filtrar
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      {errorStats ? (
        <div style={{ color: "#ef4444", padding: "8px 0", fontSize: 13 }}>
          {errorStats}
          <button onClick={cargarResumen} style={{ marginLeft: 8, color: "#22c55e", background: "none", border: "none", cursor: "pointer" }}>
            Reintentar
          </button>
        </div>
      ) : (
        <div className={styles["containerCards"]}>
          {stats.map((stat, i) => (
            <DSAStatCard
              key={i}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconBg={stat.iconBg}
              iconColor={stat.iconColor}
            />
          ))}
        </div>
      )}

      {/* Tabla de reservas */}
      <div className={styles["containerReservations"]}>
        <DSAText variant="subtitle">
          Reservas del {fecha === fechaHoy() ? "día" : fecha}
        </DSAText>

        {loadingTable ? (
          <div style={{ padding: "24px 0", color: "#6B7280", fontSize: 14 }}>
            Cargando reservas...
          </div>
        ) : errorTable ? (
          <div style={{ color: "#ef4444", fontSize: 13, padding: "8px 0" }}>
            {errorTable}
            <button onClick={() => cargarReservas(fecha)} style={{ marginLeft: 8, color: "#22c55e", background: "none", border: "none", cursor: "pointer" }}>
              Reintentar
            </button>
          </div>
        ) : reservas.length === 0 ? (
          <div style={{ padding: "24px 0", color: "#6B7280", fontSize: 14 }}>
            No hay reservas para esta fecha.
          </div>
        ) : (
          <DSAReservationsTable data={reservas} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
