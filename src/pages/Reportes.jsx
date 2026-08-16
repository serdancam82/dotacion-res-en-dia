import { useEffect, useState } from "react";

import { getLocales } from "../services/localesService";
import { getColaboradores } from "../services/colaboradoresService";

export default function Reportes() {
  const [locales, setLocales] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargarDatos() {
    try {
      setLoading(true);
      setError("");

      const [localesData, colaboradoresData] =
        await Promise.all([
          getLocales(),
          getColaboradores(),
        ]);

      setLocales(localesData || []);
      setColaboradores(colaboradoresData || []);
    } catch (err) {
      console.error(
        "Error cargando Reportes:",
        err
      );

      setError(
        err?.message ||
          "No se pudieron cargar los reportes."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function obtenerReal(localId) {
    return colaboradores.filter(
      (colaborador) =>
        colaborador.local_id === localId
    ).length;
  }

  const totalLocales = locales.length;

  const totalColaboradores =
    colaboradores.length;

  const dotacionTeorica =
    locales.reduce(
      (total, local) =>
        total +
        Number(
          local.dotacion_teorica ?? 4
        ),
      0
    );

  const dotacionReal =
    locales.reduce(
      (total, local) =>
        total +
        obtenerReal(local.id),
      0
    );

  const diferencia =
    dotacionReal - dotacionTeorica;

  if (loading) {
    return (
      <div style={styles.loading}>
        Cargando reportes...
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <strong>Error:</strong>

        <div style={{ marginTop: 8 }}>
          {error}
        </div>

        <button
          style={styles.retry}
          onClick={cargarDatos}
        >
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            📈 Informes
          </h1>

          <p style={styles.subtitle}>
            Resumen general de dotación y personal
          </p>
        </div>

        <button
          style={styles.refresh}
          onClick={cargarDatos}
        >
          🔄 Actualizar
        </button>
      </div>

      <div style={styles.grid}>

        <div style={styles.card}>
          <div style={styles.icon}>
            🏢
          </div>

          <div style={styles.number}>
            {totalLocales}
          </div>

          <div style={styles.label}>
            Locales
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>
            👥
          </div>

          <div style={styles.number}>
            {totalColaboradores}
          </div>

          <div style={styles.label}>
            Colaboradores
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>
            📊
          </div>

          <div style={styles.number}>
            {dotacionTeorica}
          </div>

          <div style={styles.label}>
            Dotación teórica
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>
            👤
          </div>

          <div style={styles.number}>
            {dotacionReal}
          </div>

          <div style={styles.label}>
            Dotación real
          </div>
        </div>

      </div>

      <div style={styles.summary}>

        <h2 style={styles.sectionTitle}>
          Resumen de dotación
        </h2>

        <div style={styles.summaryRow}>

          <span>
            Dotación teórica
          </span>

          <strong>
            {dotacionTeorica}
          </strong>

        </div>

        <div style={styles.summaryRow}>

          <span>
            Dotación real
          </span>

          <strong>
            {dotacionReal}
          </strong>

        </div>

        <div style={styles.summaryRow}>

          <span>
            Diferencia
          </span>

          <strong
            style={{
              color:
                diferencia < 0
                  ? "#d97706"
                  : diferencia > 0
                  ? "#dc2626"
                  : "#16a34a",
            }}
          >
            {diferencia > 0
              ? `+${diferencia}`
              : diferencia}
          </strong>

        </div>

      </div>

      <div style={styles.summary}>

        <h2 style={styles.sectionTitle}>
          Estado por local
        </h2>

        {locales.length === 0 ? (

          <div style={styles.empty}>
            No hay locales registrados.
          </div>

        ) : (

          locales.map((local) => {

            const teorica =
              Number(
                local.dotacion_teorica ?? 4
              );

            const real =
              obtenerReal(local.id);

            const diferenciaLocal =
              real - teorica;

            let estado =
              "Dotación completa";

            let estadoStyle =
              styles.completo;

            if (diferenciaLocal < 0) {
              estado =
                `Faltan ${Math.abs(
                  diferenciaLocal
                )}`;

              estadoStyle =
                styles.faltante;
            }

            if (diferenciaLocal > 0) {
              estado =
                `Excedente ${diferenciaLocal}`;

              estadoStyle =
                styles.excedente;
            }

            return (
              <div
                key={local.id}
                style={styles.localRow}
              >

                <div>
                  <div
                    style={styles.localNumero}
                  >
                    LOCAL Nº{" "}
                    {local.numero || "-"}
                  </div>

                  <div
                    style={styles.localNombre}
                  >
                    {local.nombre ||
                      "Sin nombre"}
                  </div>
                </div>

                <div
                  style={styles.localData}
                >
                  <span>
                    Teórica:{" "}
                    <strong>
                      {teorica}
                    </strong>
                  </span>

                  <span>
                    Real:{" "}
                    <strong>
                      {real}
                    </strong>
                  </span>

                  <span
                    style={estadoStyle}
                  >
                    {estado}
                  </span>
                </div>

              </div>
            );
          })
        )}

      </div>

    </div>
  );
}

const styles = {
  loading: {
    padding: 40,
    textAlign: "center",
    color: "#6b7280",
  },

  error: {
    padding: 20,
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: 12,
  },

  retry: {
    marginTop: 15,
    border: "none",
    borderRadius: 8,
    padding: "9px 14px",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    gap: 20,
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

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 18,
    marginBottom: 20,
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 22,
    textAlign: "center",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 5px 18px rgba(0,0,0,0.06)",
  },

  icon: {
    fontSize: 28,
    marginBottom: 8,
  },

  number: {
    fontSize: 30,
    fontWeight: "800",
    color: "#2563eb",
  },

  label: {
    marginTop: 5,
    color: "#6b7280",
    fontSize: 14,
  },

  summary: {
    background: "#fff",
    borderRadius: 16,
    padding: 22,
    marginBottom: 20,
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 5px 18px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: 18,
    color: "#111827",
    fontSize: 20,
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "13px 0",
    borderBottom:
      "1px solid #f1f5f9",
    color: "#374151",
  },

  localRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    padding: "15px 0",
    borderBottom:
      "1px solid #f1f5f9",
  },

  localNumero: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "700",
  },

  localNombre: {
    marginTop: 3,
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  localData: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    color: "#374151",
    fontSize: 13,
  },

  completo: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 9px",
    borderRadius: 7,
    fontWeight: "700",
  },

  faltante: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "6px 9px",
    borderRadius: 7,
    fontWeight: "700",
  },

  excedente: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "6px 9px",
    borderRadius: 7,
    fontWeight: "700",
  },

  empty: {
    padding: 25,
    textAlign: "center",
    color: "#6b7280",
  },
};