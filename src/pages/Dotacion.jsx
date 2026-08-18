import { useEffect, useState } from "react";

import { getLocales } from "../services/localesService";
import {
  getColaboradores,
  updateColaborador,
} from "../services/colaboradoresService";


export default function Dotacion() {

  const [locales, setLocales] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [colaboradorSeleccionado, setColaboradorSeleccionado] =
    useState(null);

  const [nuevoLocalId, setNuevoLocalId] = useState("");

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");


  // =====================================================
  // CARGAR DATOS
  // =====================================================

  async function cargarDatos() {

    try {

      setLoading(true);
      setError("");

      const [
        localesData,
        colaboradoresData,
      ] = await Promise.all([
        getLocales(),
        getColaboradores(),
      ]);

      setLocales(localesData || []);
      setColaboradores(colaboradoresData || []);

    } catch (err) {

      console.error(
        "ERROR CARGANDO DOTACIÓN:",
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
  // BUSCAR COLABORADOR
  // =====================================================

  const textoBusqueda =
    busqueda
      .toLowerCase()
      .trim();


  const resultados =
    textoBusqueda.length < 2
      ? []
      : colaboradores.filter((colaborador) => {

          const nombre =
            `${colaborador.nombre || ""} ${
              colaborador.apellido || ""
            }`
              .toLowerCase()
              .trim();

          const nombreCompleto =
            `${colaborador.apellido || ""} ${
              colaborador.nombre || ""
            }`
              .toLowerCase()
              .trim();

          const legajo =
            String(
              colaborador.legajo || ""
            )
              .toLowerCase()
              .trim();

          return (
            nombre.includes(textoBusqueda) ||
            nombreCompleto.includes(textoBusqueda) ||
            legajo.includes(textoBusqueda)
          );

        });


  // =====================================================
  // SELECCIONAR COLABORADOR
  // =====================================================

  function seleccionarColaborador(colaborador) {

    setColaboradorSeleccionado(
      colaborador
    );

    setNuevoLocalId(
      colaborador.local_id || ""
    );

    setMensaje("");

  }


  // =====================================================
  // CANCELAR MOVIMIENTO
  // =====================================================

  function cancelarMovimiento() {

    setColaboradorSeleccionado(null);
    setNuevoLocalId("");
    setMensaje("");

  }


  // =====================================================
  // CONFIRMAR MOVIMIENTO
  // =====================================================

  async function confirmarMovimiento() {

    if (!colaboradorSeleccionado) {
      return;
    }

    if (!nuevoLocalId) {

      alert(
        "Seleccioná el nuevo local."
      );

      return;

    }


    if (
      nuevoLocalId ===
      colaboradorSeleccionado.local_id
    ) {

      alert(
        "El colaborador ya pertenece a ese local."
      );

      return;

    }


    const localAnterior =
      obtenerNombreLocal(
        colaboradorSeleccionado.local_id
      );

    const nuevoLocal =
      obtenerNombreLocal(
        nuevoLocalId
      );


    const confirmar =
      window.confirm(
        `¿Confirmar movimiento?\n\n` +
        `${obtenerNombreCompleto(
          colaboradorSeleccionado
        )}\n\n` +
        `Desde: ${localAnterior}\n` +
        `Hacia: ${nuevoLocal}`
      );


    if (!confirmar) {
      return;
    }


    try {

      setGuardando(true);
      setError("");
      setMensaje("");


      await updateColaborador(
        colaboradorSeleccionado.id,
        {
          local_id: nuevoLocalId,
        }
      );


      setMensaje(
        `Movimiento realizado correctamente.`
      );


      await cargarDatos();


      setColaboradorSeleccionado(
        (actual) => {

          if (!actual) {
            return null;
          }

          return {
            ...actual,
            local_id: nuevoLocalId,
          };

        }
      );


    } catch (err) {

      console.error(
        "ERROR REALIZANDO MOVIMIENTO:",
        err
      );

      setError(
        err?.message ||
        "No se pudo realizar el movimiento."
      );

    } finally {

      setGuardando(false);

    }

  }


  // =====================================================
  // NOMBRE COMPLETO
  // =====================================================

  function obtenerNombreCompleto(
    colaborador
  ) {

    return (
      `${colaborador.nombre || ""} ${
        colaborador.apellido || ""
      }`
        .trim() ||
      "Sin nombre"
    );

  }


  // =====================================================
  // NOMBRE LOCAL
  // =====================================================

  function obtenerNombreLocal(
    localId
  ) {

    const local =
      locales.find(
        (item) =>
          String(item.id) ===
          String(localId)
      );

    if (!local) {
      return "Sin local";
    }

    if (local.numero) {

      return `Local Nº ${local.numero} - ${
        local.nombre || ""
      }`;

    }

    return local.nombre || "Sin nombre";

  }


  // =====================================================
  // DOTACIÓN REAL
  // =====================================================

  function obtenerReal(localId) {

    return colaboradores.filter(
      (colaborador) =>
        String(colaborador.local_id) ===
        String(localId)
    ).length;

  }


  // =====================================================
  // ESTADO LOCAL
  // =====================================================

  function obtenerEstado(
    teorica,
    real
  ) {

    const diferencia =
      real - teorica;


    if (diferencia < 0) {

      return {
        texto:
          `⚠️ Faltan ${Math.abs(
            diferencia
          )}`,
        style:
          styles.faltante,
      };

    }


    if (diferencia === 0) {

      return {
        texto:
          "🟢 Dotación completa",
        style:
          styles.completo,
      };

    }


    return {
      texto:
        `🔴 Excedente ${diferencia}`,
      style:
        styles.excedente,
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

  if (error && !colaboradorSeleccionado) {

    return (
      <div style={styles.error}>

        <strong>Error:</strong>

        <div
          style={{
            marginTop: 8,
          }}
        >
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
            Control de dotación y movimientos
            de colaboradores
          </p>

        </div>

        <button
          style={styles.refresh}
          onClick={cargarDatos}
          disabled={guardando}
        >
          🔄 Actualizar
        </button>

      </div>


      {/* =================================================
          MOVIMIENTO
      ================================================= */}

      <div style={styles.movimientoCard}>

        <div>

          <h2 style={styles.movimientoTitulo}>
            🔄 Movimiento de colaborador
          </h2>

          <p style={styles.movimientoSubtitulo}>
            Buscá un colaborador para cambiarlo
            de local.
          </p>

        </div>


        <input
          style={styles.search}
          type="text"
          placeholder="Buscar por nombre, apellido o legajo..."
          value={busqueda}
          onChange={(e) => {

            setBusqueda(
              e.target.value
            );

            setColaboradorSeleccionado(
              null
            );

            setMensaje("");
            setError("");

          }}
        />


        {/* =================================================
            RESULTADOS
        ================================================= */}

        {textoBusqueda.length >= 2 &&
          !colaboradorSeleccionado && (

          <div style={styles.resultados}>

            {resultados.length === 0 ? (

              <div style={styles.sinResultados}>
                No se encontraron colaboradores.
              </div>

            ) : (

              resultados.map(
                (colaborador) => (

                  <button
                    key={colaborador.id}
                    style={styles.resultado}
                    onClick={() =>
                      seleccionarColaborador(
                        colaborador
                      )
                    }
                  >

                    <div>

                      <strong
                        style={
                          styles.resultadoNombre
                        }
                      >
                        {obtenerNombreCompleto(
                          colaborador
                        )}
                      </strong>

                      <div
                        style={
                          styles.resultadoDetalle
                        }
                      >
                        {colaborador.puesto ||
                          "Sin puesto"}
                      </div>

                    </div>


                    <div
                      style={
                        styles.resultadoLocal
                      }
                    >
                      {obtenerNombreLocal(
                        colaborador.local_id
                      )}
                    </div>

                  </button>

                )
              )

            )}

          </div>

        )}


        {/* =================================================
            COLABORADOR SELECCIONADO
        ================================================= */}

        {colaboradorSeleccionado && (

          <div style={styles.seleccionado}>

            <div style={styles.seleccionadoHeader}>

              <div>

                <div
                  style={
                    styles.seleccionadoNombre
                  }
                >
                  {obtenerNombreCompleto(
                    colaboradorSeleccionado
                  )}
                </div>

                <div
                  style={
                    styles.seleccionadoPuesto
                  }
                >
                  {colaboradorSeleccionado.puesto ||
                    "Sin puesto"}
                </div>

                {colaboradorSeleccionado.legajo && (

                  <div
                    style={
                      styles.seleccionadoLegajo
                    }
                  >
                    Legajo:{" "}
                    {colaboradorSeleccionado.legajo}
                  </div>

                )}

              </div>


              <button
                style={styles.cancelar}
                onClick={
                  cancelarMovimiento
                }
              >
                ✕
              </button>

            </div>


            <div style={styles.movimientoGrid}>

              <div style={styles.localActual}>

                <span style={styles.label}>
                  Local actual
                </span>

                <strong>
                  {obtenerNombreLocal(
                    colaboradorSeleccionado.local_id
                  )}
                </strong>

              </div>


              <div>

                <span style={styles.label}>
                  Cambiar local
                </span>

                <select
                  style={styles.select}
                  value={nuevoLocalId}
                  onChange={(e) =>
                    setNuevoLocalId(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Seleccionar local
                  </option>

                  {locales.map(
                    (local) => (

                      <option
                        key={local.id}
                        value={local.id}
                      >
                        {local.numero
                          ? `Nº ${local.numero} - `
                          : ""}
                        {local.nombre}
                      </option>

                    )
                  )}

                </select>

              </div>

            </div>


            {error && (

              <div style={styles.errorMovimiento}>
                {error}
              </div>

            )}


            {mensaje && (

              <div style={styles.exito}>
                ✅ {mensaje}
              </div>

            )}


            <button
              style={
                guardando
                  ? styles.confirmarDisabled
                  : styles.confirmar
              }
              onClick={
                confirmarMovimiento
              }
              disabled={guardando}
            >
              {guardando
                ? "Guardando movimiento..."
                : "✅ Confirmar movimiento"}
            </button>

          </div>

        )}

      </div>


      {/* =================================================
          DOTACIÓN POR LOCAL
      ================================================= */}

      <div
        style={{
          marginTop: 30,
        }}
      >

        <h2 style={styles.seccionTitulo}>
          Dotación por local
        </h2>


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

                  <div
                    style={
                      styles.cardHeader
                    }
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

  movimientoCard: {
    background: "#fff",
    borderRadius: 18,
    padding: 22,
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 5px 18px rgba(0,0,0,0.06)",
  },

  movimientoTitulo: {
    margin: 0,
    color: "#111827",
    fontSize: 22,
  },

  movimientoSubtitulo: {
    marginTop: 6,
    marginBottom: 18,
    color: "#6b7280",
  },

  search: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 15px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 15,
    outline: "none",
  },

  resultados: {
    marginTop: 10,
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
  },

  resultado: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    padding: "13px 15px",
    border: "none",
    borderBottom: "1px solid #e5e7eb",
    background: "#fff",
    textAlign: "left",
    cursor: "pointer",
  },

  resultadoNombre: {
    color: "#111827",
    fontSize: 15,
  },

  resultadoDetalle: {
    marginTop: 3,
    color: "#6b7280",
    fontSize: 12,
  },

  resultadoLocal: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },

  sinResultados: {
    padding: 18,
    color: "#6b7280",
    textAlign: "center",
  },

  seleccionado: {
    marginTop: 18,
    padding: 18,
    background: "#f8fafc",
    borderRadius: 14,
    border: "1px solid #dbeafe",
  },

  seleccionadoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 15,
    marginBottom: 20,
  },

  seleccionadoNombre: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  seleccionadoPuesto: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 14,
  },

  seleccionadoLegajo: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 12,
  },

  cancelar: {
    border: "none",
    background: "#e5e7eb",
    color: "#374151",
    width: 32,
    height: 32,
    borderRadius: "50%",
    cursor: "pointer",
    fontWeight: "bold",
  },

  movimientoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 15,
    marginBottom: 18,
  },

  localActual: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: 13,
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },

  label: {
    display: "block",
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 5,
  },

  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#fff",
    fontSize: 14,
  },

  confirmar: {
    width: "100%",
    border: "none",
    borderRadius: 10,
    padding: 13,
    background: "#16a34a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: 14,
  },

  confirmarDisabled: {
    width: "100%",
    border: "none",
    borderRadius: 10,
    padding: 13,
    background: "#9ca3af",
    color: "#fff",
    cursor: "not-allowed",
    fontWeight: "700",
    fontSize: 14,
  },

  errorMovimiento: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: 13,
  },

  exito: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    background: "#dcfce7",
    color: "#166534",
    fontSize: 13,
    fontWeight: "600",
  },

  seccionTitulo: {
    color: "#1f2937",
    fontSize: 22,
    marginBottom: 18,
  },

  empty: {
    background: "#fff",
    borderRadius: 16,
    padding: 35,
    textAlign: "center",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
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