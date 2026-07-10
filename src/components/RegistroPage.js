import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import RegistrationForm from "./RegistrationForm";
import "./RegistroPage.css";

const RegistroPage = () => {
  // Al entrar a la ruta, asegurar que la vista arranque arriba.
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="registro-page">
      <header className="registro-page__nav">
        <RouterLink to="/" className="registro-page__brand">
          <img src="/images/coomsocial-isotipo.png" alt="COOMSOCIAL" />
          <span>COOMSOCIAL</span>
        </RouterLink>
        <RouterLink to="/" className="registro-page__back">
          <FaArrowLeft /> Volver al inicio
        </RouterLink>
      </header>

      <main className="registro-page__main">
        <RegistrationForm light />
      </main>
    </div>
  );
};

export default RegistroPage;
