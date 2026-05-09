import { useState } from "react";

const buildEditableData = (data = {}) => ({
  nombre: data.nombre || "",
  apellido: data.apellido || "",
  dni: data.dni || "",
  email: data.email || "",
  telefono: data.telefono || "",
  password: "",
  confirmPassword: "",
});

export const useProfileData = (initialData = {}, initialEditing = false) => {
  const [profileData, setProfileData] = useState(initialData);
  const [editableData, setEditableData] = useState(buildEditableData(initialData));
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;
  const validatePhone = (phone) => /^[+]?[\d\s\-()]+$/.test(phone);

  const validateEditableData = (mode = "profile") => {
    const newErrors = {};

    if (mode === "profile" && !editableData.nombre) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (mode === "profile" && !editableData.apellido) {
      newErrors.apellido = "El apellido es obligatorio";
    }

    if ((mode === "profile" || mode === "email") && !editableData.email) {
      newErrors.email = "El correo es obligatorio";
    } else if ((mode === "profile" || mode === "email") && !validateEmail(editableData.email)) {
      newErrors.email = "Correo invalido";
    }

    if (mode === "profile" && !editableData.telefono) {
      newErrors.telefono = "El telefono es obligatorio";
    } else if (mode === "profile" && !validatePhone(editableData.telefono)) {
      newErrors.telefono = "Telefono invalido";
    }

    if (mode === "password" || editableData.password || editableData.confirmPassword) {
      if (!editableData.password) {
        newErrors.password = "La contrasena es obligatoria";
      } else if (!validatePassword(editableData.password)) {
        newErrors.password = "Minimo 8 caracteres";
      }

      if (!editableData.confirmPassword) {
        newErrors.confirmPassword = "Debe confirmar la contrasena";
      } else if (editableData.password !== editableData.confirmPassword) {
        newErrors.confirmPassword = "Las contrasenas no coinciden";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetEditableData = () => {
    setEditableData(buildEditableData(profileData));
    setErrors({});
  };

  const handleEditToggle = () => {
    if (isEditing) {
      resetEditableData();
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

  const handleSaveChanges = (mode = "profile") => {
    if (!validateEditableData(mode)) {
      return false;
    }

    const updatedData = {
      ...profileData,
      nombre: mode === "profile" ? editableData.nombre : profileData.nombre,
      apellido: mode === "profile" ? editableData.apellido : profileData.apellido,
      dni: mode === "profile" ? editableData.dni : profileData.dni,
      email: mode === "profile" || mode === "email" ? editableData.email : profileData.email,
      telefono: mode === "profile" ? editableData.telefono : profileData.telefono,
    };

    if (editableData.password) {
      updatedData.password = editableData.password;
    }

    setProfileData(updatedData);
    setEditableData(buildEditableData(updatedData));
    setIsEditing(false);
    setErrors({});
    return true;
  };

  return {
    profileData,
    setProfileData,
    editableData,
    handleEditableDataChange,
    isEditing,
    setIsEditing,
    handleEditToggle,
    handleSaveChanges,
    resetEditableData,
    errors,
  };
};
