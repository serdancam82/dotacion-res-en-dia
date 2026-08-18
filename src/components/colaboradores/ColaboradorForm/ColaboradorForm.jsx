import { useEffect, useState } from "react";
import styles from "./ColaboradorForm.styles";

const PUESTOS = [
  "Encargado",
  "Segundo Encargado",
  "Carnicero",
  "Cajero",
  "Aprendiz",
  "Fiambrero",
];

const ROLES = [
  "colaborador",
  "supervisor",
  "auditor",
];

const initialState = {
  legajo: "",
  nombre: "",
  apellido: "",
  telefono: "",
  puesto: "",
  rol: "colaborador",
  local_id: "",
  zona_id: "",
};

export default function ColaboradorForm({
  colaborador,
  locales = [],
  zonas = [],
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (colaborador) {
      setForm({
        legajo: colaborador.legajo || "",
        nombre: colaborador.nombre || "",
        apellido: colaborador.apellido || "",
        telefono: colaborador.telefono || "",
        puesto: colaborador.puesto || "",
        rol: colaborador.rol || "colaborador",

        local_id:
          colaborador.local_id ||
          colaborador.locales?.id ||
          "",

        zona_id:
          colaborador.zona_id ||
          "",
      });
    } else {
      setForm(initialState);
    }
  }, [colaborador]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      ...form,
      local_id: form.local_id || null,
      zona_id: form.zona_id || null,
    });

    if (!colaborador) {
      setForm(initialState);
    }
  }

  return (
    <form
      style={styles.container}
      onSubmit={handleSubmit}
    >
      <h2 style={styles.title}>
        {colaborador
          ? "Editar colaborador"
          : "Nuevo colaborador"}
      </h2>

      <div style={styles.grid}>
        <input
          style={styles.input}
          name="legajo"
          placeholder="Legajo"
          value={form.legajo}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
        />

        <select
          style={styles.select}
          name="puesto"
          value={form.puesto}
          onChange={handleChange}
        >
          <option value="">
            Seleccione un puesto
          </option>

          {PUESTOS.map((puesto) => (
            <option
              key={puesto}
              value={puesto}
            >
              {puesto}
            </option>
          ))}
        </select>

        <select
          style={styles.select}
          name="rol"
          value={form.rol}
          onChange={handleChange}
        >
          {ROLES.map((rol) => (
            <option
              key={rol}
              value={rol}
            >
              {rol}
            </option>
          ))}
        </select>

        <select
          style={styles.select}
          name="local_id"
          value={form.local_id}
          onChange={handleChange}
        >
          <option value="">
            Seleccione un local
          </option>

          {locales.map((local) => (
            <option
              key={local.id}
              value={local.id}
            >
              {local.numero || ""} - {local.nombre}
            </option>
          ))}
        </select>

        {(form.rol === "supervisor" ||
          form.rol === "auditor") && (
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
        )}
      </div>

      <div style={styles.actions}>
        <button
          type="submit"
          style={styles.saveButton}
        >
          {colaborador
            ? "Actualizar"
            : "Guardar"}
        </button>

        {colaborador && (
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