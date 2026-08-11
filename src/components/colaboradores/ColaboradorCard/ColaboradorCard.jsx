import styles from "./ColaboradorCard.styles";

export default function ColaboradorCard({
  colaborador,
  onEdit,
  onDelete,
}) {
  return (
    <div style={styles.card}>

      <div style={styles.header}>
        <h3 style={styles.nombre}>
          👤 {colaborador.nombre} {colaborador.apellido}
        </h3>

        <span style={styles.rol}>
          {colaborador.rol}
        </span>
      </div>

      <div style={styles.body}>

        <p style={styles.item}>
          <strong>🆔 Legajo:</strong> {colaborador.legajo}
        </p>

        <p style={styles.item}>
          <strong>🏪 Local:</strong>{" "}
          {colaborador.locales
            ? `${colaborador.locales.numero} - ${colaborador.locales.nombre}`
            : "Sin asignar"}
        </p>

        <p style={styles.item}>
          <strong>💼 Puesto:</strong> {colaborador.puesto}
        </p>

        <p style={styles.item}>
          <strong>📱 Teléfono:</strong>{" "}
          {colaborador.telefono || "-"}
        </p>

      </div>

      <div style={styles.actions}>

        <button
          style={styles.editButton}
          onClick={() => onEdit(colaborador)}
        >
          ✏ Editar
        </button>

        <button
          style={styles.deleteButton}
          onClick={() => onDelete(colaborador.id)}
        >
          🗑 Eliminar
        </button>

      </div>

    </div>
  );
}