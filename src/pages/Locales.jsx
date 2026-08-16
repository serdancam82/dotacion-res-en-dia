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

          dotacion_teorica:
            Number(
              local.dotacion_teorica ?? 4
            ),

        }));


      setLocales(
        localesNormalizados
      );

      setZonas(
        zonasData || []
      );

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


        console.log(
          "GUARDANDO CAMBIOS EN LOCAL:",
          id
        );

        console.log(
          "DATOS DEL FORMULARIO:",
          local
        );


        await updateLocal(
          id,
          local
        );


        // -----------------------------------------------
        // ACTUALIZACIÓN INMEDIATA DEL ESTADO
        // -----------------------------------------------

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

                // ---------------------------------------
                // MANTENER RELACIÓN CON ZONA
                // ---------------------------------------

                zonas:
                  zonas.find(
                    (zona) =>
                      String(zona.id) ===
                      String(local.zona_id)
                  ) || item.zonas || null,

              };

            }
          );

        });


        console.log(
          "LOCAL ACTUALIZADO EN ESTADO LOCAL:",
          id
        );


        setLocalEditando(null);


        // -----------------------------------------------
        // RECARGA FINAL DESDE SUPABASE
        // -----------------------------------------------

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


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

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
  // DOTACIÓN REAL
  // =====================================================

  function obtenerDotacionReal(localId) {

    return colaboradores.filter(
      (colaborador) =>
        colaborador.local_id === localId
    ).length;

  }


  // =====================================================
  // ENRIQUECER LOCALES
  // =====================================================

  const localesConDotacion =
    locales.map((local) => {

      const dotacionReal =
        obtenerDotacionReal(
          local.id
        );


      const dotacionTeorica =
        Number(
          local.dotacion_teorica ?? 4
        );


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


      <LocalForm

        local={localEditando}

        zonas={zonas}

        onSave={handleSave}

        onCancel={handleCancel}

      />


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

          onEdit={handleEdit}

          onDelete={handleDelete}

        />

      )}

    </div>

  );

}