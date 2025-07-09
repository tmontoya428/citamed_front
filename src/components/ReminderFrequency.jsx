import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle, FaClock, FaTimes } from 'react-icons/fa';
import '../styles/ReminderFrequency.css';
import TimeTable from './TimeTable';

function ReminderFrequency() {
  const navigate = useNavigate();
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [showTimeTable, setShowTimeTable] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState([]);

  const handleBack = () => {
    navigate('/reminder-medicine'); // ruta previa
  };

  const handleNext = () => {
    navigate('/reminder-created'); // próxima ruta
  };

  const handleFrequencySelect = (frequency) => {
    setSelectedFrequency(frequency);
  };

  const handleTimeSelect = (times) => {
    setSelectedTimes(times.sort((a, b) => {
      // Convertir las horas a formato de 24 horas para ordenar
      const getHours = (time) => {
        const [hour, period] = time.split(' ');
        const [h] = hour.split(':');
        let hours = parseInt(h);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours;
      };
      return getHours(a) - getHours(b);
    }));
  };

  const removeTime = (timeToRemove) => {
    setSelectedTimes(prev => prev.filter(time => time !== timeToRemove));
  };

  return (
    <>
      <nav className="bottom">
        <button className="nav-button" onClick={handleBack}>
          <FaArrowLeft />
        </button>
        <h1>CITAMED</h1>
      </nav>

      <div className="frequency-box">
        <div className="frequency-title-bar">
          <h2>Crear recordatorio de Medicamentos</h2>
          <button className="reminder-close-btn" onClick={handleBack}>✕</button>
        </div>

        <div className="frequency-content">
          <h3>Selecciona la frecuencia del recordatorio</h3>

          <div className="frequency-options">
            <button 
              className={`frequency-btn ${selectedFrequency === 'diaria' ? 'selected' : ''}`}
              onClick={() => handleFrequencySelect('diaria')}
            >
              Diaria
            </button>
            <button 
              className={`frequency-btn ${selectedFrequency === 'semanal' ? 'selected' : ''}`}
              onClick={() => handleFrequencySelect('semanal')}
            >
              Semanal
            </button>
            <button 
              className={`frequency-btn ${selectedFrequency === 'personalizada' ? 'selected' : ''}`}
              onClick={() => handleFrequencySelect('personalizada')}
            >
              Personalizada
            </button>
          </div>

          <p className="frequency-note">
            <FaInfoCircle /> Las notificaciones serán según los horarios establecidos.
          </p>

          <button 
            className="set-time-btn"
            onClick={() => setShowTimeTable(true)}
          >
            Establecer horario
          </button>

          {selectedTimes.length > 0 && (
            <div className="selected-times">
              <div className="selected-times-header">
                <FaClock /> Horarios seleccionados:
              </div>
              <div className="selected-times-list">
                {selectedTimes.map((time) => (
                  <div key={time} className="time-chip">
                    <span>{time}</span>
                    <button 
                      className="remove-time-btn"
                      onClick={() => removeTime(time)}
                      title="Eliminar hora"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="frequency-nav">
            <button className="back-btn" onClick={handleBack}>
              <FaArrowLeft /> Volver
            </button>
            <button 
              className="continue-btn" 
              onClick={handleNext}
              disabled={selectedTimes.length === 0}
            >
              CONTINUAR &rsaquo;
            </button>
          </div>
        </div>
      </div>

      {showTimeTable && (
        <TimeTable
          onClose={() => setShowTimeTable(false)}
          onConfirm={handleTimeSelect}
        />
      )}
    </>
  );
}

export default ReminderFrequency;
