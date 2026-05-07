import { useEffect, useState } from "react";
import { ProfileHeader, ProfileDisplay, ProfileForm } from "./components";
import { useProfileData } from "./hooks/useProfileData";
import { DSAButton } from "../../../components";
import styles from "./profile.module.css";

const Profile = ({ onBack }) => {
  const {
    profileData,
    setProfileData,
    editableData,
    handleEditableDataChange,
    isEditing,
    handleEditToggle,
    handleSaveChanges,
    errors,
  } = useProfileData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Mi cuenta", icon: "user", active: true },
    { label: "Mis reservas", icon: "calendar" },
    { label: "Pagos", icon: "card" },
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

  useEffect(() => {
    const userData = {
      nombre: "Rudy",
      apellido: "Dávila",
      dni: "12345678A",
      email: "rudydavisrd2054@gmail.com",
      telefono: "+34 600 123 456",
    };

    setProfileData(userData);
  }, [setProfileData]);

  const handleSave = () => {
    if (handleSaveChanges()) {
      console.log("Cambios guardados:", profileData);
    }
  };

  const handleCancel = () => {
    handleEditToggle();
  };

  return (
    <div className={styles["profile-screen"]}>
      <div className={styles["profile-container"]}>
        <div className={styles["back-button-wrapper"]}>
          {onBack && (
            <DSAButton variant="outline" color="primary" onClick={onBack}>
              ← Volver
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
            <span>Menú lateral</span>
          </button>

          {isMobileMenuOpen && (
            <button
              type="button"
              className={styles["sidebar-overlay"]}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Cerrar menú lateral"
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
              isEditing={isEditing}
              onEditToggle={handleEditToggle}
            />

            <nav
              id="profile-menu"
              className={styles["profile-menu"]}
              aria-label="Opciones de perfil"
            >
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`${styles["menu-item"]} ${
                    item.active ? styles["menu-item-active"] : ""
                  }`}
                  disabled={!item.active}
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
              <h1>Mi cuenta</h1>
            </div>

            {!isEditing ? (
              <ProfileDisplay data={profileData} />
            ) : (
              <ProfileForm
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
