import Admin from "./screens/admin"
import { useState } from "react";
import Recepcionist from "./screens/receptionist"
// import Client from "./screens/client"
import Login from "./screens/login"
  
function App() {
  const [currentFlow, setCurrentFlow] = useState("login");

  const handleLogin = (email) => {
    if (email === "example@recep.com") {
      setCurrentFlow("receptionist");
    } else if (email === "example@admin.com") {
      setCurrentFlow("admin");
    } else {
      alert("Correo no asignado a ningún flujo (usa example@recep.com o example@admin.com)");
    }
  };

  return (
    <>
       {currentFlow === "admin" && <Admin />}
       {currentFlow === "receptionist" && <Recepcionist />}
       {/* {currentFlow === "client" && <Client />} */}
       {currentFlow === "login" && <Login onLogin={handleLogin} />}
    </>
  )
}

export default App
