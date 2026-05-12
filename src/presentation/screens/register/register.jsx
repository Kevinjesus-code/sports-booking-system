import { useState } from "react";
import styles from "./register.module.css";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../../assets/MetodoPago/Logo.png";
import { Eye, EyeOff } from "lucide-react";
const Register = ({ onGoToLogin }) => {
  const [nombre,          setNombre]          = useState("");
  const [apellido,        setApellido]        = useState("");
  const [dni,             setDni]             = useState("");
  const [email,           setEmail]           = useState("");
  const [telefono,        setTelefono]        = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms,   setAcceptedTerms]   = useState(false);
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { handleRegister, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) { alert("Debes aceptar los términos y condiciones"); return; }
    if (password !== confirmPassword) { alert("Las contraseñas no coinciden"); return; }
    if (password.length < 8) { alert("La contraseña debe tener al menos 8 caracteres"); return; }
    try {
      await handleRegister({ nombre, apellido, dni, email, telefono, password });
      alert("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.");
      onGoToLogin();
    } catch (_) {}
  };

  return (
    <div className={styles["register-container"]}>

      {/* Columna izquierda — ilustración */}
      <div className={styles["ilustration-col"]}>
        <img src="/assets/svg/Ilustration.svg" alt="" className={styles["ilustration"]} />
      </div>

      {/* Columna derecha — formulario */}
      <div className={styles["form-col"]}>
        <div className={styles["register-content"]}>

          {/* Header */}
          <div className={styles["register-header"]}>
            <div className={styles["register-icon-box"]}>
              <img src={logo} alt="Kancha Sports" className={styles["logo"]} />
            </div>
            <h1 className={styles["register-title"]}>Kancha Sports</h1>
            <p className={styles["register-subtitle"]}>Completa el formulario para registrarte</p>
          </div>

          {/* Card */}
          <div className={styles["register-card"]}>
            <form onSubmit={handleSubmit}>

              {error && (
                <div className={styles["error-banner"]}>{error}</div>
              )}

              {/* Nombre + Apellido */}
              <div className={styles["row"]}>
                <div className={styles["form-group"]}>
                  <label className={styles["form-label"]}>Nombre</label>
                  <div className={styles["input-wrapper"]}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    <input type="text" placeholder="Juan" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  </div>
                </div>
                <div className={styles["form-group"]}>
                  <label className={styles["form-label"]}>Apellido</label>
                  <div className={styles["input-wrapper"]}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    <input type="text" placeholder="Pérez" value={apellido} onChange={(e) => setApellido(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* DNI */}
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>DNI</label>
                <div className={styles["input-wrapper"]}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input type="text" placeholder="Ingrese su DNI" value={dni} onChange={(e) => setDni(e.target.value)} />
                </div>
              </div>

              {/* Correo */}
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Correo electrónico</label>
                <div className={styles["input-wrapper"]}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              {/* Teléfono */}
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Teléfono</label>
                <div className={styles["input-wrapper"]}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <input type="tel" placeholder="+51 900 000 000" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </div>
              </div>

              {/* Contraseña */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Contraseña</label>
              <div className={styles["input-wrapper"]}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className={styles["eye-btn"]} onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

                {/* Confirmar contraseña */}
                <div className={styles["form-group"]}>
                  <label className={styles["form-label"]}>Confirmar contraseña</label>
                  <div className={styles["input-wrapper"]}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="button" className={styles["eye-btn"]} onClick={() => setShowConfirmPassword(v => !v)}>
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

              {/* Términos */}
              <div className={styles["terms-row"]}>
                <input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
                <label htmlFor="terms">
                  Acepto los{" "}
                  <a href="#" className={styles["terms-link"]}>términos y condiciones</a>
                  {" "}y la{" "}
                  <a href="#" className={styles["terms-link"]}>política de privacidad</a>
                </label>
              </div>

              <button type="submit" className={styles["register-btn"]} disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>

              <div className={styles["login-link"]}>
                ¿Ya tienes una cuenta?{" "}
                <a onClick={onGoToLogin}>Inicia sesión</a>
              </div>

            </form>
          </div>

          <div className={styles["footer"]}>Sistema de Reservas de Canchas Deportivas</div>
        </div>
      </div>
    </div>
  );
};

export default Register;