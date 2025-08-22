import React, { useState } from 'react';
import '../styles/TimeTable.css';

function TimeTable({ onClose, onConfirm }) {
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
    onConfirm(selectedTimes);
    onClose();
  };

  return (
    <div className="time-table-overlay">
      <div className="time-table-container">
        <div className="time-table-header">
          <h2>Seleccionar Horarios (24h)</h2>
          <button className="time-table-close" onClick={onClose}>✕</button>
        </div>

        <div className="time-slots">
          {allTimes.map((time) => (
            <div
              key={time}
              className={`time-slot ${selectedTimes.includes(time) ? "selected" : ""}`}
              onClick={() => toggleTimeSelection(time)}
            >
              {time}
            </div>
          ))}
        </div>

        <div className="time-table-actions">
          <button className="time-table-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="time-table-confirm"
            onClick={handleConfirm}
            disabled={selectedTimes.length === 0}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimeTable;