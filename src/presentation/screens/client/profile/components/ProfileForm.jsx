import { DSAInput, DSAButton, DSAFormSection } from "../../../../components";
import styles from "./profile-form.module.css";

const ProfileForm = ({
  editableData,
  onEditableDataChange,
  onSaveChanges,
  onCancel,
  errors,
}) => {
  return (
    <div className={styles["form-container"]}>
      <DSAFormSection title="Editar datos">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles["form-group"]}>
            <DSAInput
              label="Correo electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              value={editableData.email}
              onChange={(value) => onEditableDataChange("email", value)}
            />
            {errors.email && (
              <span className={styles["error-message"]}>{errors.email}</span>
            )}
          </div>

          <div className={styles["form-group"]}>
            <DSAInput
              label="Teléfono"
              type="tel"
              placeholder="+34 600 000 000"
              value={editableData.telefono}
              onChange={(value) => onEditableDataChange("telefono", value)}
            />
            {errors.telefono && (
              <span className={styles["error-message"]}>
                {errors.telefono}
              </span>
            )}
          </div>

          <div className={styles["divider"]}></div>

          <h4 className={styles["password-title"]}>Cambiar contraseña</h4>

          <div className={styles["form-group"]}>
            <DSAInput
              label="Nueva contraseña"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={editableData.password}
              onChange={(value) => onEditableDataChange("password", value)}
            />
            {errors.password && (
              <span className={styles["error-message"]}>{errors.password}</span>
            )}
          </div>

          <div className={styles["form-group"]}>
            <DSAInput
              label="Confirmar contraseña"
              type="password"
              placeholder="Repite tu contraseña"
              value={editableData.confirmPassword}
              onChange={(value) =>
                onEditableDataChange("confirmPassword", value)
              }
            />
            {errors.confirmPassword && (
              <span className={styles["error-message"]}>
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className={styles["button-group"]}>
            <DSAButton variant="solid" color="primary" onClick={onSaveChanges}>
              Guardar cambios
            </DSAButton>
            <DSAButton variant="outline" color="primary" onClick={onCancel}>
              Cancelar
            </DSAButton>
          </div>
        </form>
      </DSAFormSection>
    </div>
  );
};

export default ProfileForm;
