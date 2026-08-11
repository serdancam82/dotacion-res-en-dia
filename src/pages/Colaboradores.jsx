import { useEffect, useState } from "react";

import ColaboradorForm from "../components/colaboradores/ColaboradorForm/ColaboradorForm";
import ColaboradorList from "../components/colaboradores/ColaboradorList/ColaboradorList";

import {
  getColaboradores,
  createColaborador,
  updateColaborador,
  deleteColaborador,
} from "../services/colaboradoresService";

import { getLocales } from "../services/localesService";


export default function Colaboradores() {

  const [colaboradores, setColaboradores] = useState([]);
  const [locales, setLocales] = useState([]);

  const [editando, setEditando] = useState(null);

  const [cargando, setCargando] = useState(true);


  async function cargarDatos() {

  try {

    setCargando(true);

    const colaboradoresData = await getColaboradores();

    console.log(
      "COLABORADORES OK:",
      colaboradoresData
    );


    const localesData = await getLocales();

    console.log(
      "LOCALES OK:",
      localesData
    );


    setColaboradores(colaboradoresData);
    setLocales(localesData);


  } catch (error) {

    console.error(
      "ERROR REAL:",
      error
    );

    alert(
      error.message || "Error cargando datos"
    );


  } finally {

    setCargando(false);

  }

}


  useEffect(() => {

    cargarDatos();

  }, []);



  async function guardarColaborador(data) {

  console.log(
    "DATOS A GUARDAR:",
    data
  );

  try {

    if (editando) {

      await updateColaborador(
        editando.id,
        data
      );

    } else {

      await createColaborador(
        data
      );

    }

    setEditando(null);

    await cargarDatos();

  } catch (error) {

  console.error(
    "ERROR GUARDANDO COLABORADOR:",
    error
  );

  alert(
    error.message || "Error guardando colaborador."
  );

}

}



  async function eliminarColaborador(id) {


    const confirmar = window.confirm(
      "¿Desea eliminar este colaborador?"
    );


    if (!confirmar) return;


    try {


      await deleteColaborador(id);

      await cargarDatos();


    } catch (error) {

      console.error(error);

      alert(
        "Error eliminando colaborador."
      );

    }

  }



  if (cargando) {

    return (
      <div>
        Cargando colaboradores...
      </div>
    );

  }



  return (

    <div
      style={{
        padding: "24px"
      }}
    >


      <h1
        style={{
          marginBottom:"24px",
          color:"#1f2937"
        }}
      >
        👥 Colaboradores
      </h1>



      <ColaboradorForm

        colaborador={editando}

        locales={locales}

        onSave={guardarColaborador}

        onCancel={() => setEditando(null)}

      />



      <ColaboradorList

        colaboradores={colaboradores}

        onEdit={setEditando}

        onDelete={eliminarColaborador}

      />


    </div>

  );

}