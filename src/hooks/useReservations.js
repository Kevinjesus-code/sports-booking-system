// hooks/useReservations.js
// Puente entre la capa de aplicación y los componentes React

import { useState, useEffect, useCallback } from 'react';
import { reservationRepository } from '../infrastructure/repositories/reservationRepositoryImpl';
import { getReservationsByUser, getAvailableSlots } from '../application/reservation/getReservations';
import { createReservation }                         from '../application/reservation/createReservation';

// ─────────────────────────────────────────────────────────────
// Hook: reservas del usuario autenticado
// Uso: const { reservations, loading, error } = useReservations(userId)
// ─────────────────────────────────────────────────────────────
export function useReservations(userId) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getReservationsByUser(reservationRepository)(userId);
      setReservations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { reservations, loading, error, refetch: fetch };
}

// ─────────────────────────────────────────────────────────────
// Hook: horarios disponibles de una cancha en una fecha
// Uso: const { slots, loading } = useAvailableSlots(courtId, date)
// ─────────────────────────────────────────────────────────────
export function useAvailableSlots(courtId, date) {
  const [slots, setSlots]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!courtId || !date) { setSlots([]); return; }

    setLoading(true);
    setError(null);

    getAvailableSlots(reservationRepository)(courtId, date)
      .then(setSlots)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [courtId, date]);

  return { slots, loading, error };
}

// ─────────────────────────────────────────────────────────────
// Hook: acción de crear una reserva
// Uso: const { create, loading, error } = useCreateReservation()
// ─────────────────────────────────────────────────────────────
export function useCreateReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const create = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      return await createReservation(reservationRepository)(data);
    } catch (err) {
      setError(err.message);
      throw err; // re-lanza para que el componente decida qué mostrar
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}