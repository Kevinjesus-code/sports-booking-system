import { DSAButton, DSAText } from "../../../../components";
import styles from "./profile-header.module.css";

const ProfileHeader = ({ userName, onEditToggle, isEditing }) => {
  const getInitials = (name) => {
    const [first = "", second = ""] = (name || "Usuario")
      .trim()
      .split(" ")
      .filter(Boolean);

    return `${first.charAt(0)}${second.charAt(0) || first.charAt(1) || ""}`.toUpperCase();
  };

  return (
    <div className={styles["header-container"]}>
      <div className={styles["avatar"]}>
        <span aria-hidden="true">{getInitials(userName)}</span>
      </div>
      <div className={styles["header-content"]}>
        <DSAText variant="subtitle">{userName || "Usuario"}</DSAText>
        <p className={styles["subtitle"]}>
          {isEditing ? "Editando tu perfil" : "Tu información personal"}
        </p>
      </div>
      <DSAButton
        variant={isEditing ? "outline" : "solid"}
        color="primary"
        onClick={onEditToggle}
      >
        {isEditing ? "Cancelar" : "Editar perfil"}
      </DSAButton>
    </div>
  );
};

export default ProfileHeader;
