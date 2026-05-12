// RUTA: src/presentation/screens/client/profile/components/ProfileHeader.jsx

import styles from './profile-header.module.css';

const ProfileHeader = ({ userName, isEditing, onEditToggle }) => {
  const initials = userName
    ? userName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <div className={styles['profile-header']}>
      <div className={styles['avatar']}>
        <span className={styles['avatar-initials']}>{initials}</span>
      </div>
      <p className={styles['user-name']}>{userName || 'Usuario'}</p>
      <button
        type="button"
        className={styles['edit-btn']}
        onClick={onEditToggle}
      >
        {isEditing ? 'Cancelar edición' : 'Editar perfil'}
      </button>
    </div>
  );
};

export default ProfileHeader;