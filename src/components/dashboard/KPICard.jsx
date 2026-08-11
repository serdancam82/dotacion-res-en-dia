import { styles } from "./KPICard.styles";

export default function KPICard({
  titulo,
  valor,
  icono,
}) {
  return (
    <div style={styles.card}>
      <div style={styles.left}>
        <div style={styles.value}>
          {valor}
        </div>

        <div style={styles.title}>
          {titulo}
        </div>
      </div>

      <div style={styles.icon}>
        {icono}
      </div>
    </div>
  );
}