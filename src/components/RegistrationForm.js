import React from "react";
import {
  FaUser,
  FaUserTag,
  FaIdCard,
  FaPhoneAlt,
  FaVenusMars,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMapMarkedAlt,
  FaCity,
  FaBriefcase,
  FaInfoCircle,
  FaExclamationCircle,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import {
  optionsEconomicSector,
  optionsSexo,
  optionsTipoDocumento,
} from "../data/economicSectors";
import { departamentos, municipiosDe } from "../data/colombia";
import "./RegistrationForm.css";

// Vacío = ruta relativa (mismo dominio, ideal para Vercel: /api/entries).
// Para un backend en otro host, define REACT_APP_API_URL.
const API_URL = process.env.REACT_APP_API_URL || "";

const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.-]{2,}$/;

const initialForm = {
  nombre: "",
  apellidos: "",
  tipoDocumento: "CC",
  cedula: "",
  telefono: "",
  sexo: "",
  fechaNacimiento: "",
  direccion: "",
  departamento: "",
  municipio: "",
  sectorEconomico: "",
};

// Edad (años completos) a partir de un objeto Date.
const calcAge = (birth) => {
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

// Aplica máscara DD/MM/AAAA a medida que se escribe (solo dígitos).
const maskDate = (value) => {
  const d = value.replace(/\D/g, "").slice(0, 8);
  let out = d.slice(0, 2);
  if (d.length > 2) out += "/" + d.slice(2, 4);
  if (d.length > 4) out += "/" + d.slice(4, 8);
  return out;
};

// Parsea "DD/MM/AAAA" a Date real; null si el formato o la fecha no son válidos.
const parseDate = (str) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(str.trim());
  if (!m) return null;
  const day = +m[1];
  const month = +m[2];
  const year = +m[3];
  const d = new Date(year, month - 1, day);
  // Rechaza fechas imposibles como 31/02/2000 (JS las "corre" al mes siguiente).
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day)
    return null;
  return d;
};

