import styles from "./LocalCard.styles";


export default function LocalCard({
  local,
  onEdit,
  onDelete
}) {


  return (

    <div style={styles.card}>


      <div style={styles.header}>


        <div>

          <h3 style={styles.title}>

            Local Nº {local.numero}

          </h3>


          <p style={styles.nombre}>

            {local.nombre}

          </p>

        </div>


      </div>



      <div style={styles.info}>


        <p>
          📍 Zona:
          {" "}
          {local.zonas?.nombre || "-"}
        </p>



        <p>
          ☎️ Teléfono:
          {" "}
          {local.telefono || "-"}
        </p>



        <p>
          📱 WhatsApp:
          {" "}
          {local.whatsapp || "-"}
        </p>



        <p>
          🏠 Dirección:
          {" "}
          {local.direccion || "-"}
        </p>



      </div>




      <div style={styles.actions}>


        <button

          style={styles.edit}

          onClick={()=>onEdit(local)}

        >
          ✏️ Editar
        </button>



        <button

          style={styles.delete}

          onClick={()=>onDelete(local.id)}

        >
          🗑️ Eliminar
        </button>


      </div>



    </div>

  );

}