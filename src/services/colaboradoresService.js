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

  console.log(
    "COLABORADORES DESDE SUPABASE:",
    data
  );

  return data || [];
}


// =====================================================
// CREAR COLABORADOR
// =====================================================

export async function createColaborador(
  colaborador
) {
  const payload = {
    legajo:
      colaborador.legajo || null,

    nombre:
      colaborador.nombre || null,

    apellido:
      colaborador.apellido || null,

    telefono:
      colaborador.telefono || null,

    puesto:
      colaborador.puesto || null,

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
// ACTUALIZAR COLABORADOR
// =====================================================

export async function updateColaborador(
  id,
  colaborador
) {
  const payload = {
    legajo:
      colaborador.legajo || null,

    nombre:
      colaborador.nombre || null,

    apellido:
      colaborador.apellido || null,

    telefono:
      colaborador.telefono || null,

    puesto:
      colaborador.puesto || null,

    rol:
      colaborador.rol || "colaborador",

    local_id:
      colaborador.local_id || null,
  };

  console.log(
    "ACTUALIZANDO COLABORADOR:",
    id
  );

  console.log(
    "PAYLOAD:",
    payload
  );

  const { data, error } = await supabase
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

  console.log(
    "COLABORADOR ACTUALIZADO:",
    data
  );

  return data?.[0] || null;
}


// =====================================================
// ELIMINAR COLABORADOR
// =====================================================

export async function deleteColaborador(
  id
) {
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