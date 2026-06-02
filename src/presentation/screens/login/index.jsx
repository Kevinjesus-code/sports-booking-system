
    import { useState } from "react";
    import styles from "./login.module.css";
    import { DSAInput, DSAButton } from "../../components";
    import { useAuth } from "../../../context/AuthContext";
    import { forgotPasswordRequest } from "../../../infrastructure/api/auth.api";
    // import logo from "../../../assets/MetodoPago/Logo.png";

    // ── Iconos ────────────────────────────────────────────────────────────────────

    const EnvelopeIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    );

    const LockIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );

    const EyeIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );

    const EyeOffIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
      </svg>
    );

    const CloseIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" x2="6" y1="6" y2="18" />
        <line x1="6" x2="18" y1="6" y2="18" />
      </svg>
    );

    // ── Componente principal ──────────────────────────────────────────────────────

    const Login = ({ onRegister, onLogin }) => {
      const [email, setEmail]               = useState("");
      const [password, setPassword]         = useState("");
      const [showPassword, setShowPassword] = useState(false);
      const [remember, setRemember]         = useState(false);

      const [showModal, setShowModal]       = useState(false);
      const [resetEmail, setResetEmail]     = useState("");
      const [resetLoading, setResetLoading] = useState(false);
      const [resetError, setResetError]     = useState("");
      const [resetSuccess, setResetSuccess] = useState(false);

      const { login, loading, error } = useAuth();

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const user = await login(email, password, remember);
          onLogin(user.rol);
        } catch (_) {}
      };

      const openModal = (e) => {
        e.preventDefault();
        setResetEmail(""); setResetError(""); setResetSuccess(false); setShowModal(true);
      };
      const closeModal = () => setShowModal(false);

      const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!resetEmail.trim()) { setResetError("Ingresa tu correo electrónico."); return; }
        setResetLoading(true); setResetError("");
        try {
          await forgotPasswordRequest(resetEmail.trim());
          setResetSuccess(true);
        } catch (err) {
          setResetError(err?.response?.data?.message || "No pudimos enviar el correo. Verifica la dirección e intenta de nuevo.");
        } finally {
          setResetLoading(false);
        }
      };

      return (
        <>
          <div className={styles.loginContainer}>

            {/* ── Columna izquierda — ilustración ── */}
            <div className={styles.containerIlustration}>
              <div className={styles.ilustrationInner}>

                {/* Marca: logo + nombre */}
                <div className={styles.ilustrationBrand}>
                  <img src={"assets/img/Logo.JPG"} alt="Kancha Sports" className={styles.ilustrationLogo} />
                  <span className={styles.ilustrationBrandName}>Kancha Sports</span>
                </div>

                {/* Tagline con acento de color */}
                <p className={styles.ilustrationTagline}>
                  La plataforma de reservas<br />
                  <em>deportivas</em> más fácil<br />
                  de usar
                </p>

                {/* Ilustración grande ocupando el resto */}
                <img
                  src="/assets/svg/Ilustration.svg"
                  alt="Ilustración deportiva"
                  className={styles.ilustration}
                />
              </div>
            </div>

            {/* ── Columna derecha — formulario ── */}
            <div className={styles.container}>
              <div className={styles.loginContent}>

                <div className={styles.loginHeader}>
                  {/*
                    En móvil: se muestra el logo + nombre aquí.
                    En desktop: este bloque queda oculto via CSS (el logo ya está en la columna izquierda).
                  */}
                  <div className={styles.loginIconBox}>
                    <img src={"assets/img/Logo.JPG"} alt="Logo" className={styles.logo} />
                    <span className={styles.loginIconBrandName}>Kancha Sports</span>
                  </div>

                  <h1 className={styles.loginTitle}>Bienvenido</h1>
                  <p className={styles.loginSubtitle}>Ingresa tus datos para <strong>iniciar sesión</strong></p>
                </div>

                <div className={styles.loginCard}>
                  <form onSubmit={handleSubmit}>

                    <DSAInput
                      label="Correo electrónico"
                      placeholder="usuario@kancha.com"
                      value={email}
                      onChange={setEmail}
                      icon={EnvelopeIcon}
                    />

                    <div className={styles.passwordWrapper}>
                      <DSAInput
                        label="Contraseña"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={setPassword}
                        icon={LockIcon}
                      />
                      <button
                        type="button"
                        className={styles.eyeToggle}
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>

                    {error && <p className={styles.errorMsg}>{error}</p>}

                    <div className={styles.loginOptions}>
                      <label className={styles.loginCheckbox}>
                        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                        <span>Recordarme</span>
                      </label>
                      <a href="#" className={styles.loginForgot} onClick={openModal}>
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>

                    <div className={styles.loginButtonWrapper}>
                      <DSAButton type="submit" variant="solid" color="primary" disabled={loading}>
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

                <div className={styles.loginFooter}>
                  Sistema de Reservas de Canchas Deportivas
                </div>
              </div>
            </div>
          </div>

          {/* ── Modal recuperar contraseña ── */}
          {showModal && (
            <div className={styles.modalOverlay} onClick={closeModal}>
              <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={closeModal} aria-label="Cerrar">
                  <CloseIcon />
                </button>

                {resetSuccess ? (
                  <div className={styles.modalSuccess}>
                    <div className={styles.modalSuccessIcon}>✓</div>
                    <h2 className={styles.modalTitle}>Correo enviado</h2>
                    <p className={styles.modalSubtitle}>
                      Revisa tu bandeja de entrada. Te enviamos un enlace para restablecer tu contraseña.
                    </p>
                    <div className={styles.modalButtonWrapper}>
                      <DSAButton variant="solid" color="primary" onClick={closeModal}>Entendido</DSAButton>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className={styles.modalTitle}>Recuperar contraseña</h2>
                    <p className={styles.modalSubtitle}>
                      Escribe tu correo registrado y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                    <form onSubmit={handleForgotPassword}>
                      <DSAInput
                        label="Correo electrónico"
                        placeholder="usuario@kancha.com"
                        value={resetEmail}
                        onChange={setResetEmail}
                        icon={EnvelopeIcon}
                      />
                      {resetError && <p className={styles.errorMsg}>{resetError}</p>}
                      <div className={styles.modalButtonWrapper}>
                        <DSAButton type="submit" variant="solid" color="primary" disabled={resetLoading}>
                          {resetLoading ? "Enviando..." : "Enviar enlace"}
                        </DSAButton>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      );
    };

    export default Login;