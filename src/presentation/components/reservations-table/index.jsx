import styles from "./reservation-table.module.css";

const STATUS_CONFIG = {
  pendiente:   { label: "Pendiente",   className: "status-yellow"  },
  confirmada:  { label: "Confirmada",  className: "status-green"   },
  cancelada:   { label: "Cancelada",   className: "status-red"     },
  completada:  { label: "Completada",  className: "status-blue"    },
  en_curso:    { label: "En curso",    className: "status-purple"  },
  finalizada:  { label: "Finalizada",  className: "status-blue"    },
  no_asistio:  { label: "No asistió",  className: "status-gray"    },
  disponible:  { label: "Disponible",  className: "status-green"   },
  ocupado:     { label: "Ocupado",     className: "status-red"     },
};

const ReservationsTable = ({ data = [], onView, onEdit, showActions = false, renderActions }) => {
  const getStatus = (estado) => STATUS_CONFIG[estado] ?? { label: estado, className: "" };

  return (
    <div className={styles["table-card"]}>
      <div className={styles["table-wrapper"]}>
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cancha</th>
              <th>Estado</th>
              {showActions && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const st = getStatus(item.estado);
              return (
                <tr key={item.id}>
                  <td>
                    <div className={styles["client-cell"]}>
                      <span className={styles["client-name"]}>{item.cliente}</span>
                      {item.telefono && (
                        <span className={styles["client-phone"]}>{item.telefono}</span>
                      )}
                    </div>
                  </td>
                  <td>{item.fecha}</td>
                  <td>{item.hora}</td>
                  <td>{item.cancha}</td>
                  <td>
                    <span className={`${styles.status} ${styles[st.className] || ""}`}>
                      {st.label}
                    </span>
                  </td>
                  {showActions && (
                    <td className={styles.actions}>
                      {renderActions ? renderActions(item) : (
                        <>
                          <button
                            className={`${styles["action-btn"]} ${styles["action-view"]}`}
                            onClick={() => onView?.(item)}
                            title="Ver detalles"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                              strokeWidth="2" strokeLinecap="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          {(item.estado === "pendiente" || item.estado === "confirmada") && (
                            <button
                              className={`${styles["action-btn"]} ${styles["action-edit"]}`}
                              onClick={() => onEdit?.(item)}
                              title="Editar reserva"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsTable;