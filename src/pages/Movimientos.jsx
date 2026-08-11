import React from "react";
import styles from "./ColaboradorCard.styles";

const ColaboradorCard = ({
  colaborador,
  seleccionado,
  onSelect
}) => {

  if (!colaborador) return null;

  return (
    <div
      onClick={() => onSelect(colaborador)}
      style={{
        ...styles.card,
        ...(seleccionado ? styles.selected : {})
      }}
    >

      <div style={styles.header}>

        <div style={styles.avatar}>
          {colaborador.nombre?.charAt(0)?.toUpperCase() || "?"}
        </div>

        <div>
          <h3 style={styles.nombre}>
            {colaborador.nombre} {colaborador.apellido || ""}
          </h3>

          <p style={styles.puesto}>
            {colaborador.puesto || "Sin puesto"}
          </p>
        </div>

      </div>


      <div style={styles.info}>

        <div>
          <span style={styles.label}>
            Local:
          </span>

          {colaborador.local_nombre || "-"}
        </div>


        <div>
          <span style={styles.label}>
            Estado:
          </span>

          <span
            style={{
              ...styles.estado,
              ...(colaborador.estado === "Activo"
                ? styles.activo
                : colaborador.estado === "Baja"
                ? styles.baja
                : styles.otro)
            }}
          >
            {colaborador.estado || "Activo"}
          </span>

        </div>


        <div>
          <span style={styles.label}>
            Legajo:
          </span>

          {colaborador.legajo || "-"}
        </div>

      </div>


    </div>
  );
};


export default ColaboradorCard;