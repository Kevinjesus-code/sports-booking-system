import { useState, useEffect, useMemo, useCallback } from "react";
import styles from "./customers.module.css";
import ClientTable from "../../../components/clients-table";
import { DSAText, DSAEmptyState, DSAButton, DSASearchBar, DSAToast, DSAClientModal, DSALoadingSpinner } from "../../../components";
import { clienteApi } from "../../../../infrastructure/api/cliente.api";

const Customers = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showClientModal, setShowClientModal] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  // ── Cargar clientes desde API ────────────────────
  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clienteApi.getAll();
      setClientes((data ?? []).map(c => ({
        id:       c.id,
        nombre:   `${c.nombre} ${c.apellido ?? ''}`.trim(),
        dni:      c.dni ?? '',
        email:    c.email ?? '',
        telefono: c.telefono ?? '',
        activo:   c.activo,
        reservas: 0, // TODO: Agregar endpoint para contar reservas
      })));
    } catch (err) {
      setToast({ visible: true, message: err.response?.data?.error ?? "Error al cargar clientes", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClientes(); }, [fetchClientes]);

  // ── Filtro: busca por nombre, email o teléfono ──────────
  const clientesFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q)   ||
        c.email.toLowerCase().includes(q)    ||
        c.telefono.includes(q)               ||
        c.dni?.includes(q)
    );
  }, [query, clientes]);

  const handleClientCreated = async (newClient) => {
    // Refetch from API to get the real data
    await fetchClientes();
    setToast({ visible: true, message: "Cliente registrado exitosamente", type: "success" });
  };

  if (loading) {
    return (
      <div className={styles["customers-screen"]} style={{ display: 'flex', justifyContent: 'center', paddingTop: '60px' }}>
        <DSALoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles["customers-screen"]}>

      {/* ── Encabezado ── */}
      <div className={styles["customers-header"]}>
        <div>
          <DSAText variant="title">Clientes</DSAText>
          <p className={styles["customers-sub"]}>
            {clientes.length} clientes registrados
          </p>
        </div>
        <div className={styles["headerAction"]}>
          <DSAButton onClick={() => setShowClientModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" width="16" height="16">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Crear Cliente
          </DSAButton>
        </div>
      </div>

      {/* ── Barra de búsqueda ── */}
      <DSASearchBar
        value={query}
        onChange={setQuery}
        placeholder="Buscar por nombre, DNI, email o teléfono..."
        resultsCount={query ? clientesFiltrados.length : null}
      />

      {/* ── Tabla ── */}
      {clientesFiltrados.length > 0 ? (
        <ClientTable data={clientesFiltrados} />
      ) : (
        <DSAEmptyState
          icon={
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
          title={query ? `No se encontró "${query}"` : "Sin clientes"}
          subtitle={query ? "Intenta con otro nombre, email o teléfono" : "No hay clientes registrados aún."}
          action={
            query ? (
              <DSAButton variant="outline" color="secondary" onClick={() => setQuery("")}>
                Limpiar búsqueda
              </DSAButton>
            ) : (
              <DSAButton onClick={() => setShowClientModal(true)}>
                Registrar primer cliente
              </DSAButton>
            )
          }
        />
      )}

      {/* ── Client Modal ── */}
      <DSAClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onCreated={handleClientCreated}
      />

      {/* ── Toast ── */}
      <DSAToast
        isVisible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default Customers;