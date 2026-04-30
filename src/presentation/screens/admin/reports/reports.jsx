import { useState } from "react";
import { DSAStatCard, DSAText, DSABarChart, DSALineChart, DSACard, DSAResumenCard } from "../../../components";
import "./reports.css";

const periodos = ["Esta semana", "Este mes", "Este año"];

const dataPorPeriodo = {
  "Esta semana": {
    bar: {
      dataset: [
        { reservas: 40000, month: "Lun" }, { reservas: 55000, month: "Mar" },
        { reservas: 48000, month: "Mié" }, { reservas: 62000, month: "Jue" },
        { reservas: 70000, month: "Vie" }, { reservas: 80000, month: "Sáb" },
        { reservas: 45000, month: "Dom" },
      ],
      config: { xKey: "month", dataKey: "reservas", label: "Ingresos", yLabel: "Ingresos", height: 280 },
    },
    line: {
      data: { xValues: ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"], yValues: [8,12,10,15,18,22,14] },
      config: { label: "Reservas", color: "#22c55e", curve: "natural", height: 280 },
    },
    stats: [
      { id: "reservas", title: "Total Reservas (Semana)", value: 18,        subtext: "+5% vs semana anterior", iconBg: "#fce7f3", iconColor: "#db2777" },
      { id: "ingresos", title: "Ingresos (Semana)",       value: "$95.000",  subtext: "+3% vs semana anterior", iconBg: "#fef3c7", iconColor: "#d97706" },
      { id: "crec",     title: "Crecimiento",             value: "5%",       subtext: "+1% vs semana anterior", iconBg: "#dcfce7", iconColor: "#16a34a" },
    ],
    resumen: { totalReservas: 18, ingresos: "$95.000", promedio: "$5.277", canchaPopular: "Fútbol 5", ocupacion: "65%" },
  },
  "Este mes": {
    bar: {
      dataset: [
        { reservas: 180000, month: "Ene" }, { reservas: 220000, month: "Feb" },
        { reservas: 240000, month: "Mar" }, { reservas: 260000, month: "Abr" },
        { reservas: 270000, month: "May" }, { reservas: 360000, month: "Jun" },
      ],
      config: { xKey: "month", dataKey: "reservas", label: "Ingresos", yLabel: "Ingresos", height: 280 },
    },
    line: {
      data: { xValues: ["Ene","Feb","Mar","Abr","May","Jun"], yValues: [43,48,61,57,67,72] },
      config: { label: "Reservas", color: "#22c55e", curve: "natural", height: 280 },
    },
    stats: [
      { id: "reservas", title: "Total Reservas (Mes)", value: 72,          subtext: "+10% vs mes anterior", iconBg: "#fce7f3", iconColor: "#db2777" },
      { id: "ingresos", title: "Ingresos (Mes)",       value: "$360.000",  subtext: "+8% vs mes anterior",  iconBg: "#fef3c7", iconColor: "#d97706" },
      { id: "crec",     title: "Crecimiento",          value: "15%",       subtext: "+5% vs mes anterior",  iconBg: "#dcfce7", iconColor: "#16a34a" },
    ],
    resumen: { totalReservas: 315, ingresos: "$1.775.000", promedio: "$5.635", canchaPopular: "Fútbol 5", ocupacion: "78%" },
  },
  "Este año": {
    bar: {
      dataset: [
        { reservas: 180000, month: "Ene" }, { reservas: 220000, month: "Feb" },
        { reservas: 240000, month: "Mar" }, { reservas: 260000, month: "Abr" },
        { reservas: 270000, month: "May" }, { reservas: 360000, month: "Jun" },
        { reservas: 310000, month: "Jul" }, { reservas: 290000, month: "Ago" },
        { reservas: 330000, month: "Sep" }, { reservas: 350000, month: "Oct" },
        { reservas: 380000, month: "Nov" }, { reservas: 420000, month: "Dic" },
      ],
      config: { xKey: "month", dataKey: "reservas", label: "Ingresos", yLabel: "Ingresos", height: 280 },
    },
    line: {
      data: { xValues: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"], yValues: [43,48,61,57,67,72,68,64,70,75,80,88] },
      config: { label: "Reservas", color: "#22c55e", curve: "natural", height: 280 },
    },
    stats: [
      { id: "reservas", title: "Total Reservas (Año)", value: 841,          subtext: "+22% vs año anterior", iconBg: "#fce7f3", iconColor: "#db2777" },
      { id: "ingresos", title: "Ingresos (Año)",       value: "$3.810.000", subtext: "+18% vs año anterior", iconBg: "#fef3c7", iconColor: "#d97706" },
      { id: "crec",     title: "Crecimiento",          value: "22%",        subtext: "+7% vs año anterior",  iconBg: "#dcfce7", iconColor: "#16a34a" },
    ],
    resumen: { totalReservas: 841, ingresos: "$3.810.000", promedio: "$4.530", canchaPopular: "Fútbol 5", ocupacion: "85%" },
  },
};

const iconos = [
  (<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>),
  (<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7"/></>),
  (<><path d="M3 16l6-6 4 4 7-7"/><path d="M14 7h7v7"/></>),
];

const Reports = () => {
  const [periodo, setPeriodo] = useState("Este mes");
  const { bar, line, stats, resumen } = dataPorPeriodo[periodo];

  return (
    <div>
      <div className="containerHeaderReports">
        <div>
          <DSAText variant="title">Reportes</DSAText>
          <DSAText variant="text" color="#6B7280">Análisis de rendimiento y estadísticas</DSAText>
        </div>
        <div className="periodoTabs">
          {periodos.map((p) => (
            <button
              key={p}
              className={`periodoTab ${periodo === p ? "active" : ""}`}
              onClick={() => setPeriodo(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="containerCardsReports">
        {stats.map((item, i) => (
          <DSAStatCard
            key={item.id}
            title={item.title}
            value={item.value}
            icon={iconos[i]}
            iconBg={item.iconBg}
            iconColor={item.iconColor}
          />
        ))}
      </div>

      <div className="containerCardsGraphics">
        <DSACard>
          <DSAText variant="subtitle">Tendencia de Reservas</DSAText>
          <DSALineChart data={line.data} config={line.config} />
        </DSACard>
        <DSACard>
          <DSAText variant="subtitle">Ingresos Mensuales</DSAText>
          <DSABarChart dataset={bar.dataset} config={bar.config} />
        </DSACard>
      </div>

      <div className="containerResumen">
        <DSAResumenCard data={resumen} />
      </div>
    </div>
  );
};

export default Reports;