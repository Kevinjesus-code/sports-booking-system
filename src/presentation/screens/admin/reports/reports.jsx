import {
  DSAStatCard,
  DSAText,
  DSABarChart,
  DSALineChart,
  DSACard,
  DSAResumenCard,
} from "../../../components";
import "./reports.module.css";

const barData = {
  dataset: [
    { reservas: 12, month: "Ene" },
    { reservas: 15, month: "Feb" },
    { reservas: 10, month: "Mar" },
    { reservas: 18, month: "Abr" },
    { reservas: 20, month: "May" },
    { reservas: 22, month: "Jun" },
    { reservas: 25, month: "Jul" },
    { reservas: 23, month: "Ago" },
    { reservas: 19, month: "Sep" },
    { reservas: 16, month: "Oct" },
    { reservas: 13, month: "Nov" },
    { reservas: 11, month: "Dic" },
  ],
  config: {
    xKey: "month",
    dataKey: "reservas",
    label: "Reservas",
    yLabel: "Reservas",
    height: 320,
  },
};

const lineData = {
  data: {
    xValues: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    yValues: [43, 48, 61, 57, 67, 72],
  },
  config: {
    label: "Reservas",
    color: "#22c55e",
    curve: "natural",
    height: 280,
  },
};

const Reports = () => {
  const stats = [
    {
      id: "reservas_mes",
      title: "Total Reservas (Mes)",
      value: 72,
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
      id: "ingresos_mes",
      title: "Ingresos (Mes)",
      value: "$360.000",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" />
        </svg>
      ),
    },
    {
      id: "crecimiento",
      title: "Crecimiento",
      value: "15%",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 16l6-6 4 4 7-7" />
          <path d="M14 7h7v7" />
        </svg>
      ),
    },
  ];
  const resumen = {
    totalReservas: 315,
    ingresos: "$1.775.000",
    promedio: "$5.635",
    canchaPopular: "Fútbol 5",
    ocupacion: "78%",
  };

  return (
    <>
      <div>
        <div className={styles.containerHeader}>
          <DSAText variant="title">Reportes</DSAText>
          <DSAText variant="text" color={"#6B7280"}>
            Análisis de rendimiento y estadísticas
          </DSAText>
        </div>

        <div className={styles.containerCards}>
          {stats.map((item) => (
            <DSAStatCard
              key={item.id}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </div>

        <div className={styles.containerCardsGraphics}>
          <DSACard>
            <DSAText variant="subtitle">Tendencia de Reservas</DSAText>
            <DSALineChart data={lineData.data} config={lineData.config} />
          </DSACard>
          <DSACard>
            <DSAText variant="subtitle">Reservas por mes</DSAText>
            <DSABarChart dataset={barData.dataset} config={barData.config} />
          </DSACard>
        </div>
        <div className={styles.containerCardsGraphics}>
          <DSAResumenCard data={resumen} />
        </div>
      </div>
    </>
  );
};

export default Reports;
