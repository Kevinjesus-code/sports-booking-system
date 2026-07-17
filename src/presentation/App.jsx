  import Admin         from "./screens/admin";
  import Recepcionist  from "./screens/receptionist";
  import Client        from "./screens/client";
  import Login         from "./screens/login";
  import Register      from "./screens/register/register";
  import ResetPassword from "./screens/reset-password/ResetPassword";
  import { useState, useEffect } from "react";
  import { useAuth } from "../context/AuthContext";

  function getResetToken() {
    return new URLSearchParams(window.location.search).get("token");
  }

  function App() {
    const { user, logout } = useAuth();
    const [resetToken, setResetToken] = useState(() => getResetToken());

    const [currentFlow, setCurrentFlow] = useState(() => {
      if (getResetToken()) return "reset-password";
      if (!user) return "login";
      if (user.rol === "ADMIN")         return "admin";
      if (user.rol === "CLIENTE")       return "client";
      if (user.rol === "RECEPCIONISTA") return "receptionist";
      return "login";
    });

    useEffect(() => {
  const token = getResetToken();
  if (token) {
    setResetToken(token);
    setCurrentFlow("reset-password");
    return; // ← el token tiene prioridad, salimos
  }
  if (!user) setCurrentFlow("login");
}, [user]);

    const handleLogin = (rol) => {
      if      (rol === "ADMIN")         setCurrentFlow("admin");
      else if (rol === "CLIENTE")       setCurrentFlow("client");
      else if (rol === "RECEPCIONISTA") setCurrentFlow("receptionist");
      else alert("Rol no reconocido: " + rol);
    };

    const handleLogout = () => {
      setCurrentFlow("login");
    };

    const handleResetDone = () => {
      setResetToken(null);
      window.history.replaceState({}, "", window.location.pathname);
      setCurrentFlow("login");
    };

    return (
      <>
        {currentFlow === "admin"          && <Admin         onLogout={handleLogout} />}
        {currentFlow === "receptionist"   && <Recepcionist  onLogout={handleLogout} />}
        {currentFlow === "client"         && <Client        onLogout={handleLogout} />}
        {currentFlow === "login"          && (
          <Login onLogin={handleLogin} onRegister={() => setCurrentFlow("register")} />
        )}
        {currentFlow === "register"       && (
          <Register onGoToLogin={() => setCurrentFlow("login")} />
        )}
        {currentFlow === "reset-password" && (
          <ResetPassword token={resetToken} onDone={handleResetDone} />
        )}
      </>
    );
  }

  export default App;