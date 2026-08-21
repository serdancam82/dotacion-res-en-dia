import { useEffect, useMemo, useState } from "react";

import { getColaboradores } from "../services/colaboradoresService";
import { getLocales } from "../services/localesService";
import { getMovimientos } from "../services/movimientosService";

export default function Movimientos() {
  const [colaboradores, setColaboradores] = useState([]);
  const [locales, setLocales] = useState([]);
  const [movimientos, setMovimientos] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [abierto, setAbierto] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // CARGAR DATOS
  // =====================================================

  async function cargarDatos() {
    try {
      setLoading(true);
      setError("");

      const [
        colaboradoresData,
        localesData,
        movimientosData,
      ] = await Promise.all([
        getColaboradores(),
        getLocales(),
        getMovimientos(),
      ]);

      setColaboradores(
        colaboradoresData || []
      );

      setLocales(
        localesData || []
      );

      setMovimientos(
        movimientosData || []
      );
    } catch (err) {
      console.error(
        "ERROR CARGANDO MOVIMIENTOS:",
        err
      );

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

  // =====================================================
  // NOMBRE LOCAL
  // =====================================================

  function obtenerNombreLocal(localId) {
    const local = locales.find(
      (item) => item.id === localId
    );

    if (!local) {
      return "Local desconocido";
    }

    return `Nº ${local.numero || "-"} - ${
      local.nombre || "Sin nombre"
    }`;
  }

  // =====================================================
  // MOVIMIENTOS DE UN COLABORADOR
  // =====================================================

  function obtenerMovimientosColaborador(
    colaboradorId
  ) {
    return movimientos.filter(
      (movimiento) =>
        movimiento.colaborador_id ===
        colaboradorId
    );
  }

  // =====================================================
  // BUSCADOR
  // =====================================================

  const colaboradoresFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      if (!texto) {
        return colaboradores;
      }

      return colaboradores.filter(
        (colaborador) => {
          const nombre =
            `${colaborador.nombre || ""} ${
              colaborador.apellido || ""
            }`.toLowerCase();

          const apellido =
            `${colaborador.apellido || ""}`.toLowerCase();

          const legajo =
            `${colaborador.legajo || ""}`.toLowerCase();

          const puesto =
            `${colaborador.puesto || ""}`.toLowerCase();

          return (
            nombre.includes(texto) ||
            apellido.includes(texto) ||
            legajo.includes(texto) ||
            puesto.includes(texto)
          );
        }
      );
    }, [
      colaboradores,
      busqueda,
    ]);

  // =====================================================
  // FECHA
  // =====================================================

  function formatearFecha(fecha) {
    if (!fecha) {
      return "-";
    }

    const fechaObj =
      new Date(fecha);

    return fechaObj.toLocaleString(
      "es-AR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  // =====================================================
  // TOGGLE
  // =====================================================

  function toggleColaborador(id) {
    setAbierto((actual) =>
      actual === id
        ? null
        : id
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.loading}>
        Cargando movimientos...
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div style={styles.error}>
        <strong>
          Error cargando movimientos
        </strong>

        <div
          style={{
            marginTop: 6,
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>
      {/* =================================================
          CABECERA
      ================================================= */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            🔄 Movimientos
          </h1>

          <p style={styles.subtitle}>
            Historial de movimientos de colaboradores
          </p>
        </div>

        <button
          type="button"
          style={styles.refresh}
          onClick={cargarDatos}
        >
          🔄 Actualizar
        </button>
      </div>

      {/* =================================================
          BUSCADOR
      ================================================= */}

      <div style={styles.searchContainer}>
        <span style={styles.searchIcon}>
          🔎
        </span>

        <input
          type="text"
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
          placeholder="Buscar colaborador por nombre, apellido, legajo o puesto..."
          style={styles.search}
        />

        {busqueda && (
          <button
            type="button"
            style={styles.clearSearch}
            onClick={() =>
              setBusqueda("")
            }
          >
            ✕
          </button>
        )}
      </div>

      {/* =================================================
          RESUMEN
      ================================================= */}

      <div style={styles.summary}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>
            Colaboradores
          </span>

          <strong style={styles.summaryNumber}>
            {colaboradoresFiltrados.length}
          </strong>
        </div>

        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>
            Movimientos registrados
          </span>

          <strong style={styles.summaryNumber}>
            {movimientos.length}
          </strong>
        </div>
      </div>

      {/* =================================================
          SIN COLABORADORES
      ================================================= */}

      {colaboradoresFiltrados.length === 0 ? (
        <div style={styles.empty}>
          {busqueda
            ? "No se encontraron colaboradores."
            : "No hay colaboradores registrados."}
        </div>
      ) : (
        <div style={styles.grid}>
          {colaboradoresFiltrados.map(
            (colaborador) => {
              const historial =
                obtenerMovimientosColaborador(
                  colaborador.id
                );

              const estaAbierto =
                abierto ===
                colaborador.id;

              return (
                <div
                  key={colaborador.id}
                  style={{
                    ...styles.card,
                    ...(estaAbierto
                      ? styles.cardAbierta
                      : {}),
                  }}
                >
                  {/* =====================================
                      CABECERA TARJETA
                  ===================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleColaborador(
                        colaborador.id
                      )
                    }
                    style={styles.cardButton}
                  >
                    <div
                      style={
                        styles.cardHeader
                      }
                    >
                      <div
                        style={
                          styles.avatar
                        }
                      >
                        👤
                      </div>

                      <div
                        style={
                          styles.identity
                        }
                      >
                        <div
                          style={
                            styles.nombre
                          }
                        >
                          {colaborador.nombre ||
                            "Sin nombre"}{" "}
                          {colaborador.apellido ||
                            ""}
                        </div>

                        <div
                          style={
                            styles.puesto
                          }
                        >
                          {colaborador.puesto ||
                            "Sin puesto"}
                        </div>
                      </div>

                      <div
                        style={
                          styles.badgeContainer
                        }
                      >
                        <div
                          style={{
                            ...styles.badge,
                            ...(historial.length >
                            0
                              ? styles.badgeMovimiento
                              : styles.badgeSinMovimiento),
                          }}
                        >
                          🔄{" "}
                          {historial.length}
                        </div>

                        <span
                          style={
                            styles.arrow
                          }
                        >
                          {estaAbierto
                            ? "▲"
                            : "▼"}
                        </span>
                      </div>
                    </div>

                    <div
                      style={
                        styles.localActual
                      }
                    >
                      <span>
                        📍 Local actual
                      </span>

                      <strong>
                        {obtenerNombreLocal(
                          colaborador.local_id
                        )}
                      </strong>
                    </div>
                  </button>

                  {/* =====================================
                      HISTORIAL DESPLEGABLE
                  ===================================== */}

                  {estaAbierto && (
                    <div
                      style={
                        styles.historial
                      }
                    >
                      <div
                        style={
                          styles.historialTitulo
                        }
                      >
                        📋 Historial de movimientos
                      </div>

                      {historial.length ===
                      0 ? (
                        <div
                          style={
                            styles.sinMovimientos
                          }
                        >
                          Este colaborador no
                          registra movimientos.
                        </div>
                      ) : (
                        <div
                          style={
                            styles.listaMovimientos
                          }
                        >
                          {historial.map(
                            (
                              movimiento,
                              index
                            ) => (
                              <div
                                key={
                                  movimiento.id
                                }
                                style={
                                  styles.movimiento
                                }
                              >
                                <div
                                  style={
                                    styles.movimientoFecha
                                  }
                                >
                                  {formatearFecha(
                                    movimiento.created_at
                                  )}
                                </div>

                                <div
                                  style={
                                    styles.ruta
                                  }
                                >
                                  <div
                                    style={
                                      styles.localAnterior
                                    }
                                  >
                                    <span>
                                      Desde
                                    </span>

                                    <strong>
                                      {obtenerNombreLocal(
                                        movimiento.local_anterior_id
                                      )}
                                    </strong>
                                  </div>

                                  <div
                                    style={
                                      styles.flecha
                                    }
                                  >
                                    ↓
                                  </div>

                                  <div
                                    style={
                                      styles.localNuevo
                                    }
                                  >
                                    <span>
                                      Hacia
                                    </span>

                                    <strong>
                                      {obtenerNombreLocal(
                                        movimiento.local_nuevo_id
                                      )}
                                    </strong>
                                  </div>
                                </div>

                                {movimiento.descripcion && (
                                  <div
                                    style={
                                      styles.descripcion
                                    }
                                  >
                                    {movimiento.descripcion.replace(
                                      /^:\s*/,
                                      ""
                                    )}
                                  </div>
                                )}

                                {index <
                                  historial.length -
                                    1 && (
                                  <div
                                    style={
                                      styles.separador
                                    }
                                  />
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}


// =====================================================
// ESTILOS
// =====================================================

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

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
    marginBottom: 0,
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

  searchContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "0 14px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.04)",
    marginBottom: 18,
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  search: {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "13px 4px",
    fontSize: 14,
    color: "#111827",
    background: "transparent",
  },

  clearSearch: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#6b7280",
    fontSize: 14,
  },

  summary: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap",
  },

  summaryItem: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#6b7280",
  },

  summaryNumber: {
    fontSize: 18,
    color: "#111827",
  },

  empty: {
    background: "#ffffff",
    padding: 30,
    borderRadius: 16,
    textAlign: "center",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 16,
  },

  card: {
    background: "#ffffff",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },

  cardAbierta: {
    border:
      "1px solid #bfdbfe",
    boxShadow:
      "0 5px 18px rgba(37,99,235,0.10)",
  },

  cardButton: {
    width: "100%",
    border: "none",
    background: "#ffffff",
    cursor: "pointer",
    textAlign: "left",
    padding: 16,
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 11,
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
  },

  identity: {
    minWidth: 0,
    flex: 1,
  },

  nombre: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  puesto: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
  },

  badgeContainer: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  badge: {
    minWidth: 34,
    height: 26,
    padding: "0 8px",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: "800",
  },

  badgeMovimiento: {
    background: "#dbeafe",
    color: "#1d4ed8",
  },

  badgeSinMovimiento: {
    background: "#f3f4f6",
    color: "#6b7280",
  },

  arrow: {
    fontSize: 12,
    color: "#6b7280",
  },

  localActual: {
    marginTop: 14,
    padding: "10px 12px",
    borderRadius: 9,
    background: "#f9fafb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    fontSize: 12,
    color: "#6b7280",
  },

  historial: {
    borderTop: "1px solid #e5e7eb",
    padding: 15,
    background: "#f8fafc",
  },

  historialTitulo: {
    fontSize: 13,
    fontWeight: "800",
    color: "#374151",
    marginBottom: 12,
  },

  sinMovimientos: {
    padding: 12,
    background: "#ffffff",
    borderRadius: 9,
    color: "#6b7280",
    fontSize: 12,
    textAlign: "center",
  },

  listaMovimientos: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  movimiento: {
    background: "#ffffff",
    borderRadius: 10,
    padding: 12,
    border: "1px solid #e5e7eb",
  },

  movimientoFecha: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6b7280",
    marginBottom: 10,
  },

  ruta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  localAnterior: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  localNuevo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  ruta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  localAnterior: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 3,
    color: "#6b7280",
    fontSize: 10,
  },

  localNuevo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 3,
    color: "#6b7280",
    fontSize: 10,
  },

  flecha: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2563eb",
  },

  descripcion: {
    marginTop: 9,
    paddingTop: 8,
    borderTop: "1px solid #f3f4f6",
    fontSize: 11,
    color: "#6b7280",
  },

  separador: {
    marginTop: 10,
  },
};