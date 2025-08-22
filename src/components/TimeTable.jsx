import React, { useState } from 'react';
import '../styles/TimeTable.css';

function TimeTable({ onClose, onConfirm }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

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
          <h2>Seleccionar Hora</h2>
          <button className="time-table-close" onClick={onClose}>✕</button>
        </div>

        <div className="time-picker">
          <label>⏰ Hora</label>
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            required
          />
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
