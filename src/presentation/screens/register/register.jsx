import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import { useAuth } from "../../hooks/useAuth"; // ← agregar

const Register = ({ onGoToLogin }) => {
  const [nombre,          setNombre]          = useState("");
  const [apellido,        setApellido]        = useState("");
  const [dni,             setDni]             = useState("");
  const [email,           setEmail]           = useState("");
  const [telefono,        setTelefono]        = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms,   setAcceptedTerms]   = useState(false);

  const { register, loading, error } = useAuth(); // ← agregar
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones locales (sin tocar el backend)
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

    try {
      await register({ nombre, apellido, dni, email, telefono, password });
      alert("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.");
      onGoToLogin(); // vuelve al login
    } catch (_) {
      // el error del backend ya está en `error`
    }
  };

  return (
    <div className={styles["register-container"]}>
      <div className={styles["register-content"]}>

        <div className={styles["register-header"]}>
          {/* ... tu header igual ... */}
        </div>

        <div className={styles["register-card"]}>
          <form onSubmit={handleSubmit}>

            {/* Mostrar error del backend */}
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

            {/* ... todos tus campos igual, sin cambios ... */}

            <button
              type="submit"
              className={styles["register-btn"]}
              disabled={loading} // ← agregar
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"} {/* ← agregar */}
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