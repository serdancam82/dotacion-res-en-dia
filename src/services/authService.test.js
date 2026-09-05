```javascript
import { supabase } from "../supabaseClient";
import { getUsuarioActual } from "./authService";

export async function probarUsuarioActual() {
  try {
    console.log("===== PRUEBA USUARIO ACTUAL =====");

    // ==========================================
    // USUARIO ACTUAL
    // ==========================================

    const resultado = await getUsuarioActual();

    console.log("SESSION:", resultado.session);
    console.log("USER:", resultado.user);
    console.log("PERFIL:", resultado.perfil);

    if (!resultado.user) {
      console.warn("NO HAY USUARIO AUTENTICADO");

      return resultado;
    }

    if (!resultado.perfil) {
      console.warn(
        "EL USUARIO EXISTE EN AUTH PERO NO TIENE PERFIL"
      );

      return resultado;
    }

    console.log("USUARIO CORRECTAMENTE VINCULADO");

    console.log(
      "NOMBRE:",
      resultado.perfil.nombre
    );

    console.log(
      "ROL GLOBAL:",
      resultado.perfil.rol_global
    );

    console.log(
      "ACTIVO:",
      resultado.perfil.activo
    );

    // ==========================================
    // PRUEBA FUNCIÓN es_administrador()
    // ==========================================

    console.log(
      "===== PRUEBA ES ADMINISTRADOR ====="
    );

    const {
      data: esAdministrador,
      error: errorAdministrador,
    } = await supabase.rpc(
      "es_administrador"
    );

    console.log(
      "ES ADMINISTRADOR:",
      esAdministrador
    );

    console.log(
      "ERROR ES ADMINISTRADOR:",
      errorAdministrador
    );

    if (errorAdministrador) {
      console.error(
        "ERROR EJECUTANDO es_administrador:",
        errorAdministrador
      );
    } else if (esAdministrador === true) {
      console.log(
        "✓ EL USUARIO ES ADMINISTRADOR"
      );
    } else {
      console.log(
        "✓ EL USUARIO NO ES ADMINISTRADOR"
      );
    }

    // ==========================================
    // PRUEBA ACCESO ZONA OESTE
    // ==========================================

    console.log(
      "===== PRUEBA ACCESO ZONA OESTE ====="
    );

    const {
      data: accesoZonaOeste,
      error: errorZonaOeste,
    } = await supabase.rpc(
      "tiene_acceso_zona",
      {
        p_zona_id: 11,
      }
    );

    console.log(
      "ACCESO ZONA OESTE (11):",
      accesoZonaOeste
    );

    console.log(
      "ERROR ZONA OESTE:",
      errorZonaOeste
    );

    if (errorZonaOeste) {
      console.error(
        "ERROR EJECUTANDO tiene_acceso_zona PARA ZONA OESTE:",
        errorZonaOeste
      );
    } else if (accesoZonaOeste === true) {
      console.log(
        "✓ EL USUARIO TIENE ACCESO A ZONA OESTE"
      );
    } else {
      console.warn(
        "⚠ EL USUARIO NO TIENE ACCESO A ZONA OESTE"
      );
    }

    // ==========================================
    // PRUEBA ACCESO ZONA NORTE
    // ==========================================

    console.log(
      "===== PRUEBA ACCESO ZONA NORTE ====="
    );

    const {
      data: accesoZonaNorte,
      error: errorZonaNorte,
    } = await supabase.rpc(
      "tiene_acceso_zona",
      {
        p_zona_id: 9,
      }
    );

    console.log(
      "ACCESO ZONA NORTE (9):",
      accesoZonaNorte
    );

    console.log(
      "ERROR ZONA NORTE:",
      errorZonaNorte
    );

    if (errorZonaNorte) {
      console.error(
        "ERROR EJECUTANDO tiene_acceso_zona PARA ZONA NORTE:",
        errorZonaNorte
      );
    } else if (accesoZonaNorte === true) {
      console.warn(
        "⚠ EL USUARIO TIENE ACCESO A ZONA NORTE"
      );
    } else {
      console.log(
        "✓ EL USUARIO NO TIENE ACCESO A ZONA NORTE"
      );
    }

    // ==========================================
    // RESULTADO FINAL
    // ==========================================

    return {
      ...resultado,

      esAdministrador,

      errorAdministrador,

      accesoZonaOeste,
      errorZonaOeste,

      accesoZonaNorte,
      errorZonaNorte,
    };

  } catch (error) {
    console.error(
      "ERROR EN PRUEBA DE USUARIO:",
      error
    );

    throw error;
  }
}
```
