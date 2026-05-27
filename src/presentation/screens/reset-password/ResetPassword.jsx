import { useState } from "react";
import styles from "./ResetPassword.module.css";
import { resetPasswordRequest } from "../../../infrastructure/api/auth.api";
import { Eye, EyeOff } from "lucide-react";
import logo from "/assets/img/Logo.JPG";

function ResetPassword({ token, onDone }) {
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status,      setStatus]      = useState("idle");
  const [errorMsg,    setErrorMsg]    = useState("");

  const validate = () => {
    if (password.length < 8)  return "La contraseña debe tener al menos 8 caracteres.";
    if (password !== confirm)  return "Las contraseñas no coinciden.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setErrorMsg(err); setStatus("error"); return; }

    setStatus("loading");
    setErrorMsg("");
    try {
      await resetPasswordRequest(token, password);
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setErrorMsg(e?.response?.data?.message || "Error al restablecer la contraseña.");
    }
  };

  /* ── Pantalla de éxito ───────────────────────────────────── */
  if (status === "success") {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.ilustrationCol}>
          <img src="/assets/svg/Ilustration.svg" alt="" className={styles.ilustration} />
        </div>
        <div className={styles.formCol}>
          <div className={styles.formContent}>
            <div className={styles.successIcon}>✓</div>
            <h1 className={styles.title}>¡Contraseña actualizada!</h1>
            <p className={styles.subtitle}>
              Tu contraseña fue restablecida correctamente.<br />Ya puedes iniciar sesión.
            </p>
            <button className={styles.submitBtn} onClick={onDone}>
              Ir al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Formulario ──────────────────────────────────────────── */
  return (
    <div className={styles.pageContainer}>

      {/* Columna izquierda — ilustración */}
      <div className={styles.ilustrationCol}>
        <img src="/assets/svg/Ilustration.svg" alt="" className={styles.ilustration} />
      </div>

      {/* Columna derecha — formulario */}
      <div className={styles.formCol}>
        <div className={styles.formContent}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.logoBox}>
              <img src={logo} alt="Kancha Sports" className={styles.logo} />
            </div>
            <h1 className={styles.brand}>Kancha Sports</h1>
            <p className={styles.brandTagline}>Restablecer contraseña</p>
          </div>

          {/* Card */}
          <div className={styles.card}>
            <p className={styles.cardHint}>
              Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres.
            </p>

            {/* Nueva contraseña */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="rp-password">
                Nueva contraseña
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="rp-password"
                  className={styles.input}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (status === "error") { setStatus("idle"); setErrorMsg(""); }
                  }}
                  disabled={status === "loading"}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? "Ocultar" : "Mostrar"}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="rp-confirm">
                Confirmar contraseña
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="rp-confirm"
                  className={styles.input}
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    if (status === "error") { setStatus("idle"); setErrorMsg(""); }
                  }}
                  disabled={status === "loading"}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowConfirm(v => !v)}
                  aria-label={showConfirm ? "Ocultar" : "Mostrar"}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {status === "error" && (
              <p className={styles.errorMsg}>{errorMsg}</p>
            )}

            {/* Botón */}
            <div className={styles.btnWrapper}>
              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Guardando…" : "Restablecer contraseña"}
              </button>
            </div>
          </div>

          {/* Volver */}
          <button className={styles.backBtn} onClick={onDone} disabled={status === "loading"}>
            ← Volver al inicio de sesión
          </button>

          <div className={styles.footer}>Sistema de Reservas de Canchas Deportivas</div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;