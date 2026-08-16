import { useState } from "react";

export default function Configuracion() {
  const [mensaje, setMensaje] = useState("");

  function guardar() {
    setMensaje("Configuración guardada correctamente.");
  }

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            ⚙️ Configuración
          </h1>

          <p style={styles.subtitle}>
            Configuración general del sistema
          </p>
        </div>
      </div>

      <div style={styles.card}>

        <h2 style={styles.sectionTitle}>
          Sistema
        </h2>

        <div style={styles.row}>
          <div>
            <strong>Nombre del sistema</strong>

            <p style={styles.description}>
              RES en DÍA – Sistema de dotación personal
            </p>
          </div>
        </div>

        <div style={styles.row}>
          <div>
            <strong>Estado del sistema</strong>

            <p style={styles.description}>
              Sistema operativo y conectado a Supabase.
            </p>
          </div>

          <span style={styles.status}>
            ● Activo
          </span>
        </div>

      </div>

      <div style={styles.card}>

        <h2 style={styles.sectionTitle}>
          Preferencias
        </h2>

        <div style={styles.row}>
          <div>
            <strong>Actualización de datos</strong>

            <p style={styles.description}>
              Los datos se actualizan desde Supabase.
            </p>
          </div>

          <span style={styles.status}>
            Automática
          </span>
        </div>

      </div>

      <div style={styles.actions}>

        <button
          style={styles.saveButton}
          onClick={guardar}
        >
          💾 Guardar configuración
        </button>

      </div>

      {mensaje && (
        <div style={styles.success}>
          {mensaje}
        </div>
      )}

    </div>
  );
}

const styles = {
  container: {
    width: "100%",
  },

  header: {
    marginBottom: 25,
  },

  title: {
    margin: 0,
    color: "#1f2937",
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 6,
    color: "#6b7280",
    fontSize: 15,
  },

  card: {
    background: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    border: "1px solid #e5e7eb",
    boxShadow: "0 5px 18px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: 20,
    color: "#111827",
    fontSize: 20,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    padding: "16px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  description: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: 14,
  },

  status: {
    background: "#dcfce7",
    color: "#166534",
    padding: "7px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 10,
  },

  saveButton: {
    border: "none",
    borderRadius: 10,
    padding: "12px 18px",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
  },

  success: {
    marginTop: 15,
    padding: 12,
    borderRadius: 10,
    background: "#dcfce7",
    color: "#166534",
    fontWeight: "600",
  },
};