/*
==========================================
RES en DÍA

Sidebar.jsx

Responsabilidad:
- Menú lateral principal
- Navegación entre módulos
- Mostrar usuario conectado
- Control visual de acceso por rol
- Cerrar sesión

No contiene lógica de negocio.
==========================================
*/

import { styles } from "./Sidebar.styles";

export default function Sidebar({
  modulo,
  setModulo,
  usuario,
  onLogout,
}) {
  // ==========================================
  // MENÚ COMPLETO
  // ==========================================

  const menuCompleto = [
    {
      id: "dashboard",
      icon: "📊",
      label: "Dashboard",
    },
    {
      id: "zonas",
      icon: "🏢",
      label: "Zonas",
    },
    {
      id: "locales",
      icon: "🏪",
      label: "Locales",
    },
    {
      id: "colaboradores",
      icon: "👥",
      label: "Colaboradores",
    },
    {
      id: "dotacion",
      icon: "📋",
      label: "Dotación",
    },
    {
      id: "movimientos",
      icon: "🔄",
      label: "Movimientos",
    },
    {
      id: "reportes",
      icon: "📈",
      label: "Reportes",
    },
    {
      id: "configuracion",
      icon: "⚙️",
      label: "Configuración",
    },
  ];

  // ==========================================
  // ROL ACTUAL
  // ==========================================

  const rol = usuario?.rol_global || null;
  console.log("SIDEBAR - USUARIO:", usuario);
  console.log("SIDEBAR - ROL:", rol);
  //  ==========================================
  // PERMISOS VISUALES DEL MENÚ
  // ==========================================

  const permisos = {
    administrador: [
      "dashboard",
      "zonas",
      "locales",
      "colaboradores",
      "dotacion",
      "movimientos",
      "reportes",
      "configuracion",
    ],

    supervisor: [
      "dashboard",
      "zonas",
      "locales",
      "colaboradores",
      "dotacion",
      "movimientos",
      "reportes",
    ],

    auditor: [
      "dashboard",
      "zonas",
      "locales",
      "colaboradores",
      "dotacion",
      "reportes",
    ],
  };

  // ==========================================
  // MENÚ SEGÚN ROL
  // ==========================================

  const modulosPermitidos =
    permisos[rol] || ["dashboard"];

  const menu = menuCompleto.filter((item) =>
    modulosPermitidos.includes(item.id)
  );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <aside style={styles.sidebar}>
      <div>
        {/* LOGO */}

        <div style={styles.logo}>
          <div style={styles.logoTitle}>
            RES en DÍA
          </div>

          <div style={styles.logoSubtitle}>
            Sistema de dotación personal
          </div>
        </div>

        {/* MENÚ */}

        <div style={styles.menu}>
          {menu.map((item) => (
            <button
              key={item.id}
              type="button"
              style={{
                ...styles.button,

                ...(modulo === item.id
                  ? styles.buttonActive
                  : {}),
              }}
              onClick={() =>
                setModulo(item.id)
              }
            >
              <span>{item.icon}</span>

              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* USUARIO */}

      <div style={styles.footer}>
        <div style={styles.userName}>
          {usuario?.nombre || "Usuario"}
        </div>

        <div style={styles.userEmail}>
          {usuario?.email || "Sin sesión"}
        </div>

        {usuario?.rol_global && (
          <div
            style={{
              marginTop: 6,
              fontSize: 11,
              color: "#6b7280",
              textTransform: "capitalize",
            }}
          >
            {usuario.rol_global}
          </div>
        )}

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            style={{
              width: "100%",
              marginTop: 12,
              padding: "9px 12px",
              border: "none",
              borderRadius: 8,
              background: "#dc2626",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: 13,
            }}
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </aside>
  );
}

