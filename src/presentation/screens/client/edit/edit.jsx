import "./edit-profile-modular.css";
import { useState } from "react";

export default function EditProfile() {
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [login, setLogin] = useState(true);
  const [modal, setModal] = useState(false);
  const [password, setPassword] = useState(false);
  const usuario = {
    nombre: "Juan Perez",
    correo: "juan@correo.com",
    telefono: "987654321",
    direccion: "Lima, Peru",
    rol: "Administrador",
    foto: "https://i.pravatar.cc/150?img=12",
  };
  if (!login) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          <input placeholder="Correo" />
          <input type="password" placeholder="Contraseña" />
          <button className="btn-primary" onClick={() => setLogin(true)}>
            Ingresar
          </button>
        </div>
        {modal && (
          <div className="modal">
            <div className="modal-box">
              <h3>Editar Perfil</h3>
              <input defaultValue={usuario.nombre} />
              <input defaultValue={usuario.correo} />
              <button className="btn-primary" onClick={() => setModal(false)}>
                Guardar
              </button>
            </div>
          </div>
        )}
        {password && (
          <div className="modal">
            <div className="modal-box">
              <h3>Nueva Contraseña</h3>
              <input type="password" placeholder="Nueva contraseña" />
              <button
                className="btn-primary"
                onClick={() => setPassword(false)}
              >
                Actualizar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold mb-3">Landing Page</h1>
          <p className="text-slate-600 mb-6">
            Bienvenido al sistema. Desde aquí puedes administrar tu cuenta y
            consultar tu perfil.
          </p>
          <button
            className="btn-primary"
            onClick={() => setMostrarPerfil(true)}
          >
            Ver Perfil
          </button>
        </section>
        {mostrarPerfil && (
          <section className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-4">Mi Perfil</h2>
            <div className="space-y-3">
              <img src={usuario.foto} className="avatar" />
              <div>
                <b>Nombre:</b> {usuario.nombre}
              </div>
              <div>
                <b>Correo:</b> {usuario.correo}
              </div>
              <div>
                <b>Teléfono:</b> {usuario.telefono}
              </div>
              <div>
                <b>Dirección:</b> {usuario.direccion}
              </div>
              <div>
                <b>Rol:</b> {usuario.rol}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="btn-success" onClick={() => setModal(true)}>
                Editar Perfil
              </button>
              <button className="btn-dark" onClick={() => setLogin(false)}>
                Cerrar Sesión
              </button>
              <button className="btn-warning" onClick={() => setPassword(true)}>
                Cambiar Contraseña
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* CSS FILE: edit-profile-modular.css
.min-h-screen{min-height:100vh}.bg-slate-100{background:#f1f5f9}.p-6{padding:24px}.max-w-5xl{max-width:1100px}.mx-auto{margin:auto}.grid{display:grid}.md\:grid-cols-2{grid-template-columns:1fr 1fr}.gap-6{gap:24px}.bg-white{background:#fff}.rounded-2xl{border-radius:18px}.shadow{box-shadow:0 10px 20px rgba(0,0,0,.08)}.p-8{padding:32px}.btn-primary{background:#2563eb;color:#fff;padding:10px 18px;border:none;border-radius:12px;cursor:pointer}.btn-primary:hover{background:#1d4ed8}
*/
