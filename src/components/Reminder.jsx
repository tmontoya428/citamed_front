import React, { useState } from "react";
import "../styles/Reminder.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaHistory, FaPlus, FaUsers, FaPills, FaTimes } from "react-icons/fa";

const Reminder = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => setShowOptions(!showOptions);
  const irARecordatorio = () => {
    navigate('/create-reminder');

  };

  return (
    <div className="container">

      {/* Contenido principal */}
      <main className="main-content">
        <p className="no-data">No data to display</p>
      </main>

      {/* Botón flotante con opciones */}
      <div className="fab-container">
        {showOptions && (
          <div className="fab-options">
            <button className="fab-option" onClick={irARecordatorio}>
              <FaUsers /> Recordatorio de control
            </button>
      <button className="fab-option" onClick={() => navigate('/reminder-medicine')}>
          <FaPills /> Recordatorio de medicamentos
      </button>
          </div>
        )}
        <button className="fab-main" onClick={toggleOptions}>
          {showOptions ? <FaTimes /> : <FaPlus />}
        </button>
      </div>

      {/* Barra inferior */}
      <nav className="bottom-nav">
      <button className="back-button" onClick={() => navigate("/home")}>
          <FaArrowLeft />
        </button>
        <h1>RECORDATORIOS</h1>
        <button className="nav-button">
          <FaCalendarAlt /> Calendar
        </button>
        <button className="nav-button">
          <FaHistory /> Records
        </button>
        <button className="nav-button" onClick={() => navigate("/home")}>
          <FaArrowLeft /> Return
        </button>
      </nav>
    </div>
  );
};

export default Reminder;
