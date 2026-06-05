import React, { useState } from "react";
import "./login.css";

const IconLogin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const IconEmail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aab" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aab" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    setError("");
    alert(`Sesión iniciada con: ${email}`);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <IconLogin />
        </div>

        <h1 className="login-title">Bienvenido</h1>
        <p className="login-subtitle">Ingresa a tu cuenta para continuar</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Correo electrónico
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <IconEmail />
              </span>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <IconLock />
              </span>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="form-row">
            <label className="remember-label">
              <input
                type="checkbox"
                className="remember-checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Recordarme</span>
            </label>
            <a href="#forgot" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn-primary">
            Iniciar sesión
          </button>
        </form>

        <p className="login-register">
          ¿No tienes una cuenta?{" "}
          <a href="#register" className="register-link">
            Regístrate aquí
          </a>
        </p>
      </div>

      <footer className="login-footer">Sistema de Reservas de Canchas Deportivas</footer>
    </div>
  );
}