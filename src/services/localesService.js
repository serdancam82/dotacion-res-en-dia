import { supabase } from "../supabaseClient";


// =====================================================
// OBTENER LOCALES
// =====================================================

export async function getLocales() {

  const { data, error } = await supabase
    .from("locales")
    .select(`
      id,
      numero,
      nombre,
      zona_id,
      telefono,
      whatsapp,
      direccion,
      encargado,
      latitud,
      longitud,
      dotacion_teorica,
      zonas (
        id,
        nombre
      )
    `)
    .order("numero", {
      ascending: true,
    });


  if (error) {

    console.error(
      "ERROR OBTENIENDO LOCALES:",
      error
    );

    throw error;

  }


  const locales = data || [];


  // ===================================================
  // DEBUG MUNRO
  // ===================================================

  const munro = locales.find(
    (local) =>
      local.id ===
      "36cd975f-5480-4721-b6c5-5bb6607c81d6"
  );


  console.log(
    "LOCALES DESDE SUPABASE:",
    locales
  );


  console.log(
    "MUNRO DESDE SUPABASE:",
    munro
  );


  return locales;

}



// =====================================================
// VERIFICAR NUMERO DISPONIBLE
// =====================================================

async function verificarNumeroDisponible(
  numero,
  id = null
) {

  let query = supabase
    .from("locales")
    .select("id, numero")
    .eq("numero", numero);


  if (id) {

    query = query.neq(
      "id",
      id
    );

  }


  const {
    data,
    error,
  } = await query;


  if (error) {

    console.error(
      "ERROR VERIFICANDO NUMERO:",
      error
    );

    throw error;

  }


  return (
    !data ||
    data.length === 0
  );

}



// =====================================================
// CREAR LOCAL
// =====================================================

export async function createLocal(local) {

  const numero =
    String(
      local.numero ?? ""
    ).trim();


  if (!numero) {

    throw new Error(
      "El número del local es obligatorio."
    );

  }


  const disponible =
    await verificarNumeroDisponible(
      numero
    );


  if (!disponible) {

    throw new Error(
      `Ya existe un local con el número ${numero}.`
    );

  }


  const dotacion =
    Number(
      local.dotacion_teorica ?? 4
    );


  const payload = {

    numero,

    nombre:
      String(
        local.nombre ?? ""
      ).trim(),

    zona_id:
      local.zona_id || null,

    direccion:
      String(
        local.direccion ?? ""
      ).trim(),

    telefono:
      String(
        local.telefono ?? ""
      ).trim(),

    whatsapp:
      String(
        local.whatsapp ?? ""
      ).trim(),

    encargado:
      String(
        local.encargado ?? ""
      ).trim(),

    latitud:
      local.latitud ?? null,

    longitud:
      local.longitud ?? null,

    dotacion_teorica:
      Number.isFinite(dotacion)
        ? dotacion
        : 4,

  };


  console.log(
    "CREANDO LOCAL - PAYLOAD:",
    payload
  );


  const {
    data,
    error,
  } =
    await supabase
      .from("locales")
      .insert([payload])
      .select(`
        id,
        numero,
        nombre,
        zona_id,
        telefono,
        whatsapp,
        direccion,
        encargado,
        latitud,
        longitud,
        dotacion_teorica
      `);


  if (error) {

    console.error(
      "ERROR CREANDO LOCAL:",
      error
    );

    throw error;

  }


  if (
    !data ||
    data.length === 0
  ) {

    throw new Error(
      "El local fue creado pero Supabase no devolvió el registro."
    );

  }


  console.log(
    "LOCAL CREADO CORRECTAMENTE:",
    data[0]
  );


  return data[0];

}



// =====================================================
// ACTUALIZAR LOCAL
// =====================================================

