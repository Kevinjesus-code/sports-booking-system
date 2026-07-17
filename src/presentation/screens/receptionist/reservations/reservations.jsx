import { useState, useMemo, useCallback, useEffect } from "react";
import styles from "./reservations.module.css";
import {
  DSAText,
  DSAReservationsTable,
  DSAButton,
  DSAModal,
  DSAInput,
  DSASelect,
  DSAToast,
  DSAEmptyState,
  DSASearchBar,
  DSALoadingSpinner,
  DSAClientModal,
} from "../../../components";
import { useAllReservations, useCreateReservation } from "../../../hooks/useReservations";
import { useCourts } from "../../../hooks/useCourts";
import { clienteApi } from "../../../../infrastructure/api/cliente.api";

/* ── Helpers de validación de fecha/hora ── */
const getTodayStr = () => new Date().toISOString().split("T")[0];

const getNowTimeStr = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

const validateDateTime = (fecha, horaInicio, horaFin) => {
  const errors = {};
  const today = getTodayStr();

  if (fecha && fecha < today) {
    errors.fecha = "No puedes seleccionar una fecha pasada";
  }

  if (horaInicio && horaFin && horaFin <= horaInicio) {
    errors.horaFin = "La hora fin debe ser posterior a la hora inicio";
  }

  if (fecha === today && horaInicio) {
    const now = getNowTimeStr();
    if (horaInicio < now) {
      errors.horaInicio = "La hora inicio debe ser posterior a la hora actual";
    }
  }

  return errors;
};

