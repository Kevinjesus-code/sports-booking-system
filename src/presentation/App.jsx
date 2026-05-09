import Admin from "./screens/admin";
import { useState } from "react";
import Recepcionist from "./screens/receptionist";
import Client from "./screens/client";
import Login from "./screens/login";
import Register from "./screens/register/register";

function App() {
  const [currentFlow, setCurrentFlow] = useState("login");

  const handleLogin = (rol) => {
  if (rol === "ADMIN")              setCurrentFlow("admin");
  else if (rol === "CLIENTE")       setCurrentFlow("client");
  else if (rol === "RECEPCIONISTA") setCurrentFlow("receptionist");
  else alert("Rol no reconocido: " + rol);
};

  return (
    <>
      {currentFlow === "admin" && <Admin />}
      {currentFlow === "receptionist" && <Recepcionist />}
      {currentFlow === "client" && <Client />}
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