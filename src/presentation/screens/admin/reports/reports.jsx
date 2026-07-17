import { useState, useEffect, useMemo } from "react";
import { Download } from "lucide-react";
import { DSAStatCard, DSAText, DSABarChart, DSALineChart, DSACard, DSAResumenCard } from "../../../components";
import { reservationApi } from "../../../../infrastructure/api/reservation.api";
import styles from "./reports.module.css";

const periodos = ["Hoy", "Esta semana", "Este mes", "Este año"];

const iconos = [
  (<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>),
  (<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7"/></>),
  (<><path d="M3 16l6-6 4 4 7-7"/><path d="M14 7h7v7"/></>),
];

const Reports = () => {
  const [periodo, setPeriodo] = useState("Este mes");
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Traer todas las reservas para armar el reporte
        const data = await reservationApi.getAll();
        // Solo tener en cuenta reservas pagadas/confirmadas/completadas para ingresos?
        // Asumiremos que todas aportan a las estadísticas, excluyendo las CANCELADAS
        setReservas(data.filter(r => r.estado !== 'CANCELADA'));
      } catch (error) {
        console.error("Error fetching report data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const reportData = useMemo(() => {
    const now = new Date();
    let filtered = [];
    let titlePeriod = "";
    let barDataset = [];
    let lineData = { xValues: [], yValues: [] };

    if (periodo === "Hoy") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = reservas.filter(r => new Date(r.fecha) >= today && new Date(r.fecha) < new Date(today.getTime() + 86400000));
      titlePeriod = "Hoy";
      
      const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
      const grouped = Array(hours.length).fill(0);
      const ingresos = Array(hours.length).fill(0);
      
      filtered.forEach(r => {
        const h = parseInt(r.horaInicio.split(":")[0]);
        let idx = Math.floor((h - 8) / 2);
        if (idx < 0) idx = 0;
        if (idx >= hours.length) idx = hours.length - 1;
        grouped[idx]++;
        ingresos[idx] += r.total || 0;
      });
      
      barDataset = hours.map((h, i) => ({ month: h, reservas: ingresos[i] }));
      lineData.xValues = hours;
      lineData.yValues = hours.map((_, i) => grouped[i]);

    } else if (periodo === "Esta semana") {
      const day = now.getDay() || 7;
      const startOfWeek = new Date(now);
      startOfWeek.setHours(0,0,0,0);
      startOfWeek.setDate(now.getDate() - day + 1);
      
      filtered = reservas.filter(r => new Date(r.fecha) >= startOfWeek);
      titlePeriod = "Semana";
      
      const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      const grouped = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
      const ingresos = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
      
      filtered.forEach(r => {
        const d = new Date(r.fecha).getDay() || 7;
        const idx = d - 1;
        grouped[idx]++;
        ingresos[idx] += r.total || 0;
      });
      
      barDataset = days.map((d, i) => ({ month: d, reservas: ingresos[i] }));
      lineData.xValues = days;
      lineData.yValues = days.map((_, i) => grouped[i]);

    } else if (periodo === "Este mes") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = reservas.filter(r => new Date(r.fecha) >= startOfMonth);
      titlePeriod = "Mes";

      const weeks = ["Sem 1", "Sem 2", "Sem 3", "Sem 4"];
      const grouped = { 0:0, 1:0, 2:0, 3:0 };
      const ingresos = { 0:0, 1:0, 2:0, 3:0 };
      
      filtered.forEach(r => {
        const date = new Date(r.fecha).getDate();
        let weekIdx = Math.floor((date - 1) / 7);
        if (weekIdx > 3) weekIdx = 3;
        grouped[weekIdx]++;
        ingresos[weekIdx] += r.total || 0;
      });
      
      barDataset = weeks.map((w, i) => ({ month: w, reservas: ingresos[i] }));
      lineData.xValues = weeks;
      lineData.yValues = weeks.map((_, i) => grouped[i]);

    } else if (periodo === "Este año") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      filtered = reservas.filter(r => new Date(r.fecha) >= startOfYear);
      titlePeriod = "Año";

      const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
      const grouped = Array(12).fill(0);
      const ingresos = Array(12).fill(0);
      
      filtered.forEach(r => {
        const m = new Date(r.fecha).getMonth();
        grouped[m]++;
        ingresos[m] += r.total || 0;
      });

      barDataset = months.map((m, i) => ({ month: m, reservas: ingresos[i] }));
      lineData.xValues = months;
      lineData.yValues = months.map((_, i) => grouped[i]);
    }

    const totalReservas = filtered.length;
    const totalIngresos = filtered.reduce((sum, r) => sum + (r.total || 0), 0);
    const promedio = totalReservas ? (totalIngresos / totalReservas) : 0;
    
    const courtsCount = {};
    filtered.forEach(r => {
      courtsCount[r.nombreCancha] = (courtsCount[r.nombreCancha] || 0) + 1;
    });
    let popularCourt = "-";
    let maxCount = 0;
    for (let c in courtsCount) {
      if (courtsCount[c] > maxCount) {
        maxCount = courtsCount[c];
        popularCourt = c;
      }
    }

    return {
      bar: {
        dataset: barDataset,
        config: { xKey: "month", dataKey: "reservas", label: "Ingresos", yLabel: "Ingresos", height: 280 },
      },
      line: {
        data: lineData,
        config: { label: "Reservas", color: "#22c55e", curve: "natural", height: 280 },
      },
      stats: [
        { id: "reservas", title: `Total Reservas (${titlePeriod})`, value: totalReservas, subtext: "Datos reales", iconBg: "#fce7f3", iconColor: "#db2777" },
        { id: "ingresos", title: `Ingresos (${titlePeriod})`, value: `S/ ${totalIngresos.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, subtext: "Datos reales", iconBg: "#fef3c7", iconColor: "#d97706" },
        { id: "promedio", title: "Promedio por Reserva", value: `S/ ${promedio.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, subtext: "Datos reales", iconBg: "#dcfce7", iconColor: "#16a34a" },
      ],
      resumen: { 
        totalReservas: totalReservas, 
        ingresos: `S/ ${totalIngresos.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
        promedio: `S/ ${promedio.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
        canchaPopular: popularCourt, 
        ocupacion: "N/A" 
      }
    };
  }, [reservas, periodo]);

  const { bar, line, stats, resumen } = reportData;

  const handleExport = () => {
    // Aún no funciona
    console.log("Export functionality to be implemented");
  };

  return (
    <div>
      <div className={styles["containerHeaderReports"]}>
        <div className={styles["headerTop"]}>
          <div>
            <DSAText variant="title">Reportes</DSAText>
            <DSAText variant="text" color="#6B7280">Análisis de rendimiento y estadísticas</DSAText>
          </div>
          <button className={styles["exportBtn"]} onClick={handleExport}>
            <Download size={18} />
            Exportar
          </button>
        </div>
        <div className={styles["periodoTabs"]}>
          {periodos.map((p) => (
            <button
              key={p}
              className={`${styles["periodoTab"]} ${periodo === p ? styles["active"] : ""}`}
              onClick={() => setPeriodo(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Cargando datos...</div>
      ) : (
        <>
          <div className={styles["containerCardsReports"]}>
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

          <div className={styles["containerCardsGraphics"]}>
            <DSACard>
              <DSAText variant="subtitle">Tendencia de Reservas</DSAText>
              <DSALineChart data={line.data} config={line.config} />
            </DSACard>
            <DSACard>
              <DSAText variant="subtitle">Ingresos Mensuales</DSAText>
              <DSABarChart dataset={bar.dataset} config={bar.config} />
            </DSACard>
          </div>

          <div className={styles["containerResumen"]}>
            <DSAResumenCard data={resumen} />
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;