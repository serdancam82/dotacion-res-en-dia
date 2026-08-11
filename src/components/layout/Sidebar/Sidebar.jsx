/*
==========================================
SC Gestión Comercial V2

Sidebar.jsx

Responsabilidad:
- Menú lateral principal
- Navegación entre módulos
- Mostrar usuario conectado

No contiene lógica de negocio.
==========================================
*/

import { styles } from "./Sidebar.styles";

export default function Sidebar({
  modulo,
  setModulo,
  usuario,
}) {
  const menu = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "zonas", icon: "🏢", label: "Zonas" },
    { id: "locales", icon: "🏪", label: "Locales" },
    { id: "colaboradores", icon: "👥", label: "Colaboradores" },
    { id: "dotacion", icon: "📋", label: "Dotación" },
    { id: "movimientos", icon: "🔄", label: "Movimientos" },
    { id: "reportes", icon: "📈", label: "Reportes" },
    { id: "configuracion", icon: "⚙️", label: "Configuración" },
  ];

  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.logo}>
          <div style={styles.logoTitle}>SC</div>

          <div style={styles.logoSubtitle}>
            Gestión Comercial V2
          </div>
        </div>

        <div style={styles.menu}>
          {menu.map((item) => (
            <button
              key={item.id}
              style={{
                ...styles.button,
                ...(modulo === item.id
                  ? styles.buttonActive
                  : {}),
              }}
              onClick={() => setModulo(item.id)}
            >
              <span>{item.icon}</span>

              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.userName}>
          {usuario?.nombre || "Usuario"}
        </div>

        <div style={styles.userEmail}>
          {usuario?.email || "Sin sesión"}
        </div>
      </div>
    </aside>
  );
}