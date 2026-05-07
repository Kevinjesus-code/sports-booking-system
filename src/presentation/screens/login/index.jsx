import { useState } from "react";
import styles from "./login.module.css";
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

  const LoginIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#22c55e"
      strokeWidth="2"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );

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
                <DSAButton variant="solid" color="primary">
                  Iniciar sesión
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
