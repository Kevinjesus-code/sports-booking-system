import Admin from "./screens/admin";
import { useState } from "react";
import Recepcionist from "./screens/receptionist";
import Client from "./screens/client";
import Login from "./screens/login";
import Register from "./screens/register/register";

function App() {
  const [currentFlow, setCurrentFlow] = useState(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.rol === "ADMIN") return "admin";
        if (user.rol === "CLIENTE") return "client";
        if (user.rol === "RECEPCIONISTA") return "receptionist";
      } catch (_) {
        // Ignorar error de parseo
      }
    }
    return "login";
  });

  const handleLogin = (rol) => {
    if (rol === "ADMIN")              setCurrentFlow("admin");
    else if (rol === "CLIENTE")       setCurrentFlow("client");
    else if (rol === "RECEPCIONISTA") setCurrentFlow("receptionist");
    else alert("Rol no reconocido: " + rol);
  };

  const handleLogout = () => {
    setCurrentFlow("login");
  };

  return (
    <>
      {currentFlow === "admin" && <Admin onLogout={handleLogout} />}
      {currentFlow === "receptionist" && <Recepcionist onLogout={handleLogout} />}
      {currentFlow === "client" && <Client onLogout={handleLogout} />}  {/* ← aquí estaba el error */}
      {currentFlow === "login" && (
        <Login
          onLogin={handleLogin}
          onRegister={() => setCurrentFlow("register")}
        />
      )}
      {currentFlow === "register" && (
        <Register onGoToLogin={() => setCurrentFlow("login")} />
      )}
    </>
  );
}

export default App;