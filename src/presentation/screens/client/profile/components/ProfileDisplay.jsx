// RUTA: src/presentation/screens/client/profile/components/ProfileDisplay.jsx

import styles from './profile-display.module.css';

const Field = ({ label, value }) => (
  <div className={styles['field']}>
    <span className={styles['field-label']}>{label}</span>
    <span className={styles['field-value']}>{value || '—'}</span>
  </div>
);

const ProfileDisplay = ({ data, onChangeEmail, onChangePassword }) => {
  if (!data) return null;

  return (
    <div className={styles['profile-display']}>
      <section className={styles['section']}>
        <h2 className={styles['section-title']}>Información personal</h2>
        <div className={styles['fields-grid']}>
          <Field label="Nombre"   value={data.nombre} />
          <Field label="Apellido" value={data.apellido} />
          <Field label="DNI"      value={data.dni} />
          <Field label="Teléfono" value={data.telefono} />
        </div>
      </section>

      <section className={styles['section']}>
        <h2 className={styles['section-title']}>Cuenta</h2>
        <div className={styles['fields-grid']}>
          <Field label="Correo electrónico" value={data.email} />
          <Field label="Rol"                value={data.rol} />
          <Field label="Estado"             value={data.activo ? 'Activo' : 'Inactivo'} />
          <Field
            label="Miembro desde"
            value={data.fechaCreacion
              ? new Date(data.fechaCreacion).toLocaleDateString('es-PE')
              : '—'}
          />
        </div>
      </section>

      <section className={styles['section']}>
        <h2 className={styles['section-title']}>Seguridad</h2>
        <div className={styles['actions-row']}>
          <button className={styles['action-btn']} onClick={onChangeEmail}>
            Cambiar correo
          </button>
          <button className={styles['action-btn']} onClick={onChangePassword}>
            Cambiar contraseña
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProfileDisplay;