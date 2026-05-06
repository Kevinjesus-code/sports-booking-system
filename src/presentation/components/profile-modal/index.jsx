import { useState } from "react";
import styles from "./profile-modal.module.css";

const ProfileModal = ({ client, reservationCount = 0, onClose }) => {
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    nombre: client.nombre,
    email: client.email,
    telefono: client.telefono,
    documento: client.documento,
    numeroDocumento: client.numeroDocumento,
    direccion: client.direccion,
    metodoPago: client.metodoPago,
  });

  const handleChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
  };

  const handleSave = () => {
    // Aquí luego puedes conectar con backend
    console.log("Datos guardados:", formData);
    setEditMode(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.modalHeader}>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
          <div className={styles.avatarLarge}>
            {formData.nombre
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <h2 className={styles.clientName}>{formData.nombre}</h2>
          <span className={styles.clientTag}>Cliente</span>
        </div>

        {/* BODY */}
        <div className={styles.modalBody}>
          {!editMode ? (
            <>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Correo</span>
                <span className={styles.infoValue}>{formData.email}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Teléfono</span>
                <span className={styles.infoValue}>{formData.telefono}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Documento</span>
                <span className={styles.infoValue}>
                  {formData.documento} - {formData.numeroDocumento}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Dirección</span>
                <span className={styles.infoValue}>{formData.direccion}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Método de pago</span>
                <span className={styles.infoValue}>{formData.metodoPago}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Reservas</span>
                <span className={styles.infoValue}>{reservationCount}</span>
              </div>

              <button
                className={styles.editBtn}
                onClick={() => setEditMode(true)}
              >
                ✏️ Editar perfil
              </button>

              <button className={styles.logoutBtn}>🚪 Cerrar sesión</button>
            </>
          ) : (
            <>
              <input
                className={styles.input}
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                placeholder="Nombre"
              />

              <input
                className={styles.input}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Correo"
              />

              <input
                className={styles.input}
                value={formData.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
                placeholder="Teléfono"
              />

              <input
                className={styles.input}
                value={formData.numeroDocumento}
                onChange={(e) =>
                  handleChange("numeroDocumento", e.target.value)
                }
                placeholder="Documento"
              />

              <input
                className={styles.input}
                value={formData.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
                placeholder="Dirección"
              />

              <input
                className={styles.input}
                value={formData.metodoPago}
                onChange={(e) => handleChange("metodoPago", e.target.value)}
                placeholder="Método de pago"
              />

              <button className={styles.saveBtn} onClick={handleSave}>
                💾 Guardar
              </button>

              <button
                className={styles.cancelBtn}
                onClick={() => setEditMode(false)}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ProfileModal;
