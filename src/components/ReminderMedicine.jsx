import React from 'react';
import '../styles/ReminderMedicine.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';

function ReminderMedicine() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/reminder');
  };

  return (
    <>
      <nav className="bottom">
        <button className="nav-button" onClick={handleBack}>
          <FaArrowLeft />
        </button>
        <h1>CITAMED</h1>
      </nav>

      <div className="reminder-medicine-content">
        <div className="reminder-banner">
          <h2>Crear recordatorio de Medicamentos</h2>
          <button className="reminder-close-btn" onClick={handleBack}>✕</button>
        </div>

        <form className="reminder-form">
          <label className="reminder-label">Medicamento</label>
          <input type="text" placeholder="Nombre del recordatorio" className="reminder-input" />

          <label className="reminder-label">Descripción</label>
          <textarea className="reminder-textarea"></textarea>

          <p className="reminder-note">
            <FaInfoCircle /> Este texto se mostrará en la notificación. Ej: Tomar el medicamento con jugo de naranja.
          </p>

          <div className="reminder-row">
            <label>Dosis a tomar:</label>
            <input type="number" className="reminder-small-input" />
          </div>

          <div className="reminder-row">
            <label>Unidad(s):</label>
            <span className="reminder-units">Unidades &gt;</span>
          </div>

          <div className="reminder-row">
            <label>Cantidad disponible:</label>
            <input type="number" className="reminder-small-input" /> Unidades
          </div>

          <p className="reminder-note">
            <FaInfoCircle /> Unidades disponibles del medicamento
          </p>

        <button type="submit" className="reminder-submit-btn" onClick={() => navigate("/reminder-frequency")}>
            Continuar
        </button>
        </form>
      </div>
    </>
  );
}

export default ReminderMedicine;
