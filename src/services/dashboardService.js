/*
==========================================
RES en DÍA

dashboardService.js

Responsabilidad:
Obtener y preparar toda la información
necesaria para el Dashboard Ejecutivo.
==========================================
*/

import { supabase } from "../supabaseClient";


// =====================================================
// NORMALIZAR PARA AGRUPAR PUESTOS
// =====================================================
//
// IMPORTANTE:
// Esto NO modifica el puesto original de Supabase.
// Solamente genera una clave para poder agrupar:
//
// CARNICERO
// Carnicero
// carnicero
//
// como el mismo puesto.
//
// Los errores reales de escritura NO se corrigen
// automáticamente.
// =====================================================

function clavePuesto(puesto) {

  if (!puesto) {
    return "sin_puesto";
  }

  return String(puesto)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

}


// =====================================================
// NOMBRE PARA MOSTRAR EL PUESTO
// =====================================================

function nombrePuesto(puesto) {

  if (!puesto) {
    return "Sin puesto";
  }

  return String(puesto)
    .trim()
    .toLowerCase()
    .replace(/(^|\s)([a-záéíóúüñ])/g, (_, espacio, letra) => {

      return espacio + letra.toUpperCase();

    });

}


// =====================================================
// OBTENER DASHBOARD
// =====================================================

export async function getDashboard() {


  // ===================================================
  // OBTENER DATOS
  // ===================================================

  const [

    zonasResponse,

    localesResponse,

    personalResponse

  ] = await Promise.all([


    supabase
      .from("zonas")
      .select(`
        id,
        nombre
      `)
      .order("nombre"),



    supabase
      .from("locales")
      .select(`
        id,
        numero,
        nombre,
        zona_id,
        dotacion_teorica
      `)
      .order("nombre"),



    supabase
      .from("personal")
      .select(`
        id,
        nombre,
        apellido,
        puesto,
        rol,
        local_id
      `)
      .order("nombre")

  ]);


  // ===================================================
  // VALIDAR ERRORES
  // ===================================================

  if (zonasResponse.error) {
    throw zonasResponse.error;
  }


  if (localesResponse.error) {
    throw localesResponse.error;
  }


  if (personalResponse.error) {
    throw personalResponse.error;
  }


  const zonas =
    zonasResponse.data || [];


  const locales =
    localesResponse.data || [];


  const colaboradores =
    personalResponse.data || [];


  // ===================================================
  // PREPARAR INFORMACIÓN DE LOCALES
  // ===================================================

  const localesPreparados =
    locales.map((local) => {


      // -----------------------------------------------
      // PERSONAL DEL LOCAL
      // -----------------------------------------------

      const personalLocal =
        colaboradores.filter(
          (persona) =>
            persona.local_id === local.id
        );


      // -----------------------------------------------
      // ZONA
      // -----------------------------------------------

      const zona =
        zonas.find(
          (z) =>
            String(z.id) ===
            String(local.zona_id)
        );


      // -----------------------------------------------
      // DOTACIÓN
      // -----------------------------------------------

      const dotacionTeorica =
        Number(
          local.dotacion_teorica ?? 4
        );


      const dotacionReal =
        personalLocal.length;


      const diferencia =
        dotacionReal -
        dotacionTeorica;


      // -----------------------------------------------
      // ESTADO
      // -----------------------------------------------

      let estado = "completo";


      if (diferencia < 0) {

        estado = "faltante";

      } else if (diferencia > 0) {

        estado = "excedente";

      }


      return {

        ...local,

        zona_nombre:
          zona?.nombre || "Sin zona",

        colaboradores:
          personalLocal,

        dotacionTeorica,

        dotacionReal,

        diferencia,

        estado,

      };

    });


  // ===================================================
  // AGRUPAR LOCALES POR ESTADO
  // ===================================================

  const localesCompletos =
    localesPreparados.filter(
      (local) =>
        local.estado === "completo"
    );


  const localesFaltantes =
    localesPreparados.filter(
      (local) =>
        local.estado === "faltante"
    );


  const localesExcedentes =
    localesPreparados.filter(
      (local) =>
        local.estado === "excedente"
    );


  // ===================================================
  // DISTRIBUCIÓN POR PUESTO
  // ===================================================

  const puestosMap =
    new Map();


  colaboradores.forEach((persona) => {


    const clave =
      clavePuesto(persona.puesto);


    if (!puestosMap.has(clave)) {

      puestosMap.set(

        clave,

        {

          puesto:
            nombrePuesto(persona.puesto),

          cantidad: 0,

          originales: new Set(),

        }

      );

    }


    const registro =
      puestosMap.get(clave);


    registro.cantidad += 1;


    if (persona.puesto) {

      registro.originales.add(
        String(persona.puesto).trim()
      );

    }

  });


  const distribucionPuestos =
    Array.from(
      puestosMap.values()
    )
    .map((registro) => ({

      puesto:
        registro.puesto,

      cantidad:
        registro.cantidad,

      originales:
        Array.from(
          registro.originales
        ),

    }))
    .sort(
      (a, b) =>
        b.cantidad -
        a.cantidad
    );


  // ===================================================
  // DISTRIBUCIÓN POR ZONA
  // ===================================================

  const distribucionZonas =
    zonas.map((zona) => {


      const localesZona =
        localesPreparados.filter(
          (local) =>
            String(local.zona_id) ===
            String(zona.id)
        );


      const dotacionTeorica =
        localesZona.reduce(
          (total, local) =>
            total +
            local.dotacionTeorica,
          0
        );


      const dotacionReal =
        localesZona.reduce(
          (total, local) =>
            total +
            local.dotacionReal,
          0
        );


      const diferencia =
        dotacionReal -
        dotacionTeorica;


      let estado = "completa";


      if (diferencia < 0) {

        estado = "faltante";

      } else if (diferencia > 0) {

        estado = "excedente";

      }


      return {

        id:
          zona.id,

        nombre:
          zona.nombre,

        locales:
          localesZona.length,

        dotacionTeorica,

        dotacionReal,

        diferencia,

        estado,

        localesCompletos:
          localesZona.filter(
            (local) =>
              local.estado ===
              "completo"
          ),

        localesFaltantes:
          localesZona.filter(
            (local) =>
              local.estado ===
              "faltante"
          ),

        localesExcedentes:
          localesZona.filter(
            (local) =>
              local.estado ===
              "excedente"
          ),

      };

    });


  // ===================================================
  // RESULTADO FINAL
  // ===================================================

  return {

    // -----------------------------------------------
    // TOTALES
    // -----------------------------------------------

    totalZonas:
      zonas.length,

    totalLocales:
      locales.length,

    totalColaboradores:
      colaboradores.length,


    // -----------------------------------------------
    // DATOS GENERALES
    // -----------------------------------------------

    zonas,

    locales:
      localesPreparados,

    colaboradores,


    // -----------------------------------------------
    // LOCALES POR ESTADO
    // -----------------------------------------------

    localesCompletos,

    localesFaltantes,

    localesExcedentes,


    // -----------------------------------------------
    // CANTIDADES POR ESTADO
    // -----------------------------------------------

    totalLocalesCompletos:
      localesCompletos.length,

    totalLocalesFaltantes:
      localesFaltantes.length,

    totalLocalesExcedentes:
      localesExcedentes.length,


    // -----------------------------------------------
    // PUESTOS
    // -----------------------------------------------

    distribucionPuestos,


    // -----------------------------------------------
    // ZONAS
    // -----------------------------------------------

    distribucionZonas,

  };

}