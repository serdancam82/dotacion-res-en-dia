import { useEffect, useState } from "react";

import {
  getLocales,
  createLocal,
  updateLocal,
  deleteLocal,
} from "../services/localesService";

import { getZonas } from "../services/zonasService";

import LocalForm from "../components/locales/LocalForm/LocalForm";
import LocalList from "../components/locales/LocalList/LocalList";

export default function Locales() {

  const [locales, setLocales] = useState([]);
  const [zonas, setZonas] = useState([]);

  const [localSeleccionado, setLocalSeleccionado] = useState(null);

  const [cargando, setCargando] = useState(true);


  const cargarDatos = async () => {

    try {

      setCargando(true);

      const [
        localesData,
        zonasData
      ] = await Promise.all([
        getLocales(),
        getZonas()
      ]);


      setLocales(localesData || []);
      setZonas(zonasData || []);


    } catch(error){

      console.error(
        "Error cargando locales:",
        error
      );

    } finally {

      setCargando(false);

    }

  };


  useEffect(()=>{

    cargarDatos();

  },[]);



  const guardarLocal = async(local)=>{

    try{

      if(local.id){

        await updateLocal(
          local.id,
          local
        );

      }else{

        await createLocal(
          local
        );

      }


      setLocalSeleccionado(null);

      cargarDatos();


    }catch(error){

      console.error(
        "Error guardando local:",
        error
      );

    }

  };



  const editarLocal = (local)=>{

    setLocalSeleccionado(local);

  };



  const eliminarLocal = async(id)=>{


    const confirmar =
      window.confirm(
        "¿Eliminar este local?"
      );


    if(!confirmar)
      return;



    try{

      await deleteLocal(id);

      cargarDatos();


    }catch(error){

      console.error(
        "Error eliminando local:",
        error
      );

    }

  };



  return (

    <div
      style={{
        padding:"25px"
      }}
    >


      <h1
        style={{
          marginBottom:"20px"
        }}
      >
        🏪 Locales
      </h1>



      <LocalForm

        local={localSeleccionado}

        zonas={zonas}

        onSave={guardarLocal}

        onCancel={()=>
          setLocalSeleccionado(null)
        }

      />



      {
        cargando ?

        <p>
          Cargando locales...
        </p>

        :

        <LocalList

          locales={locales}

          onEdit={editarLocal}

          onDelete={eliminarLocal}

        />

      }


    </div>

  );

}