import { useState } from "react";
import { ProfileHeader, ProfileDisplay, ProfileForm } from "./components";
import { useProfileData } from "./hooks/useProfileData";
import { DSAButton } from "../../../components";
import styles from "./profile.module.css";

const DEFAULT_USER_DATA = {
  nombre: "Rudy",
  apellido: "Davis",
  dni: "12345678A",
  email: "rudydavisrd2054@gmail.com",
  telefono: "+34 600 123 456",
};

const Profile = ({ onBack, startEditing = false }) => {
  const {
    profileData,
    editableData,
    handleEditableDataChange,
    handleSaveChanges,
    resetEditableData,
    errors,
  } = useProfileData(DEFAULT_USER_DATA, startEditing);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("account");

  const navItems = [
    { id: "account", label: "Mi cuenta", icon: "user" },
    { id: "reservations", label: "Mis reservas", icon: "calendar" },
    { id: "payments", label: "Pagos", icon: "card" },
  ];

  const renderIcon = (icon) => {
    const paths = {
      user: (
        <>
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="7" r="4" />
        </>
      ),
      calendar: (
        <>
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
        </>
      ),
      card: (
        <>
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </>
      ),
    };

    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {paths[icon]}
      </svg>
    );
  };

  const handleSave = () => {
    if (handleSaveChanges(activeSection)) {
      console.log("Cambios guardados:", profileData);
      setActiveSection("account");
    }
  };

  const handleCancel = () => {
    resetEditableData();
    setActiveSection("account");
  };

  const openSection = (section) => {
    resetEditableData();
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={styles["profile-screen"]}>
      <div className={styles["profile-container"]}>
        <div className={styles["back-button-wrapper"]}>
          {onBack && (
            <DSAButton variant="outline" color="primary" onClick={onBack}>
              Volver
            </DSAButton>
          )}
        </div>

        <div className={styles["profile-layout"]}>
          <button
            type="button"
            className={styles["menu-toggle"]}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="profile-sidebar"
          >
            <span className={styles["hamburger-icon"]} aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span>Menu lateral</span>
          </button>

          {isMobileMenuOpen && (
            <button
              type="button"
              className={styles["sidebar-overlay"]}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Cerrar menu lateral"
            />
          )}

          <aside
            id="profile-sidebar"
            className={`${styles["profile-sidebar"]} ${
              isMobileMenuOpen ? styles["profile-sidebar-open"] : ""
            }`}
          >
            <ProfileHeader
              userName={
                profileData.nombre
                  ? `${profileData.nombre} ${profileData.apellido}`
                  : "Usuario"
              }
              isEditing={activeSection !== "account"}
              onEditToggle={() => openSection("profile")}
            />

            <nav
              id="profile-menu"
              className={styles["profile-menu"]}
              aria-label="Opciones de perfil"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles["menu-item"]} ${
                    activeSection === item.id ? styles["menu-item-active"] : ""
                  }`}
                  onClick={() => openSection(item.id)}
                >
                  <span className={styles["menu-icon"]}>{renderIcon(item.icon)}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className={styles["profile-content"]}>
            <div className={styles["content-heading"]}>
              <p>Perfil de usuario</p>
              <h1>{activeSection === "payments" ? "Pagos" : "Mi cuenta"}</h1>
            </div>

            {activeSection === "account" ? (
              <ProfileDisplay
                data={profileData}
                onChangeEmail={() => openSection("email")}
                onChangePassword={() => openSection("password")}
              />
            ) : activeSection === "payments" ? (
              <div className={styles["payments-panel"]}>
                <h2>Metodos de pago</h2>
                <p>Configura como quieres pagar tus reservas.</p>
                <div className={styles["payment-grid"]}>
                  <label>
                    Metodo principal
                    <select defaultValue="Yape">
                      <option>Yape</option>
                      <option>Plin</option>
                      <option>Tarjeta</option>
                      <option>Efectivo</option>
                    </select>
                  </label>
                  <label>
                    Tarjeta guardada
                    <input placeholder="**** **** **** 1234" />
                  </label>
                </div>
                <button className={styles["primary-action"]}>Guardar metodo de pago</button>
              </div>
            ) : activeSection === "reservations" ? (
              <div className={styles["payments-panel"]}>
                <h2>Mis reservas</h2>
                <p>Tus reservas apareceran aqui cuando confirmes un horario.</p>
              </div>
            ) : (
              <ProfileForm
                mode={activeSection}
                editableData={editableData}
                onEditableDataChange={handleEditableDataChange}
                onSaveChanges={handleSave}
                onCancel={handleCancel}
                errors={errors}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
