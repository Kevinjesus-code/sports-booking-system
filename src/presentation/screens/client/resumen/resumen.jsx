// presentation/screens/client/resumen/resumen.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import styles from "./resumen.module.css";

const Resumen = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const reservation = state?.reservation;

  // Redirigir si no hay datos de reserva
  if (!reservation) {
    navigate('/client/courts');
    return null;
  }

  // Manejadores de botones
  const handleNewReservation = () => {
    navigate('/client/schedules', { 
      state: { court: { id: reservation.courtId, name: reservation.courtName } } 
    });
  };

  const handleGoHome = () => {
    navigate('/client/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.successHeader}>
        <div className={styles.checkCircle}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className={styles.title}>¡Reserva confirmada!</h1>
        <p className={styles.subtitle}>Tu reserva ha sido registrada exitosamente</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>Detalles de la reserva</div>
        <div className={styles.cardBody}>
          
          <div className={styles.courtRow}>
            <div className={styles.courtIconBg}>{reservation.courtIcon || "⚽"}</div>
            <div className={styles.courtInfo}>
              <span className={styles.label}>Cancha</span>
              <span className={styles.value}>{reservation.courtName}</span>
            </div>
          </div>

          <div className={styles.gridRow}>
            <div className={styles.infoItem}>
              <div className={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className={styles.infoContent}>
                <span className={styles.label}>Fecha</span>
                <span className={styles.value}>{reservation.getFormattedDate()}</span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className={styles.infoContent}>
                <span className={styles.label}>Horario</span>
                <span className={styles.value}>{reservation.startTime} – {reservation.endTime}</span>
              </div>
            </div>
          </div>

          <div className={styles.contactRow}>
            <div className={styles.infoItem}>
              <div className={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className={styles.infoContent}>
                <span className={styles.label}>Estado</span>
                <span className={`${styles.value} ${styles.badge}`}>{reservation.status}</span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconContainer}>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>S/</span>
              </div>
              <div className={styles.infoContent}>
                <span className={styles.label}>Total Pagado</span>
                <span className={styles.value}>S/ {reservation.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={styles.confirmationBox}>
            <div className={styles.label}>Número de confirmación</div>
            <p className={styles.confNumber}>#{reservation.id}</p>
          </div>

        </div>
      </div>

      <div className={styles.nextSteps}>
        <h3 className={styles.nextStepsTitle}>¿Qué sigue?</h3>
        <ul className={styles.stepsList}>
          <li className={styles.stepItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Recibirás un SMS de confirmación en breve
          </li>
          <li className={styles.stepItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Te enviaremos un recordatorio 24 horas antes
          </li>
        </ul>
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.primaryBtn} onClick={handleGoHome}>Ir al inicio</button>
        <button className={styles.secondaryBtn} onClick={handleNewReservation}>Nueva reserva</button>
      </div>

    </div>
  );
};

export default Resumen;
