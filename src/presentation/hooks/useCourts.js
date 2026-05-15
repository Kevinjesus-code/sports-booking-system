// hooks/useCourts.js
import { useState, useEffect, useCallback } from 'react';
import { courtRepository } from '../../infrastructure/repositories/courtRepositoryImpl';

export function useCourts() {
  const [courts,  setCourts]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await courtRepository.getAll();
      setCourts(data ?? []);
    } catch (err) {
      setError(err.response?.data?.error ?? err.message ?? 'Error al cargar canchas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const createCourt = useCallback(async (data) => {
    let created = await courtRepository.create(data);
    if (data.imageFile) {
      created = await courtRepository.uploadImage(created.id, data.imageFile);
    }
    setCourts(prev => [...prev, created]);
    return created;
  }, []);

  const updateCourt = useCallback(async (id, data) => {
    let updated = await courtRepository.update(id, data);
    if (data.imageFile) {
      updated = await courtRepository.uploadImage(id, data.imageFile);
    }
    setCourts(prev => prev.map(c => c.id === id ? updated : c));
    return updated;
  }, []);

  const deleteCourt = useCallback(async (id) => {
    await courtRepository.delete(id);
    setCourts(prev => prev.filter(c => c.id !== id));
  }, []);

  return { courts, loading, error, refetch: fetch, createCourt, updateCourt, deleteCourt };
}
