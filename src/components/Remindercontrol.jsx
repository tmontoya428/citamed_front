import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import '../styles/Remindercontrol.css';

const Remindercontrol = () => {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [frecuencia, setFrecuencia] = useState('');

  const irAReminder = () => {
    navigate('/reminder');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ titulo, descripcion, frecuencia });
    setTitulo('');
    setDescripcion('');
    setFrecuencia('');
  };

  return (
    <>
      {/* Navbar superior */}
      <nav className="bottom">
        <button className="nav-button" onClick={irAReminder}>
          <FaArrowLeft />
        </button>
        <h1>CITAMED</h1>
      </nav>

      {/* Contenedor con scroll */}
      <main>
        <div className="remindercontrol-container">
          <div className="remindercontrol-banner">
            <h2 className="remindercontrol-subtitle">Crear recordatorio de control</h2>
          </div>

          <form className="remindercontrol-form" onSubmit={handleSubmit}>
            <label htmlFor="titulo" className="remindercontrol-label">Título</label>
            <input
              type="text"
              id="titulo"
              className="remindercontrol-input"
              placeholder="Nombre del recordatorio"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />

            <label htmlFor="descripcion" className="remindercontrol-label">Descripción</label>
            <textarea
              id="descripcion"
              className="remindercontrol-textarea"
              placeholder="Descripción del recordatorio"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            ></textarea>

            <p className="remindercontrol-frecuencia-label">Selecciona la frecuencia del recordatorio</p>

            <div className="remindercontrol-frecuencia-buttons">
              {['Diaria', 'Semanal', 'Personalizada'].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  className={`remindercontrol-frecuencia-btn ${frecuencia === freq ? 'selected' : ''}`}
                  onClick={() => setFrecuencia(freq)}
                >
                  {freq}
                </button>
              ))}
            </div>

            <p className="remindercontrol-info">
              <span>❗</span> Las notificaciones serán según los horarios establecidos
            </p>

            <button type="submit" className="remindercontrol-submit">Guardar</button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Remindercontrol;
