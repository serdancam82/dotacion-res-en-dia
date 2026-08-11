import { supabase } from "../supabaseClient";


// Obtener locales
export async function getLocales() {

  const { data, error } = await supabase
    .from("locales")
    .select(`
      id,
      numero,
      nombre,
      zona_id
    `)
    .order("numero", {
      ascending: true
    });


  if (error) {
    throw error;
  }


  return data || [];

}



// Crear local
export async function createLocal(local) {

  const { data, error } = await supabase
    .from("locales")
    .insert([
      local
    ])
    .select()
    .single();


  if (error) {
    throw error;
  }


  return data;

}



// Actualizar local
export async function updateLocal(id, local) {

  const { data, error } = await supabase
    .from("locales")
    .update(local)
    .eq("id", id)
    .select()
    .single();


  if (error) {
    throw error;
  }


  return data;

}



// Eliminar local
export async function deleteLocal(id) {

  const { error } = await supabase
    .from("locales")
    .delete()
    .eq("id", id);


  if (error) {
    throw error;
  }


  return true;

}