import { useEffect, useState } from "react";

import {
  getZonas,
  getSupervisores,
  getAuditores,
  createZona,
  updateZona,
  deleteZona,
  updateZonaAsignacion,
  createResponsable,
} from "../services/zonasService";

export default function Zonas() {
  const [zonas, setZonas] = useState([]);

  const [supervisores, setSupervisores] =
    useState([]);

  const [auditores, setAuditores] =
    useState([]);

  const [nombre, setNombre] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  // =====================================================
  // FORMULARIO RESPONSABLE
  // =====================================================

  const [responsableZona, setResponsableZona] =
    useState(null);

  const [responsableRol, setResponsableRol] =
    useState("");

  const [responsableNombre, setResponsableNombre] =
    useState("");

  const [responsableApellido, setResponsableApellido] =
    useState("");


  // =====================================================
  // CARGAR TODO
  // =====================================================

  async function cargarTodo() {
    try {
      setLoading(true);

      const [
        zonasData,
        supervisoresData,
        auditoresData,
      ] = await Promise.all([
        getZonas(),
        getSupervisores(),
        getAuditores(),
      ]);

      setZonas(zonasData || []);
      setSupervisores(
        supervisoresData || []
      );
      setAuditores(
        auditoresData || []
      );
    } catch (error) {
      console.error(
        "Error cargando zonas:",
        error
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    cargarTodo();
  }, []);


  // =====================================================
  // CREAR ZONA
  // =====================================================

  async function crearZona() {
    if (!nombre.trim()) return;

    try {
      setGuardando(true);

      await createZona(nombre);

      setNombre("");

      await cargarTodo();
    } catch (error) {
      console.error(error);
      alert(
        error?.message ||
          "No se pudo crear la zona."
      );
    } finally {
      setGuardando(false);
    }
  }


  // =====================================================
  // EDITAR ZONA
  // =====================================================

  async function editarZona(zona) {
    const nuevo = window.prompt(
      "Nuevo nombre de zona:",
      zona.nombre
    );

    if (!nuevo?.trim()) return;

    try {
      await updateZona(
        zona.id,
        nuevo
      );

      await cargarTodo();
    } catch (error) {
      console.error(error);
      alert(
        error?.message ||
          "No se pudo modificar la zona."
      );
    }
  }


  // =====================================================
  // ELIMINAR ZONA
  // =====================================================

  async function borrarZona(id) {
    if (
      !window.confirm(
        "¿Eliminar esta zona?"
      )
    ) {
      return;
    }

    try {
      await deleteZona(id);

      await cargarTodo();
    } catch (error) {
      console.error(error);
      alert(
        error?.message ||
          "No se pudo eliminar la zona."
      );
    }
  }


  // =====================================================
  // ASIGNAR RESPONSABLE EXISTENTE
  // =====================================================

  async function asignar(
    zona,
    supervisorId,
    auditorId
  ) {
    try {
      await updateZonaAsignacion(
        zona.id,
        supervisorId,
        auditorId
      );

      await cargarTodo();
    } catch (error) {
      console.error(error);

      alert(
        error?.message ||
          "No se pudo actualizar la asignación."
      );
    }
  }


  // =====================================================
  // ABRIR FORMULARIO RESPONSABLE
  // =====================================================

  function abrirNuevoResponsable(
    zona,
    rol
  ) {
    setResponsableZona(zona);
    setResponsableRol(rol);
    setResponsableNombre("");
    setResponsableApellido("");
  }


  // =====================================================
  // CERRAR FORMULARIO RESPONSABLE
  // =====================================================

  function cerrarResponsable() {
    setResponsableZona(null);
    setResponsableRol("");
    setResponsableNombre("");
    setResponsableApellido("");
  }


  // =====================================================
  // CREAR RESPONSABLE
  // =====================================================

  async function guardarResponsable() {
    if (!responsableZona) return;

    if (
      !responsableNombre.trim() ||
      !responsableApellido.trim()
    ) {
      alert(
        "Completá nombre y apellido."
      );
      return;
    }

    try {
      setGuardando(true);

      const nuevo =
        await createResponsable({
          nombre:
            responsableNombre,
          apellido:
            responsableApellido,
          rol:
            responsableRol,
        });

      const supervisorId =
        responsableRol === "Supervisor"
          ? nuevo.id
          : responsableZona.supervisor_id;

      const auditorId =
        responsableRol === "Auditor"
          ? nuevo.id
          : responsableZona.auditor_id;

      await updateZonaAsignacion(
        responsableZona.id,
        supervisorId,
        auditorId
      );

      cerrarResponsable();

      await cargarTodo();
    } catch (error) {
      console.error(error);

      alert(
        error?.message ||
          "No se pudo crear el responsable."
      );
    } finally {
      setGuardando(false);
    }
  }


  // =====================================================
  // ESTADO VISUAL
  // =====================================================

  function obtenerEstado(zona) {
    if (zona.diferencia < 0) {
      return {
        texto: `Faltan ${Math.abs(
          zona.diferencia
        )}`,
        style: styles.estadoFaltante,
      };
    }

    if (zona.diferencia > 0) {
      return {
        texto: `Excedente ${zona.diferencia}`,
        style: styles.estadoExcedente,
      };
    }

    return {
      texto: "Dotación completa",
      style: styles.estadoCompleto,
    };
  }


  if (loading) {
    return (
      <div style={styles.loading}>
        Cargando zonas...
      </div>
    );
  }


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Gestión de Zonas
          </h1>

          <p style={styles.subtitle}>
            Supervisión, auditoría y dotación
            por zona
          </p>
        </div>

        <button
          style={styles.refresh}
          onClick={cargarTodo}
        >
          🔄 Actualizar
        </button>
      </div>


      {/* =================================================
          CREAR ZONA
      ================================================= */}

      <div style={styles.createBox}>

        <input
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
          placeholder="Nombre de nueva zona"
          style={styles.input}
        />

        <button
          onClick={crearZona}
          disabled={guardando}
          style={styles.button}
        >
          + Crear zona
        </button>

      </div>


      {/* =================================================
          ZONAS
      ================================================= */}

      <div style={styles.grid}>

        {zonas.map((zona) => {

          const estado =
            obtenerEstado(zona);

          return (
            <div
              key={zona.id}
              style={styles.card}
            >

              {/* CABECERA */}

              <div style={styles.cardTop}>

                <div>
                  <h2 style={styles.zoneName}>
                    {zona.nombre}
                  </h2>

                  <div style={styles.zoneInfo}>
                    {zona.cantidadLocales || 0}{" "}
                    locales
                  </div>
                </div>

                <div style={estado.style}>
                  {estado.texto}
                </div>

              </div>


              {/* =================================================
                  DOTACIÓN
              ================================================= */}

              <div style={styles.dotacion}>

                <div style={styles.dotacionItem}>
                  <span>
                    Teórica
                  </span>

                  <strong>
                    {zona.dotacionTeorica}
                  </strong>
                </div>

                <div style={styles.dotacionItem}>
                  <span>
                    Real
                  </span>

                  <strong>
                    {zona.dotacionReal}
                  </strong>
                </div>

                <div style={styles.dotacionItem}>
                  <span>
                    Diferencia
                  </span>

                  <strong
                    style={{
                      color:
                        zona.diferencia < 0
                          ? "#d97706"
                          : zona.diferencia > 0
                          ? "#dc2626"
                          : "#16a34a",
                    }}
                  >
                    {zona.diferencia > 0
                      ? `+${zona.diferencia}`
                      : zona.diferencia}
                  </strong>
                </div>

              </div>


              {/* =================================================
                  RESPONSABLES
              ================================================= */}

              <div style={styles.responsables}>

                <div style={styles.responsableTitle}>
                  Responsables
                </div>


                {/* SUPERVISOR */}

                <label style={styles.label}>
                  Supervisor
                </label>

                <select
                  style={styles.select}
                  value={
                    zona.supervisor_id ||
                    ""
                  }
                  onChange={(e) =>
                    asignar(
                      zona,
                      e.target.value,
                      zona.auditor_id
                    )
                  }
                >
                  <option value="">
                    Sin supervisor
                  </option>

                  {supervisores.map(
                    (persona) => (
                      <option
                        key={persona.id}
                        value={persona.id}
                      >
                        {persona.nombre}{" "}
                        {persona.apellido}
                      </option>
                    )
                  )}
                </select>

                <button
                  style={styles.addResponsible}
                  onClick={() =>
                    abrirNuevoResponsable(
                      zona,
                      "Supervisor"
                    )
                  }
                >
                  + Agregar supervisor
                </button>


                {/* AUDITOR */}

                <label style={styles.label}>
                  Auditor
                </label>

                <select
                  style={styles.select}
                  value={
                    zona.auditor_id ||
                    ""
                  }
                  onChange={(e) =>
                    asignar(
                      zona,
                      zona.supervisor_id,
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Sin auditor
                  </option>

                  {auditores.map(
                    (persona) => (
                      <option
                        key={persona.id}
                        value={persona.id}
                      >
                        {persona.nombre}{" "}
                        {persona.apellido}
                      </option>
                    )
                  )}
                </select>

                <button
                  style={styles.addResponsible}
                  onClick={() =>
                    abrirNuevoResponsable(
                      zona,
                      "Auditor"
                    )
                  }
                >
                  + Agregar auditor
                </button>

              </div>


              {/* =================================================
                  BOTONES ZONA
              ================================================= */}

              <div style={styles.actions}>

                <button
                  style={styles.editButton}
                  onClick={() =>
                    editarZona(zona)
                  }
                >
                  ✏️ Editar
                </button>

                <button
                  style={styles.deleteButton}
                  onClick={() =>
                    borrarZona(zona.id)
                  }
                >
                  🗑️ Eliminar
                </button>

              </div>

            </div>
          );
        })}

      </div>


      {/* =================================================
          MODAL NUEVO RESPONSABLE
      ================================================= */}

      {responsableZona && (

        <div style={styles.overlay}>

          <div style={styles.modal}>

            <h2 style={styles.modalTitle}>
              Nuevo{" "}
              {responsableRol ===
              "Supervisor"
                ? "Supervisor"
                : "Auditor"}
            </h2>

            <p style={styles.modalSubtitle}>
              Zona:{" "}
              <strong>
                {responsableZona.nombre}
              </strong>
            </p>


            <input
              style={styles.input}
              placeholder="Nombre"
              value={
                responsableNombre
              }
              onChange={(e) =>
                setResponsableNombre(
                  e.target.value
                )
              }
            />


            <input
              style={styles.input}
              placeholder="Apellido"
              value={
                responsableApellido
              }
              onChange={(e) =>
                setResponsableApellido(
                  e.target.value
                )
              }
            />


            <div style={styles.modalActions}>

              <button
                style={styles.cancelButton}
                onClick={
                  cerrarResponsable
                }
              >
                Cancelar
              </button>

              <button
                style={styles.button}
                onClick={
                  guardarResponsable
                }
                disabled={guardando}
              >
                {guardando
                  ? "Guardando..."
                  : "Crear y asignar"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


// =======================================================
// ESTILOS
// =======================================================

const styles = {

  page: {
    padding: 25,
    minHeight: "100vh",
    background:
      "linear-gradient(180deg,#f6f8fc 0%,#eef2f7 100%)",
    fontFamily:
      "Segoe UI, Arial, sans-serif",
    boxSizing: "border-box",
  },

  loading: {
    padding: 40,
    textAlign: "center",
    color: "#6b7280",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginBottom: 25,
  },

  title: {
    margin: 0,
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    marginTop: 6,
    color: "#6b7280",
  },

  refresh: {
    border: "none",
    borderRadius: 10,
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  createBox: {
    display: "flex",
    gap: 10,
    background: "#fff",
    padding: 18,
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    marginBottom: 20,
    boxShadow:
      "0 4px 14px rgba(0,0,0,0.05)",
  },

  input: {
    flex: 1,
    width: "100%",
    boxSizing: "border-box",
    padding: 11,
    borderRadius: 10,
    border:
      "1px solid #d1d5db",
    fontSize: 14,
    outline: "none",
  },

  button: {
    border: "none",
    borderRadius: 10,
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(330px,1fr))",
    gap: 18,
  },

  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 20,
    border:
      "1px solid #e5e7eb",
    boxShadow:
      "0 6px 20px rgba(0,0,0,0.06)",
  },

  cardTop: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 18,
  },

  zoneName: {
    margin: 0,
    color: "#111827",
    fontSize: 22,
    fontWeight: "800",
  },

  zoneInfo: {
    marginTop: 5,
    color: "#6b7280",
    fontSize: 13,
  },

  dotacion: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3,1fr)",
    gap: 8,
    marginBottom: 20,
  },

  dotacionItem: {
    background: "#f9fafb",
    borderRadius: 10,
    padding: 12,
    textAlign: "center",
  },

  estadoCompleto: {
    background: "#dcfce7",
    color: "#166534",
    padding: "7px 10px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  estadoFaltante: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "7px 10px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  estadoExcedente: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "7px 10px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  responsables: {
    borderTop:
      "1px solid #e5e7eb",
    paddingTop: 16,
  },

  responsableTitle: {
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  label: {
    display: "block",
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "700",
  },

  select: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border:
      "1px solid #d1d5db",
    background: "#fff",
    boxSizing: "border-box",
  },

  addResponsible: {
    marginTop: 7,
    border: "none",
    background: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    padding: 0,
    fontSize: 12,
    fontWeight: "700",
  },

  actions: {
    display: "flex",
    gap: 8,
    marginTop: 20,
    paddingTop: 15,
    borderTop:
      "1px solid #e5e7eb",
  },

  editButton: {
    flex: 1,
    border: "1px solid #d1d5db",
    background: "#fff",
    borderRadius: 9,
    padding: 9,
    cursor: "pointer",
  },

  deleteButton: {
    flex: 1,
    border: "none",
    background: "#dc2626",
    color: "#fff",
    borderRadius: 9,
    padding: 9,
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(15,23,42,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 20,
  },

  modal: {
    width: "100%",
    maxWidth: 430,
    background: "#fff",
    borderRadius: 18,
    padding: 24,
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.25)",
  },

  modalTitle: {
    margin: 0,
    color: "#111827",
  },

  modalSubtitle: {
    color: "#6b7280",
    marginBottom: 20,
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 15,
  },

  cancelButton: {
    border: "1px solid #d1d5db",
    background: "#fff",
    borderRadius: 10,
    padding: "10px 16px",
    cursor: "pointer",
  },

};