export async function updateLocal(
  id,
  local
) {

  if (!id) {

    throw new Error(
      "No se recibió el ID del local."
    );

  }


  const numero =
    String(
      local.numero ?? ""
    ).trim();


  if (!numero) {

    throw new Error(
      "El número del local es obligatorio."
    );

  }


  const disponible =
    await verificarNumeroDisponible(
      numero,
      id
    );


  if (!disponible) {

    throw new Error(
      `Ya existe otro local con el número ${numero}.`
    );

  }


  const dotacion =
    Number(
      local.dotacion_teorica ?? 4
    );


  const payload = {

    numero,

    nombre:
      String(
        local.nombre ?? ""
      ).trim(),

    zona_id:
      local.zona_id || null,

    direccion:
      String(
        local.direccion ?? ""
      ).trim(),

    telefono:
      String(
        local.telefono ?? ""
      ).trim(),

    whatsapp:
      String(
        local.whatsapp ?? ""
      ).trim(),

    encargado:
      String(
        local.encargado ?? ""
      ).trim(),

    latitud:
      local.latitud ?? null,

    longitud:
      local.longitud ?? null,

    dotacion_teorica:
      Number.isFinite(dotacion)
        ? dotacion
        : 4,

  };


  console.log(
    "===================================="
  );

  console.log(
    "ACTUALIZANDO LOCAL:",
    id
  );

  console.log(
    "PAYLOAD:",
    payload
  );

  console.log(
    "===================================="
  );


  // ===================================================
  // UPDATE
  // ===================================================

  const {
    error,
    count,
  } =
    await supabase
      .from("locales")
      .update(payload, {
        count: "exact",
      })
      .eq("id", id);


  if (error) {

    console.error(
      "ERROR UPDATE LOCAL:",
      error
    );

    throw error;

  }


  console.log(
    "CANTIDAD DE FILAS ACTUALIZADAS:",
    count
  );


  if (count === 0) {

    throw new Error(
      "Supabase no actualizó ningún local. Verificá el ID y las políticas RLS."
    );

  }


  console.log(
    "LOCAL ACTUALIZADO CORRECTAMENTE:",
    id
  );


  // ===================================================
  // VERIFICAR LO QUE REALMENTE QUEDÓ EN SUPABASE
  // ===================================================

  const {
    data: localVerificado,
    error: errorVerificacion,
  } =
    await supabase
      .from("locales")
      .select(`
        id,
        numero,
        nombre,
        zona_id,
        telefono,
        whatsapp,
        direccion,
        encargado,
        latitud,
        longitud,
        dotacion_teorica,
        zonas (
          id,
          nombre
        )
      `)
      .eq("id", id);


  if (errorVerificacion) {

    console.error(
      "ERROR VERIFICANDO LOCAL ACTUALIZADO:",
      errorVerificacion
    );

    throw errorVerificacion;

  }


  console.log(
    "LOCAL DESPUÉS DEL UPDATE:",
    localVerificado
  );


  if (
    !localVerificado ||
    localVerificado.length === 0
  ) {

    throw new Error(
      "El local fue actualizado pero no pudo ser leído nuevamente desde Supabase."
    );

  }


  const localFinal =
    localVerificado[0];


  console.log(
    "NOMBRE FINAL EN SUPABASE:",
    localFinal.nombre
  );


  console.log(
    "NUMERO FINAL EN SUPABASE:",
    localFinal.numero
  );


  console.log(
    "DOTACION FINAL EN SUPABASE:",
    localFinal.dotacion_teorica
  );


  return localFinal;

}



// =====================================================
// ELIMINAR LOCAL
// =====================================================

export async function deleteLocal(
  id
) {

  if (!id) {

    throw new Error(
      "No se recibió el ID del local."
    );

  }


  const {
    error,
    count,
  } =
    await supabase
      .from("locales")
      .delete({
        count: "exact",
      })
      .eq("id", id);


  if (error) {

    console.error(
      "ERROR ELIMINANDO LOCAL:",
      error
    );

    throw error;

  }


  console.log(
    "FILAS ELIMINADAS:",
    count
  );


  if (count === 0) {

    throw new Error(
      "No se encontró el local para eliminar."
    );

  }


  console.log(
    "LOCAL ELIMINADO CORRECTAMENTE:",
    id
  );


  return true;

}