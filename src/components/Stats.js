import React from "react";
import { FaUsers, FaBirthdayCake, FaDollarSign, FaStar } from "react-icons/fa";

const stats = [
  { id: 1, icon: <FaUsers />, value: "1,000+", label: "Miembros Activos" },
  { id: 2, icon: <FaBirthdayCake />, value: "500+", label: "Cumpleaños Organizados" },
  { id: 3, icon: <FaDollarSign />, value: "$50M+", label: "En Comisiones Pagadas" },
  { id: 4, icon: <FaStar />, value: "98%", label: "Satisfacción de Clientes" },
];

const Stats = () => {
  return (
    <section className="stats" id="stats">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">Logros Alcanzados</h2>
          <p className="section__subtitle">Resultados que hablan por sí solos</p>
        </div>

        <div className="stats__grid">
          {stats.map((s) => (
            <div className="stat" key={s.id}>
              <div className="stat__icon">{s.icon}</div>
              <div className="stat__value">{s.value}</div>
              <div className="stat__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
