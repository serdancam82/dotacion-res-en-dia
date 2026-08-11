import { useEffect, useState } from "react";

import {
  getZonas,
  getSupervisores,
  getAuditores,
  createZona,
  updateZona,
  deleteZona,
  updateZonaAsignacion,
} from "../services/zonasService";

import ZoneCard from "../components/zonas/ZoneCard";


export default function Zonas() {

  const [zonas, setZonas] = useState([]);

  const [supervisores, setSupervisores] = useState([]);
  const [auditores, setAuditores] = useState([]);

  const [nombre, setNombre] = useState("");

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    cargarTodo();

  }, []);



  async function cargarTodo(){

    try{

      const [
        zonasData,
        supervisoresData,
        auditoresData

      ] = await Promise.all([

        getZonas(),
        getSupervisores(),
        getAuditores()

      ]);


      setZonas(zonasData);

      setSupervisores(supervisoresData);

      setAuditores(auditoresData);


    }catch(error){

      console.error(
        "Error cargando zonas:",
        error
      );

    }finally{

      setLoading(false);

    }

  }



  async function crearZona(){

    if(!nombre.trim()) return;


    await createZona(nombre);


    setNombre("");

    cargarTodo();

  }



  async function editarZona(zona){

    const nuevo = prompt(
      "Nuevo nombre de zona:",
      zona.nombre
    );


    if(!nuevo) return;


    await updateZona(
      zona.id,
      nuevo
    );


    cargarTodo();

  }



  async function borrarZona(id){

    if(!confirm("¿Eliminar zona?"))
      return;


    await deleteZona(id);

    cargarTodo();

  }




  async function asignar(
    zona,
    supervisor_id,
    auditor_id
  ){

    await updateZonaAsignacion(

      zona.id,

      supervisor_id,

      auditor_id

    );


    cargarTodo();

  }



  if(loading)

    return (
      <h2 style={{padding:20}}>
        Cargando...
      </h2>
    );



  const styles = {

    page:{
      padding:24,
      minHeight:"100vh",
      background:
        "linear-gradient(180deg,#f6f8fc 0%,#eef2f7 100%)",
      fontFamily:"system-ui,sans-serif"
    },


    title:{
      fontSize:26,
      fontWeight:700
    },


    subtitle:{
      color:"#6b7280",
      marginBottom:20
    },


    inputRow:{
      display:"flex",
      gap:10,
      marginBottom:20
    },


    input:{
      flex:1,
      padding:10,
      borderRadius:10,
      border:"1px solid #ddd"
    },


    button:{
      padding:"10px 14px",
      borderRadius:10,
      border:"none",
      background:"#2563eb",
      color:"#fff",
      cursor:"pointer"
    },


    grid:{
      display:"grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(280px,1fr))",
      gap:16
    },


    select:{
      width:"100%",
      marginTop:8,
      padding:8,
      borderRadius:10
    }

  };



  return (

    <div style={styles.page}>


      <h1 style={styles.title}>
        Gestión de Zonas
      </h1>


      <div style={styles.subtitle}>
        Panel de control de locales,
        colaboradores y responsables
      </div>



      <div style={styles.inputRow}>


        <input

          value={nombre}

          onChange={
            e=>setNombre(e.target.value)
          }

          placeholder="Nueva zona"

          style={styles.input}

        />


        <button
          onClick={crearZona}
          style={styles.button}
        >
          + Crear
        </button>


      </div>




      <div style={styles.grid}>


      {zonas.map(zona=>(

        <div key={zona.id}>


          <ZoneCard {...zona}/>



          <select

            style={styles.select}

            value={zona.supervisor_id || ""}

            onChange={
              e=>
              asignar(
                zona,
                e.target.value,
                zona.auditor_id
              )
            }

          >

            <option value="">
              Supervisor
            </option>


            {
              supervisores.map(persona=>(

                <option
                  key={persona.id}
                  value={persona.id}
                >

                  {persona.nombre}
                  {" "}
                  {persona.apellido}

                </option>

              ))

            }

          </select>




          <select

            style={styles.select}

            value={zona.auditor_id || ""}

            onChange={
              e=>
              asignar(
                zona,
                zona.supervisor_id,
                e.target.value
              )
            }

          >

            <option value="">
              Auditor
            </option>


            {
              auditores.map(persona=>(

                <option
                  key={persona.id}
                  value={persona.id}
                >

                  {persona.nombre}
                  {" "}
                  {persona.apellido}

                </option>

              ))

            }


          </select>



          <div>

            <button
              onClick={() => editarZona(zona)}
            >
              ✏️
            </button>


            <button
              onClick={() => borrarZona(zona.id)}
            >
              🗑️
            </button>

          </div>



        </div>

      ))}


      </div>


    </div>

  );

}