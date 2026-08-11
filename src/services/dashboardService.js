/*
==========================================
SC Gestión Comercial V2

dashboardService.js

Responsabilidad:
Obtener toda la información del Dashboard.
==========================================
*/

import { supabase } from "../supabaseClient";


export async function getDashboard() {


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
        nombre,
        zona_id
      `)
      .order("nombre"),



    supabase
      .from("personal")
      .select(`
        id,
        nombre,
        apellido,
        puesto,
        local_id
      `)
      .order("nombre")



  ]);



  if(zonasResponse.error)
    throw zonasResponse.error;


  if(localesResponse.error)
    throw localesResponse.error;


  if(personalResponse.error)
    throw personalResponse.error;



  return {


    totalZonas:
      zonasResponse.data?.length || 0,


    totalLocales:
      localesResponse.data?.length || 0,


    totalColaboradores:
      personalResponse.data?.length || 0,



    zonas:
      zonasResponse.data || [],



    locales:
      localesResponse.data || [],



    colaboradores:
      personalResponse.data || []

  };


}