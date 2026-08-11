import { useEffect, useState } from "react";
import {
  getColaboradores,
  createColaborador,
  updateColaborador,
  deleteColaborador,
} from "../services/colaboradoresService";

import { getZonas } from "../services/zonasService";

export default function Colaboradores() {
  const [data, setData] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    legajo: "",
    nombre: "",
    apellido: "",
    telefono: "",
    puesto: "",
    local_id: "",
    rol: "colaborador",
  });

  useEffect(() => {
    cargarTodo();
  }, []);

  async function cargarTodo() {
    try {
      const [colabs, zonasData] = await Promise.all([
        getColaboradores(),
        getZonas(),
      ]);

      setData(colabs);
      setZonas(zonasData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function crear() {
    await createColaborador(form);
    setForm({
      legajo: "",
      nombre: "",
      apellido: "",
      telefono: "",
      puesto: "",
      local_id: "",
      rol: "colaborador",
    });
    cargarTodo();
  }

  async function eliminar(id) {
    await deleteColaborador(id);
    cargarTodo();
  }

  if (loading) return <h2>Cargando colaboradores...</h2>;

  const puestos = [
    "Carnicero",
    "Segundo Encargado",
    "Encargado",
    "Auditor",
    "Supervisor",
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Colaboradores</h1>

      {/* FORM */}
      <div style={{ display: "grid", gap: 10, maxWidth: 500 }}>
        <input
          placeholder="Legajo"
          value={form.legajo}
          onChange={(e) => setForm({ ...form, legajo: e.target.value })}
        />

        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />

        <input
          placeholder="Apellido"
          value={form.apellido}
          onChange={(e) => setForm({ ...form, apellido: e.target.value })}
        />

        <input
          placeholder="Teléfono"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
        />

        {/* PUESTO */}
        <select
          value={form.puesto}
          onChange={(e) => setForm({ ...form, puesto: e.target.value })}
        >
          <option value="">Puesto</option>
          {puestos.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* LOCAL */}
        <select
          value={form.local_id}
          onChange={(e) => setForm({ ...form, local_id: e.target.value })}
        >
          <option value="">Local</option>
          {zonas.map((z) => (
            <option key={z.id} value={z.id}>
              {z.nombre}
            </option>
          ))}
        </select>

        <button onClick={crear}>Agregar colaborador</button>
      </div>

      <hr />

      {/* LISTA */}
      {data.map((c) => (
        <div key={c.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <b>{c.nombre} {c.apellido}</b>
          <div>Legajo: {c.legajo}</div>
          <div>Puesto: {c.puesto}</div>
          <div>Tel: {c.telefono}</div>

          <button onClick={() => eliminar(c.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}