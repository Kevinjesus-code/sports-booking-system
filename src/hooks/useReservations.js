// hooks/useReservations.js
import { useState, useEffect, useCallback } from 'react';
import { reservationRepository } from '../infrastructure/repositories/reservationRepositoryImpl';

// ── Hook: slots disponibles (usado en schedules.jsx) ──────────────────────
export function useAvailableSlots(courtId, date) {
  const [slots,   setSlots]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    // No llamar si faltan datos
    if (!courtId || !date) {
      setSlots([]);
      return;
    }

    setLoading(true);
    setError(null);

    // Llama directo al repositorio — sin capa de caso de uso currificada
    reservationRepository
      .getAvailableSlots(courtId, date)
      .then((data) => setSlots(data ?? []))
      .catch((err) => setError(err.message ?? 'Error al cargar horarios'))
      .finally(() => setLoading(false));

  }, [courtId, date]);

  return { slots, loading, error };
}

// ── Hook: reservas del usuario ────────────────────────────────────────────
export function useReservations(userId) {
  const [reservations, setReservations] = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await reservationRepository.getByUserId(userId);
      setReservations(data ?? []);
    } catch (err) {
      setError(err.message ?? 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { reservations, loading, error, refetch: fetch };
}

// ── Hook: acción crear reserva (usado en confirm-reserve.jsx) ─────────────
export function useCreateReservation() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const create = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      return await reservationRepository.create(data);
    } catch (err) {
      setError(err.message ?? 'Error al crear reserva');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}