import { useState, useEffect, useMemo } from "react";
import styles from "./dashboard.module.css";
import {
  DSAStatCard,
  DSAText,
  DSAReservationsTable,
  DSAEmptyState,
  DSALoadingSpinner,
} from "../../../components";
import { useAllReservations } from "../../../hooks/useReservations";

const TODAY = new Date().toISOString().slice(0, 10);

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { reservations, loading, error, refetch } = useAllReservations(TODAY);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // ── Métricas operativas del día ──
  const metrics = useMemo(() => {
    const total       = reservations.length;
    const enCurso     = reservations.filter(r => r.estado === "en_curso").length;
    const finalizadas = reservations.filter(r => r.estado === "finalizada").length;
    const noAsistidas = reservations.filter(r => r.estado === "no_asistio").length;
    return { total, enCurso, finalizadas, noAsistidas };
  }, [reservations]);

  const stats = [
    {
      id: "reservas_dia",
      title: "Reservas del día",
      value: metrics.total,
      iconBg: "#ecfdf5",
      iconColor: "#22c55e",
      icon: (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </>
      ),
    },
    {
      id: "en_curso",
      title: "En curso",
      value: metrics.enCurso,
      iconBg: "#f3e8ff",
      iconColor: "#7c3aed",
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </>
      ),
    },
    {
      id: "finalizadas",
      title: "Finalizadas",
      value: metrics.finalizadas,
      iconBg: "#dbeafe",
      iconColor: "#2563eb",
      icon: (
        <>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </>
      ),
    },
    {
      id: "no_asistidas",
      title: "No asistieron",
      value: metrics.noAsistidas,
      iconBg: "#fee2e2",
      iconColor: "#ef4444",
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </>
      ),
    },
  ];

  // ── Próximas reservas por atender (confirmadas + pendientes del día) ──
  const proximas = reservations.filter(
    r => r.estado === "confirmada" || r.estado === "pendiente"
  );

  // ── Actividad reciente (en_curso + finalizadas + no_asistio) ──
  const actividad = reservations.filter(
    r => r.estado === "en_curso" || r.estado === "finalizada" || r.estado === "no_asistio"
  );

  if (loading) {
    return (
      <div className={styles.screen} style={{ display: 'flex', justifyContent: 'center', paddingTop: '60px' }}>
        <DSALoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      {error && (
        <div style={{ color: '#ef4444', padding: '12px', background: '#fef2f2', borderRadius: '8px', marginBottom: '16px' }}>
          Error al cargar datos: {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {stats.map((item) => (
          <DSAStatCard
            key={item.id}
            title={item.title}
            value={item.value}
            icon={item.icon}
            iconBg={item.iconBg}
            iconColor={item.iconColor}
          />
        ))}
      </div>

      {/* Próximas por atender */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>Próximas por atender</h3>
            <p className={styles.sectionSub}>Reservas confirmadas y pendientes de hoy</p>
          </div>
          <span className={styles.sectionCount}>{proximas.length}</span>
        </div>
        {proximas.length > 0 ? (
          <DSAReservationsTable data={proximas} />
        ) : (
          <DSAEmptyState
            icon={
              <svg viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            title="Todo al día"
            subtitle="No hay reservas pendientes por atender."
          />
        )}
      </div>

      {/* Actividad del día */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>Actividad del día</h3>
            <p className={styles.sectionSub}>Reservas en curso, finalizadas y no asistidas</p>
          </div>
          <span className={styles.sectionCount}>{actividad.length}</span>
        </div>
        {actividad.length > 0 ? (
          <DSAReservationsTable data={actividad} />
        ) : (
          <DSAEmptyState
            icon={
              <svg viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
            title="Sin actividad aún"
            subtitle="Las reservas atendidas aparecerán aquí."
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
