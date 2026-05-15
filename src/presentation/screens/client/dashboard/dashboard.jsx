import styles from "./dashboard.module.css";
import { useState } from "react";
import { DSACourtCard } from "../../../components";
import { useCourts } from "../../../hooks/useCourts";

const Dashboard = () => {
  const USERNAME = "Usuario";
  const { courts, loading, error } = useCourts();



  const BENEFITS = [
    {
      id: 1,
      icon: (
        <svg width="24" height="24" fill="none" stroke="#111827" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      title: "Reserva rápida",
      description: "Elige tu horario en segundos",
    },
    {
      id: 2,
      icon: (
        <svg width="24" height="24" fill="none" stroke="#111827" strokeWidth="2">
          <circle cx="9" cy="7" r="4" />
          <path d="M17 11c2.21 0 4 1.79 4 4v1H13v-1c0-2.21 1.79-4 4-4z" />
          <path d="M1 20v-1c0-2.21 1.79-4 4-4h4" />
        </svg>
      ),
      title: "Para todos",
      description: "Diferentes tipos de canchas",
    },
    {
      id: 3,
      icon: (
        <svg width="24" height="24" fill="none" stroke="#111827" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      title: "Confirmación instantánea",
      description: "Recibe tu reserva al momento",
    },
  ];

  const [query, setQuery] = useState("");

  return (
    <main className={styles.wrapper}>
      {/* Bienvenida */}
      <section>
        <h1 className={styles.welcomeTitle}>
          Hola, {USERNAME} 👋🏻
        </h1>
        <p className={styles.welcomeSub}>
          Reserva tu cancha fácilmente
        </p>
      </section>

      {/* Búsqueda */}
      <div className={styles.searchBox}>
        {/* 🔍 Search SVG */}
        <svg width="18" height="18" fill="none" stroke="#94a3b8" strokeWidth="2">
          <circle cx="8" cy="8" r="6" />
          <line x1="13" y1="13" x2="17" y2="17" />
        </svg>

        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar por tipo de cancha, fecha u horario..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Tipos de canchas */}
      <h2 className={styles.sectionLabel}>Tipos de canchas</h2>
      {loading && <p>Cargando canchas...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && courts.length === 0 && <p>No hay canchas disponibles.</p>}
      <div className={styles.gridTypes}>
        {courts.slice(0, 4).map((court) => (
          <DSACourtCard key={court.id} court={court} />
        ))}
      </div>

      {/* Beneficios */}
      <h2 className={styles.sectionLabel}>
        ¿Por qué reservar con nosotros?
      </h2>
      <div className={styles.gridBenefits}>
        {BENEFITS.map((b) => (
          <div key={b.id} className={styles.benefitCard}>
            <div className={styles.bIcon}>{b.icon}</div>
            <h3 className={styles.benefitTitle}>{b.title}</h3>
            <p className={styles.benefitDesc}>{b.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className={styles.ctaGreen}>
        <h2 className={styles.ctaTitle}>¿Listo para reservar? xssxsxsx</h2>
        <p className={styles.ctaDesc}>
          Selecciona tu tipo de cancha favorito y encuentra el horario
          perfecto
        </p>

        <button className={styles.btnWhite}>
          Explorar canchas

          {/* ➡️ Arrow SVG */}
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="#28bc6b"
            strokeWidth="2"
          >
            <line x1="5" y1="3" x2="11" y2="8" />
            <line x1="5" y1="13" x2="11" y2="8" />
          </svg>
        </button>
      </div>
    </main>
  );
};

export default Dashboard;