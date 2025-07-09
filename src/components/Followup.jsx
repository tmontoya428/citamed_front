import React from "react";
import "../styles/Followup.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Followup = () => {
  const navigate = useNavigate();

  return (
    <div className="container-follow">
      {/* Barra superior */}
      <header className="header-container">
        <button className="back-button-home" onClick={() => navigate("/home")}>
          <FaArrowLeft />
        </button>
      </header>

      {/* Barra de navegación inferior */}
      <nav className="botton-nav">
        <button className="button" onClick={() => navigate("/home")}>
          <FaArrowLeft />
        </button>
        <h1 className="header-title">Seguimiento a paciente</h1>
      </nav>
    </div>
  );
};

export default Followup;
