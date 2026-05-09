import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { DSAInput, DSAButton } from "../../components";
import { useAuth } from "../../hooks/useAuth"; // ← agregar

const Login = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth(); // ← agregar
  const navigate = useNavigate();              // ← agregar

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      // Redirige según el rol del usuario
      if (user.isAdmin())               navigate("/admin/dashboard");
      else if (user.isCliente())        navigate("/cliente/dashboard");
      else if (user.isRecepcionista())  navigate("/recepcionista/dashboard");
    } catch (_) {
      // el error ya lo maneja useAuth en `error`
    }
  };

  // ... tus iconos SVG igual que antes ...

  return (
    <div className={styles.loginContainer}>
      <div className={styles.containerIlustration}>
        <img src="/assets/svg/Ilustration.svg" alt="Ilustration" className={styles.ilustration} />
      </div>

      <div className={styles.container}>
        <div className={styles.loginContent}>
          <div className={styles.loginHeader}>
            <div className={styles.loginIconBox}>
              <img src="/assets/img/Logo.JPG" alt="" className={styles.logo} />
            </div>
            <h1 className={styles.loginTitle}>Bienvenido</h1>
            <p className={styles.loginSubtitle}>Ingresa a tu cuenta para continuar</p>
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

              {/* ← Mostrar error del backend */}
              {error && (
                <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px" }}>
                  {error}
                </p>
              )}

              <div className={styles.loginOptions}>
                <label className={styles.loginCheckbox}>
                  <input type="checkbox" />
                  <span>Recordarme</span>
                </label>
                <a href="#" className={styles.loginForgot}>¿Olvidaste tu contraseña?</a>
              </div>

              <div className={styles.loginButtonWrapper}>
                {/* ← disabled mientras carga */}
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

          <div className={styles.loginFooter}>Sistema de Reservas de Canchas Deportivas</div>
        </div>
      </div>
    </div>
  );
};

export default Login;