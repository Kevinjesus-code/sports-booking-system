import { createContext, useContext, useState, useCallback } from 'react';
import { loginRequest, registerRequest, logoutRequest } from '../infrastructure/api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginRequest(email, password);
      const userData = response.data.user || response.data;
      const token = response.data.token || userData.token;
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        (typeof err.response?.data === 'string' ? err.response.data : 'Error al iniciar sesión');
      setError(msg);
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
      return response.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        (typeof err.response?.data === 'string' ? err.response.data : 'Error al registrarse');
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (_) {}
    finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, handleRegister, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}