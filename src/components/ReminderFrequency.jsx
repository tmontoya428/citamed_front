import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle, FaClock, FaTimes } from 'react-icons/fa';
import '../styles/ReminderFrequency.css';
import TimeTable from './TimeTable';

function ReminderFrequency() {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state || {};

  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [showTimeTable, setShowTimeTable] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [recommendedInterval, setRecommendedInterval] = useState(null);

  const handleBack = () => {
    navigate('/reminder-medicine');
  };

  const handleFrequencySelect = (frequency) => {
    setSelectedFrequency(frequency);
    setRecommendedInterval(null); // Reinicia al cambiar
  };

  const handleTimeSelect = (times) => {
    setSelectedTimes(
      times.sort((a, b) => {
        const getHours = (time) => {
          const [hour, period] = time.split(' ');
          const [h] = hour.split(':');
          let hours = parseInt(h);
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          return hours;
        };
        return getHours(a) - getHours(b);
      })
    );
  };

  const removeTime = (timeToRemove) => {
    setSelectedTimes((prev) => prev.filter((time) => time !== timeToRemove));
  };

  const handleNext = async () => {
    const token = localStorage.getItem('token');

    const reminder = {
      tipo: 'medicamento',
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      dosis: Number(formData.dosis),
      unidad: formData.unidad,
      cantidadDisponible: Number(formData.cantidadDisponible),
      frecuencia: selectedFrequency.charAt(0).toUpperCase() + selectedFrequency.slice(1),
      intervalo: recommendedInterval ? `${recommendedInterval} horas` : null,
      horarios: selectedTimes,
    };

    try {
      const res = await fetch('http://localhost:5000/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reminder),
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/reminder-created');
      } else {
        alert('❌ Error al guardar recordatorio: ' + data.message);
      }
    } catch (error) {
      console.error('🚨 Error al conectar con backend:', error);
      alert('No se pudo conectar con el servidor.');
    }
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
          <button className="reminder-close-btn" onClick={handleBack}>
            ✕
          </button>
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

          {/* ⚡️ Aquí aparece el letrero cuando selecciona "diaria" */}
          {selectedFrequency === 'personalizada' && (
            <div className="recommended-box">
              <p><FaInfoCircle /> Selecciona cada cuántas horas recomienda el doctor:</p>
              <div className="interval-options">
                {[4, 6, 8, 12, 24].map((hrs) => (
                  <button
                    key={hrs}
                    className={`interval-btn ${recommendedInterval === hrs ? 'selected' : ''}`}
                    onClick={() => setRecommendedInterval(hrs)}
                  >
                    Cada {hrs} horas
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="frequency-note">
            <FaInfoCircle /> Las notificaciones serán según los horarios establecidos.
          </p>

          <button className="set-time-btn" onClick={() => setShowTimeTable(true)}>
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
              disabled={selectedTimes.length === 0 || !selectedFrequency}
            >
              CONTINUAR &rsaquo;
            </button>
          </div>
        </div>
      </div>

      {showTimeTable && (
        <TimeTable onClose={() => setShowTimeTable(false)} onConfirm={handleTimeSelect} />
      )}
    </>
  );
}

export default ReminderFrequency;
