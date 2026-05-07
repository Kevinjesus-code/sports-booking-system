import { useState } from "react";

export const useProfileData = (initialData = {}) => {
  const [profileData, setProfileData] = useState(initialData);
  const [editableData, setEditableData] = useState({
    email: initialData?.email || "",
    telefono: initialData?.telefono || "",
    password: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[\d\s\-()]+$/;
    return phoneRegex.test(phone);
  };

  const validateEditableData = () => {
    const newErrors = {};

    if (!editableData.email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!validateEmail(editableData.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!editableData.telefono) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!validatePhone(editableData.telefono)) {
      newErrors.telefono = "Teléfono inválido";
    }

    if (editableData.password || editableData.confirmPassword) {
      if (!editableData.password) {
        newErrors.password = "La contraseña es obligatoria";
      } else if (!validatePassword(editableData.password)) {
        newErrors.password = "Mínimo 8 caracteres";
      }

      if (!editableData.confirmPassword) {
        newErrors.confirmPassword = "Debe confirmar la contraseña";
      } else if (editableData.password !== editableData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditableData({
        email: profileData?.email || "",
        telefono: profileData?.telefono || "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleEditableDataChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSaveChanges = () => {
    if (validateEditableData()) {
      const updatedData = {
        ...profileData,
        email: editableData.email,
        telefono: editableData.telefono,
      };

      if (editableData.password) {
        updatedData.password = editableData.password;
      }

      setProfileData(updatedData);
      setEditableData({
        email: updatedData.email,
        telefono: updatedData.telefono,
        password: "",
        confirmPassword: "",
      });
      setIsEditing(false);
      return true;
    }
    return false;
  };

  return {
    profileData,
    setProfileData,
    editableData,
    handleEditableDataChange,
    isEditing,
    handleEditToggle,
    handleSaveChanges,
    errors,
  };
};
