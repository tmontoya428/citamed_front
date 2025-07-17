import React, { useState } from 'react';
import '../styles/ReminderMedicine.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';

function ReminderMedicine() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [dosis, setDosis] = useState('');
  const [unidad, setUnidad] = useState('Unidades');
  const [cantidadDisponible, setCantidadDisponible] = useState('');

  const handleBack = () => {
    navigate('/reminder');
  };

  const handleNext = (e) => {
    e.preventDefault();

    const formData = {
      titulo,
      descripcion,
      dosis,
      unidad,
      cantidadDisponible,
    };

    navigate("/reminder-frequency", { state: formData });
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

        <form className="reminder-form" onSubmit={handleNext}>
          <label className="reminder-label">Medicamento</label>
          <input type="text" className="reminder-input" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />

          <label className="reminder-label">Descripción</label>
          <textarea className="reminder-textarea" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required></textarea>

          <p className="reminder-note">
            <FaInfoCircle /> Este texto se mostrará en la notificación.
          </p>

          <div className="reminder-row">
            <label>Dosis a tomar:</label>
            <input type="number" className="reminder-small-input" value={dosis} onChange={(e) => setDosis(e.target.value)} required />
          </div>

          <div className="reminder-row">
            <label>Unidad(s):</label>
            <span className="reminder-units">{unidad}</span>
          </div>

          <div className="reminder-row">
            <label>Cantidad disponible:</label>
            <input type="number" className="reminder-small-input" value={cantidadDisponible} onChange={(e) => setCantidadDisponible(e.target.value)} required /> Unidades
          </div>

          <p className="reminder-note">
            <FaInfoCircle /> Unidades disponibles del medicamento
          </p>

          <button type="submit" className="reminder-submit-btn">
            Continuar
          </button>
        </form>
      </div>
    </>
  );
}

export default ReminderMedicine;
