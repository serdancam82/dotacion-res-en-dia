import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function App() {
  const [locales, setLocales] = useState([]);

  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState("");
  const [localId, setLocalId] = useState("");

  const [nuevoLocal, setNuevoLocal] = useState("");

  const [editId, setEditId] = useState(null);

  const [busqueda, setBusqueda] = useState("");

  // ================= FETCH (FIX: REFRESH + ORDER) =================
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("locales")
      .select("id, nombre, personal(id, nombre, puesto, local_id)");

    if (error) {
      console.log(error);
      return;
    }

    // orden + refresh limpio
    const ordered = (data || []).sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );

    setLocales(structuredClone(ordered));
  };

  useEffect(() => {
    fetchData();
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
    await supabase.from("personal").delete().eq("id", id);
    await fetchData();
  };

  const deleteLocal = async (id) => {
    await supabase.from("locales").delete().eq("id", id);
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

    saveAs(file, "personal.xlsx");
  };

  // ================= FILTER =================
  const filtered = [...locales].map((l) => ({
    ...l,
    personal: l.personal?.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    ),
  }));

  // ================= UI =================
  return (
    <div style={styles.app}>
      <div style={styles.container}>

        <div style={styles.header}>
          <h2>📊 EQUIPO</h2>
          <p>Sistema de personal</p>
        </div>

        {/* SEARCH + EXPORT */}
        <div style={styles.card}>
          <input
            style={styles.input}
            placeholder="Buscar empleado..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <button style={styles.btnBlue} onClick={exportExcel}>
            📥 Exportar Excel
          </button>
        </div>

        {/* LOCALES */}
        <div style={styles.card}>
          <h3>🏢 Agregar local</h3>

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

        {/* EMPLEADO */}
        <div style={styles.card}>
          <h3>👤 Empleado</h3>

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

        {/* LISTA LOCALES */}
        {filtered.map((local) => (
          <div key={local.id} style={styles.card}>

            {/* FIX: contador empleados */}
            <div style={styles.localHeader}>
              <h3>
                🏢 {local.nombre}{" "}
                <span style={{ fontSize: 12, color: "#777" }}>
                  ({local.personal?.length || 0})
                </span>
              </h3>

              <button
                style={styles.btnRed}
                onClick={() => deleteLocal(local.id)}
              >
                Eliminar
              </button>
            </div>

            {local.personal?.length === 0 && (
              <p style={{ color: "#999" }}>Sin empleados</p>
            )}

            {local.personal?.map((p) => (
              <div key={p.id} style={styles.row}>
                <div>
                  <div style={{ fontWeight: "bold" }}>
                    👤 {p.nombre}
                  </div>

                  <div style={{ fontSize: 12, color: "#777" }}>
                    {p.puesto}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 5 }}>
                  <button onClick={() => startEdit(p)}>✏️</button>
                  <button onClick={() => deleteEmpleado(p.id)}>🗑</button>
                </div>
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
    fontFamily: "Arial",
    background: "#f4f6f8",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: 15,
  },

  container: {
    width: "100%",
    maxWidth: 520,
  },

  header: {
    textAlign: "center",
    marginBottom: 15,
  },

  card: {
    background: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  btnGreen: {
    width: "100%",
    padding: 10,
    background: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
  },

  btnBlue: {
    width: "100%",
    padding: 10,
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
  },

  btnRed: {
    padding: "6px 10px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: 6,
  },

  localHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },
};