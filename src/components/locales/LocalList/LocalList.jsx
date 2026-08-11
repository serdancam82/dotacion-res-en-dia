import { useState } from "react";

import LocalCard from "../LocalCard/LocalCard";

import styles from "./LocalList.styles";


export default function LocalList({

  locales,

  onEdit,

  onDelete

}) {


const [busqueda,setBusqueda] = useState("");



const filtrados = locales.filter(local=>{


const texto = busqueda.toLowerCase();


return (

String(local.numero)
.includes(texto)

||

local.nombre
?.toLowerCase()
.includes(texto)


||

local.zonas?.nombre
?.toLowerCase()
.includes(texto)

);


});



return (

<div>


<input

style={styles.search}

placeholder="Buscar local..."

value={busqueda}

onChange={
e=>setBusqueda(e.target.value)
}

/>



<div style={styles.grid}>


{

filtrados.map(local=>(

<LocalCard

key={local.id}

local={local}

onEdit={onEdit}

onDelete={onDelete}

/>

))


}


</div>


</div>

);


}