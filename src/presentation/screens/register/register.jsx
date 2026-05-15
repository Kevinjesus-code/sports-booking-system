import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import { useAuth } from "../../hooks/useAuth";

const Register = ({ onGoToLogin }) => {
  const [nombre,          setNombre]          = useState("");
  const [apellido,        setApellido]        = useState("");
  const [dni,             setDni]             = useState("");
  const [email,           setEmail]           = useState("");
  const [telefono,        setTelefono]        = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms,   setAcceptedTerms]   = useState(false);
  const [ageError,        setAgeError]        = useState("");

  const { handleRegister, loading, error } = useAuth();
  const navigate = useNavigate();

  /* ── Validación de mayoría de edad ── */
  const validateAge = (dateStr) => {
    if (!dateStr) return "";
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age < 18 ? "Debes ser mayor de 18 años para registrarte" : "";
  };

  const handleDateChange = (val) => {
    setFechaNacimiento(val);
    setAgeError(validateAge(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (!fechaNacimiento) {
      alert("La fecha de nacimiento es requerida");
      return;
    }
    const ageMsg = validateAge(fechaNacimiento);
    if (ageMsg) {
      setAgeError(ageMsg);
      return;
    }

    try {
      await handleRegister({ nombre, apellido, dni, email, telefono, fechaNacimiento, password });
      alert("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.");
      onGoToLogin();
    } catch (_) {
      // el error del backend ya está en `error`
    }
  };

  return (
    <div className={styles["register-container"]}>
      <div className={styles["register-content"]}>

        <div className={styles["register-header"]}>
          <div className={styles["register-icon-box"]}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h1 className={styles["register-title"]}>Crear cuenta</h1>
          <p className={styles["register-subtitle"]}>Completa el formulario para registrarte</p>
        </div>

        <div className={styles["register-card"]}>
          <form onSubmit={handleSubmit}>

            {/* Error del backend */}
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

            {/* Nombre + Apellido */}
            <div className={styles["row"]}>
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Nombre</label>
                <div className={styles["input-wrapper"]}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input type="text" placeholder="Juan" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>
              </div>
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Apellido</label>
                <div className={styles["input-wrapper"]}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
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
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input type="text" placeholder="Ingrese su DNI" value={dni} onChange={(e) => setDni(e.target.value)} />
              </div>
            </div>

            {/* Correo */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Correo electrónico</label>
              <div className={styles["input-wrapper"]}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            {/* Teléfono */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Teléfono</label>
              <div className={styles["input-wrapper"]}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <input type="tel" placeholder="+51 900 000 000" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Fecha de nacimiento</label>
              <div className={styles["input-wrapper"]}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => handleDateChange(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              {ageError && (
                <div className={styles["age-error"]}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {ageError}
                </div>
              )}
            </div>

            {/* Contraseña */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Contraseña</label>
              <div className={styles["input-wrapper"]}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Confirmar contraseña</label>
              <div className={styles["input-wrapper"]}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input type="password" placeholder="Repite tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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

            <button
              type="submit"
              className={styles["register-btn"]}
              disabled={loading || !!ageError}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            <div className={styles["login-link"]}>
              ¿Ya tienes una cuenta?{" "}
              <a onClick={onGoToLogin}>Inicia sesión</a>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Register;