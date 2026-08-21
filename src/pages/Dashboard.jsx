import { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { getDashboard } from "../services/dashboardService";
import { getMovimientos } from "../services/movimientosService";

import KPICard from "../components/dashboard";


// =====================================================
// DASHBOARD
// =====================================================

export default function Dashboard() {

  const [datos, setDatos] = useState({

    totalZonas: 0,
    totalLocales: 0,
    totalColaboradores: 0,

    zonas: [],
    locales: [],
    colaboradores: [],

    localesCompletos: [],
    localesFaltantes: [],
    localesExcedentes: [],

    distribucionPuestos: [],
    distribucionZonas: [],

  });


  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [seccionAbierta, setSeccionAbierta] =
    useState(null);

  const [exportando, setExportando] =
    useState(false);


  // =====================================================
  // CARGAR DASHBOARD
  // =====================================================

  useEffect(() => {

    cargarDashboard();

  }, []);


  async function cargarDashboard() {

    try {

      setLoading(true);
      setError(null);

      const respuesta =
        await getDashboard();

      console.log(
        "DASHBOARD:",
        respuesta
      );


      setDatos({

        totalZonas:
          respuesta.totalZonas || 0,

        totalLocales:
          respuesta.totalLocales || 0,

        totalColaboradores:
          respuesta.totalColaboradores || 0,

        zonas:
          respuesta.zonas || [],

        locales:
          respuesta.locales || [],

        colaboradores:
          respuesta.colaboradores || [],

        localesCompletos:
          respuesta.localesCompletos || [],

        localesFaltantes:
          respuesta.localesFaltantes || [],

        localesExcedentes:
          respuesta.localesExcedentes || [],

        distribucionPuestos:
          respuesta.distribucionPuestos || [],

        distribucionZonas:
          respuesta.distribucionZonas || [],

      });

    } catch (error) {

      console.error(
        "ERROR DASHBOARD:",
        error
      );

      setError(
        error?.message ||
        "No se pudo cargar el Dashboard."
      );

    } finally {

      setLoading(false);

    }

  }


  // =====================================================
  // TOGGLE
  // =====================================================

  function toggleSeccion(seccion) {

    setSeccionAbierta(
      seccionAbierta === seccion
        ? null
        : seccion
    );

  }


  // =====================================================
  // FORMATEAR FECHA
  // =====================================================

  function formatearFecha(fecha) {

    if (!fecha) {
      return "-";
    }

    return new Date(fecha).toLocaleString(
      "es-AR"
    );

  }


  // =====================================================
  // OBTENER LOCAL
  // =====================================================

  function obtenerLocal(localId) {

    if (!localId) {
      return null;
    }

    return (
      datos.locales.find(
        (local) =>
          local.id === localId
      ) || null
    );

  }


  // =====================================================
  // OBTENER ZONA
  // =====================================================

  function obtenerZona(zonaId) {

    if (!zonaId) {
      return null;
    }

    return (
      datos.zonas.find(
        (zona) =>
          zona.id === zonaId
      ) || null
    );

  }


  // =====================================================
  // ESTADO DEL LOCAL
  // =====================================================

  function obtenerEstadoLocal(local) {

    const diferencia =
      Number(local.diferencia ?? 0);

    if (diferencia < 0) {
      return "FALTANTE";
    }

    if (diferencia > 0) {
      return "EXCEDENTE";
    }

    return "COMPLETO";

  }


  // =====================================================
  // EXPORTAR EXCEL
  // =====================================================

  async function exportarExcel() {

    try {

      setExportando(true);


      // -------------------------------------------------
      // OBTENER MOVIMIENTOS
      // -------------------------------------------------

      const movimientos =
        await getMovimientos();


      // -------------------------------------------------
      // FECHA DEL INFORME
      // -------------------------------------------------

      const ahora = new Date();

      const fecha =
        ahora.toLocaleDateString(
          "es-AR"
        );

      const hora =
        ahora.toLocaleTimeString(
          "es-AR"
        );


      // =================================================
      // HOJA RESUMEN
      // =================================================

      const resumen = [

        {
          Indicador:
            "Fecha del informe",

          Valor:
            fecha,

        },

        {
          Indicador:
            "Hora de generación",

          Valor:
            hora,

        },

        {
          Indicador:
            "Total de zonas",

          Valor:
            datos.totalZonas,

        },

        {
          Indicador:
            "Total de locales",

          Valor:
            datos.totalLocales,

        },

        {
          Indicador:
            "Total de colaboradores",

          Valor:
            datos.totalColaboradores,

        },

        {
          Indicador:
            "Locales completos",

          Valor:
            datos.localesCompletos.length,

        },

        {
          Indicador:
            "Locales faltantes",

          Valor:
            datos.localesFaltantes.length,

        },

        {
          Indicador:
            "Locales con excedente",

          Valor:
            datos.localesExcedentes.length,

        },

      ];


      // =================================================
      // HOJA LOCALES
      // =================================================

      const localesExcel =
        datos.locales.map(
          (local) => {

            const zona =
              obtenerZona(
                local.zona_id
              );


            const diferencia =
              Number(
                local.diferencia ??
                (
                  Number(
                    local.dotacion_real ?? 0
                  ) -
                  Number(
                    local.dotacion_teorica ?? 0
                  )
                )
              );


            return {

              "Nº Local":
                local.numero || "",

              "Local":
                local.nombre || "",

              "Zona":
                zona?.nombre || "",

              "Dotación Teórica":
                Number(
                  local.dotacion_teorica ?? 0
                ),

              "Dotación Real":
                Number(
                  local.dotacion_real ?? 0
                ),

              "Diferencia":
                diferencia,

              "Estado":
                obtenerEstadoLocal({
                  diferencia,
                }),

              "Encargado":
                local.encargado || "",

              "Teléfono":
                local.telefono || "",

              "WhatsApp":
                local.whatsapp || "",

              "Dirección":
                local.direccion || "",

            };

          }
        );


      // =================================================
      // HOJA PERSONAL
      // =================================================

      const personalExcel =
        datos.colaboradores.map(
          (colaborador) => {

            const local =
              obtenerLocal(
                colaborador.local_id
              );


            const zona =
              local
                ? obtenerZona(
                    local.zona_id
                  )
                : null;


            return {

              "Legajo":
                colaborador.legajo || "",

              "Nombre":
                colaborador.nombre || "",

              "Apellido":
                colaborador.apellido || "",

              "Puesto":
                colaborador.puesto || "Sin puesto",

              "Rol":
                colaborador.rol || "",

              "Local Nº":
                local?.numero || "",

              "Local":
                local?.nombre || "",

              "Zona":
                zona?.nombre || "",

              "Teléfono":
                colaborador.telefono || "",

            };

          }
        );


      // =================================================
      // HOJA PUESTOS
      // =================================================

      const puestosExcel =
        datos.distribucionPuestos.map(
          (puesto) => ({

            "Puesto":
              puesto.puesto ||
              "Sin puesto",

            "Cantidad":
              puesto.cantidad || 0,

          })
        );


      // =================================================
      // HOJA ZONAS
      // =================================================

      const zonasExcel =
        datos.distribucionZonas.map(
          (zona) => ({

            "Zona":
              zona.nombre || "",

            "Locales":
              zona.locales || 0,

            "Dotación Teórica":
              zona.dotacionTeorica || 0,

            "Dotación Real":
              zona.dotacionReal || 0,

            "Diferencia":
              zona.diferencia || 0,

          })
        );


      // =================================================
      // HOJA MOVIMIENTOS
      // =================================================

      const movimientosExcel =
        movimientos.map(
          (movimiento) => {

            const colaborador =
              datos.colaboradores.find(
                (item) =>
                  item.id ===
                  movimiento.colaborador_id
              );


            const localAnterior =
              obtenerLocal(
                movimiento.local_anterior_id
              );


            const localNuevo =
              obtenerLocal(
                movimiento.local_nuevo_id
              );


            return {

              "Fecha":
                formatearFecha(
                  movimiento.created_at
                ),

              "Colaborador":
                colaborador
                  ? `${colaborador.nombre || ""} ${colaborador.apellido || ""}`.trim()
                  : "Colaborador no encontrado",

              "Legajo":
                colaborador?.legajo || "",

              "Puesto":
                colaborador?.puesto || "",

              "Local Anterior Nº":
                localAnterior?.numero || "",

              "Local Anterior":
                localAnterior?.nombre || "",

              "Local Nuevo Nº":
                localNuevo?.numero || "",

              "Local Nuevo":
                localNuevo?.nombre || "",

              "Descripción":
                movimiento.descripcion || "",

            };

          }
        );


      // =================================================
      // CREAR LIBRO
      // =================================================

      const workbook =
        XLSX.utils.book_new();


      // =================================================
      // AGREGAR HOJAS
      // =================================================

      const wsResumen =
        XLSX.utils.json_to_sheet(
          resumen
        );


      const wsLocales =
        XLSX.utils.json_to_sheet(
          localesExcel
        );


      const wsPersonal =
        XLSX.utils.json_to_sheet(
          personalExcel
        );


      const wsPuestos =
        XLSX.utils.json_to_sheet(
          puestosExcel
        );


      const wsZonas =
        XLSX.utils.json_to_sheet(
          zonasExcel
        );


      const wsMovimientos =
        XLSX.utils.json_to_sheet(
          movimientosExcel
        );


      XLSX.utils.book_append_sheet(
        workbook,
        wsResumen,
        "Resumen"
      );


      XLSX.utils.book_append_sheet(
        workbook,
        wsLocales,
        "Locales"
      );


      XLSX.utils.book_append_sheet(
        workbook,
        wsPersonal,
        "Personal"
      );


      XLSX.utils.book_append_sheet(
        workbook,
        wsPuestos,
        "Puestos"
      );


      XLSX.utils.book_append_sheet(
        workbook,
        wsZonas,
        "Zonas"
      );


      XLSX.utils.book_append_sheet(
        workbook,
        wsMovimientos,
        "Movimientos"
      );


      // =================================================
      // ANCHOS DE COLUMNAS
      // =================================================

      wsResumen["!cols"] = [
        {
          wch: 28,
        },
        {
          wch: 25,
        },
      ];


      wsLocales["!cols"] = [
        {
          wch: 12,
        },
        {
          wch: 25,
        },
        {
          wch: 20,
        },
        {
          wch: 18,
        },
        {
          wch: 16,
        },
        {
          wch: 12,
        },
        {
          wch: 14,
        },
        {
          wch: 25,
        },
        {
          wch: 18,
        },
        {
          wch: 18,
        },
        {
          wch: 35,
        },
      ];


      wsPersonal["!cols"] = [
        {
          wch: 14,
        },
        {
          wch: 18,
        },
        {
          wch: 20,
        },
        {
          wch: 22,
        },
        {
          wch: 18,
        },
        {
          wch: 12,
        },
        {
          wch: 25,
        },
        {
          wch: 20,
        },
        {
          wch: 18,
        },
      ];


      wsPuestos["!cols"] = [
        {
          wch: 25,
        },
        {
          wch: 12,
        },
      ];


      wsZonas["!cols"] = [
        {
          wch: 25,
        },
        {
          wch: 12,
        },
        {
          wch: 20,
        },
        {
          wch: 18,
        },
        {
          wch: 12,
        },
      ];


      wsMovimientos["!cols"] = [
        {
          wch: 22,
        },
        {
          wch: 30,
        },
        {
          wch: 14,
        },
        {
          wch: 22,
        },
        {
          wch: 18,
        },
        {
          wch: 28,
        },
        {
          wch: 18,
        },
        {
          wch: 28,
        },
        {
          wch: 60,
        },
      ];


      // =================================================
      // GENERAR ARCHIVO
      // =================================================

      const buffer =
        XLSX.write(
          workbook,
          {
            bookType: "xlsx",
            type: "array",
          }
        );


      const blob =
        new Blob(
          [buffer],
          {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }
        );


      const fechaArchivo =
        ahora
          .toISOString()
          .slice(0, 10);


      const horaArchivo =
        ahora
          .toTimeString()
          .slice(0, 8)
          .replace(/:/g, "-");


      saveAs(
        blob,
        `RES_en_DIA_Informe_${fechaArchivo}_${horaArchivo}.xlsx`
      );


    } catch (error) {

      console.error(
        "ERROR GENERANDO EXCEL:",
        error
      );


      alert(
        error?.message ||
        "No se pudo generar el informe Excel."
      );


    } finally {

      setExportando(false);

    }

  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div
        style={{
          padding: "30px",
          color: "#6b7280",
        }}
      >

        <h2>
          Cargando Dashboard...
        </h2>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div
        style={{
          padding: "30px",
        }}
      >

        <h2
          style={{
            color: "#dc2626",
          }}
        >

          Error cargando Dashboard

        </h2>

        <p>
          {error}
        </p>

        <button
          onClick={cargarDashboard}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >

          Reintentar

        </button>

      </div>

    );

  }


  // =====================================================
  // TARJETA ESTADO
  // =====================================================

  function TarjetaEstado({
    tipo,
    titulo,
    icono,
    cantidad,
    locales,
    color,
    background,
    borde,
  }) {

    const abierta =
      seccionAbierta === tipo;


    return (

      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          boxShadow:
            "0 5px 18px rgba(0,0,0,0.07)",
          border:
            `1px solid ${borde}`,
          overflow: "hidden",
        }}
      >

        <button
          type="button"
          onClick={() =>
            toggleSeccion(tipo)
          }
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            padding: "18px",
            cursor: "pointer",
            textAlign: "left",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >

              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >

                {icono}

              </div>


              <div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "3px",
                  }}
                >

                  Locales

                </div>


                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: "700",
                    color,
                  }}
                >

                  {titulo}

                </div>

              </div>

            </div>


            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >

              <strong
                style={{
                  fontSize: "30px",
                  color,
                }}
              >

                {cantidad}

              </strong>


              <span
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >

                {abierta ? "▲" : "▼"}

              </span>

            </div>

          </div>

        </button>


        {abierta && (

          <div
            style={{
              borderTop:
                "1px solid #e5e7eb",
              padding: "10px 18px 16px",
              background: "#fafafa",
            }}
          >

            {locales.length === 0 ? (

              <div
                style={{
                  padding: "8px 0",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >

                No hay locales en esta categoría.

              </div>

            ) : (

              locales.map((local) => (

                <div
                  key={local.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 0",
                    borderBottom:
                      "1px solid #e5e7eb",
                    fontSize: "13px",
                  }}
                >

                  <div>

                    <strong>
                      Nº {local.numero || "-"}
                    </strong>

                    {" · "}

                    {local.nombre}

                  </div>


                  {local.diferencia !== undefined && (

                    <strong
                      style={{
                        color,
                        whiteSpace: "nowrap",
                      }}
                    >

                      {local.diferencia > 0
                        ? `+${local.diferencia}`
                        : local.diferencia}

                    </strong>

                  )}

                </div>

              ))

            )}

          </div>

        )}

      </div>

    );

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      style={{
        padding: "20px",
        maxWidth: "1600px",
        margin: "0 auto",
      }}
    >

      {/* =================================================
          CABECERA
      ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,
              color: "#1f2937",
              fontSize: "28px",
            }}
          >

            Dashboard Ejecutivo

          </h1>


          <p
            style={{
              marginTop: "6px",
              color: "#6b7280",
            }}
          >

            Resumen general de la dotación de RES en DÍA

          </p>

        </div>


        {/* =================================================
            EXPORTAR EXCEL
        ================================================= */}

        <button
          type="button"
          onClick={exportarExcel}
          disabled={exportando}
          style={{
            border: "none",
            borderRadius: "10px",
            padding: "11px 18px",
            background:
              exportando
                ? "#93c5fd"
                : "#166534",
            color: "#ffffff",
            cursor:
              exportando
                ? "not-allowed"
                : "pointer",
            fontWeight: "700",
            fontSize: "14px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.10)",
          }}
        >

          {exportando
            ? "⏳ Generando..."
            : "📥 Generar informe Excel"}

        </button>

      </div>


      {/* =================================================
          KPIs
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "18px",
        }}
      >

        <KPICard
          titulo="Zonas"
          valor={datos.totalZonas}
          icono="🌎"
        />


        <KPICard
          titulo="Locales"
          valor={datos.totalLocales}
          icono="🏪"
        />


        <KPICard
          titulo="Colaboradores"
          valor={datos.totalColaboradores}
          icono="👥"
        />

      </div>


      {/* =================================================
          ESTADO DE LOCALES
      ================================================= */}

      <div
        style={{
          marginTop: "30px",
        }}
      >

        <h2
          style={{
            marginBottom: "14px",
            color: "#1f2937",
            fontSize: "20px",
          }}
        >

          📊 Estado de los locales

        </h2>


        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >

          <TarjetaEstado
            tipo="completos"
            titulo="Completos"
            icono="🟢"
            cantidad={
              datos.localesCompletos.length
            }
            locales={
              datos.localesCompletos
            }
            color="#166534"
            background="#dcfce7"
            borde="#bbf7d0"
          />


          <TarjetaEstado
            tipo="faltantes"
            titulo="Faltantes"
            icono="⚠️"
            cantidad={
              datos.localesFaltantes.length
            }
            locales={
              datos.localesFaltantes
            }
            color="#92400e"
            background="#fef3c7"
            borde="#fde68a"
          />


          <TarjetaEstado
            tipo="excedentes"
            titulo="Excedentes"
            icono="🔴"
            cantidad={
              datos.localesExcedentes.length
            }
            locales={
              datos.localesExcedentes
            }
            color="#991b1b"
            background="#fee2e2"
            borde="#fecaca"
          />

        </div>

      </div>


      {/* =================================================
          DISTRIBUCIÓN POR PUESTO
      ================================================= */}

      <div
        style={{
          marginTop: "30px",
        }}
      >

        <h2
          style={{
            marginBottom: "14px",
            color: "#1f2937",
            fontSize: "20px",
          }}
        >

          👥 Distribución por Puesto

        </h2>


        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "20px",
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.07)",
            border:
              "1px solid #e5e7eb",
          }}
        >

          {datos.distribucionPuestos.length === 0 ? (

            <p
              style={{
                color: "#6b7280",
              }}
            >

              No hay información de puestos.

            </p>

          ) : (

            datos.distribucionPuestos.map(
              (puesto) => (

                <div
                  key={puesto.puesto}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom:
                      "1px solid #f3f4f6",
                  }}
                >

                  <span>
                    {puesto.puesto}
                  </span>


                  <strong>
                    {puesto.cantidad}
                  </strong>

                </div>

              )
            )

          )}

        </div>

      </div>


      {/* =================================================
          RESUMEN POR ZONA
      ================================================= */}

      <div
        style={{
          marginTop: "30px",
        }}
      >

        <h2
          style={{
            marginBottom: "14px",
            color: "#1f2937",
            fontSize: "20px",
          }}
        >

          🌎 Resumen por Zona

        </h2>


        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >

          {datos.distribucionZonas.map(
            (zona) => (

              <div
                key={zona.id}
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "18px",
                  boxShadow:
                    "0 5px 20px rgba(0,0,0,0.07)",
                  border:
                    "1px solid #e5e7eb",
                }}
              >

                <h3
                  style={{
                    marginTop: 0,
                    color: "#1f2937",
                  }}
                >

                  {zona.nombre}

                </h3>


                <p>
                  🏪 Locales:{" "}
                  <strong>
                    {zona.locales}
                  </strong>
                </p>


                <p>
                  📊 Teórica:{" "}
                  <strong>
                    {zona.dotacionTeorica}
                  </strong>
                </p>


                <p>
                  👥 Real:{" "}
                  <strong>
                    {zona.dotacionReal}
                  </strong>
                </p>


                <p>
                  Diferencia:{" "}
                  <strong
                    style={{
                      color:
                        zona.diferencia < 0
                          ? "#92400e"
                          : zona.diferencia > 0
                          ? "#991b1b"
                          : "#166534",
                    }}
                  >

                    {zona.diferencia > 0
                      ? `+${zona.diferencia}`
                      : zona.diferencia}

                  </strong>
                </p>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );

}