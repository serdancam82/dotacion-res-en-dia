import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function App() {
  const [locales, setLocales] = useState([]);
const [zonas, setZonas] = useState([]);

// EMPLEADOS
const [nombre, setNombre] = useState("");
const [puesto, setPuesto] = useState("");
const [localId, setLocalId] = useState("");

// LOCALES
const [nuevoLocal, setNuevoLocal] = useState("");

// EDICIÓN
const [editId, setEditId] = useState(null);

// BÚSQUEDA
const [busqueda, setBusqueda] = useState("");

// LOGIN
const [session, setSession] = useState(null);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [menuUsuario, setMenuUsuario] = useState(false);

// DESPLEGABLES
const [openZonas, setOpenZonas] = useState({});
const [openLocales, setOpenLocales] = useState({});

const toggleZona = (id) => {
  setOpenZonas((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};

const toggleLocal = (id) => {
  setOpenLocales((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};

const login = async () => {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  console.log("LOGIN DATA:", data);
  console.log("LOGIN ERROR:", error);

  if (error) {
    alert(error.message);
    return;
  }

  // Limpia la contraseña después de ingresar
  setPassword("");
};

const logout = async () => {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    alert(error.message);
    return;
  }

  // Limpia formulario y menú
  setEmail("");
  setPassword("");
  setMenuUsuario(false);
};

  // ================= FETCH =================
  const fetchData = async () => {
  const { data, error } = await supabase
    .from("zonas")
    .select(`
      id,
      nombre,
      locales (
        id,
        nombre,
        zona_id,
        personal (
          id,
          nombre,
          puesto,
          local_id
        )
      )
    `);

  if (error) {
    console.log(error);
    return;
  }

  const zonasOrdenadas = (data || []).sort((a, b) =>
    a.nombre.localeCompare(b.nombre)
  );

  setZonas(zonasOrdenadas);

  const todosLosLocales =
    zonasOrdenadas.flatMap(
      (z) => z.locales || []
    );

  setLocales(todosLosLocales);
};
  // ================= INIT =================
  useEffect(() => {
    fetchData();

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    const channel = supabase
      .channel("realtime-personal")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "personal",
        },
        () => fetchData()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "locales",
        },
        () => fetchData()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);
  // ================= EMPLEADO SAVE (FIX VALIDATION) =================
  const saveEmpleado = async () => {
    if (!nombre.trim() || !puesto.trim() || !localId) return;

    let res;

    if (editId) {
      res = await supabase
        .from("personal")
        .update({
          nombre: nombre.trim(),
          puesto: puesto.trim(),
          local_id: localId,
        })
        .eq("id", editId);
    } else {
      res = await supabase.from("personal").insert({
        nombre: nombre.trim(),
        puesto: puesto.trim(),
        local_id: localId,
      });
    }

    if (res.error) {
      alert(res.error.message);
      return;
    }

    resetForm();
    await fetchData();
  };

  // ================= RESET UX =================
  const resetForm = () => {
    setNombre("");
    setPuesto("");
    setLocalId("");
    setEditId(null);
    document.activeElement?.blur();
  };

  const startEdit = (p) => {
    setNombre(p.nombre ?? "");
    setPuesto(p.puesto ?? "");
    setLocalId(p.local_id ?? "");
    setEditId(p.id);
  };

  // ================= DELETE =================
  const deleteEmpleado = async (id) => {
  if (!window.confirm("¿Eliminar empleado?")) return;

  const { error } = await supabase
    .from("personal")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await fetchData();
};

  const deleteLocal = async (id) => {
  if (!window.confirm("¿Eliminar local?")) return;

  const { error } = await supabase
    .from("locales")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await fetchData();
};

  // ================= LOCALES CRUD =================
  const addLocal = async () => {
    if (!nuevoLocal.trim()) return;

    const res = await supabase.from("locales").insert({
      nombre: nuevoLocal.trim(),
    });

    if (res.error) {
      alert(res.error.message);
      return;
    }

    setNuevoLocal("");
    await fetchData();
  };

  // ================= EXPORT =================
  const exportExcel = () => {
  const data = [];

  locales.forEach((l) => {
    l.personal?.forEach((p) => {
      data.push({
        Local: l.nombre,
        Nombre: p.nombre,
        Puesto: p.puesto,
      });
    });
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Personal");

  const buffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([buffer], {
    type: "application/octet-stream",
  });

  const now = new Date();

  const fecha =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  const hora =
    String(now.getHours()).padStart(2, "0") +
    "-" +
    String(now.getMinutes()).padStart(2, "0");

  saveAs(file, `personal_${fecha}_${hora}.xlsx`);
};

  // ================= FILTER =================
  const filtered = [...locales].map((l) => ({
    ...l,
    personal: l.personal?.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    ),
  }));
const totalLocales = locales.length;

const totalEmpleados = locales.reduce(
  (acc, local) => acc + (local.personal?.length || 0),
  0
);

const puestosUnicos = new Set(
  locales.flatMap((l) =>
    (l.personal || []).map((p) => p.puesto)
  )
).size;

const localMasGrande =
  locales.length > 0
    ? locales.reduce((max, actual) =>
        (actual.personal?.length || 0) >
        (max.personal?.length || 0)
          ? actual
          : max
      )
    : null;

// ================= LOGIN SCREEN =================
if (!session) {
  return (
    <div style={styles.app}>
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          marginTop: 100,
        }}
      >
        <div style={styles.card}>
          <h2
            style={{
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            SC Gestión Comercial
          </h2>

          <input
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            style={styles.btnBlue}
            onClick={login}
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
}

  // ================= UI =================
  return (
  <div style={styles.app}>
    <div style={styles.container}>

      <div style={styles.header}>
  <div
    style={{
      background: "white",
      borderRadius: 16,
      padding: "20px 15px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      marginBottom: 15,
      position: "relative",
    }}
  >

    <div
      style={{
        position: "absolute",
        top: 15,
        right: 15,
      }}
    >
      <button
        style={styles.userButton}
        onClick={() =>
          setMenuUsuario(!menuUsuario)
        }
      >
        👤
      </button>

      {menuUsuario && (
        <div style={styles.userMenu}>
          <div style={styles.userEmail}>
            {session?.user?.email}
          </div>

          <button
            style={styles.menuItem}
          >
            Mi Perfil
          </button>

          <button
            style={styles.menuItem}
          >
            Configuración
          </button>

          <button
            style={styles.menuLogout}
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: "800",
              letterSpacing: "0.5px",
            }}
          >
            <span style={{ color: "#1565c0" }}>SC</span>{" "}
            <span style={{ color: "#222" }}>Gestión</span>{" "}
            <span style={{ color: "#2e7d32" }}>Comercial</span>
          </h1>

          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              color: "#666",
              fontSize: 14,
            }}
          >
            Gestión integral de empresas
          </p>
        </div>
      </div>

      <div style={styles.dashboard}>
        <div style={styles.kpi}>
          <div style={styles.kpiNumber}>{totalLocales}</div>
          <div>Locales</div>
        </div>

        <div style={styles.kpi}>
          <div style={styles.kpiNumber}>{totalEmpleados}</div>
          <div>Colaboradores</div>
        </div>

        <div style={styles.kpi}>
          <div style={styles.kpiNumber}>{puestosUnicos}</div>
          <div>Puestos</div>
        </div>

        <div style={styles.kpi}>
          <div style={styles.kpiNumber}>
            {localMasGrande?.personal?.length || 0}
          </div>
          <div>Mayor dotación</div>
        </div>
      </div>

      {/* SEARCH + EXPORT */}
      <div style={styles.card}>
        <input
          style={styles.input}
          placeholder="Buscar colaborador..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <button style={styles.btnBlue} onClick={exportExcel}>
          📊 Exportar Reporte
        </button>
      </div>

      {/* LOCALES */}
      <div style={styles.card}>
        <h3>🏢 Gestión de locales</h3>

        <input
          style={styles.input}
          placeholder="Nombre del local"
          value={nuevoLocal}
          onChange={(e) => setNuevoLocal(e.target.value)}
        />

        <button style={styles.btnBlue} onClick={addLocal}>
          Agregar local
        </button>
      </div>

      {/* EMPLEADOS */}
      <div style={styles.card}>
        <h3>👤 Gestión de colaboradores</h3>

        <input
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Puesto"
          value={puesto}
          onChange={(e) => setPuesto(e.target.value)}
        />

        <select
          style={styles.input}
          value={localId}
          onChange={(e) => setLocalId(e.target.value)}
        >
          <option value="">Seleccionar local</option>

          {locales.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nombre}
            </option>
          ))}
        </select>

        <button style={styles.btnGreen} onClick={saveEmpleado}>
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </div>

      {/* LISTA DE ZONAS */}

{zonas &&
  zonas.map((zona) => (
    <div key={zona.id} style={styles.card}>
      <h2
        style={{
          cursor: "pointer",
          marginBottom: 10,
        }}
        onClick={() => toggleZona(zona.id)}
      >
        {openZonas[zona.id] ? "▼" : "▶"} {zona.nombre}
        {" "}
        (
        {(zona.locales || []).reduce(
          (acc, local) =>
            acc + (local.personal?.length || 0),
          0
        )}
        )
      </h2>

      {openZonas[zona.id] &&
        (zona.locales || []).map((local) => (
          <div
            key={local.id}
            style={{
              marginLeft: 20,
              marginBottom: 12,
            }}
          >
            <div style={styles.localHeader}>
              <h3
                style={styles.localTitle}
                onClick={() =>
                  toggleLocal(local.id)
                }
              >
                {openLocales[local.id]
                  ? "▼"
                  : "▶"}{" "}
                {local.nombre}

                <span style={styles.localCounter}>
                  {" "}
                  ({local.personal?.length || 0})
                </span>
              </h3>

              <button
                style={styles.btnRed}
                onClick={() =>
                  deleteLocal(local.id)
                }
              >
                Eliminar
              </button>
            </div>

            {openLocales[local.id] &&
              (local.personal || []).map((p) => (
                <div
                  key={p.id}
                  style={{
                    ...styles.row,
                    marginLeft: 20,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      👤 {p.nombre}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#777",
                      }}
                    >
                      {p.puesto}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 5,
                    }}
                  >
                    <button
                      onClick={() =>
                        startEdit(p)
                      }
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() =>
                        deleteEmpleado(p.id)
                      }
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
    </div>
  ))}

    </div>
  </div>
);
}
// ================= STYLES (NO TOCAR) =================
const styles = {
  app: {
    fontFamily: "Segoe UI, Arial, sans-serif",
    background: "#111827",
    color: "#f9fafb",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: 20,
  },

  container: {
    width: "100%",
    maxWidth: 900,
  },

  header: {
    textAlign: "center",
    marginBottom: 25,
  },

  card: {
    background: "#1f2937",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    border: "1px solid #374151",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid #374151",
    background: "#111827",
    color: "#ffffff",
    fontSize: 14,
    boxSizing: "border-box",
  },

  btnBlue: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: "bold",
    cursor: "pointer",
  },

  btnGreen: {
    width: "100%",
    padding: 12,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: "bold",
    cursor: "pointer",
  },

  btnRed: {
    padding: "8px 12px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  dashboard: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
    marginBottom: 20,
  },

  kpi: {
    background: "#1f2937",
    borderRadius: 16,
    padding: 18,
    textAlign: "center",
    border: "1px solid #374151",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  },

  kpiNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: "#60a5fa",
    marginBottom: 5,
  },

  localHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  localTitle: {
    color: "#f9fafb",
    cursor: "pointer",
    margin: 0,
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
  },

  localCounter: {
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: "normal",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginTop: 8,
    borderRadius: 10,
    background: "#111827",
    border: "1px solid #374151",
  },

  subtitle: {
    color: "#9ca3af",
    marginTop: 8,
    fontSize: 14,
  },

  // ================= USUARIO =================

  userButton: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: "bold",
  },

  userMenu: {
    position: "absolute",
    top: 50,
    right: 0,
    width: 250,
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0,0,0,.4)",
    zIndex: 9999,
  },

  userEmail: {
    padding: 12,
    fontSize: 12,
    color: "#9ca3af",
    borderBottom: "1px solid #374151",
    wordBreak: "break-word",
  },

  menuItem: {
    width: "100%",
    padding: 12,
    background: "transparent",
    color: "#fff",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
  },

  menuLogout: {
    width: "100%",
    padding: 12,
    background: "#dc2626",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};