const ESTADO_FILTER = [
  { value: "", label: "Todos los estados" },
  { value: "pendiente", label: "Pendiente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "en_curso", label: "En curso" },
  { value: "finalizada", label: "Finalizada" },
  { value: "cancelada", label: "Cancelada" },
  { value: "no_asistio", label: "No asistió" },
];

const INITIAL_FORM = { dni: "", cliente: "", telefono: "", canchaId: "", fecha: "", horaInicio: "", horaFin: "", observaciones: "", metodoPago: "Efectivo" };

const METODO_PAGO_OPTIONS = [
  { value: "Efectivo", label: "Efectivo" },
  { value: "Yape", label: "Yape" },
  { value: "Plin", label: "Plin" },
  { value: "Transferencia", label: "Transferencia" },
  { value: "Tarjeta", label: "Tarjeta" },
];

const Reservations = () => {
  const [query, setQuery] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  const apiFilters = useMemo(
    () => ({
      ...(filtroFecha ? { fecha: filtroFecha } : {}),
      ...(filtroEstado ? { estado: filtroEstado } : {}),
    }),
    [filtroFecha, filtroEstado]
  );

  const { reservations, loading, error, refetch, updateEstado, reprogramar } = useAllReservations(apiFilters);
  const { create: createReservation, loading: creating } = useCreateReservation();
  const { courts } = useCourts();

  // ── Crear reserva (multi-step) ──
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [clienteFound, setClienteFound] = useState(null);
  const [clienteNotFound, setClienteNotFound] = useState(false);
  const [dniLoading, setDniLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showInlineClientModal, setShowInlineClientModal] = useState(false);

  // ── Detalle / Acciones ──
  const [selectedReservation, setSelectedReservation] = useState(null);

  // ── Editar fecha/hora ──
  const [editingReservation, setEditingReservation] = useState(null);
  const [editFecha, setEditFecha] = useState("");
  const [editHoraInicio, setEditHoraInicio] = useState("");
  const [editHoraFin, setEditHoraFin] = useState("");

  // ── Toast ──
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  // ── Opciones de canchas dinámicas ──
  const canchaOptions = useMemo(() =>
    courts.map(c => ({
      value: String(c.id),
      label: `${c.type} - ${c.nombre}`,
      precio: c.precioPorHora,
    })),
  [courts]);

  // ── Filtrado local (búsqueda texto); fecha/estado vienen del API cuando aplica ──
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reservations.filter((r) => {
      const matchQ =
        !q ||
        r.cliente?.toLowerCase().includes(q) ||
        r.telefono?.includes(q) ||
        String(r.id).includes(q) ||
        r.dni?.includes(q) ||
        r.codigo?.toLowerCase().includes(q);
      const matchEstado = !filtroEstado || r.estado === filtroEstado;
      const matchFecha = !filtroFecha || r.fecha === filtroFecha;
      return matchQ && matchEstado && matchFecha;
    });
  }, [reservations, query, filtroEstado, filtroFecha]);

  // ═══════════════════ CREAR RESERVA ═══════════════════

  const handleDNISearch = async () => {
    const d = form.dni.trim();
    if (!d || d.length < 8) {
      setFormErrors({ dni: "Ingresa un DNI válido (8 dígitos)" });
      return;
    }
    setDniLoading(true);
    setClienteNotFound(false);
    setFormErrors({});

    try {
      const found = await clienteApi.searchByDni(d);
      setClienteFound(found);
      setForm(prev => ({
        ...prev,
        cliente: `${found.nombre} ${found.apellido ?? ''}`.trim(),
        telefono: found.telefono ?? '',
        clienteId: found.id,
      }));
      setCreateStep(2);
    } catch (err) {
      if (err.response?.status === 404) {
        setClienteNotFound(true);
      } else {
        setFormErrors({ dni: err.response?.data?.error ?? "Error al buscar cliente" });
      }
    } finally {
      setDniLoading(false);
    }
  };

  const handleCreateReservation = useCallback(async () => {
    const errors = {};
    if (!form.canchaId) errors.cancha = "Selecciona una cancha";
    if (!form.fecha) errors.fecha = "Fecha requerida";
    if (!form.horaInicio) errors.horaInicio = "Hora inicio requerida";
    if (!form.horaFin) errors.horaFin = "Hora fin requerida";

    // Validaciones de fecha/hora lógicas
    const dtErrors = validateDateTime(form.fecha, form.horaInicio, form.horaFin);
    Object.assign(errors, dtErrors);

    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    try {
      const result = await createReservation({
        canchaId: Number(form.canchaId),
        clienteId: form.clienteId ?? null,
        fecha: form.fecha,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
        metodoPago: form.metodoPago || "Efectivo",
        estado: "pendiente",
      });
      closeCreate();
      refetch();
      setToast({ visible: true, message: `Reserva creada. Código: ${result.codigo}`, type: "success" });
    } catch (err) {
      setToast({ visible: true, message: err.response?.data?.error ?? "Error al crear reserva", type: "error" });
    }
  }, [form, createReservation, refetch]);

  // ── Inline client creation callback ──
  const handleInlineClientCreated = (newClient) => {
    setShowInlineClientModal(false);
    setClienteNotFound(false);
    // Set the newly created client as the found client
    const found = {
      id: newClient.id,
      nombre: newClient.nombre?.split(' ')[0] ?? newClient.nombre,
      apellido: newClient.nombre?.split(' ').slice(1).join(' ') ?? '',
      dni: newClient.dni,
      email: newClient.email,
      telefono: newClient.telefono,
    };
    setClienteFound(found);
    setForm(prev => ({
      ...prev,
      cliente: newClient.nombre,
      telefono: newClient.telefono ?? '',
      clienteId: newClient.id,
    }));
    setCreateStep(2);
    setToast({ visible: true, message: "Cliente creado exitosamente", type: "success" });
  };

  const closeCreate = () => {
    setShowCreateModal(false);
    setCreateStep(1);
    setForm(INITIAL_FORM);
    setClienteFound(null);
    setClienteNotFound(false);
    setFormErrors({});
  };

  // ═══════════════════ ACCIONES POR ESTADO ═══════════════════

  const handleConfirm = async (r) => {
    try {
      await updateEstado(r.id, "confirmada");
      setSelectedReservation(null);
      setToast({ visible: true, message: "Reserva confirmada", type: "success" });
    } catch (err) {
      setToast({ visible: true, message: err.response?.data?.error ?? "Error al confirmar", type: "error" });
    }
  };

  const handleCancel = async (r) => {
    try {
      await updateEstado(r.id, "cancelada");
      setSelectedReservation(null);
      setToast({ visible: true, message: "Reserva cancelada", type: "info" });
    } catch (err) {
      setToast({ visible: true, message: err.response?.data?.error ?? "Error al cancelar", type: "error" });
    }
  };

  const openEdit = (r) => {
    if (r.estado !== "pendiente" && r.estado !== "confirmada") return;
    setEditingReservation(r);
    setEditFecha(r.fecha ?? '');
    setEditHoraInicio(r.startTime ?? r.hora?.split(' - ')[0] ?? '');
    setEditHoraFin(r.endTime ?? r.hora?.split(' - ')[1] ?? '');
  };

  const handleSaveEdit = async () => {
    if (!editFecha || !editHoraInicio || !editHoraFin) return;

    // Validación de fecha/hora al reprogramar
    const dtErrors = validateDateTime(editFecha, editHoraInicio, editHoraFin);
    if (Object.keys(dtErrors).length > 0) {
      setToast({ visible: true, message: Object.values(dtErrors)[0], type: "error" });
      return;
    }

    try {
      await reprogramar(editingReservation.id, {
        fecha: editFecha,
        horaInicio: editHoraInicio,
        horaFin: editHoraFin,
      });
      setEditingReservation(null);
      setToast({ visible: true, message: "Fecha y hora actualizadas", type: "success" });
    } catch (err) {
      setToast({ visible: true, message: err.response?.data?.error ?? "Error al reprogramar", type: "error" });
    }
  };

  // ═══════════════════ RENDER ═══════════════════

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
          <DSAText variant="title">Reservas </DSAText>
          <DSAText variant="text" color="#6B7280">
            Administra y supervisa las reservas programadas
          </DSAText>
        </div>
        <div className={styles.headerAction}>
          <DSAButton onClick={() => setShowCreateModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" width="16" height="16">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Crear Reserva
          </DSAButton>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <DSASearchBar
          value={query}
          onChange={setQuery}
          placeholder="Buscar por nombre, DNI, teléfono o código..."
          resultsCount={query ? filtered.length : null}
        />
        <div className={styles.filters}>
          <div className={styles.filterItem}>
            <DSASelect value={filtroEstado} onChange={setFiltroEstado} options={ESTADO_FILTER} />
          </div>
          <div className={styles.filterItem}>
            <input type="date" className={styles.dateInput} value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} />
          </div>
          {(filtroEstado || filtroFecha) && (
            <button className={styles.clearFilters} onClick={() => { setFiltroEstado(""); setFiltroFecha(""); }}>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      {filtered.length > 0 ? (
        <DSAReservationsTable
          data={filtered}
          showActions
          onView={item => setSelectedReservation(item)}
          onEdit={item => openEdit(item)}
        />
      ) : (
        <DSAEmptyState
          icon={<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
          title={query || filtroEstado || filtroFecha ? "Sin resultados" : "Sin reservas futuras"}
          subtitle={query ? `No se encontraron reservas con "${query}"` : "No hay reservas pendientes ni confirmadas."}
          action={
            query || filtroEstado || filtroFecha
              ? <DSAButton variant="outline" color="secondary" onClick={() => { setQuery(""); setFiltroEstado(""); setFiltroFecha(""); }}>Limpiar filtros</DSAButton>
              : <DSAButton onClick={() => setShowCreateModal(true)}>Crear primera reserva</DSAButton>
          }
        />
      )}

      {/* ══════════ MODAL: CREAR RESERVA (Multi-step) ══════════ */}
      <DSAModal
        isOpen={showCreateModal}
        onClose={closeCreate}
        title="Crear Reserva"
        subtitle={createStep === 1 ? "Paso 1 · Identificar cliente" : createStep === 2 ? "Paso 2 · Datos del cliente" : "Paso 3 · Seleccionar cancha y horario"}
        size="lg"
        footer={
          <>
            <DSAButton variant="outline" color="secondary" onClick={createStep > 1 ? () => setCreateStep(s => s - 1) : closeCreate}>
              {createStep > 1 ? "Atrás" : "Cancelar"}
            </DSAButton>
            {createStep === 1 && (
              <DSAButton onClick={handleDNISearch} disabled={dniLoading}>
                {dniLoading ? "Buscando..." : "Buscar cliente"}
              </DSAButton>
            )}
            {createStep === 2 && (
              <DSAButton onClick={() => setCreateStep(3)}>
                Continuar
              </DSAButton>
            )}
            {createStep === 3 && (
              <DSAButton onClick={handleCreateReservation} disabled={creating}>
                {creating ? "Creando..." : "Crear Reserva"}
              </DSAButton>
            )}
          </>
        }
      >
        {/* STEP 1: DNI */}
        {createStep === 1 && (
          <div className={styles.stepContent}>
            <div className={styles.stepIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" width="40" height="40">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <circle cx="9" cy="11" r="2.5" />
                <path d="M5 18c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5" />
                <line x1="15" y1="9" x2="19" y2="9" />
                <line x1="15" y1="13" x2="19" y2="13" />
              </svg>
            </div>
            <DSAInput
              label="DNI del cliente *"
              placeholder="Ingresa el DNI de 8 dígitos"
              value={form.dni}
              onChange={v => { setForm(p => ({ ...p, dni: v })); setClienteNotFound(false); setFormErrors({}); }}
            />
            {formErrors.dni && <div className={styles.errorMsg}>{formErrors.dni}</div>}
            {clienteNotFound && (
              <div className={styles.notFoundCard}>
                <div className={styles.notFoundIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <p className={styles.notFoundTitle}>Cliente no encontrado</p>
                  <p className={styles.notFoundSub}>El DNI <strong>{form.dni}</strong> no está registrado en el sistema.</p>
                </div>
                <DSAButton variant="outline" color="primary" onClick={() => setShowInlineClientModal(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Crear cliente
                </DSAButton>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Client data (auto-filled) */}
        {createStep === 2 && clienteFound && (
          <div className={styles.stepContent}>
            <div className={styles.clientCard}>
              <div className={styles.clientCardAvatar}>
                {clienteFound.nombre?.charAt(0)}{clienteFound.apellido?.charAt(0)}
              </div>
              <div>
                <div className={styles.clientCardName}>{clienteFound.nombre} {clienteFound.apellido}</div>
                <div className={styles.clientCardMeta}>DNI: {clienteFound.dni} · {clienteFound.telefono}</div>
                <div className={styles.clientCardMeta}>{clienteFound.email}</div>
                {clienteFound.penalizacion > 0 && (
                  <div style={{ color: '#dc2626', fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>
                    ⚠️ Penalidad pendiente: S/ {clienteFound.penalizacion}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Court + Schedule */}
        {createStep === 3 && (
          <div className={styles.stepContent}>
            <DSASelect
              label="Cancha *"
              placeholder="Selecciona una cancha"
              value={form.canchaId}
              onChange={v => { setForm(p => ({ ...p, canchaId: v })); if (formErrors.cancha) setFormErrors(p => ({ ...p, cancha: "" })); }}
              options={canchaOptions}
              error={formErrors.cancha}
            />
            <DSAInput
              label="Fecha *"
              type="date"
              value={form.fecha}
              min={getTodayStr()}
              onChange={v => {
                setForm(p => ({ ...p, fecha: v }));
                if (formErrors.fecha) setFormErrors(p => ({ ...p, fecha: "" }));
              }}
              error={formErrors.fecha}
            />
            <DSAInput
              label="Hora inicio *"
              type="time"
              value={form.horaInicio}
              onChange={v => {
                setForm(p => ({ ...p, horaInicio: v }));
                if (formErrors.horaInicio) setFormErrors(p => ({ ...p, horaInicio: "" }));
              }}
              error={formErrors.horaInicio}
            />
            <DSAInput
              label="Hora fin *"
              type="time"
              value={form.horaFin}
              onChange={v => {
                setForm(p => ({ ...p, horaFin: v }));
                if (formErrors.horaFin) setFormErrors(p => ({ ...p, horaFin: "" }));
              }}
              error={formErrors.horaFin}
            />
            <DSASelect
              label="Método de pago"
              value={form.metodoPago}
              onChange={v => setForm(p => ({ ...p, metodoPago: v }))}
              options={METODO_PAGO_OPTIONS}
            />
            <DSAInput
              label="Observaciones"
              placeholder="Notas adicionales (opcional)"
              value={form.observaciones}
              onChange={v => setForm(p => ({ ...p, observaciones: v }))}
            />
            {Object.keys(formErrors).length > 0 && (
              <div className={styles.errorMsg}>
                {formErrors.fecha || formErrors.horaInicio || formErrors.horaFin || formErrors.cancha || "Completa todos los campos requeridos"}
              </div>
            )}
          </div>
        )}

        {/* Step indicators */}
        <div className={styles.stepIndicator}>
          {[1, 2, 3].map(s => (
            <div key={s} className={`${styles.stepDot} ${createStep >= s ? styles.stepDotActive : ""}`}>
              {s}
            </div>
          ))}
        </div>
      </DSAModal>

      {/* ══════════ MODAL: DETALLE DE RESERVA ══════════ */}
      <DSAModal
        isOpen={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
        title={`Reserva ${selectedReservation?.codigo || ""}`}
        subtitle="Detalle completo de la reserva"
        size="md"
        footer={
          selectedReservation && (
            <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "flex-end" }}>
              {selectedReservation.estado === "pendiente" && (
                <>
                  <DSAButton variant="outline" color="secondary" onClick={() => handleCancel(selectedReservation)}>
                    Cancelar Reserva
                  </DSAButton>
                  <DSAButton color="primary" onClick={() => handleConfirm(selectedReservation)}>
                    ✓ Confirmar Reserva
                  </DSAButton>
                </>
              )}
              {selectedReservation.estado === "confirmada" && (
                <DSAButton variant="outline" color="secondary" onClick={() => handleCancel(selectedReservation)}>
                  Cancelar Reserva
                </DSAButton>
              )}
            </div>
          )
        }
      >
        {selectedReservation && (
          <div className={styles.detailContainer}>
            {/* Status banner */}
            <div className={`${styles.statusBanner} ${styles[`banner-${selectedReservation.estado}`]}`}>
              <span className={styles.statusBannerIcon}>
                {selectedReservation.estado === "confirmada" ? "✓" : selectedReservation.estado === "pendiente" ? "◷" : "✕"}
              </span>
              <div className={styles.statusBannerText}>
                <span className={styles.statusBannerTitle}>{selectedReservation.estado === "confirmada" ? "Reserva Confirmada" : selectedReservation.estado === "pendiente" ? "Reserva Pendiente" : "Reserva Cancelada"}</span>
                <span className={styles.statusBannerSub}>Código: {selectedReservation.codigo}</span>
              </div>
              <span className={`${styles.detailBadge} ${styles[`detail-${selectedReservation.estado}`]}`}>{selectedReservation.estado}</span>
            </div>

            {/* Client section */}
            <div className={styles.detailSection}>
              <div className={styles.detailSectionHeader}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Cliente</span>
              </div>
              <div className={styles.detailCards}>
                <div className={styles.detailCard}>
                  <span className={styles.detailCardLabel}>Nombre</span>
                  <span className={styles.detailCardValue}>{selectedReservation.cliente}</span>
                </div>
                {selectedReservation.dni && (
                  <div className={styles.detailCard}>
                    <span className={styles.detailCardLabel}>DNI</span>
                    <span className={styles.detailCardValue}>{selectedReservation.dni}</span>
                  </div>
                )}
                <div className={styles.detailCard}>
                  <span className={styles.detailCardLabel}>Teléfono</span>
                  <span className={styles.detailCardValue}>{selectedReservation.telefono}</span>
                </div>
              </div>
            </div>

            {/* Schedule section */}
            <div className={styles.detailSection}>
              <div className={styles.detailSectionHeader}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Horario y cancha</span>
              </div>
              <div className={styles.detailCards}>
                <div className={styles.detailCard}>
                  <span className={styles.detailCardLabel}>Cancha</span>
                  <span className={styles.detailCardValue}>{selectedReservation.cancha}</span>
                </div>
                <div className={styles.detailCard}>
                  <span className={styles.detailCardLabel}>Fecha</span>
                  <span className={styles.detailCardValue}>{selectedReservation.fecha}</span>
                </div>
                <div className={styles.detailCard}>
                  <span className={styles.detailCardLabel}>Horario</span>
                  <span className={styles.detailCardValue}>{selectedReservation.hora}</span>
                </div>
              </div>
            </div>

            {/* Financial section */}
            <div className={styles.detailSection}>
              <div className={styles.detailSectionHeader}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span>Pago</span>
              </div>
              <div className={styles.priceHighlight}>
                <span className={styles.priceLabel}>
                  {selectedReservation.estado === "confirmada" ? "Monto pagado" : "Total a pagar"}
                </span>
                <span className={styles.priceAmount}>S/ {selectedReservation.precio}.00</span>
              </div>
            </div>

            {/* Info note */}
            <div className={styles.infoNote}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              Para cambiar de cancha, cancela esta reserva y crea una nueva.
            </div>
          </div>
        )}
      </DSAModal>

      {/* ══════════ MODAL: EDITAR FECHA/HORA ══════════ */}
      <DSAModal
        isOpen={!!editingReservation}
        onClose={() => setEditingReservation(null)}
        title="Reprogramar Reserva"
        subtitle={`${editingReservation?.codigo || ""} · ${editingReservation?.cliente || ""}`}
        size="sm"
        footer={
          <>
            <DSAButton variant="outline" color="secondary" onClick={() => setEditingReservation(null)}>Cancelar</DSAButton>
            <DSAButton onClick={handleSaveEdit}>Guardar cambios</DSAButton>
          </>
        }
      >
        <DSAInput label="Nueva fecha" type="date" value={editFecha} min={getTodayStr()} onChange={setEditFecha} />
        <DSAInput label="Hora inicio" type="time" value={editHoraInicio} onChange={setEditHoraInicio} />
        <DSAInput label="Hora fin" type="time" value={editHoraFin} onChange={setEditHoraFin} />
        {(() => {
          const dtErrors = validateDateTime(editFecha, editHoraInicio, editHoraFin);
          const firstError = Object.values(dtErrors)[0];
          return firstError ? (
            <div className={styles.errorMsg}>{firstError}</div>
          ) : null;
        })()}
        <div className={styles.infoNote}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
          Solo se puede editar la fecha y hora. La cancha no puede cambiarse.
        </div>
      </DSAModal>

      {/* ══════════ MODAL: CREAR CLIENTE INLINE ══════════ */}
      <DSAClientModal
        isOpen={showInlineClientModal}
        onClose={() => setShowInlineClientModal(false)}
        onCreated={handleInlineClientCreated}
      />

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

export default Reservations;
