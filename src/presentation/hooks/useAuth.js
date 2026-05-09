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
      const user = await loginUser({ email, password });
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message ?? err.response?.data ?? 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (datos) => {
    setLoading(true);
    setError(null);
    try {
      const user = await registerUser(datos);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message ?? err.response?.data ?? 'Error al registrarse');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, login, handleRegister };
}