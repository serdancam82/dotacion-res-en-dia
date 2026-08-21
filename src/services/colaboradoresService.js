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
// OBTENER LOCAL
// =====================================================

async function obtenerLocal(id) {
  if (!id) {
    return null;
  }

  const { data, error } = await supabase
    .from("locales")
    .select(`
      id,
      numero,
      nombre
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(
      "ERROR OBTENIENDO LOCAL:",
      error
    );

    throw error;
  }

  return data || null;
}


// =====================================================
// REGISTRAR MOVIMIENTO
// =====================================================

async function registrarMovimiento({
  colaboradorId,
  localAnteriorId,
  localNuevoId,
}) {
  if (
    !colaboradorId ||
    !localAnteriorId ||
    !localNuevoId ||
    localAnteriorId === localNuevoId
  ) {
    return;
  }

  const [
    localAnterior,
    localNuevo,
  ] = await Promise.all([
    obtenerLocal(localAnteriorId),
    obtenerLocal(localNuevoId),
  ]);

  const anteriorTexto = localAnterior
    ? `Local Nº ${localAnterior.numero || "-"} - ${
        localAnterior.nombre || "Sin nombre"
      }`
    : "Local desconocido";

  const nuevoTexto = localNuevo
    ? `Local Nº ${localNuevo.numero || "-"} - ${
        localNuevo.nombre || "Sin nombre"
      }`
    : "Local desconocido";

  const descripcion =
    `${anteriorTexto} → ${nuevoTexto}`;

  const { error } = await supabase
    .from("logs")
    .insert([
      {
        tipo: "MOVIMIENTO_COLABORADOR",
        descripcion,
        colaborador_id: colaboradorId,
        local_anterior_id: localAnteriorId,
        local_nuevo_id: localNuevoId,
      },
    ]);

  if (error) {
    console.error(
      "ERROR REGISTRANDO MOVIMIENTO:",
      error
    );

    throw error;
  }

  console.log(
    "MOVIMIENTO REGISTRADO:",
    descripcion
  );
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
      "No se recibió el ID del colaborador."
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
      rol,
      local_id
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

    local_id:
      colaborador.local_id !== undefined
        ? colaborador.local_id
        : actual.local_id,
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
  // DETECTAR CAMBIO DE LOCAL
  // ---------------------------------------------------

  const huboMovimiento =
    actual.local_id &&
    payload.local_id &&
    actual.local_id !== payload.local_id;

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

  // ---------------------------------------------------
  // REGISTRAR MOVIMIENTO
  // ---------------------------------------------------

  if (huboMovimiento) {
    try {
      await registrarMovimiento({
        colaboradorId: id,
        localAnteriorId: actual.local_id,
        localNuevoId: payload.local_id,
      });
    } catch (errorMovimiento) {
      console.error(
        "EL COLABORADOR FUE MOVIDO, PERO NO SE PUDO REGISTRAR EL MOVIMIENTO:",
        errorMovimiento
      );
    }
  }

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