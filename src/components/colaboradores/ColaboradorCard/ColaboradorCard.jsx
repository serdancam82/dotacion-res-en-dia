import styles from "./ColaboradorCard.styles";

export default function ColaboradorCard({
  colaborador,
  onEdit,
  onDelete,
}) {

  const local =
    colaborador.locales || null;

  const numeroLocal =
    local?.numero || "Sin número";

  const nombreLocal =
    local?.nombre || "Sin nombre";


  return (

    <div style={styles.card}>

      {/* HEADER */}

      <div style={styles.header}>

        <h3 style={styles.nombre}>
          👤 {colaborador.nombre}{" "}
          {colaborador.apellido}
        </h3>

        <span style={styles.rol}>
          {colaborador.rol}
        </span>

      </div>


      {/* INFORMACIÓN */}

      <div style={styles.body}>

        <p style={styles.item}>

          <strong>🆔 Legajo:</strong>{" "}

          {colaborador.legajo || "-"}

        </p>


        <p style={styles.item}>

          <strong>🏪 Local:</strong>{" "}

          {local
            ? `${numeroLocal} - ${nombreLocal}`
            : "Sin asignar"}

        </p>


        <p style={styles.item}>

          <strong>💼 Puesto:</strong>{" "}

          {colaborador.puesto || "-"}

        </p>


        <p style={styles.item}>

          <strong>📱 Teléfono:</strong>{" "}

          {colaborador.telefono || "-"}

        </p>

      </div>


      {/* ACCIONES */}

      <div style={styles.actions}>

        <button
          type="button"
          style={styles.editButton}
          onClick={() =>
            onEdit(colaborador)
          }
        >
          ✏ Editar
        </button>


        <button
          type="button"
          style={styles.deleteButton}
          onClick={() =>
            onDelete(colaborador.id)
          }
        >
          🗑 Eliminar
        </button>

      </div>

    </div>

  );

}