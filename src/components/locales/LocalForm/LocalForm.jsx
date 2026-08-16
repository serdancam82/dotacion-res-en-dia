import { useEffect, useState } from "react";
import styles from "./LocalForm.styles";

const initialState = {
  numero: "",
  nombre: "",
  zona_id: "",
  direccion: "",
  telefono: "",
  whatsapp: "",
  encargado: "",
  dotacion_teorica: 4,
};

export default function LocalForm({
  local,
  zonas,
  onSave,
  onCancel,
}) {

  const [form, setForm] = useState(initialState);

  useEffect(() => {

    if (local) {

      setForm({
        numero: local.numero || "",
        nombre: local.nombre || "",
        zona_id: local.zona_id || "",
        direccion: local.direccion || "",
        telefono: local.telefono || "",
        whatsapp: local.whatsapp || "",
        encargado: local.encargado || "",
        dotacion_teorica:
          local.dotacion_teorica ?? 4,
      });

    } else {

      setForm(initialState);

    }

  }, [local]);


  function handleChange(e) {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  }


  function handleSubmit(e) {

    e.preventDefault();


    if (!form.numero.trim()) {

      alert(
        "Debe ingresar el número del local."
      );

      return;
    }


    if (!form.nombre.trim()) {

      alert(
        "Debe ingresar el nombre del local."
      );

      return;
    }


    const dotacion =
      Number(form.dotacion_teorica);


    if (
      !Number.isInteger(dotacion) ||
      dotacion < 1
    ) {

      alert(
        "La dotación teórica debe ser un número entero mayor a 0."
      );

      return;
    }


    onSave({
      ...form,
      dotacion_teorica: dotacion,
    });


    if (!local) {

      setForm(initialState);

    }

  }


  return (

    <form
      style={styles.container}
      onSubmit={handleSubmit}
    >

      <h2 style={styles.title}>

        {local
          ? "Editar Local"
          : "Nuevo Local"}

      </h2>


      <div style={styles.grid}>


        <input
          style={styles.input}
          name="numero"
          placeholder="Número del local"
          value={form.numero}
          onChange={handleChange}
        />


        <input
          style={styles.input}
          name="nombre"
          placeholder="Nombre del local"
          value={form.nombre}
          onChange={handleChange}
        />


        <select
          style={styles.select}
          name="zona_id"
          value={form.zona_id}
          onChange={handleChange}
        >

          <option value="">
            Seleccione una zona
          </option>

          {zonas.map((zona) => (

            <option
              key={zona.id}
              value={zona.id}
            >
              {zona.nombre}
            </option>

          ))}

        </select>


        <input
          style={styles.input}
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
        />


        <input
          style={styles.input}
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
        />


        <input
          style={styles.input}
          name="whatsapp"
          placeholder="WhatsApp"
          value={form.whatsapp}
          onChange={handleChange}
        />


        <input
          style={styles.input}
          name="encargado"
          placeholder="Encargado"
          value={form.encargado}
          onChange={handleChange}
        />


        {/* DOTACIÓN TEÓRICA */}

        <input
          style={styles.input}
          type="number"
          name="dotacion_teorica"
          min="1"
          step="1"
          placeholder="Dotación teórica"
          value={form.dotacion_teorica}
          onChange={handleChange}
        />

      </div>


      <div style={styles.actions}>


        <button
          type="submit"
          style={styles.saveButton}
        >

          {local
            ? "Actualizar"
            : "Guardar"}

        </button>


        {local && (

          <button
            type="button"
            style={styles.cancelButton}
            onClick={onCancel}
          >

            Cancelar

          </button>

        )}

      </div>

    </form>

  );

}