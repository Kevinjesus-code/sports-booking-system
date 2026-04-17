import { useState } from "react";
import "./login.css";
import { DSAInput, DSAButton } from "../../components";

const Login = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
    }
  };

  const EnvelopeIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );

  const LockIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  const LoginIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <div className="login-icon-box">
             {LoginIcon}
          </div>
          <h1 className="login-title">Bienvenido</h1>
          <p className="login-subtitle">Ingresa a tu cuenta para continuar</p>
        </div>

        <div className="login-card">
          <form onSubmit={handleSubmit}>
            <DSAInput 
              label="Correo electrónico" 
              placeholder="correo@ejemplo.com" 
              value={email}
              onChange={setEmail}
              icon={EnvelopeIcon}
            />
            
            <DSAInput 
              label="Contraseña" 
              type="password"
              placeholder="••••••••" 
              value={password}
              onChange={setPassword}
              icon={LockIcon}
            />

            <div className="login-options">
              <label className="login-checkbox">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>
              <a href="#" className="login-forgot">¿Olvidaste tu contraseña?</a>
            </div>

            <div className="login-button-wrapper">
               <DSAButton variant="solid" color="primary" onClick={handleSubmit}>
                 Iniciar sesión
               </DSAButton>
            </div>
            
            <div className="login-register">
              ¿No tienes una cuenta? <a onClick={onRegister} style={{ cursor: "pointer" }}>Regístrate aquí</a>
            </div>
          </form>
        </div>

        <div className="login-footer">
          Sistema de Reservas de Canchas Deportivas
        </div>
      </div>
    </div>
  );
};
export default Login;