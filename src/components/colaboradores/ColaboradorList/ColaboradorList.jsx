import { useMemo, useState } from "react";
import ColaboradorCard from "../ColaboradorCard/ColaboradorCard";
import styles from "./ColaboradorList.styles";

export default function ColaboradorList({
  colaboradores,
  onEdit,
  onDelete,
}) {

  const [busqueda, setBusqueda] = useState("");

  const filtrados = useMemo(() => {

    const texto = busqueda.toLowerCase();

    return colaboradores.filter((colaborador) => {

      const nombreCompleto =
        `${colaborador.nombre} ${colaborador.apellido}`
          .toLowerCase();

      const puesto =
        colaborador.puesto?.toLowerCase() || "";

      const local =
        colaborador.locales?.nombre?.toLowerCase() || "";

      return (
        nombreCompleto.includes(texto) ||
        puesto.includes(texto) ||
        local.includes(texto)
      );

    });

  }, [colaboradores, busqueda]);


  return (
    <div style={styles.container}>

      <div style={styles.searchBox}>

        <input
          style={styles.search}
          placeholder="Buscar por nombre, puesto o local..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

      </div>


      <div style={styles.grid}>

        {filtrados.length === 0 ? (

          <p style={styles.empty}>
            No se encontraron colaboradores.
          </p>

        ) : (

          filtrados.map((colaborador) => (

            <ColaboradorCard
              key={colaborador.id}
              colaborador={colaborador}
              onEdit={onEdit}
              onDelete={onDelete}
            />

          ))

        )}

      </div>

    </div>
  );
}