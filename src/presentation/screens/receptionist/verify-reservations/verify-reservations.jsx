import { useState, useEffect, useCallback } from "react";
import styles from "./verify-reservations.module.css";
import {
  DSAText,
  DSAInput,
  DSAButton,
  DSAReservationsTable,
  DSAEmptyState,
  DSALoadingSpinner,
} from "../../../components";
import { useAllReservations } from "../../../hooks/useReservations";

const TODAY = new Date().toISOString().slice(0, 10);

const VerifyReservations = () => {
  const { reservations, loading, error, refetch, updateEstado } = useAllReservations(TODAY);
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Timer para reloj
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Auto-marcar como finalizada o no_asistió (lógica basada en tiempo)
  useEffect(() => {
    const now = new Date();
    reservations.forEach(async (r) => {
      const [, horaFinStr] = (r.hora ?? '').split(' - ');
      if (!horaFinStr) return;
      const [hfH, hfM] = horaFinStr.split(':').map(Number);
      const endTime = new Date();
      endTime.setHours(hfH, hfM, 0, 0);

      if (now >= endTime) {
        if (r.estado === 'en_curso') {
          try { await updateEstado(r.id, 'finalizada'); } catch { /* silent */ }
        } else if (r.estado === 'confirmada') {
          try { await updateEstado(r.id, 'no_asistio'); } catch { /* silent */ }
        }
      }
    });
  }, [currentTime]); // re-check periodically

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    setSearchError("");
    setSearchResult(null);

    if (!q) {
      setSearchError("Ingresa un código de reserva.");
      return;
    }

    const normalizedCode = q.replace(/\s+/g, "").toUpperCase();
    const found = reservations.find(r => r.codigo?.toUpperCase() === normalizedCode);

    if (found) {
      setSearchResult(found);
    } else {
      setSearchError("No se encontró ninguna reserva para hoy con ese código.");
    }
  };

  const handleStartReservation = async () => {
    if (!searchResult) return;
    try {
      const updated = await updateEstado(searchResult.id, "en_curso");
      setSearchResult(updated);
    } catch (err) {
      setSearchError(err.response?.data?.error ?? "Error al iniciar la reserva");
    }
  };

  // Validar si se puede iniciar
  const canStart = () => {
    if (!searchResult || searchResult.estado !== "confirmada") return false;

    const [horaInicioStr] = (searchResult.hora ?? '').split(" - ");
    if (!horaInicioStr) return false;
    const [hiH, hiM] = horaInicioStr.split(":").map(Number);

    const now = new Date(currentTime);
    const startTime = new Date(currentTime);
    startTime.setHours(hiH, hiM, 0, 0);

    return now >= startTime;
  };

  const listToRender = reservations.filter(r => ["en_curso", "finalizada", "no_asistio"].includes(r.estado));

  if (loading) {
    return (
      <div className={styles.screen} style={{ display: 'flex', justifyContent: 'center', paddingTop: '60px' }}>
        <DSALoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div>
          <DSAText variant="title">Verificar Reservas</DSAText>
          <DSAText variant="text" color="#6B7280">
            Ingresa el código entregado al generar la reserva.
          </DSAText>
        </div>
      </div>

      <div className={styles.searchSection}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchInputWrapper}>
            <DSAInput
              placeholder="Ej: RSV-000103"
              value={query}
              onChange={setQuery}
            />
          </div>
          <DSAButton type="submit" className={styles.searchBtn}>
             Buscar
          </DSAButton>
        </form>

        {searchError && (
          <div className={styles.errorMsg}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {searchError}
          </div>
        )}

        {searchResult && (
          <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <h3 className={styles.resultTitle}>{searchResult.codigo}</h3>
              <span className={`${styles.badge} ${styles[`badge-${searchResult.estado}`]}`}>
                {searchResult.estado.replace("_", " ")}
              </span>
            </div>

            <div className={styles.resultBody}>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Código</span>
                  <span className={styles.resultValue}>{searchResult.codigo}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Cliente</span>
                  <span className={styles.resultValue}>{searchResult.cliente}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Cancha</span>
                  <span className={styles.resultValue}>{searchResult.cancha}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Horario</span>
                  <span className={styles.resultValue}>{searchResult.hora}</span>
                </div>
              </div>

              <div className={styles.resultActions}>
                {searchResult.estado === "confirmada" && (
                  <>
                    {!canStart() && (
                      <div className={styles.warningMsg}>
                        Aún no es la hora de inicio de esta reserva.
                      </div>
                    )}
                    <DSAButton
                      onClick={handleStartReservation}
                      disabled={!canStart()}
                      className={styles.startBtn}
                    >
                      Iniciar Reserva
                    </DSAButton>
                  </>
                )}
                {searchResult.estado === "en_curso" && (
                   <div className={styles.infoMsg}>
                     Esta reserva está actualmente en curso. Finalizará automáticamente.
                   </div>
                )}
                 {searchResult.estado === "pendiente" && (
                   <div className={styles.warningMsg}>
                     Esta reserva está pendiente de confirmación o pago. Confírmala en la sección de Reservas.
                   </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.tableSection}>
        <DSAText variant="subtitle" style={{marginBottom: '16px', display: 'block', fontWeight: 600}}>
          Historial del día
        </DSAText>
        {listToRender.length > 0 ? (
          <DSAReservationsTable data={listToRender} showActions={false} />
        ) : (
          <DSAEmptyState
            title="Sin registros"
            subtitle="No hay reservas en curso, finalizadas o inasistencias hoy."
            icon={<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          />
        )}
      </div>
    </div>
  );
};

export default VerifyReservations;
