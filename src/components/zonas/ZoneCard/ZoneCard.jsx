```jsx
import { styles } from "./ZoneCard.styles";

export default function ZoneCard({
  nombre,
  cantidadLocales,
  colaboradores,
  dotacionTeorica,
  supervisor,
  auditor,
}) {
  const vacantes = Math.max(
    Number(dotacionTeorica || 0) - Number(colaboradores || 0),
    0
  );

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>{nombre}</div>

        <div style={styles.badge}>
          🏢 {cantidadLocales || 0} Locales
        </div>
      </div>

      <div style={styles.infoGrid}>

        <div style={styles.item}>
          <div style={styles.label}>
            👥 Colaboradores
          </div>

          <div style={styles.value}>
            {colaboradores || 0}
          </div>
        </div>

        <div style={styles.item}>
          <div style={styles.label}>
            📋 Dotación Teórica
          </div>

          <div style={styles.value}>
            {dotacionTeorica || 0}
          </div>
        </div>

        <div style={styles.item}>
          <div style={styles.label}>
            📉 Vacantes
          </div>

          <div style={styles.value}>
            {vacantes}
          </div>
        </div>

        <div style={styles.item}>
          <div style={styles.label}>
            👔 Supervisor
          </div>

          <div style={styles.value}>
            {supervisor || "Sin asignar"}
          </div>
        </div>

        <div style={styles.item}>
          <div style={styles.label}>
            📝 Auditor
          </div>

          <div style={styles.value}>
            {auditor || "Sin asignar"}
          </div>
        </div>

      </div>
    </div>
  );
}
```
