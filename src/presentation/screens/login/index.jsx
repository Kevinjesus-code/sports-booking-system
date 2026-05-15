import { useState } from "react";
import styles from "./login.module.css";
import { DSAInput, DSAButton } from "../../components";
import { useAuth } from "../../hooks/useAuth";

const EnvelopeIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const Login = ({ onRegister, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      onLogin(user.rol);
    } catch (_) {
      // el error ya lo maneja useAuth en `error`
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.containerIlustration}>
        <img
          src="/assets/svg/Ilustration.svg"
          alt="Ilustration"
          className={styles.ilustration}
        />
      </div>

      <div className={styles.container}>
        <div className={styles.loginContent}>
          <div className={styles.loginHeader}>
            <div className={styles.loginIconBox}>
              <img src="/assets/img/Logo.JPG" alt="" className={styles.logo} />
            </div>
            <h1 className={styles.loginTitle}>Bienvenido</h1>
            <p className={styles.loginSubtitle}>
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          <div className={styles.loginCard}>
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

              {error && (
                <div style={{
                  background: "#fef2f2",
                  border: "1px solid #fca5a5",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "#dc2626",
                  fontSize: "0.85rem",
                  marginBottom: "16px"
                }}>
                  {error}
                </div>
              )}

              <div className={styles.loginOptions}>
                <label className={styles.loginCheckbox}>
                  <input type="checkbox" />
                  <span>Recordarme</span>
                </label>
                <a href="#" className={styles.loginForgot}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <div className={styles.loginButtonWrapper}>
                <DSAButton variant="solid" color="primary" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </DSAButton>
              </div>

              <div className={styles.loginRegister}>
                ¿No tienes una cuenta?{" "}
                <span onClick={onRegister} style={{ cursor: "pointer" }}>
                  Regístrate aquí
                </span>
              </div>
            </form>
          </div>

          <div className={styles.loginFooter}>
            Sistema de Reservas de Canchas Deportivas
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
