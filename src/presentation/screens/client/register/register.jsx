import styles from "./register.module.css";
import { DSAButton, DSAText } from "../../../components";

const Register = () => {
  return (
    <>
      <div className={styles.container}>
        <DSAText variant="subtitle" align={"center"}>Crear cuenta</DSAText>
        <p className={styles.subtitle}>Completa el formulario para registrarte</p>

        <form id="form">
          <div className={styles.row}>
            <div className={styles["input-group"]}>
              <label>Nombre</label>
              <input type="text" placeholder="Nombre" required></input>
            </div>

            <div className={styles["input-group"]}>
              <label>Apellido</label>
              <input type="text" placeholder="Apellido" required></input>
            </div>
          </div>

          <div className={styles["input-group"]}>
            <label>DNI</label>
            <input type="text" placeholder="Ingrese su DNI" required></input>
          </div>

          <div className={styles["input-group"]}>
            <label>Correo electrónico</label>
            <input type="email" placeholder="correo@ejemplo.com" required></input>
          </div>

          <div className={styles["input-group"]}>
            <label>Teléfono</label>
            <input type="tel" placeholder="+34 600 000 000"></input>
          </div>

          <div className={styles["input-group"]}>
            <label>Contraseña</label>
            <input type="password" id="password" placeholder="Mínimo 8 caracteres" required></input>
          </div>

          <div className={styles["input-group"]}>
            <label>Confirmar contraseña</label>
            <input type="password" id="confirmPassword" placeholder="Repite tu contraseña" required></input>
          </div>

          <div className={styles.checkbox}>
            <input type="checkbox" required></input>
            <span>
              Acepto los <a href="#">términos y condiciones</a> y la{" "}
              <a href="#">política de privacidad</a>
            </span>
          </div>

          <DSAButton variant="solid">Crear cuenta</DSAButton>
        </form>
      </div>
    </>
  );
};

export default Register;
