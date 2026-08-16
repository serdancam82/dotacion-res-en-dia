import { useState } from "react";

import Sidebar from "./components/layout/Sidebar";

import Dashboard from "./pages/Dashboard";
import Zonas from "./pages/Zonas";
import Locales from "./pages/Locales";
import Colaboradores from "./pages/Colaboradores";
import Dotacion from "./pages/Dotacion";
import Movimientos from "./pages/Movimientos";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";

export default function AppV2() {
  const [modulo, setModulo] = useState("dashboard");

  const usuario = {
    nombre: "Administrador",
    email: "admin@scgestion.com",
  };

  function renderPagina() {
    switch (modulo) {
      case "dashboard":
        return <Dashboard />;

      case "zonas":
        return <Zonas />;

      case "locales":
        return <Locales />;

      case "colaboradores":
        return <Colaboradores />;

      case "dotacion":
        return <Dotacion />;

      case "movimientos":
        return <Movimientos />;

      case "reportes":
        return <Reportes />;

      case "configuracion":
        return <Configuracion />;

      default:
        return <Dashboard />;
    }
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#F4F7FB",
        overflow: "hidden",
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
          padding: "30px",
          overflowY: "auto",
          minWidth: 0,
        }}
      >
        {renderPagina()}
      </main>
    </div>
  );
}