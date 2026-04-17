import styles from "./court.module.css";
import { useState } from "react";

const Courts = ({ onSelectCourt }) => {
  const [filtro, setFiltro] = useState("todas");

  const canchasData = [
    {
      id: 1,
      titulo: "Fútbol 5",
      descripcion: "Ideal para grupos pequeños",
      jugadores: "5 jugadores",
      disponibles: 8,
      tipo: "futbol",
      icono: "⚽",
    },
    {
      id: 2,
      titulo: "Fútbol 7",
      descripcion: "Perfecto para partidos medianos",
      jugadores: "7 jugadores",
      disponibles: 5,
      tipo: "futbol",
      icono: "⚽",
    },
    {
      id: 3,
      titulo: "Fútbol 11",
      descripcion: "Cancha completa profesional",
      jugadores: "11 jugadores",
      disponibles: 3,
      tipo: "futbol",
      icono: "⚽",
    },
    {
      id: 4,
      titulo: "Vóley",
      descripcion: "Canchas de vóley disponibles",
      jugadores: "6 jugadores por lado",
      disponibles: 4,
      tipo: "voley",
      icono: "🏐",
    },
  ];

  const filtros = [
    { label: "Todas", value: "todas" },
    { label: "Fútbol", value: "futbol" },
    { label: "Vóley", value: "voley" },
    { label: "Más disponibles", value: "disponibles" },
  ];

  const canchasFiltradas = canchasData
    .filter((cancha) => {
      if (filtro === "todas") return true;
      if (filtro === "disponibles") return cancha.disponibles > 3;
      return cancha.tipo === filtro;
    })
    .sort((a, b) => b.disponibles - a.disponibles);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Selecciona tu cancha</h1>
      <p className={styles.subtitle}>
        Elige el tipo de cancha que deseas reservar
      </p>

      <div className={styles.filters}>
        {filtros.map((item) => (
          <button
            key={item.value}
            className={`${styles.filterBtn} ${
              filtro === item.value ? styles.active : ""
            }`}
            onClick={() => setFiltro(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {canchasFiltradas.map((cancha) => (
          <div 
            key={cancha.id} 
            className={styles.card}
            onClick={() => onSelectCourt?.(cancha)}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.icon}>{cancha.icono}</div>
              <span className={styles.badge}>
                {cancha.disponibles} disponibles
              </span>
            </div>

            <h3 className={styles.cardTitle}>{cancha.titulo}</h3>
            <p className={styles.cardDesc}>{cancha.descripcion}</p>

            <div className={styles.players}>
              👥 {cancha.jugadores}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courts;