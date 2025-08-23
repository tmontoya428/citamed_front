import React, { useState } from 'react';
import '../styles/TimeTable.css';

function TimeTable({ onClose, onConfirm }) {

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [selectedTimes, setSelectedTimes] = useState([]);

  // Genera horas en formato 24h (00:00 → 23:55)
  const generateTimes = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 5) {
        const hour = h.toString().padStart(2, "0");
        const minutes = m.toString().padStart(2, "0");
        times.push(`${hour}:${minutes}`);
      }
    }
    return times;
  };

  const allTimes = generateTimes();

  const toggleTimeSelection = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
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
