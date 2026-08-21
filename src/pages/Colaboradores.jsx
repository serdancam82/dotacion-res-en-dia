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
import { getZonas } from "../services/zonasService";

export default function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [locales, setLocales] = useState([]);
  const [zonas, setZonas] = useState([]);

  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargarDatos() {
    try {
      setCargando(true);

      const [
        colaboradoresData,
        localesData,
        zonasData,
      ] = await Promise.all([
        getColaboradores(),
        getLocales(),
        getZonas(),
      ]);

      setColaboradores(colaboradoresData || []);
      setLocales(localesData || []);
      setZonas(zonasData || []);
    } catch (error) {
      console.error(
        "ERROR CARGANDO COLABORADORES:",
        error
      );

      alert(
        error?.message ||
          "Error cargando colaboradores."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  async function guardarColaborador(data) {
  try {
    if (editando) {
      const datosActualizados = {
        ...editando,
        ...data,
      };

      await updateColaborador(
        editando.id,
        datosActualizados
      );
    } else {
      await createColaborador(data);
    }

    setEditando(null);

    await cargarDatos();
  } catch (error) {
    console.error(
      "ERROR GUARDANDO COLABORADOR:",
      error
    );

    alert(
      error?.message ||
        "Error guardando colaborador."
    );
  }
}

  async function eliminarColaborador(id) {
    const confirmar = window.confirm(
      "¿Desea eliminar este colaborador?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await deleteColaborador(id);

      if (editando?.id === id) {
        setEditando(null);
      }

      await cargarDatos();
    } catch (error) {
      console.error(
        "ERROR ELIMINANDO COLABORADOR:",
        error
      );

      alert(
        error?.message ||
          "Error eliminando colaborador."
      );
    }
  }

  if (cargando) {
    return (
      <div
        style={{
          padding: "30px",
          color: "#6b7280",
        }}
      >
        Cargando colaboradores...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
      }}
    >
      <h1
        style={{
          marginBottom: "24px",
          color: "#1f2937",
        }}
      >
        👥 Colaboradores
      </h1>

      <ColaboradorForm
        colaborador={editando}
        locales={locales}
        zonas={zonas}
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