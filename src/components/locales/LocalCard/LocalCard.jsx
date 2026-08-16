import styles from "./LocalCard.styles";


export default function LocalCard({
  local,
  onEdit,
  onDelete,
}) {

  // =====================================================
  // DOTACIÓN
  // =====================================================

  const dotacionTeorica =
    Number(local.dotacion_teorica ?? 4);

  const dotacionReal =
    Number(local.dotacion_real ?? 0);


  const diferencia =
    dotacionReal - dotacionTeorica;


  let estado = "";
  let estadoStyle = {};


  if (diferencia < 0) {

    estado =
      `⚠️ Faltan ${Math.abs(diferencia)}`;

    estadoStyle =
      styles.estadoFaltante;

  } else if (diferencia === 0) {

    estado =
      "🟢 Dotación completa";

    estadoStyle =
      styles.estadoCompleto;

  } else {

    estado =
      `🔴 Excedente ${diferencia}`;

    estadoStyle =
      styles.estadoExcedente;

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div style={styles.card}>


      {/* =================================================
          CABECERA
      ================================================= */}

      <div style={styles.header}>

        <div>

          <h3 style={styles.title}>

            Local Nº{" "}

            {local.numero || "SIN NÚMERO"}

          </h3>


          <p style={styles.nombre}>

            {local.nombre}

          </p>

        </div>

      </div>



      {/* =================================================
          INFORMACIÓN
      ================================================= */}

      <div style={styles.info}>


        <p>

          📍 <strong>Zona:</strong>{" "}

          {local.zonas?.nombre || "-"}

        </p>


        <p>

          ☎️ <strong>Teléfono:</strong>{" "}

          {local.telefono || "-"}

        </p>


        <p>

          📱 <strong>WhatsApp:</strong>{" "}

          {local.whatsapp || "-"}

        </p>


        <p>

          🏠 <strong>Dirección:</strong>{" "}

          {local.direccion || "-"}

        </p>


        <p>

          👤 <strong>Encargado:</strong>{" "}

          {local.encargado || "-"}

        </p>


      </div>



      {/* =================================================
          DOTACIÓN
      ================================================= */}

      <div style={styles.dotacion}>


        <div style={styles.dotacionTitulo}>

          📊 Dotación

        </div>


        <div style={styles.dotacionGrid}>


          <div style={styles.dotacionItem}>

            <span style={styles.dotacionLabel}>

              Teórica

            </span>

            <strong style={styles.dotacionNumero}>

              {dotacionTeorica}

            </strong>

          </div>


          <div style={styles.dotacionItem}>

            <span style={styles.dotacionLabel}>

              Real

            </span>

            <strong style={styles.dotacionNumero}>

              {dotacionReal}

            </strong>

          </div>


        </div>


        <div
          style={{
            ...styles.estado,
            ...estadoStyle,
          }}
        >

          {estado}

        </div>


      </div>



      {/* =================================================
          ACCIONES
      ================================================= */}

      <div style={styles.actions}>


        <button
          style={styles.edit}
          onClick={() =>
            onEdit(local)
          }
        >

          ✏️ Editar

        </button>


        <button
          style={styles.delete}
          onClick={() =>
            onDelete(local.id)
          }
        >

          🗑️ Eliminar

        </button>


      </div>


    </div>

  );

}