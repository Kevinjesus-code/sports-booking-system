import { DSAText } from "../../../../components";
import styles from "./profile-display.module.css";

const ProfileDisplay = ({ data, onChangeEmail, onChangePassword }) => {
  const fields = [
    { label: "Nombre", value: data?.nombre },
    { label: "Apellido", value: data?.apellido },
    { label: "DNI", value: data?.dni },
    { label: "Correo electrónico", value: data?.email },
    { label: "Teléfono", value: data?.telefono },
  ];

  return (
    <div className={styles["display-container"]}>
      <div className={styles["status-card"]}>
        <span>Esta cuenta fue creada el 06/05/26</span>
        <span className={styles["check-icon"]} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m7 12 3 3 7-7" />
          </svg>
        </span>
      </div>

      <div className={styles["account-actions"]}>
        <div className={styles["account-row"]}>
          <span className={styles["row-icon"]} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <span>{data?.email || "-"}</span>
        </div>
        <button type="button" onClick={onChangeEmail}>Cambiar correo</button>

        <div className={styles["account-row"]}>
          <span className={styles["row-icon"]} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m21 2-2 2" />
              <path d="m15 8 2-2" />
              <circle cx="7.5" cy="16.5" r="5.5" />
              <path d="m14 10 7-7" />
            </svg>
          </span>
          <span>********</span>
        </div>
        <button type="button" onClick={onChangePassword}>Cambiar contrasena</button>
      </div>

      <div className={styles["fields-grid"]}>
        <DSAText variant="subtitle" align="left">
          Mis datos
        </DSAText>
        {fields.map((field) => (
          <div key={field.label} className={styles["field-item"]}>
            <p className={styles["field-label"]}>{field.label}</p>
            <p className={styles["field-value"]}>{field.value || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileDisplay;
