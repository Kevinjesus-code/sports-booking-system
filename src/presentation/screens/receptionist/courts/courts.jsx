import { useState, useCallback, useMemo } from "react";
import {
  DSAButton,
  DSAText,
  DSASelect,
  DSAToast,
  DSAEmptyState,
  DSASearchBar,
  DSACourtFormModal,
  DSACourtModal,
  DSALoadingSpinner,
} from "../../../components";
import styles from "./courts.module.css";
import { useCourts } from "../../../hooks/useCourts";

/* ── Status badge config ── */
const STATUS_CONFIG = {
  Disponible:    { class: "statusAvailable",    icon: "●" },
  Mantenimiento: { class: "statusMaintenance",  icon: "●" },
};

const PAGE_SIZE = 10;

const Courts = () => {
  const { courts, loading, error, createCourt, updateCourt, deleteCourt, refetch } = useCourts();
  const [query, setQuery] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [detailCourt, setDetailCourt] = useState(null);

  // Toast
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  // ── Filters ──
  const tipos = [...new Set(courts.map((c) => c.type).filter(Boolean))];
  const estados = [...new Set(courts.map((c) => c.state).filter(Boolean))];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courts.filter((c) => {
      const matchQuery = !q || c.nombre?.toLowerCase().includes(q) || c.type?.toLowerCase().includes(q) || c.location?.toLowerCase().includes(q);
      const matchTipo = !tipoFiltro || c.type === tipoFiltro;
      const matchEstado = !estadoFiltro || c.state === estadoFiltro;
      return matchQuery && matchTipo && matchEstado;
    });
  }, [courts, query, tipoFiltro, estadoFiltro]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // ── Create ──
  const handleCreate = useCallback(async (data) => {
    try {
      await createCourt(data);
      setShowFormModal(false);
      setToast({ visible: true, message: "Cancha creada exitosamente", type: "success" });
    } catch (err) {
      setToast({ visible: true, message: err.response?.data?.error ?? "Error al crear cancha", type: "error" });
    }
  }, [createCourt]);

  // ── Edit ──
  const openEdit = (court) => {
    setEditingCourt(court);
  };

  const handleEdit = useCallback(async (data) => {
    try {
      await updateCourt(data.id, data);
      setEditingCourt(null);
      setToast({ visible: true, message: "Cancha actualizada exitosamente", type: "success" });
    } catch (err) {
      setToast({ visible: true, message: err.response?.data?.error ?? "Error al actualizar cancha", type: "error" });
    }
  }, [updateCourt]);

  // ── Delete ──
  const handleDelete = async (court) => {
    if (window.confirm(`¿Estás seguro de eliminar "${court.nombre}"?`)) {
      try {
        await deleteCourt(court.id);
        setToast({ visible: true, message: "Cancha eliminada", type: "info" });
      } catch (err) {
        setToast({ visible: true, message: err.response?.data?.error ?? "Error al eliminar cancha", type: "error" });
      }
    }
  };

  // ── Toggle status quickly ──
  const toggleStatus = async (court) => {
    const next = court.state === "Disponible" ? "Mantenimiento" : "Disponible";
    try {
      await updateCourt(court.id, { ...court, state: next, disponible: next === "Disponible" });
      setToast({ visible: true, message: `Estado cambiado a ${next}`, type: "success" });
    } catch (err) {
      setToast({ visible: true, message: err.response?.data?.error ?? "Error al cambiar estado", type: "error" });
    }
  };

  // ── View detail ──
  const viewDetail = (court) => {
    setDetailCourt({
      ...court,
      name: court.nombre,
      price: court.precioPorHora,
      address: court.location,
    });
  };

  if (loading) {
    return (
      <div className={styles.screen} style={{ display: 'flex', justifyContent: 'center', paddingTop: '60px' }}>
        <DSALoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <DSAText variant="title">Canchas</DSAText>
          <DSAText variant="text" color="#6B7280">
            Gestiona las canchas deportivas · {courts.length} canchas
          </DSAText>
        </div>
        <div className={styles.headerAction}>
          <DSAButton onClick={() => setShowFormModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" width="16" height="16">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Crear Cancha
          </DSAButton>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <DSASearchBar
          value={query}
          onChange={(v) => { setQuery(v); setCurrentPage(1); }}
          placeholder="Buscar por nombre, tipo o ubicación..."
          resultsCount={query ? filtered.length : null}
        />
        <div className={styles.filters}>
          <div className={styles.filterItem}>
            <DSASelect
              value={tipoFiltro}
              onChange={(v) => { setTipoFiltro(v); setCurrentPage(1); }}
              options={[
                { value: "", label: "Todos los tipos" },
                ...tipos.map((t) => ({ value: t, label: t })),
              ]}
            />
          </div>
          <div className={styles.filterItem}>
            <DSASelect
              value={estadoFiltro}
              onChange={(v) => { setEstadoFiltro(v); setCurrentPage(1); }}
              options={[
                { value: "", label: "Todos los estados" },
                ...estados.map((e) => ({ value: e, label: e })),
              ]}
            />
          </div>
          {(tipoFiltro || estadoFiltro) && (
            <button
              className={styles.clearFilters}
              onClick={() => { setTipoFiltro(""); setEstadoFiltro(""); setCurrentPage(1); }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* ── Admin Table ── */}
      {filtered.length > 0 ? (
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cancha</th>
                  <th>Tipo</th>
                  <th>Ubicación</th>
                  <th>Precio</th>
                  <th>Capacidad</th>
                  <th>Estado</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((court) => (
                  <tr key={court.id}>
                    <td>
                      <div className={styles.courtCell}>
                        <div className={styles.courtThumb}>
                          {court.image ? (
                            <img src={court.image} alt={court.nombre} />
                          ) : (
                            <div className={styles.courtThumbPlaceholder}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="7" width="20" height="14" rx="2" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className={styles.courtName}>{court.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.typeChip}>{court.type}</span>
                    </td>
                    <td className={styles.locationCell}>{court.location || "—"}</td>
                    <td className={styles.priceCell}>S/ {court.precioPorHora}</td>
                    <td>{court.capacidad ? `${court.capacidad} jug.` : "—"}</td>
                    <td>
                      <button
                        className={`${styles.statusBadge} ${styles[STATUS_CONFIG[court.state]?.class || ""]}`}
                        onClick={() => toggleStatus(court)}
                        title="Clic para cambiar estado"
                      >
                        <span className={styles.statusDot}>{STATUS_CONFIG[court.state]?.icon}</span>
                        {court.state}
                      </button>
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button
                          className={`${styles.iconBtn} ${styles.viewBtn}`}
                          onClick={() => viewDetail(court)}
                          title="Ver detalle"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          className={`${styles.iconBtn} ${styles.editBtn}`}
                          onClick={() => openEdit(court)}
                          title="Editar cancha"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 21l3.5-1 11-11a2 2 0 0 0-3-3l-11 11L3 21z" />
                          </svg>
                        </button>
                        <button
                          className={`${styles.iconBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDelete(court)}
                          title="Eliminar cancha"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <span className={styles.pageInfo}>
                Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} de {filtered.length}
              </span>
              <div className={styles.pageButtons}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`${styles.pageBtn} ${currentPage === p ? styles.pageBtnActive : ""}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <DSAEmptyState
          icon={
            <svg viewBox="0 0 24 24">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <line x1="12" y1="7" x2="12" y2="21" />
              <circle cx="12" cy="14" r="2" />
            </svg>
          }
          title={query || tipoFiltro || estadoFiltro ? "Sin resultados" : "Sin canchas"}
          subtitle={query ? `No se encontraron canchas con "${query}"` : "No hay canchas registradas aún."}
          action={
            !query && !tipoFiltro && !estadoFiltro ? (
              <DSAButton onClick={() => setShowFormModal(true)}>Crear primera cancha</DSAButton>
            ) : (
              <DSAButton variant="outline" color="secondary"
                onClick={() => { setQuery(""); setTipoFiltro(""); setEstadoFiltro(""); }}>
                Limpiar filtros
              </DSAButton>
            )
          }
        />
      )}

      {/* ── Court Form Modal: Create ── */}
      <DSACourtFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSave={handleCreate}
      />

      {/* ── Court Form Modal: Edit ── */}
      <DSACourtFormModal
        isOpen={!!editingCourt}
        onClose={() => setEditingCourt(null)}
        onSave={handleEdit}
        court={editingCourt}
      />

      {/* ── Court Detail Modal ── */}
      {detailCourt && (
        <DSACourtModal
          court={detailCourt}
          onClose={() => setDetailCourt(null)}
          onReserve={() => setDetailCourt(null)}
        />
      )}

      {/* Toast */}
      <DSAToast
        isVisible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default Courts;
