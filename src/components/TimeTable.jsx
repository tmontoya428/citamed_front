import React, { useState } from 'react';
import '../styles/TimeTable.css';

function TimeTable({ onClose, onConfirm }) {
  const [selectedTimes, setSelectedTimes] = useState([]);

  const amHours = Array.from({ length: 12 }, (_, i) => {
    const hour = i === 0 ? 12 : i;
    return `${hour}:00 AM`;
  });

  const pmHours = Array.from({ length: 12 }, (_, i) => {
    const hour = i === 0 ? 12 : i;
    return `${hour}:00 PM`;
  });

  const toggleTimeSelection = (time) => {
    setSelectedTimes(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      } else {
        return [...prev, time];
      }
    });
  };

  const handleConfirm = () => {
    if (time) {
      // 🔹 Convierte la hora de 24h → 12h con AM/PM
      const [hours, minutes] = time.split(":");
      let hour = parseInt(hours, 10);
      let period = "AM";

      if (hour >= 12) {
        period = "PM";
        if (hour > 12) hour -= 12;
      } else if (hour === 0) {
        hour = 12;
      }

      const formattedTime = `${hour}:${minutes} ${period}`;

      // 🔹 Devuelve al padre un array (para que encaje con ReminderFrequency)
      onConfirm([formattedTime]);
      onClose();
    }
  };

  return (
    <div className="time-table-overlay">
      <div className="time-table-container">
        <div className="time-table-header">
          <h2>Seleccionar Horarios</h2>
          <button className="time-table-close" onClick={onClose}>✕</button>
        </div>

        <div className="time-periods">
          <div className="period-column">
            <div className="period-title">AM</div>
            <div className="time-slots">
              {amHours.map((time) => (
                <div
                  key={time}
                  className={`time-slot ${selectedTimes.includes(time) ? 'selected' : ''}`}
                  onClick={() => toggleTimeSelection(time)}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>

          <div className="period-column">
            <div className="period-title">PM</div>
            <div className="time-slots">
              {pmHours.map((time) => (
                <div
                  key={time}
                  className={`time-slot ${selectedTimes.includes(time) ? 'selected' : ''}`}
                  onClick={() => toggleTimeSelection(time)}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="time-table-actions">
          <button className="time-table-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="time-table-confirm"
            onClick={handleConfirm}
            disabled={!time}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimeTable;
