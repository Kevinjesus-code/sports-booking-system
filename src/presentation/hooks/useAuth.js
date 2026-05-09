import { useState, useCallback } from 'react';
import { loginRequest, registerRequest } from '../../infrastructure/api/auth.api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginRequest(email, password);
      localStorage.setItem('token', response.data.token);      // ← agrega esto
      localStorage.setItem('user', JSON.stringify(response.data)); // ← y esto
      setUser(response.data);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message ??
        err.response?.data?.error ??
        (typeof err.response?.data === 'string' ? err.response?.data : 'Error al iniciar sesión')
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (datos) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerRequest(datos);
      setUser(response.data);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message ??
        err.response?.data?.error ??
        (typeof err.response?.data === 'string' ? err.response?.data : 'Error al registrarse')
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, login, handleRegister };
}