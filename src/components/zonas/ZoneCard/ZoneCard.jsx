import { styles } from "./ZoneCard.styles";

export default function ZoneCard({
  nombre,
  locales,
  colaboradores,
  dotacionTeorica,
  supervisor,
  auditor,
}) {
  const vacantes = Math.max(dotacionTeorica - colaboradores, 0);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>{nombre}</div>

        <div style={styles.badge}>
          {locales} Locales
        </div>
      </div>

      <div style={styles.infoGrid}>
        <div style={styles.item}>
          <div style={styles.label}>👥 Colaboradores</div>
          <div style={styles.value}>{colaboradores}</div>
        </div>

        <div style={styles.item}>
          <div style={styles.label}>📋 Dotación Teórica</div>
          <div style={styles.value}>{dotacionTeorica}</div>
        </div>

        <div style={styles.item}>
          <div style={styles.label}>📉 Vacantes</div>
          <div style={styles.value}>{vacantes}</div>
        </div>

        <div style={styles.item}>
          <div style={styles.label}>👔 Supervisor</div>
          <div style={styles.value}>{supervisor || "Sin asignar"}</div>
        </div>

        <div style={styles.item}>
          <div style={styles.label}>📝 Auditor</div>
          <div style={styles.value}>{auditor || "Sin asignar"}</div>
        </div>
      </div>
    </div>
  );
}