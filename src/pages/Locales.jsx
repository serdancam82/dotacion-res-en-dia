import { useEffect, useState } from "react";

import {
  getLocales,
  createLocal,
  updateLocal,
  deleteLocal,
} from "../services/localesService";

import { getZonas } from "../services/zonasService";
import {
  getColaboradores,
} from "../services/colaboradoresService";

import LocalForm from "../components/locales/LocalForm/LocalForm";
import LocalList from "../components/locales/LocalList/LocalList";


export default function Locales() {

  const [locales, setLocales] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);

  const [localEditando, setLocalEditando] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // CARGAR DATOS
  // =====================================================

  async function cargarDatos() {

    try {

      setLoading(true);
      setError("");

      const [
        localesData,
        zonasData,
        colaboradoresData,
      ] = await Promise.all([
        getLocales(),
        getZonas(),
        getColaboradores(),
      ]);


      const localesNormalizados =
        (localesData || []).map((local) => ({

          ...local,

          numero:
            local.numero !== null &&
            local.numero !== undefined
              ? String(local.numero)
              : "",

          nombre:
            local.nombre || "",

          zona_id:
            local.zona_id || null,

          telefono:
            local.telefono || "",

          whatsapp:
            local.whatsapp || "",

          direccion:
            local.direccion || "",

          encargado:
            local.encargado || "",

          latitud:
            local.latitud ?? null,

          longitud:
            local.longitud ?? null,

          dotacion_teorica:
            Number(
              local.dotacion_teorica ?? 4
            ),

        }));


      setLocales(localesNormalizados);
      setZonas(zonasData || []);
      setColaboradores(
        colaboradoresData || []
      );

    } catch (err) {

      console.error(
        "ERROR CARGANDO MÓDULO LOCALES:",
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
  // CREAR / ACTUALIZAR
  // =====================================================

  async function handleSave(local) {

    try {

      setError("");


      // =================================================
      // ACTUALIZAR
      // =================================================

      if (localEditando) {

        const id =
          localEditando.id;


        await updateLocal(
          id,
          local
        );


        setLocales((prevLocales) => {

          return prevLocales.map(
            (item) => {

              if (item.id !== id) {
                return item;
              }


              return {

                ...item,

                numero:
                  local.numero !== undefined
                    ? String(local.numero)
                    : item.numero,

                nombre:
                  local.nombre !== undefined
                    ? local.nombre
                    : item.nombre,

                zona_id:
                  local.zona_id || null,

                direccion:
                  local.direccion || "",

                telefono:
                  local.telefono || "",

                whatsapp:
                  local.whatsapp || "",

                encargado:
                  local.encargado || "",

                latitud:
                  local.latitud ?? null,

                longitud:
                  local.longitud ?? null,

                dotacion_teorica:
                  Number(
                    local.dotacion_teorica ?? 4
                  ),

                zonas:
                  zonas.find(
                    (zona) =>
                      String(zona.id) ===
                      String(local.zona_id)
                  ) ||
                  item.zonas ||
                  null,

              };

            }
          );

        });


        setLocalEditando(null);

        await cargarDatos();

        return;

      }


      // =================================================
      // CREAR
      // =================================================

      await createLocal(local);

      setLocalEditando(null);

      await cargarDatos();

    } catch (err) {

      console.error(
        "ERROR GUARDANDO LOCAL:",
        err
      );

      alert(
        err?.message ||
        "No se pudo guardar el local."
      );

    }

  }


  // =====================================================
  // EDITAR
  // =====================================================

  function handleEdit(local) {

    setLocalEditando(local);


    setTimeout(() => {

      const formulario =
        document.getElementById(
          "local-formulario"
        );

      if (formulario) {

        formulario.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      }

    }, 100);

  }


  // =====================================================
  // CANCELAR
  // =====================================================

  function handleCancel() {

    setLocalEditando(null);

  }


  // =====================================================
  // ELIMINAR
  // =====================================================

  async function handleDelete(id) {

    const confirmar =
      window.confirm(
        "¿Está seguro de eliminar este local?"
      );


    if (!confirmar) {
      return;
    }


    try {

      setError("");

      await deleteLocal(id);


      setLocales((prevLocales) =>
        prevLocales.filter(
          (local) =>
            local.id !== id
        )
      );


      await cargarDatos();

    } catch (err) {

      console.error(
        "ERROR ELIMINANDO LOCAL:",
        err
      );

      alert(
        err?.message ||
        "No se pudo eliminar el local."
      );

    }

  }


  // =====================================================
  // LOCALES CON DOTACIÓN Y ENCARGADO
  // =====================================================

  const localesConDotacion =
    locales.map((local) => {

      const colaboradoresLocal =
        colaboradores.filter(
          (colaborador) =>
            String(
              colaborador.local_id
            ) ===
            String(local.id)
        );


      const dotacionReal =
        colaboradoresLocal.length;


      const dotacionTeorica =
        Number(
          local.dotacion_teorica ?? 4
        );


      // =================================================
      // BUSCAR ENCARGADO REAL
      // =================================================

      const encargado =
        colaboradoresLocal.find(
          (colaborador) =>
            String(
              colaborador.puesto || ""
            ).trim().toLowerCase() ===
            "encargado"
        );


      const nombreEncargado =
        encargado
          ? `${encargado.nombre || ""} ${
              encargado.apellido || ""
            }`.trim()
          : "";


      return {

        ...local,

        numero:
          local.numero || "",

        nombre:
          local.nombre || "",

        dotacion_teorica:
          dotacionTeorica,

        dotacion_real:
          dotacionReal,

        encargado:
          nombreEncargado,

      };

    });


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      style={{
        padding: "25px",
      }}
    >

      <h1
        style={{
          marginBottom: "25px",
          color: "#1f2937",
        }}
      >
        Locales
      </h1>


      {error && (

        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px 15px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>

      )}


      <div id="local-formulario">

        <LocalForm

          local={localEditando}

          zonas={zonas}

          onSave={handleSave}

          onCancel={handleCancel}

        />

      </div>


      {loading ? (

        <div
          style={{
            padding: "30px",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          Cargando locales...
        </div>

      ) : (

        <LocalList
  locales={localesConDotacion}
  colaboradores={colaboradores}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>

      )}

    </div>

  );

}