import { useEffect, useState } from "react";

import Sidebar from "./components/layout/Sidebar";

import Dashboard from "./pages/Dashboard";
import Zonas from "./pages/Zonas";
import Locales from "./pages/Locales";
import Colaboradores from "./pages/Colaboradores";
import Dotacion from "./pages/Dotacion";
import Movimientos from "./pages/Movimientos";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";

import {
  getUsuarioActual,
  onAuthStateChange,
  login,
  logout,
} from "./services/authService";

export default function AppV2() {
  const [modulo, setModulo] = useState("dashboard");

  const [usuario, setUsuario] = useState(null);

  const [cargando, setCargando] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  // ==========================================
  // INICIALIZAR AUTENTICACIÓN
  // ==========================================

  useEffect(() => {
    let activo = true;

    async function inicializar() {
      try {
        const usuarioActual =
          await getUsuarioActual();

        if (!activo) return;

        setUsuario(usuarioActual);
      } catch (error) {
        console.error(
          "ERROR INICIALIZANDO USUARIO:",
          error
        );

        if (activo) {
          setUsuario({
            session: null,
            user: null,
            perfil: null,
          });
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    inicializar();

    const subscription =
      onAuthStateChange((usuarioActual) => {
        if (!activo) return;

        setUsuario(usuarioActual);
      });

    return () => {
      activo = false;

      subscription?.unsubscribe();
    };
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  async function handleLogin(event) {
    event.preventDefault();

    setErrorLogin("");

    if (!email.trim() || !password) {
      setErrorLogin(
        "Ingresá correo electrónico y contraseña."
      );

      return;
    }

    try {
      await login(
        email.trim(),
        password
      );

      setPassword("");
    } catch (error) {
      console.error(
        "ERROR LOGIN:",
        error
      );

      setErrorLogin(
        error?.message ||
          "No fue posible iniciar sesión."
      );
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  async function handleLogout() {
    try {
      await logout();

      setUsuario(null);
      setEmail("");
      setPassword("");
      setModulo("dashboard");
    } catch (error) {
      console.error(
        "ERROR LOGOUT:",
        error
      );

      alert(
        error?.message ||
          "No fue posible cerrar sesión."
      );
    }
  }

  // ==========================================
  // NAVEGACIÓN
  // ==========================================

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

  // ==========================================
  // CARGANDO
  // ==========================================

  if (cargando) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingTitle}>
            RES en DÍA
          </div>

          <div style={styles.loadingText}>
            Verificando sesión...
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // LOGIN
  // ==========================================

  if (!usuario?.session) {
    return (
      <div style={styles.loginContainer}>
        <form
          style={styles.loginCard}
          onSubmit={handleLogin}
        >
          <div style={styles.loginLogo}>
            <div style={styles.logoRES}>
              RES
            </div>

            <div style={styles.logoEn}>
              en
            </div>

            <div style={styles.logoDIA}>
              DÍA
            </div>
          </div>

          <h1 style={styles.loginTitle}>
            RES en DÍA
          </h1>

          <p style={styles.loginSubtitle}>
            Sistema de dotación personal
          </p>

          <div style={styles.loginDivider} />

          <label style={styles.label}>
            Correo electrónico
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Ingresá tu correo"
            autoComplete="email"
            style={styles.input}
          />

          <label style={styles.label}>
            Contraseña
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Ingresá tu contraseña"
            autoComplete="current-password"
            style={styles.input}
          />

          {errorLogin && (
            <div style={styles.error}>
              {errorLogin}
            </div>
          )}

          <button
            type="submit"
            style={styles.loginButton}
          >
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  // ==========================================
  // PERFIL INACTIVO
  // ==========================================

  if (
    usuario?.perfil &&
    usuario.perfil.activo === false
  ) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={styles.loginLogo}>
            <div style={styles.logoRES}>
              RES
            </div>

            <div style={styles.logoEn}>
              en
            </div>

            <div style={styles.logoDIA}>
              DÍA
            </div>
          </div>

          <h2 style={styles.loginTitle}>
            Usuario inactivo
          </h2>

          <p style={styles.loginSubtitle}>
            Tu usuario no tiene acceso activo
            al sistema.
          </p>

          <button
            type="button"
            style={styles.loginButton}
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // PERFIL NO ENCONTRADO
  // ==========================================

  if (
    usuario?.user &&
    !usuario?.perfil
  ) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={styles.loginLogo}>
            <div style={styles.logoRES}>
              RES
            </div>

            <div style={styles.logoEn}>
              en
            </div>

            <div style={styles.logoDIA}>
              DÍA
            </div>
          </div>

          <h2 style={styles.loginTitle}>
            Perfil no configurado
          </h2>

          <p style={styles.loginSubtitle}>
            Tu usuario está autenticado,
            pero todavía no tiene un perfil
            configurado en el sistema.
          </p>

          <div style={styles.emailInfo}>
            {usuario.user.email}
          </div>

          <button
            type="button"
            style={styles.loginButton}
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // USUARIO REAL
  // ==========================================

  const usuarioSidebar = {
    nombre:
      usuario?.perfil?.nombre ||
      usuario?.user?.email ||
      "Usuario",

    email:
      usuario?.perfil?.email ||
      usuario?.user?.email ||
      "",

    rol_global:
      usuario?.perfil?.rol_global ||
      null,
  };

  // ==========================================
  // APLICACIÓN
  // ==========================================

  return (
    <div style={styles.app}>
      <Sidebar
        modulo={modulo}
        setModulo={setModulo}
        usuario={usuarioSidebar}
        onLogout={handleLogout}
      />

      <main style={styles.main}>
        {renderPagina()}
      </main>
    </div>
  );
}

// ==========================================
// ESTILOS
// ==========================================

const styles = {
  app: {
    display: "flex",
    height: "100vh",
    background: "#F4F7FB",
    overflow: "hidden",
  },

  main: {
    flex: 1,
    padding: "30px",
    overflowY: "auto",
    minWidth: 0,
  },

  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#F4F7FB",
    padding: 20,
  },

  loadingCard: {
    background: "#ffffff",
    borderRadius: 18,
    padding: 35,
    width: "100%",
    maxWidth: 400,
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
    border:
      "1px solid #e5e7eb",
  },

  loadingTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1565c0",
    marginBottom: 10,
  },

  loadingText: {
    color: "#6b7280",
    fontSize: 14,
  },

  loginContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #eff6ff 0%, #f4f7fb 50%, #fef2f2 100%)",
    padding: 20,
    boxSizing: "border-box",
  },

  loginCard: {
    width: "100%",
    maxWidth: 420,
    background: "#ffffff",
    borderRadius: 20,
    padding: 35,
    boxSizing: "border-box",
    boxShadow:
      "0 15px 45px rgba(0,0,0,0.10)",
    border:
      "1px solid #e5e7eb",
  },

  loginLogo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 15,
  },

  logoRES: {
    color: "#1565c0",
    fontSize: 30,
    fontWeight: "900",
  },

  logoEn: {
    color: "#222222",
    fontSize: 22,
    fontWeight: "600",
  },

  logoDIA: {
    color: "#dc2626",
    fontSize: 30,
    fontWeight: "900",
  },

  loginTitle: {
    textAlign: "center",
    margin: 0,
    color: "#111827",
    fontSize: 25,
    fontWeight: "800",
  },

  loginSubtitle: {
    textAlign: "center",
    margin:
      "8px 0 0",
    color: "#6b7280",
    fontSize: 14,
  },

  loginDivider: {
    height: 1,
    background: "#e5e7eb",
    margin:
      "25px 0",
  },

  label: {
    display: "block",
    marginBottom: 7,
    color: "#374151",
    fontSize: 13,
    fontWeight: "700",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    marginBottom: 16,
    border:
      "1px solid #d1d5db",
    borderRadius: 10,
    background: "#ffffff",
    color: "#111827",
    fontSize: 14,
    outline: "none",
  },

  loginButton: {
    width: "100%",
    border: "none",
    borderRadius: 10,
    padding: "13px 18px",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 5,
  },

  error: {
    padding: 11,
    marginBottom: 14,
    borderRadius: 9,
    background: "#fee2e2",
    color: "#991b1b",
    border:
      "1px solid #fecaca",
    fontSize: 13,
    lineHeight: 1.4,
  },

  emailInfo: {
    marginTop: 20,
    marginBottom: 20,
    padding: 12,
    borderRadius: 10,
    background: "#f3f4f6",
    color: "#374151",
    textAlign: "center",
    fontSize: 13,
    wordBreak: "break-word",
  },
};