import { useEffect, useState } from "react";

import { getLocales } from "../services/localesService";
import { getColaboradores } from "../services/colaboradoresService";

export default function Dotacion() {
  const [locales, setLocales] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // CARGAR DATOS
  // =====================================================

  async function cargarDatos() {
    try {
      setLoading(true);
      setError("");

      const [localesData, colaboradoresData] =
        await Promise.all([
          getLocales(),
          getColaboradores(),
        ]);

      setLocales(localesData || []);
      setColaboradores(colaboradoresData || []);
    } catch (err) {
      console.error(
        "Error cargando Dotación:",
        err
      );

      setError(
        err?.message ||
          "No se pudieron cargar los datos."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // CARGA INICIAL
  // =====================================================

  useEffect(() => {
    cargarDatos();
  }, []);

  // =====================================================
  // DOTACIÓN REAL
  // =====================================================

  function obtenerReal(localId) {
    return colaboradores.filter(
      (colaborador) =>
        colaborador.local_id === localId
    ).length;
  }

  // =====================================================
  // ESTADO DEL LOCAL
  // =====================================================

  function obtenerEstado(teorica, real) {
    const diferencia = real - teorica;

    if (diferencia < 0) {
      return {
        texto: `⚠️ Faltan ${Math.abs(diferencia)}`,
        style: styles.faltante,
      };
    }

    if (diferencia === 0) {
      return {
        texto: "🟢 Dotación completa",
        style: styles.completo,
      };
    }

    return {
      texto: `🔴 Excedente ${diferencia}`,
      style: styles.excedente,
    };
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.loading}>
        Cargando dotación...
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div style={styles.error}>
        <strong>Error:</strong>

        <div style={{ marginTop: 8 }}>
          {error}
        </div>

        <button
          style={styles.retry}
          onClick={cargarDatos}
        >
          🔄 Reintentar
        </button>
      </div>
    );
  }

  // =====================================================
  // PANTALLA
  // =====================================================

  return (
    <div>

      {/* =================================================
          CABECERA
      ================================================= */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.title}>
            📋 Dotación
          </h1>

          <p style={styles.subtitle}>
            Control de dotación teórica y real por
            local
          </p>
        </div>

        <button
          style={styles.refresh}
          onClick={cargarDatos}
        >
          🔄 Actualizar
        </button>

      </div>


      {/* =================================================
          SIN LOCALES
      ================================================= */}

      {locales.length === 0 ? (

        <div style={styles.empty}>
          No hay locales registrados.
        </div>

      ) : (

        <div style={styles.grid}>

          {locales.map((local) => {

            const teorica =
              Number(
                local.dotacion_teorica ?? 4
              );

            const real =
              obtenerReal(local.id);

            const diferencia =
              real - teorica;

            const estado =
              obtenerEstado(
                teorica,
                real
              );

            return (

              <div
                key={local.id}
                style={styles.card}
              >

                {/* =====================================
                    CABECERA CARD
                ===================================== */}

                <div
                  style={styles.cardHeader}
                >

                  <div>

                    <div
                      style={styles.numero}
                    >
                      LOCAL Nº{" "}
                      {local.numero || "-"}
                    </div>

                    <div
                      style={styles.nombre}
                    >
                      {local.nombre ||
                        "Sin nombre"}
                    </div>

                    <div
                      style={styles.zona}
                    >
                      📍{" "}
                      {local.zonas?.nombre ||
                        "Sin zona"}
                    </div>

                  </div>


                  <div
                    style={estado.style}
                  >
                    {estado.texto}
                  </div>

                </div>


                {/* =====================================
                    DATOS
                ===================================== */}

                <div style={styles.data}>

                  <div
                    style={styles.item}
                  >

                    <span
                      style={styles.label}
                    >
                      Teórica
                    </span>

                    <strong
                      style={
                        styles.numeroDato
                      }
                    >
                      {teorica}
                    </strong>

                  </div>


                  <div
                    style={styles.item}
                  >

                    <span
                      style={styles.label}
                    >
                      Real
                    </span>

                    <strong
                      style={
                        styles.numeroDato
                      }
                    >
                      {real}
                    </strong>

                  </div>


                  <div
                    style={styles.item}
                  >

                    <span
                      style={styles.label}
                    >
                      Diferencia
                    </span>

                    <strong
                      style={{
                        ...styles.numeroDato,

                        color:
                          diferencia < 0
                            ? "#d97706"
                            : diferencia > 0
                            ? "#dc2626"
                            : "#16a34a",
                      }}
                    >
                      {diferencia > 0
                        ? `+${diferencia}`
                        : diferencia}
                    </strong>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
}


// =======================================================
// ESTILOS
// =======================================================

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
    border: "1px solid #fecaca",
  },

  retry: {
    marginTop: 15,
    border: "none",
    borderRadius: 8,
    padding: "9px 14px",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  empty: {
    background: "#fff",
    borderRadius: 16,
    padding: 35,
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
    fontWeight: "800",
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
    color: "#fff",
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
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 5px 18px rgba(0,0,0,0.06)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 15,
    marginBottom: 20,
  },

  numero: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "700",
  },

  nombre: {
    marginTop: 4,
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
  },

  zona: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
  },

  data: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: 10,
  },

  item: {
    background: "#f9fafb",
    borderRadius: 10,
    padding: 12,
    textAlign: "center",
  },

  label: {
    display: "block",
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 5,
  },

  numeroDato: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  completo: {
    background: "#dcfce7",
    color: "#166534",
    padding: "7px 10px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  faltante: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "7px 10px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  excedente: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "7px 10px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

};