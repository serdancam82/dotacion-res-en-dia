import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";
import KPICard from "../components/dashboard";


export default function Dashboard() {


  const [datos,setDatos] = useState({

    totalZonas:0,
    totalLocales:0,
    totalColaboradores:0,

    zonas:[],
    locales:[],
    colaboradores:[]

  });


  const [loading,setLoading] = useState(true);



  useEffect(()=>{

    cargarDashboard();

  },[]);




  async function cargarDashboard(){

    try{

      const respuesta =
        await getDashboard();

      setDatos(respuesta);


    }catch(error){

      console.error(
        "Error Dashboard:",
        error
      );

    }finally{

      setLoading(false);

    }

  }





  if(loading){

    return (

      <div style={{padding:30}}>

        <h2>
          Cargando Dashboard...
        </h2>

      </div>

    );

  }






  return (

    <div
      style={{
        padding:"20px"
      }}
    >



      <h1
        style={{
          color:"#1f2937",
          marginBottom:"30px"
        }}
      >

        Dashboard Ejecutivo

      </h1>




      <div
        style={{
          display:"flex",
          gap:"20px",
          flexWrap:"wrap"
        }}
      >


        <KPICard
          titulo="Zonas"
          valor={datos.totalZonas}
          icono="🏢"
        />


        <KPICard
          titulo="Locales"
          valor={datos.totalLocales}
          icono="🏪"
        />


        <KPICard
          titulo="Colaboradores"
          valor={datos.totalColaboradores}
          icono="👥"
        />


      </div>






      <div

        style={{

          display:"grid",

          gridTemplateColumns:
          "repeat(auto-fit,minmax(280px,1fr))",

          gap:"20px",

          marginTop:"40px"

        }}

      >





        <div

          style={{
            background:"#fff",
            padding:"20px",
            borderRadius:"15px",
            boxShadow:
            "0 5px 20px rgba(0,0,0,0.08)"
          }}

        >

          <h2>
            🌎 Zonas
          </h2>


          {
            datos.zonas.map((z)=>(

              <div
                key={z.id}
                style={{
                  padding:"10px",
                  borderBottom:
                  "1px solid #eee"
                }}
              >

                {z.nombre}

              </div>

            ))
          }


        </div>








        <div

          style={{
            background:"#fff",
            padding:"20px",
            borderRadius:"15px",
            boxShadow:
            "0 5px 20px rgba(0,0,0,0.08)"
          }}

        >

          <h2>
            🏪 Locales
          </h2>



          {
            datos.locales.map((l)=>(


              <div

                key={l.id}

                style={{
                  padding:"10px",
                  borderBottom:
                  "1px solid #eee"
                }}

              >

                {l.nombre}

              </div>


            ))
          }


        </div>





      </div>







    </div>

  );


}