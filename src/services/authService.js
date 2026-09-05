import { supabase } from "../supabaseClient";

/*
==========================================
RES en DÍA

authService.js

Responsabilidad:
- Obtener sesión actual
- Escuchar cambios de autenticación
- Obtener perfil del usuario
- Cerrar sesión

No contiene lógica de navegación.
No contiene lógica de UI.
==========================================
*/

// ==========================================
// SESIÓN ACTUAL
// ==========================================

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("ERROR OBTENIENDO SESIÓN:", error);
    throw error;
  }

  return data.session;
}

// ==========================================
// PERFIL DEL USUARIO
// ==========================================

export async function getPerfilUsuario(userId) {
  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("perfiles_usuario")
    .select(`
      id,
      user_id,
      nombre,
      email,
      rol_global,
      activo,
      created_at
    `)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error(
      "ERROR OBTENIENDO PERFIL DE USUARIO:",
      error
    );

    throw error;
  }

  return data;
}

// ==========================================
// USUARIO COMPLETO
// ==========================================

export async function getUsuarioActual() {
  const session = await getSession();

  if (!session?.user) {
    return {
      session: null,
      user: null,
      perfil: null,
    };
  }

  const perfil = await getPerfilUsuario(
    session.user.id
  );

  return {
    session,
    user: session.user,
    perfil,
  };
}

// ==========================================
// ESCUCHAR CAMBIOS DE SESIÓN
// ==========================================

export function onAuthStateChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      let perfil = null;

      if (session?.user) {
        try {
          perfil = await getPerfilUsuario(
            session.user.id
          );
        } catch (error) {
          console.error(
            "ERROR OBTENIENDO PERFIL:",
            error
          );
        }
      }

      callback({
        session,
        user: session?.user ?? null,
        perfil,
      });
    }
  );

  return subscription;
}

// ==========================================
// LOGIN
// ==========================================

export async function login(email, password) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    console.error("ERROR LOGIN:", error);
    throw error;
  }

  return data;
}

// ==========================================
// LOGOUT
// ==========================================

export async function logout() {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    console.error("ERROR CERRANDO SESIÓN:", error);
    throw error;
  }

  return true;
}