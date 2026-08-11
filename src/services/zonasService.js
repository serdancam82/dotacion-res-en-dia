import { supabase } from "../supabaseClient";

// =====================================================
// OBTENER TODAS LAS ZONAS
// =====================================================
export async function getZonas() {
  // 1 - Traer zonas
  const { data: zonas, error: zonasError } = await supabase
    .from("zonas")
    .select("*")
    .order("nombre");

  if (zonasError) throw zonasError;

  // 2 - Traer locales
  const { data: locales, error: localesError } = await supabase
    .from("locales")
    .select("*");

  if (localesError) throw localesError;

  // 3 - Traer personal
  const { data: personal, error: personalError } = await supabase
    .from("personal")
    .select("*");

  if (personalError) throw personalError;

  return zonas.map((zona) => {

    const localesZona = locales.filter(
      local => local.zona_id === zona.id
    );

    const idsLocales = localesZona.map(local => local.id);

    const colaboradores = personal.filter(
      persona => idsLocales.includes(persona.local_id)
    );

    const supervisor = personal.find(
      persona => persona.id === zona.supervisor_id
    );

    const auditor = personal.find(
      persona => persona.id === zona.auditor_id
    );

    return {

      id: zona.id,
      nombre: zona.nombre,

      supervisor_id: zona.supervisor_id,
      auditor_id: zona.auditor_id,

      supervisor: supervisor
        ? `${supervisor.nombre} ${supervisor.apellido}`
        : "-",

      auditor: auditor
        ? `${auditor.nombre} ${auditor.apellido}`
        : "-",

      locales: localesZona.length,

      colaboradores: colaboradores.length,

      dotacionTeorica: colaboradores.length

    };

  });
}

// =====================================================
// CREAR ZONA
// =====================================================
export async function createZona(nombre) {

  const { error } = await supabase
    .from("zonas")
    .insert([{ nombre }]);

  if (error) throw error;

}

// =====================================================
// MODIFICAR ZONA
// =====================================================
export async function updateZona(id, nombre) {

  const { error } = await supabase
    .from("zonas")
    .update({ nombre })
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
// SUPERVISORES
// =====================================================
export async function getSupervisores() {

  const { data, error } = await supabase
    .from("personal")
    .select("id,nombre,apellido")
    .eq("rol", "Supervisor")
    .order("apellido");

  if (error) throw error;

  return data || [];

}

// =====================================================
// AUDITORES
// =====================================================
export async function getAuditores() {

  const { data, error } = await supabase
    .from("personal")
    .select("id,nombre,apellido")
    .eq("rol", "Auditor")
    .order("apellido");

  if (error) throw error;

  return data || [];

}

// =====================================================
// ASIGNAR RESPONSABLES
// =====================================================
export async function updateZonaAsignacion(
  id,
  supervisor_id,
  auditor_id
) {

  const { error } = await supabase
    .from("zonas")
    .update({

      supervisor_id: supervisor_id || null,
      auditor_id: auditor_id || null

    })
    .eq("id", id);

  if (error) throw error;

}