import styles from "./confirm-reserve.module.css";
import { useState } from "react";

const ConfirmReserve = ({ court, schedule, date, onBack, onConfirm }) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm({
        nombre: nombre || "Juan",
        telefono: telefono || "912123123",
        observaciones
      });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className={styles.title}>Confirmar reserva</h1>
          <p className={styles.subtitle}>Completa tus datos para reservar</p>
        </div>
      </header>

      <section className={styles.summaryCard}>
        <div className={styles.summaryTitle}>Resumen de tu reserva</div>
        <div className={styles.summaryCourt}>
          <div className={styles.courtIcon}>{court?.icono || "⚽"}</div>
          {court?.titulo || "Cancha seleccionada"}
        </div>
        <div className={styles.summaryDetails}>
          <div className={styles.detailItem}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {date || "2026-04-10"}
          </div>
          <div className={styles.detailItem}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {schedule?.time || "00:00 - 00:00"}
          </div>
        </div>
      </section>

      <section className={styles.formContainer}>
        <h2 className={styles.formTitle}>Datos de contacto</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Nombre completo
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Juan Pérez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Teléfono
          </label>
          <input
            type="tel"
            className={styles.input}
            placeholder="+34 600 000 000"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Observaciones (opcional)
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Agrega cualquier comentario adicional..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          ></textarea>
        </div>
      </section>

      <div className={styles.actions}>
        <button className={styles.cancelBtn} onClick={onBack}>
          Cancelar
        </button>
        <button
          className={styles.confirmBtn}
          onClick={handleConfirm}
        >
          Confirmar reserva
        </button>
      </div>

      <div className={styles.note}>
        Nota: Recibirás una confirmación por SMS y correo electrónico con los detalles de tu reserva.
      </div>
    </div>
  );
};

export default ConfirmReserve;