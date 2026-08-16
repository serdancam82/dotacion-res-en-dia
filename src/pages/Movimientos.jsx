import { useEffect, useState } from "react";

import { getColaboradores } from "../services/colaboradoresService";
import { getLocales } from "../services/localesService";

export default function Movimientos() {
  const [colaboradores, setColaboradores] = useState([]);
  const [locales, setLocales] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargarDatos() {
    try {
      setLoading(true);
      setError("");

      const [colaboradoresData, localesData] =
        await Promise.all([
          getColaboradores(),
          getLocales(),
        ]);

      setColaboradores(colaboradoresData || []);
      setLocales(localesData || []);
    } catch (err) {
      console.error("Error cargando movimientos:", err);

      setError(
        err?.message ||
          "No se pudieron cargar los movimientos."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function obtenerNombreLocal(localId) {
    const local = locales.find(
      (item) => item.id === localId
    );

    if (!local) {
      return "-";
    }

    return `${local.numero || ""} - ${
      local.nombre || "Sin nombre"
    }`;
  }

  if (loading) {
    return (
      <div style={styles.loading}>
        Cargando movimientos...
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        {error}
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            🔄 Movimientos
          </h1>

          <p style={styles.subtitle}>
            Historial y movimientos de colaboradores
          </p>
        </div>

        <button
          style={styles.refresh}
          onClick={cargarDatos}
        >
          🔄 Actualizar
        </button>
      </div>

      {colaboradores.length === 0 ? (
        <div style={styles.empty}>
          No hay colaboradores registrados.
        </div>
      ) : (
        <div style={styles.grid}>
          {colaboradores.map((colaborador) => (
            <div
              key={colaborador.id}
              style={styles.card}
            >
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.nombre}>
                    {colaborador.nombre || "Sin nombre"}{" "}
                    {colaborador.apellido || ""}
                  </div>

                  <div style={styles.puesto}>
                    {colaborador.puesto || "-"}
                  </div>
                </div>

                <div style={styles.icon}>
                  🔄
                </div>
              </div>

              <div style={styles.info}>
                <div>
                  <strong>Local actual</strong>
                </div>

                <div style={styles.local}>
                  {obtenerNombreLocal(
                    colaborador.local_id
                  )}
                </div>
              </div>

              <div style={styles.footer}>
                Movimiento registrado
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  loading: {
    padding: 40,
    textAlign: "center",
    color: "#6b7280",
  },

  error: {
    padding: 20,
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: 12,
  },

  empty: {
    background: "#ffffff",
    padding: 30,
    borderRadius: 16,
    textAlign: "center",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    gap: 20,
  },

  title: {
    margin: 0,
    color: "#1f2937",
    fontSize: 30,
  },

  subtitle: {
    marginTop: 6,
    color: "#6b7280",
  },

  refresh: {
    border: "none",
    borderRadius: 10,
    padding: "10px 16px",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 18,
  },

  card: {
    background: "#ffffff",
    borderRadius: 16,
    padding: 20,
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 5px 18px rgba(0,0,0,0.06)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },

  nombre: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  puesto: {
    marginTop: 5,
    fontSize: 13,
    color: "#6b7280",
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eff6ff",
    fontSize: 20,
  },

  info: {
    padding: 14,
    background: "#f9fafb",
    borderRadius: 10,
    color: "#374151",
  },

  local: {
    marginTop: 6,
    fontWeight: "700",
    color: "#2563eb",
  },

  footer: {
    marginTop: 15,
    fontSize: 12,
    color: "#9ca3af",
  },
};