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
  const [customInterval, setCustomInterval] = useState('');

  const handleBack = () => navigate('/reminder-medicine');

  const handleFrequencySelect = freq => {
    setSelectedFrequency(freq);
    setCustomInterval('');
  };

  const handleTimeSelect = timesArray => {
    if (!Array.isArray(timesArray)) timesArray = [timesArray];
    setSelectedTimes(timesArray);
  };

  const removeTime = timeToRemove =>
    setSelectedTimes(prev => prev.filter(t => t !== timeToRemove));

  const handleNext = async () => {
    const token = localStorage.getItem('token');

    const reminder = {
      tipo: 'medicamento',
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      dosis: Number(formData.dosis),
      unidad: formData.unidad,
      cantidadDisponible: Number(formData.cantidadDisponible),
      fecha: formData.fecha,
      frecuencia: selectedFrequency.charAt(0).toUpperCase() + selectedFrequency.slice(1),
      horarios: selectedTimes,
      intervaloPersonalizado: selectedFrequency === 'personalizada' ? customInterval : null
    };

    try {
      const res = await fetch('http://localhost:5000/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(reminder),
      });

      const data = await res.json();
      if (res.ok) navigate('/reminder-created');
      else alert('❌ Error al guardar recordatorio: ' + data.message);
    } catch (error) {
      console.error('🚨 Error al conectar con backend:', error);
      alert('No se pudo conectar con el servidor.');
    }
  };

  return (
    <>
      <nav className="bottom">
        <button className="nav-button" onClick={handleBack}><FaArrowLeft /></button>
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
            {['diaria','semanal','personalizada'].map(freq => (
              <button
                key={freq}
                className={`frequency-btn ${selectedFrequency === freq ? 'selected' : ''}`}
                onClick={()=>handleFrequencySelect(freq)}
              >
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </button>
            ))}
          </div>

          {selectedFrequency === 'personalizada' && (
            <div className="custom-interval">
              <label>Intervalo personalizado:</label>
              <select value={customInterval} onChange={e => setCustomInterval(e.target.value)}>
                <option value="">--Seleccionar--</option>
                <option value="2min">Cada 2 minutos</option>
                <option value="2h">Cada 2 horas</option>
              </select>
              <p><FaInfoCircle /> Se usará la hora de inicio del recordatorio como primer envío.</p>
            </div>
          )}

          {selectedFrequency !== 'personalizada' && (
            <button className="set-time-btn" onClick={()=>setShowTimeTable(true)}>Establecer horario</button>
          )}

          {selectedTimes.length > 0 && (
            <div className="selected-times">
              <div className="selected-times-header"><FaClock /> Horarios seleccionados:</div>
              <div className="selected-times-list">
                {selectedTimes.map(time => (
                  <div key={time} className="time-chip">
                    <span>{time}</span>
                    <button className="remove-time-btn" onClick={()=>removeTime(time)} title="Eliminar hora"><FaTimes /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="frequency-nav">
            <button className="back-btn" onClick={handleBack}><FaArrowLeft /> Volver</button>
            <button
              className="continue-btn"
              onClick={handleNext}
              disabled={
                (selectedFrequency === 'personalizada' && !customInterval) ||
                (selectedFrequency !== 'personalizada' && selectedTimes.length === 0) ||
                !selectedFrequency
              }
            >
              CONTINUAR &rsaquo;
            </button>
          </div>
        </div>
      </div>

      {showTimeTable && selectedFrequency !== 'personalizada' && (
        <TimeTable onClose={()=>setShowTimeTable(false)} onConfirm={handleTimeSelect} />
      )}
    </>
  );
}

export default ReminderFrequency;
