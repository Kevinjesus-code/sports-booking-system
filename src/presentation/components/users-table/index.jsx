import React, { useState, useEffect, useCallback } from "react";
import { DSAText } from "../../../components";
import {
  getGridHorariosRequest,
  bloquearHorarioRequest,
  desbloquearHorarioRequest,
  buildGrid,
} from "../../../../infrastructure/api/schedules.api";
import styles from "./schedules.module.css";

// ─── Fecha local YYYY-MM-DD ───────────────────────────────────────────────
const fechaHoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// ─── Componente ───────────────────────────────────────────────────────────
const Schedule = () => {
  const [fecha,    setFecha]    = useState(fechaHoy());
  const [grid,     setGrid]     = useState({ canchas: [], horas: [], celdas: {} });
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  // Rastrear qué celdas están en proceso de guardar para deshabilitar doble clic
  const [toggling, setToggling] = useState(new Set());

  // ── Cargar grid ────────────────────────────────────────────────────────
  const cargar = useCallback(async (f) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getGridHorariosRequest(f);
      const lista = Array.isArray(data) ? data : (data?.data ?? []);
      setGrid(buildGrid(lista));
    } catch (err) {
      setError("No se pudo cargar el grid de horarios.");
      console.error("[Schedules] error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(fecha); }, [cargar, fecha]);

  // ── Toggle bloquear / desbloquear ──────────────────────────────────────
  const handleToggle = async (hora, colIndex) => {
    const celda = grid.celdas[hora]?.[colIndex];
    if (!celda) return;

    const { horarioId, status } = celda;

    // Slots ocupados con reserva real no se pueden modificar
    if (status === "Ocupado" || status === "—") return;
    // Slots sintéticos (id negativo o null) no tienen fila en BD
    if (!horarioId || horarioId < 0) return;

    const key = `${hora}-${colIndex}`;
    if (toggling.has(key)) return;

    setToggling((prev) => new Set(prev).add(key));
    try {
      if (status === "Disponible") {
        await bloquearHorarioRequest(horarioId);
      } else if (status === "Bloqueado") {
        await desbloquearHorarioRequest(horarioId);
      }
      // Actualizar solo esa celda localmente para evitar recargar todo el grid
      setGrid((prev) => {
        const nuevoStatus = status === "Disponible" ? "Bloqueado" : "Disponible";
        const nuevasFila  = [...prev.celdas[hora]];
        nuevasFila[colIndex] = { ...celda, status: nuevoStatus };
        return {
          ...prev,
          celdas: { ...prev.celdas, [hora]: nuevasFila },
        };
      });
    } catch (err) {
      console.error("[Schedules] error al togglear:", err);
      alert("No se pudo actualizar el horario. Intenta de nuevo.");
    } finally {
      setToggling((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  // ── Clases CSS por estado ──────────────────────────────────────────────
  const getStatusClass = (status) => {
    if (status === "Disponible") return styles.available;
    if (status === "Ocupado")    return styles.occupied;
    if (status === "Bloqueado")  return styles.blocked;
    return styles.blocked;
  };

  const isClikeable = (status, horarioId) =>
    (status === "Disponible" || status === "Bloqueado") &&
    horarioId && horarioId > 0;

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className={styles["containerHeader"]}>
        <div className={styles["headerTopSchedule"]}>
          <div>
            <DSAText variant="title">Horarios</DSAText>
            <DSAText variant="text" color="#6B7280">
              Configura los horarios disponibles para cada cancha
            </DSAText>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 13,
                color: "#374151",
              }}
            />
            <div className={styles["scheduleLegend"]}>
              <span className={`${styles["legendItem"]} ${styles["available"]}`}>● Disponible</span>
              <span className={`${styles["legendItem"]} ${styles["occupied"]}`}>● Ocupado</span>
              <span className={`${styles["legendItem"]} ${styles["blocked"]}`}>● Bloqueado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estados */}
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>
          Cargando horarios...
        </div>
      ) : error ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
          {error}
          <br />
          <button
            onClick={() => cargar(fecha)}
            style={{ marginTop: 12, color: "#22c55e", background: "none", border: "none", cursor: "pointer" }}
          >
            Reintentar
          </button>
        </div>
      ) : grid.canchas.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>
          No hay canchas activas o no hay horarios para esta fecha.
        </div>
      ) : (

        /* Grid */
        <div className={styles["scheduleCard"]}>
          <div
            className={styles["scheduleGrid"]}
            style={{ gridTemplateColumns: `140px repeat(${grid.canchas.length}, 1fr)` }}
          >
            {/* Headers */}
            <div className={styles["scheduleHeader"]}>Hora</div>
            {grid.canchas.map((c) => (
              <div key={c.id} className={styles["scheduleHeader"]}>
                <span className={styles["courtName"]}>{c.nombre}</span>
                <span className={styles["courtType"]}>{c.tipo}</span>
              </div>
            ))}

            {/* Filas */}
            {grid.horas.map((hora) => (
              <React.Fragment key={hora}>
                <div className={styles["scheduleHour"]}>{hora}</div>
                {(grid.celdas[hora] ?? []).map((celda, i) => {
                  const key       = `${hora}-${i}`;
                  const clickable = isClikeable(celda.status, celda.horarioId);
                  const busy      = toggling.has(key);

                  return (
                    <button
                      key={key}
                      className={`${styles["scheduleCell"]} ${getStatusClass(celda.status)}`}
                      onClick={() => clickable && handleToggle(hora, i)}
                      disabled={!clickable || busy}
                      title={
                        celda.status === "Ocupado"
                          ? "Reservado por un cliente — no se puede modificar"
                          : celda.status === "Disponible"
                          ? "Clic para bloquear"
                          : celda.status === "Bloqueado"
                          ? "Clic para desbloquear"
                          : ""
                      }
                    >
                      {busy ? "..." : celda.status}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Footer instrucciones */}
      {!loading && !error && grid.canchas.length > 0 && (
        <div className={styles["scheduleFooter"]}>
          <strong>Instrucciones:</strong> Haz clic en un horario{" "}
          <span style={{ color: "#16a34a" }}>disponible</span> para bloquearlo, o en uno{" "}
          <span style={{ color: "#9ca3af" }}>bloqueado</span> para desbloquearlo. Los horarios{" "}
          <span style={{ color: "#ef4444" }}>ocupados</span> tienen una reserva activa y no se pueden modificar.
        </div>
      )}
    </div>
  );
};

export default Schedule;