// "DD/MM/AAAA" -> "AAAA-MM-DD" (ISO) para guardar en base de datos.
const toISO = (str) => {
  const d = parseDate(str);
  if (!d) return str;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Reglas de validación por campo. Devuelve string con el error o "" si es válido.
const validators = {
  nombre: (v) =>
    !v.trim()
      ? "El nombre es obligatorio."
      : !NAME_RE.test(v.trim())
      ? "Ingresa un nombre válido (mínimo 2 letras, sin números)."
      : "",
  apellidos: (v) =>
    !v.trim()
      ? "Los apellidos son obligatorios."
      : !NAME_RE.test(v.trim())
      ? "Ingresa apellidos válidos (mínimo 2 letras, sin números)."
      : "",
  tipoDocumento: (v) => (!v ? "Selecciona el tipo de documento." : ""),
  cedula: (v) =>
    !v.trim()
      ? "El número de documento es obligatorio."
      : !/^\d{5,12}$/.test(v.trim())
      ? "El documento debe tener entre 5 y 12 dígitos numéricos."
      : "",
  telefono: (v) =>
    !v.trim()
      ? "El teléfono es obligatorio."
      : !/^\d{7,10}$/.test(v.trim())
      ? "Ingresa un teléfono válido (7 a 10 dígitos)."
      : "",
  sexo: (v) => (!v ? "Selecciona una opción." : ""),
  // Opcional: solo valida formato/edad si el usuario escribe algo.
  fechaNacimiento: (v) => {
    if (!v.trim()) return "";
    const d = parseDate(v);
    if (!d) return "Formato inválido. Usa DD/MM/AAAA.";
    if (d > new Date()) return "La fecha no puede ser futura.";
    const age = calcAge(d);
    if (age < 18) return "Debes ser mayor de 18 años.";
    if (age > 110) return "Verifica la fecha de nacimiento.";
    return "";
  },
  // Dirección es opcional (sin validación).
  departamento: (v) => (!v ? "Selecciona un departamento." : ""),
  municipio: (v) => (!v ? "Selecciona un municipio." : ""),
  sectorEconomico: (v) => (!v ? "Selecciona un sector económico." : ""),
};

// Wrapper de campo (icono + input + mensaje de error accesible).
// Definido a nivel de módulo para que React NO re-monte los inputs en cada
// render (si estuviera dentro del componente, el input perdería el foco).
const Field = ({ icon, invalid, error, children, hint, full }) => (
  <div
    className={`rf-field ${full ? "rf-field--full" : ""} ${
      invalid ? "rf-field--error" : ""
    }`}
  >
    <div className="rf-control">
      <span className="rf-icon">{icon}</span>
      {children}
      {hint && (
        <span className="rf-hint" title={hint}>
          <FaInfoCircle />
        </span>
      )}
    </div>
    {invalid && (
      <p className="rf-error" role="alert">
        <FaExclamationCircle /> {error}
      </p>
    )}
  </div>
);

const RegistrationForm = ({ light = false }) => {
  const [form, setForm] = React.useState(initialForm);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [status, setStatus] = React.useState({ state: "idle", message: "" });
  const successTimer = React.useRef(null);

  // Limpia el temporizador si el componente se desmonta.
  React.useEffect(() => () => clearTimeout(successTimer.current), []);

  const municipios = React.useMemo(
    () => municipiosDe(form.departamento),
    [form.departamento]
  );

  const runValidation = (data) => {
    const next = {};
    Object.keys(validators).forEach((k) => {
      const msg = validators[k](data[k]);
      if (msg) next[k] = msg;
    });
    return next;
  };

  const handleChange = (e) => {
    const { name } = e.target;
    // La fecha de nacimiento se autoformatea a DD/MM/AAAA mientras se escribe.
    const value =
      name === "fechaNacimiento" ? maskDate(e.target.value) : e.target.value;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      // Al cambiar de departamento, se limpia el municipio seleccionado.
      if (name === "departamento") next.municipio = "";
      return next;
    });
    if (touched[name] && validators[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validators[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = runValidation(form);
    setErrors(nextErrors);
    setTouched(
      Object.keys(validators).reduce((a, k) => ({ ...a, [k]: true }), {})
    );

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        state: "error",
        message: "Revisa los campos marcados antes de continuar.",
      });
      return;
    }

    setStatus({ state: "loading", message: "" });
    try {
      const res = await fetch(`${API_URL}/api/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          nombre: form.nombre.trim(),
          apellidos: form.apellidos.trim(),
          cedula: form.cedula.trim(),
          telefono: form.telefono.trim(),
          direccion: form.direccion.trim(),
          fechaNacimiento: toISO(form.fechaNacimiento),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "No se pudo registrar.");

      setStatus({
        state: "success",
        message: "¡Registro exitoso! Pronto nos pondremos en contacto contigo.",
      });
      setForm(initialForm);
      setTouched({});
      setErrors({});
      // El mensaje de éxito desaparece solo a los 6 segundos.
      clearTimeout(successTimer.current);
      successTimer.current = setTimeout(
        () => setStatus({ state: "idle", message: "" }),
        3000
      );
    } catch (err) {
      setStatus({
        state: "error",
        message:
          err.message === "Failed to fetch"
            ? "No se pudo conectar con el servidor. Intenta más tarde."
            : err.message,
      });
    }
  };

  // Helper para pasar el estado de error de un campo al componente Field.
  const fieldState = (name) => ({
    invalid: !!(touched[name] && errors[name]),
    error: errors[name],
  });

  return (
    <section className={`registro ${light ? "registro--light" : ""}`} id="registro">
      <div className="container">
        <form className="rf-card" onSubmit={handleSubmit} noValidate>
          <h2 className="rf-title">Registro de usuarios</h2>

          <div className="rf-grid">
            <Field icon={<FaUser />} {...fieldState("nombre")}>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre*"
                value={form.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="given-name"
              />
            </Field>

            <Field icon={<FaUserTag />} {...fieldState("apellidos")}>
              <input
                type="text"
                name="apellidos"
                placeholder="Apellidos*"
                value={form.apellidos}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="family-name"
              />
            </Field>

            <Field icon={<FaIdCard />} {...fieldState("tipoDocumento")}>
              <select
                name="tipoDocumento"
                value={form.tipoDocumento}
                onChange={handleChange}
                onBlur={handleBlur}
                className="rf-doc-type"
              >
                {optionsTipoDocumento.map((o) => (
                  <option key={o.key} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field icon={<FaIdCard />} {...fieldState("cedula")}>
              <input
                type="text"
                inputMode="numeric"
                name="cedula"
                placeholder="Documento*"
                value={form.cedula}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            <Field icon={<FaPhoneAlt />} {...fieldState("telefono")}>
              <input
                type="tel"
                inputMode="numeric"
                name="telefono"
                placeholder="Tel*"
                value={form.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="tel"
              />
            </Field>

            <Field icon={<FaVenusMars />} {...fieldState("sexo")}>
              <select
                name="sexo"
                value={form.sexo}
                onChange={handleChange}
                onBlur={handleBlur}
                className={form.sexo ? "" : "rf-placeholder"}
              >
                <option value="" disabled>
                  Sexo*
                </option>
                {optionsSexo.map((o) => (
                  <option key={o.key} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field icon={<FaCalendarAlt />} {...fieldState("fechaNacimiento")}>
              <input
                type="text"
                inputMode="numeric"
                name="fechaNacimiento"
                placeholder="Fecha nac. (DD/MM/AAAA)"
                value={form.fechaNacimiento}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={10}
                autoComplete="bday"
                aria-label="Fecha de nacimiento"
              />
            </Field>

            <Field icon={<FaMapMarkerAlt />} {...fieldState("direccion")}>
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={form.direccion}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="street-address"
              />
            </Field>

            <Field icon={<FaMapMarkedAlt />} {...fieldState("departamento")}>
              <select
                name="departamento"
                value={form.departamento}
                onChange={handleChange}
                onBlur={handleBlur}
                className={form.departamento ? "" : "rf-placeholder"}
              >
                <option value="" disabled>
                  Departamento*
                </option>
                {departamentos.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>

            <Field icon={<FaCity />} {...fieldState("municipio")}>
              <select
                name="municipio"
                value={form.municipio}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!form.departamento}
                className={form.municipio ? "" : "rf-placeholder"}
              >
                <option value="" disabled>
                  {form.departamento
                    ? "Municipio*"
                    : "Selecciona un departamento primero"}
                </option>
                {municipios.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>

            <Field icon={<FaBriefcase />} {...fieldState("sectorEconomico")} full>
              <select
                name="sectorEconomico"
                value={form.sectorEconomico}
                onChange={handleChange}
                onBlur={handleBlur}
                className={form.sectorEconomico ? "" : "rf-placeholder"}
              >
                <option value="" disabled>
                  Sector Económico*
                </option>
                {optionsEconomicSector.map((o) => (
                  <option key={o.key} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {status.state !== "idle" && status.state !== "loading" && (
            <p className={`rf-banner rf-banner--${status.state}`} role="status">
              {status.state === "success" ? (
                <FaCheckCircle />
              ) : (
                <FaExclamationCircle />
              )}{" "}
              {status.message}
            </p>
          )}

          <button
            type="submit"
            className="rf-submit"
            disabled={status.state === "loading"}
          >
            {status.state === "loading" ? (
              <>
                <FaSpinner className="rf-spin" /> Registrando...
              </>
            ) : (
              <>
                <FaIdCard /> Registrar
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegistrationForm;
