import { supabase } from "../supabaseClient";


// ===============================
// OBTENER COLABORADORES
// ===============================
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
      ascending: true
    });


  console.log(
    "DATOS DESDE SUPABASE:",
    data
  );


  if (error) {
    console.error(
      "ERROR GET COLABORADORES:",
      error
    );

    throw error;
  }


  return data || [];

}



// ===============================
// CREAR COLABORADOR
// ===============================
export async function createColaborador(colaborador) {

  const { data, error } = await supabase
    .from("personal")
    .insert([colaborador])
    .select();


  if (error) {
    throw error;
  }


  return data?.[0] || null;

}



// ===============================
// ACTUALIZAR COLABORADOR
// ===============================
export async function updateColaborador(id, colaborador) {

  console.log("UPDATE ID:", id);
  console.log("DATOS RECIBIDOS:", colaborador);

  const payload = {
    legajo: colaborador.legajo || null,
    nombre: colaborador.nombre,
    apellido: colaborador.apellido,
    telefono: colaborador.telefono || null,
    puesto: colaborador.puesto,
    rol: colaborador.rol,
    local_id: colaborador.local_id || null,
  };


  console.log("PAYLOAD A SUPABASE:", payload);


  const { data, error } = await supabase
    .from("personal")
    .update(payload)
    .eq("id", id)
    .select("*");


  console.log("RESPUESTA UPDATE:", data);
  console.log("ERROR UPDATE:", error);


  if (error) {
    throw error;
  }


  return data?.[0] || null;
}



// ===============================
// ELIMINAR COLABORADOR
// ===============================
export async function deleteColaborador(id) {

  const { error } = await supabase
    .from("personal")
    .delete()
    .eq("id", id);


  if (error) {
    throw error;
  }


  return true;

}