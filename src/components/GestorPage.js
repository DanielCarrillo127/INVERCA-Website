import React from "react";
import { Link as RouterLink } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  FaLock,
  FaUser,
  FaSignOutAlt,
  FaSearch,
  FaFileExcel,
  FaLink,
  FaCheck,
  FaUsers,
  FaBirthdayCake,
  FaChartPie,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";
import { optionsEconomicSector, optionsSexo } from "../data/economicSectors";
import { departamentos, municipiosDe } from "../data/colombia";
import "./GestorPage.css";

const API_URL = process.env.REACT_APP_API_URL || "";
const TOKEN_KEY = "gestor_token";
const PAGE_SIZE = 10;

const emptyFilters = {
  search: "",
  departamento: "",
  municipio: "",
  sectorEconomico: "",
  sexo: "",
};

// "YYYY-MM-DD" -> "DD/MM/YYYY" (vacío si no hay).
const fmtDob = (iso) => {
  if (!iso) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
};

const fmtDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d.getTime()) ? "—" : d.toLocaleString("es-CO");
};

const GestorPage = () => {
  const [token, setToken] = React.useState(
    () => localStorage.getItem(TOKEN_KEY) || ""
  );

  // ----- Login -----
  const [creds, setCreds] = React.useState({ user: "", password: "" });
  const [loginError, setLoginError] = React.useState("");
  const [loggingIn, setLoggingIn] = React.useState(false);

  // ----- Datos -----
  const [searchInput, setSearchInput] = React.useState("");
  const [filters, setFilters] = React.useState(emptyFilters);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState({ rows: [], total: 0, pages: 1 });
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [copied, setCopied] = React.useState("");
  const [exporting, setExporting] = React.useState(false);

  const municipios = React.useMemo(
    () => municipiosDe(filters.departamento),
    [filters.departamento]
  );

  // fetch con auth; lanza 'unauthorized' si el token expiró/es inválido.
  const apiFetch = React.useCallback(
    async (path, opts = {}) => {
      const res = await fetch(`${API_URL}${path}`, {
        ...opts,
        headers: {
          ...(opts.body ? { "Content-Type": "application/json" } : {}),
          Authorization: `Bearer ${token}`,
          ...(opts.headers || {}),
        },
      });
      if (res.status === 401) throw new Error("unauthorized");
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.message || "Error en la solicitud.");
      }
      return res.json();
    },
    [token]
  );

  const logout = React.useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setData({ rows: [], total: 0, pages: 1 });
    setStats(null);
  }, []);

  const buildQuery = React.useCallback(
    (extra = {}) => {
      const p = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => v && p.set(k, v));
      Object.entries(extra).forEach(([k, v]) => p.set(k, v));
      return p.toString();
    },
    [filters]
  );

  // Debounce del buscador -> filtros.
  React.useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput.trim() }));
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Carga de registros al cambiar token/filtros/página.
  React.useEffect(() => {
    if (!token) return;
    let cancel = false;
    setLoading(true);
    setError("");
    apiFetch(`/api/gestor/entries?${buildQuery({ page, limit: PAGE_SIZE })}`)
      .then((d) => {
        if (!cancel) setData({ rows: d.rows, total: d.total, pages: d.pages });
      })
      .catch((e) => {
        if (cancel) return;
        if (e.message === "unauthorized") logout();
        else setError(e.message);
      })
      .finally(() => !cancel && setLoading(false));
    return () => {
      cancel = true;
    };
  }, [token, filters, page, apiFetch, buildQuery, logout]);

  // Carga de estadísticas.
  React.useEffect(() => {
    if (!token) return;
    apiFetch("/api/gestor/stats")
      .then(setStats)
      .catch((e) => {
        if (e.message === "unauthorized") logout();
      });
  }, [token, apiFetch, logout]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await fetch(`${API_URL}/api/gestor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      const b = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(b.message || "No se pudo iniciar sesión.");
      localStorage.setItem(TOKEN_KEY, b.token);
      setToken(b.token);
      setCreds({ user: "", password: "" });
    } catch (err) {
      setLoginError(
        err.message === "Failed to fetch"
          ? "No se pudo conectar con el servidor."
          : err.message
      );
    } finally {
      setLoggingIn(false);
    }
  };

  const setFilter = (name, value) =>
    setFilters((f) => {
      const next = { ...f, [name]: value };
      if (name === "departamento") next.municipio = "";
      return next;
    });

  React.useEffect(() => setPage(1), [filters]);

  const clearFilters = () => {
    setSearchInput("");
    setFilters(emptyFilters);
    setPage(1);
  };

  const exportXlsx = async () => {
    setExporting(true);
    try {
      const { rows } = await apiFetch(`/api/gestor/entries?${buildQuery({ all: 1 })}`);
      const sheet = rows.map((r) => ({
        Nombre: r.nombre,
        Apellidos: r.apellidos,
        "Tipo Doc": r.tipoDocumento,
        Documento: r.cedula,
        Teléfono: r.telefono,
        Sexo: r.sexo,
        "Fecha Nacimiento": fmtDob(r.fechaNacimiento),
        Dirección: r.direccion,
        Departamento: r.departamento,
        Municipio: r.municipio,
        "Sector Económico": r.sectorEconomico,
        "Cédula Líder": r.liderPolitico,
        "Fecha Registro": fmtDate(r.createdAt),
      }));
      const ws = XLSX.utils.json_to_sheet(sheet);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Registros");
      const stamp = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `coomsocial-registros-${stamp}.xlsx`);
    } catch (e) {
      if (e.message === "unauthorized") logout();
      else setError(e.message);
    } finally {
      setExporting(false);
    }
  };

  const copyLeaderLink = async (cedula) => {
    const url = `${window.location.origin}/registro?leaderid=${cedula}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (e) {
      window.prompt("Copia el enlace del líder:", url);
    }
    setCopied(cedula);
    setTimeout(() => setCopied((c) => (c === cedula ? "" : c)), 2500);
  };

  // ================= LOGIN =================
  if (!token) {
    return (
      <div className="gestor-login">
        <form className="gestor-login__card" onSubmit={handleLogin}>
          <div className="gestor-login__icon">
            <FaLock />
          </div>
          <h1>Panel de gestión</h1>
          <p className="gestor-login__sub">Acceso restringido</p>

          <div className="gestor-login__field">
            <FaUser />
            <input
              type="text"
              placeholder="Usuario"
              value={creds.user}
              onChange={(e) => setCreds({ ...creds, user: e.target.value })}
              autoComplete="username"
            />
          </div>
          <div className="gestor-login__field">
            <FaLock />
            <input
              type="password"
              placeholder="Contraseña"
              value={creds.password}
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              autoComplete="current-password"
            />
          </div>

          {loginError && <p className="gestor-login__error">{loginError}</p>}

          <button type="submit" disabled={loggingIn}>
            {loggingIn ? <FaSpinner className="gestor-spin" /> : "Ingresar"}
          </button>
          <RouterLink to="/" className="gestor-login__back">
            <FaArrowLeft /> Volver al inicio
          </RouterLink>
        </form>
      </div>
    );
  }

  // ================= DASHBOARD =================
  return (
    <div className="gestor">
      <header className="gestor__nav">
        <div className="gestor__brand">
          <RouterLink to="/">
            <img src="/images/coomsocial-isotipo.png" alt="COOMSOCIAL" />
          </RouterLink>
          <span>Panel de gestión</span>
        </div>
        <button className="gestor__logout" onClick={logout}>
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </header>

      <main className="gestor__main">
        {/* ---- Estadísticas resumen ---- */}
        <section className="gestor__stats">
          <div className="gstat gstat--total">
            <div className="gstat__icon">
              <FaUsers />
            </div>
            <div>
              <div className="gstat__value">{stats ? stats.total : "…"}</div>
              <div className="gstat__label">Total de registros</div>
            </div>
          </div>

        </section>

        {/* ---- Estadísticas sector and birthday ---- */}
        <section className="gstat-grid" style={{ marginBottom: "2rem" }}>
          <div className="gstat gstat--wide">
            <div className="gstat__head">
              <FaChartPie /> Personas por sector económico
            </div>
            <ul className="gstat__list">
              {stats && stats.bySector.length ? (
                stats.bySector.map((s) => (
                  <li key={s.sector}>
                    <span className="gstat__name" title={s.sector}>
                      {s.sector}
                    </span>
                    <span className="gstat__count">{s.count}</span>
                  </li>
                ))
              ) : (
                <li className="gstat__empty">Sin datos</li>
              )}
            </ul>
          </div>

          <div className="gstat gstat--wide">
            <div className="gstat__head">
              <FaBirthdayCake /> Próximos cumpleaños
            </div>
            <ul className="gstat__list">
              {stats && stats.upcomingBirthdays.length ? (
                stats.upcomingBirthdays.map((b, i) => (
                  <li key={i}>
                    <span className="gstat__name">{b.nombre}</span>
                    <span className="gstat__count gstat__count--soft">
                      {fmtDob(b.fechaNacimiento).slice(0, 5)}
                      {b.days === 0
                        ? " · ¡hoy!"
                        : b.days === 1
                          ? " · mañana"
                          : ` · en ${b.days} días`}
                    </span>
                  </li>
                ))
              ) : (
                <li className="gstat__empty">Sin fechas registradas</li>
              )}
            </ul>
          </div>
        </section>

        {/* ---- Filtros ---- */}
        <section className="gestor__filters">
          <div className="gestor__search">
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar por nombre, documento o teléfono…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <select
            value={filters.departamento}
            onChange={(e) => setFilter("departamento", e.target.value)}
          >
            <option value="">Departamento (todos)</option>
            {departamentos.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={filters.municipio}
            onChange={(e) => setFilter("municipio", e.target.value)}
            disabled={!filters.departamento}
          >
            <option value="">Municipio (todos)</option>
            {municipios.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={filters.sectorEconomico}
            onChange={(e) => setFilter("sectorEconomico", e.target.value)}
          >
            <option value="">Sector (todos)</option>
            {optionsEconomicSector.map((o) => (
              <option key={o.key} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={filters.sexo}
            onChange={(e) => setFilter("sexo", e.target.value)}
          >
            <option value="">Sexo (todos)</option>
            {optionsSexo.map((o) => (
              <option key={o.key} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button className="gestor__clear" onClick={clearFilters}>
            Limpiar
          </button>
          <button
            className="gestor__export"
            onClick={exportXlsx}
            disabled={exporting}
          >
            {exporting ? <FaSpinner className="gestor-spin" /> : <FaFileExcel />}
            Exportar XLSX
          </button>
        </section>

        {error && <p className="gestor__error">{error}</p>}

        {/* ---- Tabla ---- */}
        <section className="gestor__table-wrap">
          <table className="gestor__table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Sexo</th>
                <th>F. Nac.</th>
                <th>Departamento</th>
                <th>Municipio</th>
                <th>Sector</th>
                <th>Líder</th>
                <th>Registro</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="gestor__loading">
                    <FaSpinner className="gestor-spin" /> Cargando…
                  </td>
                </tr>
              ) : data.rows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="gestor__loading">
                    No hay registros que coincidan.
                  </td>
                </tr>
              ) : (
                data.rows.map((r) => (
                  <tr key={r._id}>
                    <td>
                      {r.nombre} {r.apellidos}
                    </td>
                    <td>
                      <span className="gestor__doc">{r.tipoDocumento}</span>
                      {" "}{r.cedula}
                    </td>
                    <td>{r.telefono}</td>
                    <td>{r.sexo}</td>
                    <td>{fmtDob(r.fechaNacimiento)}</td>
                    <td>{r.departamento}</td>
                    <td>{r.municipio}</td>
                    <td className="gestor__sector" title={r.sectorEconomico}>
                      {r.sectorEconomico}
                    </td>
                    <td>{r.liderPolitico || "—"}</td>
                    <td>{fmtDate(r.createdAt)}</td>
                    <td>
                      <button
                        className="gestor__linkbtn"
                        onClick={() => copyLeaderLink(r.cedula)}
                        title="Copiar enlace de registro con esta cédula como líder"
                      >
                        {copied === r.cedula ? (
                          <>
                            <FaCheck /> Copiado
                          </>
                        ) : (
                          <>
                            <FaLink /> Link líder
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* ---- Paginación ---- */}
        <div className="gestor__pagination">
          <span>
            {data.total} registro{data.total === 1 ? "" : "s"} · página {page} de{" "}
            {data.pages}
          </span>
          <div className="gestor__pager">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <FaChevronLeft /> Anterior
            </button>
            <button
              disabled={page >= data.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente <FaChevronRight />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GestorPage;
