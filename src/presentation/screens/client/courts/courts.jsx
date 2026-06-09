import { useState } from "react";
import styles from "./court.module.css";
import { DSACourtCard } from "../../../components";
import CourtModal from "../../../components/court-modal";

const Courts = ({ onSelectCourt }) => {
  const [modalCourt, setModalCourt] = useState(null);

  const COURT_TYPES = [
    {
      id: 1,
      name: "Fútbol 5 — Cancha A",
      image: "/assets/img/futbol5.png",
      price: 40,
      location: "San Miguel",
      address: "Av. La Marina 2345, San Miguel, Lima",
      surface: "Grass sintético",
      capacity: "10 jugadores",
      lighting: "Iluminación LED",
      covered: "Techada",
      size: "30 × 20 m",
      bathrooms: "Vestuarios incluidos",
      rules: [
        "Tolerancia máxima de 10 min de espera.",
        "Prohibido el ingreso con zapatos de calle.",
        "Cancelación gratis hasta 2 horas antes.",
        "Se requiere pago del 50% al reservar.",
      ],
    },
    {
      id: 2,
      name: "Fútbol 7 — Cancha B",
      image: "/assets/img/futbol7.png",
      price: 60,
      location: "Miraflores",
      address: "Calle Berlín 380, Miraflores, Lima",
      surface: "Grass híbrido",
      capacity: "14 jugadores",
      lighting: "Reflectores halógenos",
      covered: "Al aire libre",
      size: "50 × 30 m",
      bathrooms: "Baños compartidos",
      rules: [
        "Tolerancia de 5 minutos al inicio.",
        "Obligatorio usar tacos o zapatillas deportivas.",
        "No se permiten bebidas alcohólicas.",
        "Cancelación con 4 horas de anticipación.",
      ],
    },
    {
      id: 3,
      name: "Fútbol 11 — Cancha C",
      image: "/assets/img/futbol11.png",
      price: 100,
      location: "Surco",
      address: "Av. Primavera 1240, Santiago de Surco, Lima",
      surface: "Césped natural",
      capacity: "22 jugadores",
      lighting: "Sin iluminación nocturna",
      covered: "Al aire libre",
      size: "105 × 68 m",
      bathrooms: "Vestuarios completos",
      rules: [
        "Reserva mínima de 2 horas.",
        "Prohibido el uso de tacos en el área de vestuarios.",
        "El pago total se realiza al reservar.",
        "Devolución solo por lluvia intensa.",
      ],
    },
    {
      id: 4,
      name: "Vóley — Cancha D",
      image: "/assets/img/voley.png",
      price: 30,
      location: "Barranco",
      address: "Jr. Unión 890, Barranco, Lima",
      surface: "Parquet de madera",
      capacity: "12 jugadores",
      lighting: "Iluminación LED regulable",
      covered: "Techada",
      size: "18 × 9 m",
      bathrooms: "Baños privados",
      rules: [
        "Solo calzado de uso indoor.",
        "Máximo 2 equipos en espera.",
        "Cancelación gratis hasta 3 horas antes.",
        "Se admiten espectadores (máx. 20).",
      ],
    },
  ];

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

  return (
    <>
      {/* Tipos de canchas */}
      <h2 className={styles.sectionLabel}>Nuestras canchas</h2>
      <div className={styles.gridTypes}>
        {COURT_TYPES.map((court) => (
          <DSACourtCard
            key={court.id}
            court={court}
            onViewDetails={(c) => setModalCourt(c)}
            onReserve={(c) => onSelectCourt?.(c)}
          />
        ))}
      </div>

      {/* Beneficios */}
      <h2 className={styles.sectionLabel}>¿Por qué reservar con nosotros?</h2>
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
        <h2 className={styles.ctaTitle}>¿Listo para reservar?</h2>
        <p className={styles.ctaDesc}>
          Selecciona tu tipo de cancha favorito y encuentra el horario perfecto
        </p>
        <button className={styles.btnWhite}>
          Explorar canchas
          <svg width="16" height="16" fill="none" stroke="#19B55A" strokeWidth="2">
            <line x1="5" y1="3" x2="11" y2="8" />
            <line x1="5" y1="13" x2="11" y2="8" />
          </svg>
        </button>
      </div>

      {/* Modal de detalle de cancha */}
      {modalCourt && (
        <CourtModal
          court={modalCourt}
          onClose={() => setModalCourt(null)}
          onReserve={(c) => { setModalCourt(null); onSelectCourt?.(c); }}
        />
      )}
    </>
  );
};

export default Courts;