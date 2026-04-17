import { useState, lazy, Suspense } from "react";

// Lazy-loaded screens — cada pantalla se carga solo cuando el usuario la necesita
const Admin       = lazy(() => import("./screens/admin"));
const Recepcionist = lazy(() => import("./screens/receptionist"));
const Client      = lazy(() => import("./screens/client"));
const Login       = lazy(() => import("./screens/login"));
const Register    = lazy(() => import("./screens/register/register"));

const Loader = () => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#fff",
    fontSize: 14,
    color: "#9ca3af",
    fontFamily: "system-ui, sans-serif",
  }}>
    Cargando…
  </div>
);

function App() {
  const [currentFlow, setCurrentFlow] = useState("login");

  const handleLogin = (email) => {
    if (email === "example@recep.com") {
      setCurrentFlow("receptionist");
    } else if (email === "example@admin.com") {
      setCurrentFlow("admin");
    } else if (email === "example@client.com") {
      setCurrentFlow("client");
    } else {
      alert(
        "Correo no asignado a ningún flujo (usa example@recep.com o example@admin.com)",
      );
    }
  };

  return (
    <Suspense fallback={<Loader />}>
      {currentFlow === "admin"       && <Admin />}
      {currentFlow === "receptionist" && <Recepcionist />}
      {currentFlow === "client"      && <Client />}
      {currentFlow === "login"       && <Login onLogin={handleLogin} onRegister={() => setCurrentFlow("register")} />}
      {currentFlow === "register"    && <Register onGoToLogin={() => setCurrentFlow("login")} />}
    </Suspense>
  );
}

export default App;
