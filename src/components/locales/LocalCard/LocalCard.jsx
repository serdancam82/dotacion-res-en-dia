import { useState } from "react";

import styles from "./LocalCard.styles";

export default function LocalCard({
  local,
  colaboradores = [],
  onEdit,
  onDelete,
}) {
  const [mostrarColaboradores, setMostrarColaboradores] =
    useState(false);

  // =====================================================
  // DOTACIÓN
  // =====================================================

  const dotacionTeorica =
    Number(local.dotacion_teorica ?? 4);

  const dotacionReal =
    Number(local.dotacion_real ?? 0);

  const diferencia =
    dotacionReal - dotacionTeorica;

  // =====================================================
  // ESTADO
  // =====================================================

  let estado = "";
  let estadoStyle = {};

  if (diferencia < 0) {
    estado = `⚠️ Faltan ${Math.abs(diferencia)}`;
    estadoStyle = styles.estadoFaltante;
  } else if (diferencia === 0) {
    estado = "🟢 Dotación completa";
    estadoStyle = styles.estadoCompleto;
  } else {
    estado = `🔴 Excedente ${diferencia}`;
    estadoStyle = styles.estadoExcedente;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={styles.card}>

      {/* =================================================
          CABECERA + DOTACIÓN
      ================================================= */}

      <div style={styles.topContent}>

        {/* ===============================================
            INFORMACIÓN DEL LOCAL
        =============================================== */}

        <div>

          <div style={styles.header}>

            <div>

              <h3 style={styles.title}>
                Local Nº{" "}
                {local.numero || "SIN NÚMERO"}
              </h3>

              <p style={styles.nombre}>
                {local.nombre || "-"}
              </p>

            </div>

          </div>


          <div style={styles.info}>

            <p style={styles.infoItem}>
              📍 <strong>Zona:</strong>{" "}
              {local.zonas?.nombre || "-"}
            </p>

            <p style={styles.infoItem}>
              ☎️ <strong>Teléfono:</strong>{" "}
              {local.telefono || "-"}
            </p>

            <p style={styles.infoItem}>
              📱 <strong>WhatsApp:</strong>{" "}
              {local.whatsapp || "-"}
            </p>

            <p style={styles.infoItem}>
              🏠 <strong>Dirección:</strong>{" "}
              {local.direccion || "-"}
            </p>

            <p style={styles.infoItem}>
              👤 <strong>Encargado:</strong>{" "}
              {local.encargado || "-"}
            </p>

          </div>

        </div>


        {/* ===============================================
            DOTACIÓN
        =============================================== */}

        <div style={styles.dotacion}>

          <div style={styles.dotacionTitulo}>
            📊 Dotación
          </div>

          <div style={styles.dotacionVertical}>

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

      </div>


      {/* =================================================
          COLABORADORES
      ================================================= */}

      <div style={styles.colaboradoresSection}>

        <button
          type="button"
          onClick={() =>
            setMostrarColaboradores(
              !mostrarColaboradores
            )
          }
          style={styles.colaboradoresHeader}
        >

          <span>
            👥 Colaboradores ({colaboradores.length})
          </span>

          <span>
            {mostrarColaboradores ? "▲" : "▼"}
          </span>

        </button>


        {mostrarColaboradores && (

          <div style={styles.colaboradoresLista}>

            {colaboradores.length === 0 ? (

              <div style={styles.sinColaboradores}>
                No hay colaboradores asignados a este local.
              </div>

            ) : (

              colaboradores.map((colaborador) => (

                <div
                  key={colaborador.id}
                  style={styles.colaboradorItem}
                >

                  <div>

                    <div
                      style={{
                        fontWeight: "700",
                        color: "#111827",
                      }}
                    >
                      {colaborador.nombre || ""}
                      {" "}
                      {colaborador.apellido || ""}
                    </div>

                    <div style={styles.colaboradorDetalle}>

                      {colaborador.puesto || "Sin puesto"}

                      {" · "}

                      Legajo:{" "}
                      {colaborador.legajo || "-"}

                    </div>

                    {colaborador.rol && (

                      <div style={styles.colaboradorDetalle}>
                        Rol: {colaborador.rol}
                      </div>

                    )}

                  </div>

                </div>

              ))

            )}

          </div>

        )}

      </div>


      {/* =================================================
          ACCIONES
      ================================================= */}

      <div style={styles.actions}>

        <button
          type="button"
          style={styles.edit}
          onClick={() =>
            onEdit(local)
          }
        >
          ✏️ Editar
        </button>


        <button
          type="button"
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

