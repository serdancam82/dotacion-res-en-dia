/*
==========================================
SC Gestión Comercial V2

AppV2.jsx

Responsabilidad:
- Componente principal
- Control de navegación
- Layout general

No contiene lógica de negocio.
==========================================
*/

import { useState } from "react";
import Zonas from "./pages/Zonas";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Colaboradores from "./pages/Colaboradores";
import Locales from "./pages/Locales";

export default function AppV2() {
  const [modulo, setModulo] = useState("dashboard");

  // Más adelante vendrá desde Supabase
  const usuario = {
    nombre: "Administrador",
    email: "admin@scgestion.com",
  };

  const renderPagina = () => {
    switch (modulo) {
      case "dashboard":
        return <Dashboard />;

      case "zonas":
        return <Zonas />;;

      case "locales":
       return <Locales />;

      case "colaboradores":
        return <Colaboradores />;

      case "dotacion":
        return <h1>Dotación</h1>;

      case "movimientos":
        return <h1>Movimientos</h1>;

      case "reportes":
        return <h1>Reportes</h1>;

      case "configuracion":
        return <h1>Configuración</h1>;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#F4F7FB",
      }}
    >
      <Sidebar
        modulo={modulo}
        setModulo={setModulo}
        usuario={usuario}
      />

      <main
        style={{
          flex: 1,
          padding: 30,
          overflowY: "auto",
        }}
      >
        {renderPagina()}
      </main>
    </div>
  );
}