import { supabase } from "../supabaseClient";

// =====================================================
// OBTENER TODAS LAS ZONAS
// =====================================================

export async function getZonas() {
  const [
    { data: zonas, error: zonasError },
    { data: locales, error: localesError },
    { data: personal, error: personalError },
  ] = await Promise.all([
    supabase
      .from("zonas")
      .select("*")
      .order("nombre"),

    supabase
      .from("locales")
      .select("*"),

    supabase
      .from("personal")
      .select("*"),
  ]);

  if (zonasError) throw zonasError;
  if (localesError) throw localesError;
  if (personalError) throw personalError;

  return (zonas || []).map((zona) => {
    const localesZona = (locales || []).filter(
      (local) =>
        String(local.zona_id) ===
        String(zona.id)
    );

    const idsLocales = localesZona.map(
      (local) => local.id
    );

    const colaboradoresZona =
      (personal || []).filter(
        (persona) =>
          persona.local_id &&
          idsLocales.includes(
            persona.local_id
          )
      );

    const supervisor =
      (personal || []).find(
        (persona) =>
          String(persona.id) ===
          String(zona.supervisor_id)
      );

    const auditor =
      (personal || []).find(
        (persona) =>
          String(persona.id) ===
          String(zona.auditor_id)
      );

    const dotacionTeorica =
      localesZona.reduce(
        (total, local) =>
          total +
          Number(
            local.dotacion_teorica ?? 4
          ),
        0
      );

    const dotacionReal =
      colaboradoresZona.length;

    const diferencia =
      dotacionReal -
      dotacionTeorica;

    let estado = "completa";

    if (diferencia < 0) {
      estado = "faltante";
    }

    if (diferencia > 0) {
      estado = "excedente";
    }

    return {
      ...zona,

      supervisor_id:
        zona.supervisor_id || null,

      auditor_id:
        zona.auditor_id || null,

      supervisor: supervisor
        ? `${supervisor.nombre} ${supervisor.apellido}`
        : "",

      auditor: auditor
        ? `${auditor.nombre} ${auditor.apellido}`
        : "",

      locales: localesZona,

      cantidadLocales:
        localesZona.length,

      colaboradores:
        colaboradoresZona.length,

      dotacionTeorica,

      dotacionReal,

      diferencia,

      estado,
    };
  });
}


// =====================================================
// CREAR ZONA
// =====================================================

export async function createZona(nombre) {
  const { error } = await supabase
    .from("zonas")
    .insert([
      {
        nombre: nombre.trim(),
      },
    ]);

  if (error) throw error;
}


// =====================================================
// MODIFICAR ZONA
// =====================================================

export async function updateZona(
  id,
  nombre
) {
  const { error } = await supabase
    .from("zonas")
    .update({
      nombre: nombre.trim(),
    })
    .eq("id", id);

  if (error) throw error;
}


// =====================================================
// ELIMINAR ZONA
// =====================================================

export async function deleteZona(id) {
  const { error } = await supabase
    .from("zonas")
    .delete()
    .eq("id", id);

  if (error) throw error;
}


// =====================================================
// SUPERVISORES EXISTENTES
// =====================================================

export async function getSupervisores() {
  const { data, error } =
    await supabase
      .from("personal")
      .select(
        "id,nombre,apellido,rol,local_id"
      )
      .eq("rol", "supervisor")
      .order("apellido");

  if (error) throw error;

  return data || [];
}


// =====================================================
// AUDITORES EXISTENTES
// =====================================================

export async function getAuditores() {
  const { data, error } =
    await supabase
      .from("personal")
      .select(
        "id,nombre,apellido,rol,local_id"
      )
      .eq("rol", "auditor")
      .order("apellido");

  if (error) throw error;

  return data || [];
}


// =====================================================
// CREAR RESPONSABLE NUEVO
// =====================================================

export async function createResponsable({
  nombre,
  apellido,
  rol,
}) {
  const rolNormalizado =
    rol?.toLowerCase();

  if (
    rolNormalizado !== "supervisor" &&
    rolNormalizado !== "auditor"
  ) {
    throw new Error(
      "El responsable debe ser Supervisor o Auditor."
    );
  }

  const { data, error } =
    await supabase
      .from("personal")
      .insert([
        {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          rol: rolNormalizado,
          local_id: null,
        },
      ])
      .select()
      .single();

  if (error) throw error;

  return data;
}


// =====================================================
// ASIGNAR SUPERVISOR / AUDITOR
// =====================================================

export async function updateZonaAsignacion(
  id,
  supervisor_id,
  auditor_id
) {
  const { error } =
    await supabase
      .from("zonas")
      .update({
        supervisor_id:
          supervisor_id || null,

        auditor_id:
          auditor_id || null,
      })
      .eq("id", id);

  if (error) throw error;

  return true;
}