import { useState, useMemo } from "react";
import "./customers.css";
import ClientTable from "../../../components/clients-table";

// ─── Datos mock — reemplaza con useEffect + fetch cuando tengas API ───
const CLIENTES_MOCK = [
  { id: 1,  nombre: "Juan Pérez",      telefono: "+51 987 654 321", email: "juan@gmail.com",    reservas: 8  },
  { id: 2,  nombre: "María González",  telefono: "+51 912 345 678", email: "maria@gmail.com",   reservas: 3  },
  { id: 3,  nombre: "Luis Torres",     telefono: "+51 945 123 456", email: "luis@gmail.com",    reservas: 12 },
  { id: 4,  nombre: "Carlos Ramos",    telefono: "+51 967 891 234", email: "carlos@gmail.com",  reservas: 1  },
  { id: 5,  nombre: "Ana Flores",      telefono: "+51 934 567 890", email: "ana@gmail.com",     reservas: 5  },
  { id: 6,  nombre: "Pedro Castillo",  telefono: "+51 901 234 567", email: "pedro@gmail.com",   reservas: 0  },
  { id: 7,  nombre: "Rosa Huanca",     telefono: "+51 978 345 612", email: "rosa@gmail.com",    reservas: 7  },
  { id: 8,  nombre: "Diego Mamani",    telefono: "+51 956 781 234", email: "diego@gmail.com",   reservas: 2  },
  { id: 9,  nombre: "Lucía Vargas",    telefono: "+51 923 456 789", email: "lucia@gmail.com",   reservas: 9  },
  { id: 10, nombre: "Marcos Quispe",   telefono: "+51 911 222 333", email: "marcos@gmail.com",  reservas: 4  },
];

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    width="16" height="16">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    width="14" height="14">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const Customers = () => {
  const [query, setQuery] = useState("");

  // ── Filtro: busca por nombre, email o teléfono ──────────
  const clientesFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CLIENTES_MOCK;
    return CLIENTES_MOCK.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q)   ||
        c.email.toLowerCase().includes(q)    ||
        c.telefono.includes(q)
    );
  }, [query]);

  return (
    <div className="customers-screen">

      {/* ── Encabezado ── */}
      <div className="customers-header">
        <div>
          <h2 className="customers-title">Clientes</h2>
          <p className="customers-sub">
            {CLIENTES_MOCK.length} clientes registrados
          </p>
        </div>
      </div>

      {/* ── Barra de búsqueda ── */}
      <div className="customers-toolbar">
        <div className="search-box">
          <span className="search-box-icon"><SearchIcon /></span>
          <input
            type="text"
            className="search-box-input"
            placeholder="Buscar por nombre, email o teléfono..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="search-box-clear"
              onClick={() => setQuery("")}
              aria-label="Limpiar búsqueda"
            >
              <ClearIcon />
            </button>
          )}
        </div>

        {/* Contador de resultados cuando hay búsqueda activa */}
        {query && (
          <span className="search-results-count">
            {clientesFiltrados.length === 0
              ? "Sin resultados"
              : `${clientesFiltrados.length} resultado${clientesFiltrados.length !== 1 ? "s" : ""}`}
          </span>
        )}
      </div>

      {/* ── Tabla ── */}
      {clientesFiltrados.length > 0 ? (
        <ClientTable data={clientesFiltrados} />
      ) : (
        <div className="customers-empty">
          <div className="customers-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              width="40" height="40">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <p className="customers-empty-title">
            No se encontró "{query}"
          </p>
          <p className="customers-empty-sub">
            Intenta con otro nombre, email o teléfono
          </p>
          <button
            className="customers-empty-btn"
            onClick={() => setQuery("")}
          >
            Limpiar búsqueda
          </button>
        </div>
      )}

    </div>
  );
};

export default Customers;