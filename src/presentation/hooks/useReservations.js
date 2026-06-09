// presentation/hooks/useReservations.js
import { useState, useEffect, useCallback } from "react";
import { reservationRepository } from "../../infrastructure/repositories/reservationRepositoryImpl";

// ─── Disponibilidad por cancha y fecha ───────────────────────────────────────
export function useCourtAvailability(courtId, date) {
  const [slots,   setSlots]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!courtId || !date) { setSlots([]); setLoading(false); setError(null); return; }
    let ignore = false;
    setLoading(true);
    setError(null);
    reservationRepository
      .getCourtAvailability(courtId, date)
      .then((data)  => { if (!ignore) setSlots(data ?? []); })
      .catch((err)  => {
        if (!ignore) {
          setSlots([]);
          setError(err.response?.data?.error ?? err.message ?? "Error al cargar horarios");
        }
      })
      .finally(()   => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [courtId, date]);

  return { slots, loading, error };
}

// ─── ✅ Reservas del cliente autenticado (GET /api/reservas/mias) ─────────────
//  - Se carga al montar y cada vez que se llama `refetch()`
//  - `refetch` se expone para que navbar-client lo llame al abrir el modal
//    y también tras cancelar una reserva.
export function useMyReservations(fecha, estado) {
  const [reservations, setReservations] = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (fecha)  params.fecha  = fecha;
      if (estado) params.estado = estado;
      const data = await reservationRepository.getMine(params);
      setReservations(data ?? []);
    } catch (err) {
      setError(err.response?.data?.error ?? err.message ?? "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  }, [fecha, estado]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ✅ Cancelar desde el modal y refrescar la lista automáticamente
  const cancelAndRefresh = useCallback(async (reservaId) => {
    await reservationRepository.cancel(reservaId);
    await fetchData();          // recarga desde backend tras cancelar
  }, [fetchData]);

  return { reservations, loading, error, refetch: fetchData, cancelAndRefresh };
}

// ─── @deprecated – usar useMyReservations ────────────────────────────────────
export function useReservations(userId) {
  return useMyReservations(null, null);
}

// ─── Listado recepción / admin ────────────────────────────────────────────────
export function useAllReservations(filtersOrFecha) {
  const [reservations, setReservations] = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);

  const serialized =
    typeof filtersOrFecha === "object" && filtersOrFecha !== null
      ? JSON.stringify(filtersOrFecha)
      : String(filtersOrFecha ?? "");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reservationRepository.getAll(
        typeof filtersOrFecha === "object" && filtersOrFecha !== null
          ? filtersOrFecha
          : filtersOrFecha
      );
      setReservations(data ?? []);
    } catch (err) {
      setError(err.response?.data?.error ?? err.message ?? "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  }, [serialized]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateEstado = useCallback(async (id, estado) => {
    const updated = await reservationRepository.updateEstado(id, estado);
    setReservations((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  }, []);

  const reprogramar = useCallback(async (id, data) => {
    const updated = await reservationRepository.update(id, data);
    setReservations((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  }, []);

  return { reservations, loading, error, refetch: fetchData, updateEstado, reprogramar };
}

// ─── Hook para crear reserva ──────────────────────────────────────────────────
export function useCreateReservation() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const create = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      return await reservationRepository.create(data);
    } catch (err) {
      setError(err.response?.data?.error ?? err.message ?? "Error al crear reserva");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

// ─── Hook para cancelar reserva ──────────────────────────────────────────────
export function useCancelReservation() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const cancel = useCallback(async (reservationId) => {
    setLoading(true);
    setError(null);
    try {
      await reservationRepository.cancel(reservationId);
    } catch (err) {
      const msg = err.response?.data?.error ?? err.message ?? "No se pudo cancelar";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cancel, loading, error };
}
