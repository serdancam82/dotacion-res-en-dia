import { useState } from "react";

import LocalCard from "../LocalCard/LocalCard";

import styles from "./LocalList.styles";


export default function LocalList({
  locales,
  onEdit,
  onDelete,
}) {

  const [busqueda, setBusqueda] =
    useState("");


  const localesFiltrados =
    locales.filter((local) => {

      const texto =
        busqueda
          .toLowerCase()
          .trim();

      if (!texto) {
        return true;
      }


      return (

        String(local.numero || "")
          .toLowerCase()
          .includes(texto)

        ||

        String(local.nombre || "")
          .toLowerCase()
          .includes(texto)

        ||

        String(local.zonas?.nombre || "")
          .toLowerCase()
          .includes(texto)

      );

    });


  return (

    <div>

      <input
        style={styles.search}
        type="text"
        placeholder="Buscar por número, nombre o zona..."
        value={busqueda}
        onChange={(e) =>
          setBusqueda(e.target.value)
        }
      />


      <div style={styles.grid}>

        {localesFiltrados.length === 0 ? (

          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
              color: "#6b7280",
            }}
          >

            No se encontraron locales.

          </div>

        ) : (

          localesFiltrados.map((local) => (

            <LocalCard
              key={local.id}
              local={local}
              onEdit={onEdit}
              onDelete={onDelete}
            />

          ))

        )}

      </div>

    </div>

  );

}