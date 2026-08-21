import { supabase } from "../supabaseClient";

// =====================================================
// OBTENER MOVIMIENTOS DE UN COLABORADOR
// =====================================================

export async function getMovimientosColaborador(
  colaboradorId
) {
  if (!colaboradorId) {
    return [];
  }

  const { data, error } = await supabase
    .from("logs")
    .select(`
      id,
      tipo,
      descripcion,
      colaborador_id,
      local_anterior_id,
      local_nuevo_id,
      created_at
    `)
    .eq("colaborador_id", colaboradorId)
    .eq("tipo", "MOVIMIENTO_COLABORADOR")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "ERROR OBTENIENDO MOVIMIENTOS:",
      error
    );

    throw error;
  }

  return data || [];
}


// =====================================================
// OBTENER TODOS LOS MOVIMIENTOS
// =====================================================

export async function getMovimientos() {
  const { data, error } = await supabase
    .from("logs")
    .select(`
      id,
      tipo,
      descripcion,
      colaborador_id,
      local_anterior_id,
      local_nuevo_id,
      created_at
    `)
    .eq("tipo", "MOVIMIENTO_COLABORADOR")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "ERROR OBTENIENDO MOVIMIENTOS:",
      error
    );

    throw error;
  }

  return data || [];
}