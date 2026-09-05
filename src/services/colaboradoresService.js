import { supabase } from "../supabaseClient";

// =====================================================
// OBTENER COLABORADORES
// =====================================================

export async function getColaboradores() {
  const { data, error } = await supabase
    .from("personal")
    .select(`
      *,
      locales!personal_local_id_fkey (
        id,
        numero,
        nombre
      )
    `)
    .order("apellido", {
      ascending: true,
    });

  if (error) {
    console.error(
      "ERROR GET COLABORADORES:",
      error
    );

    throw error;
  }

  return data || [];
}


// =====================================================
// CREAR COLABORADOR
// =====================================================

export async function createColaborador(colaborador) {
  const payload = {
    legajo:
      colaborador.legajo ?? null,

    nombre:
      colaborador.nombre ?? null,

    apellido:
      colaborador.apellido ?? null,

    telefono:
      colaborador.telefono ?? null,

    puesto:
      colaborador.puesto ?? null,

    rol:
      colaborador.rol || "colaborador",

    local_id:
      colaborador.local_id || null,
  };

  console.log(
    "CREANDO COLABORADOR:",
    payload
  );

  const { data, error } = await supabase
    .from("personal")
    .insert([payload])
    .select("*");

  if (error) {
    console.error(
      "ERROR CREATE COLABORADOR:",
      error
    );

    throw error;
  }

  return data?.[0] || null;
}


// =====================================================
// MOVER COLABORADOR
// =====================================================

export async function moverColaborador(
  id,
  localNuevoId
) {
  if (!id) {
    throw new Error(
      "No se recibio el ID del colaborador."
    );
  }

  if (!localNuevoId) {
    throw new Error(
      "No se recibio el ID del nuevo local."
    );
  }

  const {
    data,
    error,
  } = await supabase
    .rpc("mover_colaborador_atomico", {
      p_colaborador_id: id,
      p_local_nuevo_id: localNuevoId,
    });

  if (error) {
    console.error(
      "ERROR MOVIENDO COLABORADOR:",
      error
    );

    throw error;
  }

  return data;
}


// =====================================================
// ACTUALIZAR COLABORADOR
// =====================================================

export async function updateColaborador(
  id,
  colaborador
) {
  if (!id) {
    throw new Error(
      "No se recibio el ID del colaborador."
    );
  }

  // ---------------------------------------------------
  // OBTENER DATOS ACTUALES
  // ---------------------------------------------------

  const {
    data: actual,
    error: errorActual,
  } = await supabase
    .from("personal")
    .select(`
      id,
      legajo,
      nombre,
      apellido,
      telefono,
      puesto,
      rol
    `)
    .eq("id", id)
    .single();

  if (errorActual) {
    console.error(
      "ERROR OBTENIENDO COLABORADOR ACTUAL:",
      errorActual
    );

    throw errorActual;
  }

  // ---------------------------------------------------
  // CONSERVAR DATOS EXISTENTES
  // ---------------------------------------------------

  const payload = {
    legajo:
      colaborador.legajo !== undefined
        ? colaborador.legajo
        : actual.legajo,

    nombre:
      colaborador.nombre !== undefined
        ? colaborador.nombre
        : actual.nombre,

    apellido:
      colaborador.apellido !== undefined
        ? colaborador.apellido
        : actual.apellido,

    telefono:
      colaborador.telefono !== undefined
        ? colaborador.telefono
        : actual.telefono,

    puesto:
      colaborador.puesto !== undefined
        ? colaborador.puesto
        : actual.puesto,

    rol:
      colaborador.rol !== undefined
        ? colaborador.rol
        : actual.rol,
  };

  console.log(
    "COLABORADOR ACTUAL:",
    actual
  );

  console.log(
    "PAYLOAD:",
    payload
  );

  // ---------------------------------------------------
  // ACTUALIZAR PERSONAL
  // ---------------------------------------------------

  const {
    data,
    error,
  } = await supabase
    .from("personal")
    .update(payload)
    .eq("id", id)
    .select("*");

  if (error) {
    console.error(
      "ERROR UPDATE COLABORADOR:",
      error
    );

    throw error;
  }

  const actualizado =
    data?.[0] || null;

  return actualizado;
}


// =====================================================
// ELIMINAR COLABORADOR
// =====================================================

export async function deleteColaborador(id) {
  console.log(
    "ELIMINANDO COLABORADOR:",
    id
  );

  const { error } = await supabase
    .from("personal")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "ERROR DELETE COLABORADOR:",
      error
    );

    throw error;
  }

  return true;
}
