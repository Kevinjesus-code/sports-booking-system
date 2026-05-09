import { useState } from "react";
import { DSAButton } from "../../../../components";
import styles from "./profile-form.module.css";

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l18 18" />
    <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-1.2" />
    <path d="M9.9 4.2A10.4 10.4 0 0 1 12 4c6.5 0 10 8 10 8a18.1 18.1 0 0 1-3.3 4.4" />
    <path d="M6.1 6.1C3.5 7.9 2 12 2 12s3.5 8 10 8a10.7 10.7 0 0 0 5-1.2" />
  </svg>
);

const TextField = ({ label, value, onChange, placeholder, type = "text", error }) => (
  <div className={styles["form-group"]}>
    <label className={styles["field-label"]}>{label}</label>
    <input
      className={styles["text-input"]}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
    {error && <span className={styles["error-message"]}>{error}</span>}
  </div>
);

const PasswordField = ({
  label,
  placeholder,
  value,
  onChange,
  isVisible,
  onToggleVisible,
  error,
}) => (
  <div className={styles["form-group"]}>
    <label className={styles["field-label"]}>{label}</label>
    <div className={styles["password-wrapper"]}>
      <input
        className={styles["password-input"]}
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        className={styles["password-toggle"]}
        type="button"
        onClick={onToggleVisible}
        aria-label={isVisible ? "Ocultar contrasena" : "Mostrar contrasena"}
      >
        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
    {error && <span className={styles["error-message"]}>{error}</span>}
  </div>
);

const ProfileForm = ({
  mode = "profile",
  editableData,
  onEditableDataChange,
  onSaveChanges,
  onCancel,
  errors,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const titleByMode = {
    profile: "Editar perfil",
    email: "Cambiar correo",
    password: "Cambiar Contrasena",
  };

  return (
    <div className={styles["form-container"]}>
      <h2>{titleByMode[mode] || "Editar perfil"}</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        {mode === "profile" && (
          <div className={styles["form-grid"]}>
            <TextField
              label="Nombre"
              value={editableData.nombre}
              onChange={(value) => onEditableDataChange("nombre", value)}
              error={errors.nombre}
            />
            <TextField
              label="Apellido"
              value={editableData.apellido}
              onChange={(value) => onEditableDataChange("apellido", value)}
              error={errors.apellido}
            />
            <TextField
              label="DNI"
              value={editableData.dni}
              onChange={(value) => onEditableDataChange("dni", value)}
            />
            <TextField
              label="Telefono"
              value={editableData.telefono}
              onChange={(value) => onEditableDataChange("telefono", value)}
              error={errors.telefono}
            />
          </div>
        )}

        {mode === "email" && (
          <TextField
            label="Correo electronico"
            type="email"
            placeholder="correo@ejemplo.com"
            value={editableData.email}
            onChange={(value) => onEditableDataChange("email", value)}
            error={errors.email}
          />
        )}

        {mode === "password" && (
          <>
            <PasswordField
              label="Nueva contrasena"
              placeholder="Minimo 8 caracteres"
              value={editableData.password}
              onChange={(value) => onEditableDataChange("password", value)}
              isVisible={showPassword}
              onToggleVisible={() => setShowPassword((current) => !current)}
              error={errors.password}
            />
            <PasswordField
              label="Confirmar contrasena"
              placeholder="Repite tu contrasena"
              value={editableData.confirmPassword}
              onChange={(value) => onEditableDataChange("confirmPassword", value)}
              isVisible={showConfirmPassword}
              onToggleVisible={() => setShowConfirmPassword((current) => !current)}
              error={errors.confirmPassword}
            />
          </>
        )}

        <div className={styles["button-group"]}>
          <DSAButton variant="solid" color="primary" onClick={onSaveChanges}>
            Guardar cambios
          </DSAButton>
          <DSAButton variant="outline" color="primary" onClick={onCancel}>
            Cancelar
          </DSAButton>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
