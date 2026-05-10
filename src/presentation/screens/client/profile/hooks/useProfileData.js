// RUTA: src/presentation/screens/client/profile/hooks/useProfileData.js

import { useState, useEffect } from 'react';
import {
  getPerfil,
  updatePerfil,
  cambiarEmail,
  cambiarPassword,
} from '../../../../../application/perfil/perfilUseCases';

export function useProfileData() {
  const [profileData,  setProfileData]  = useState(null);
  const [editableData, setEditableData] = useState({});
  const [errors,       setErrors]       = useState({});
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [fetchError,   setFetchError]   = useState(null);

  useEffect(() => {
    getPerfil()
      .then((data) => {
        setProfileData(data);
        setEditableData(data);
      })
      .catch(() => setFetchError('No se pudo cargar el perfil'))
      .finally(() => setLoading(false));
  }, []);

  const handleEditableDataChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSaveChanges = async () => {
    const newErrors = {};
    if (!editableData.nombre?.trim())   newErrors.nombre   = 'El nombre es requerido';
    if (!editableData.apellido?.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!editableData.dni?.trim())      newErrors.dni      = 'El DNI es requerido';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return false;
    }
    setSaving(true);
    try {
      const updated = await updatePerfil(editableData);
      setProfileData(updated);
      setEditableData(updated);
      return true;
    } catch (err) {
      setErrors({ general: err.response?.data?.message ?? 'Error al guardar' });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleCambiarEmail = async (emailActual, emailNuevo, password) => {
    setSaving(true);
    setErrors({});
    try {
      const data = await cambiarEmail({ emailActual, emailNuevo, password });
      setProfileData((prev) => ({ ...prev, email: data.email }));
      return true;
    } catch (err) {
      setErrors({ general: err.response?.data?.message ?? 'Error al cambiar el correo' });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleCambiarPassword = async (passwordActual, passwordNuevo, passwordConfirm) => {
    setErrors({});
    if (passwordNuevo !== passwordConfirm) {
      setErrors({ general: 'Las contraseñas nuevas no coinciden' });
      return false;
    }
    if (passwordNuevo.length < 8) {
      setErrors({ general: 'La contraseña debe tener al menos 8 caracteres' });
      return false;
    }
    setSaving(true);
    try {
      await cambiarPassword({ passwordActual, passwordNuevo, passwordConfirm });
      return true;
    } catch (err) {
      setErrors({ general: err.response?.data?.message ?? 'Error al cambiar la contraseña' });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const resetEditableData = () => {
    setEditableData(profileData ?? {});
    setErrors({});
  };

  return {
    profileData,
    editableData,
    handleEditableDataChange,
    handleSaveChanges,
    handleCambiarEmail,
    handleCambiarPassword,
    resetEditableData,
    errors,
    loading,
    saving,
    fetchError,
  };
}