// RUTA: src/presentation/screens/client/profile/components/ProfileForm.jsx

import { useState } from 'react';
import styles from './profile-form.module.css';

const InputField = ({ label, name, value, onChange, error, type = 'text', disabled }) => (
  <div className={styles['form-group']}>
    <label className={styles['form-label']}>{label}</label>
    <input
      className={`${styles['form-input']} ${error ? styles['form-input-error'] : ''}`}
      type={type}
      value={value || ''}
      onChange={(e) => onChange(name, e.target.value)}
      disabled={disabled}
    />
    {error && <span className={styles['form-error']}>{error}</span>}
  </div>
);

const ProfileForm = ({
  mode,
  editableData,
  onEditableDataChange,
  onSaveChanges,
  onCancel,
  onCambiarEmail,
  onCambiarPassword,
  errors,
  saving,
}) => {
  const [emailForm, setEmailForm] = useState({
    emailActual: '',
    emailNuevo:  '',
    password:    '',
  });

  const [passForm, setPassForm] = useState({
    passwordActual:  '',
    passwordNuevo:   '',
    passwordConfirm: '',
  });

  // ── Modo: editar datos personales ──────────────────────────────────────────
  if (mode === 'profile') {
    return (
      <div className={styles['profile-form']}>
        <h2 className={styles['form-title']}>Editar información personal</h2>
        <p className={styles['form-subtitle']}>El correo se cambia desde "Cambiar correo"</p>

        {errors.general && (
          <div className={styles['error-banner']}>{errors.general}</div>
        )}

        <div className={styles['fields-grid']}>
          <InputField
            label="Nombre"
            name="nombre"
            value={editableData.nombre}
            onChange={onEditableDataChange}
            error={errors.nombre}
          />
          <InputField
            label="Apellido"
            name="apellido"
            value={editableData.apellido}
            onChange={onEditableDataChange}
            error={errors.apellido}
          />
          <InputField
            label="DNI"
            name="dni"
            value={editableData.dni}
            onChange={onEditableDataChange}
            error={errors.dni}
          />
          <InputField
            label="Teléfono"
            name="telefono"
            value={editableData.telefono}
            onChange={onEditableDataChange}
          />
          <InputField
            label="Correo (no editable aquí)"
            name="email"
            value={editableData.email}
            onChange={() => {}}
            disabled
          />
        </div>

        <div className={styles['form-actions']}>
          <button
            className={styles['btn-cancel']}
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            className={styles['btn-save']}
            onClick={onSaveChanges}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    );
  }

  // ── Modo: cambiar email ─────────────────────────────────────────────────────
  if (mode === 'email') {
    const handleSubmit = async () => {
      const ok = await onCambiarEmail(
        emailForm.emailActual,
        emailForm.emailNuevo,
        emailForm.password
      );
      if (ok) {
        alert('Correo actualizado correctamente. Tu sesión ha sido actualizada.');
        onCancel();
      }
    };

    return (
      <div className={styles['profile-form']}>
        <h2 className={styles['form-title']}>Cambiar correo electrónico</h2>
        <p className={styles['form-subtitle']}>
          Ingresa tu contraseña para confirmar el cambio
        </p>

        {errors.general && (
          <div className={styles['error-banner']}>{errors.general}</div>
        )}

        <div className={styles['fields-grid']}>
          <InputField
            label="Correo actual"
            name="emailActual"
            type="email"
            value={emailForm.emailActual}
            onChange={(_, v) => setEmailForm((p) => ({ ...p, emailActual: v }))}
          />
          <InputField
            label="Correo nuevo"
            name="emailNuevo"
            type="email"
            value={emailForm.emailNuevo}
            onChange={(_, v) => setEmailForm((p) => ({ ...p, emailNuevo: v }))}
          />
          <InputField
            label="Contraseña"
            name="password"
            type="password"
            value={emailForm.password}
            onChange={(_, v) => setEmailForm((p) => ({ ...p, password: v }))}
          />
        </div>

        <div className={styles['form-actions']}>
          <button
            className={styles['btn-cancel']}
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            className={styles['btn-save']}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Cambiar correo'}
          </button>
        </div>
      </div>
    );
  }

  // ── Modo: cambiar contraseña ────────────────────────────────────────────────
  if (mode === 'password') {
    const handleSubmit = async () => {
      const ok = await onCambiarPassword(
        passForm.passwordActual,
        passForm.passwordNuevo,
        passForm.passwordConfirm
      );
      if (ok) {
        alert('Contraseña actualizada correctamente.');
        onCancel();
      }
    };

    return (
      <div className={styles['profile-form']}>
        <h2 className={styles['form-title']}>Cambiar contraseña</h2>

        {errors.general && (
          <div className={styles['error-banner']}>{errors.general}</div>
        )}

        <div className={styles['fields-grid']}>
          <InputField
            label="Contraseña actual"
            name="passwordActual"
            type="password"
            value={passForm.passwordActual}
            onChange={(_, v) => setPassForm((p) => ({ ...p, passwordActual: v }))}
          />
          <InputField
            label="Contraseña nueva"
            name="passwordNuevo"
            type="password"
            value={passForm.passwordNuevo}
            onChange={(_, v) => setPassForm((p) => ({ ...p, passwordNuevo: v }))}
          />
          <InputField
            label="Confirmar contraseña nueva"
            name="passwordConfirm"
            type="password"
            value={passForm.passwordConfirm}
            onChange={(_, v) => setPassForm((p) => ({ ...p, passwordConfirm: v }))}
          />
        </div>

        <div className={styles['form-actions']}>
          <button
            className={styles['btn-cancel']}
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            className={styles['btn-save']}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ProfileForm;