import React, { useState, useEffect } from "react";
import "../styles/Reminder.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaHistory, FaPlus, FaUsers, FaPills, FaTimes, FaTrash } from "react-icons/fa";
import axios from "axios";

const Reminder = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [reminders, setReminders] = useState([]);

  const toggleOptions = () => setShowOptions(!showOptions);
  const irARecordatorio = () => navigate("/create-reminder");

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/reminders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(res.data);
    } catch (error) {
      console.error("❌ Error al traer recordatorios:", error);
    }
  };

  const eliminarRecordatorio = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(reminders.filter((r) => r._id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar recordatorio:", error);
    }
  };

  return (
    <div className="container">
      <main className="main-content">
        {reminders.length === 0 ? (
          <p className="no-data">No hay recordatorios</p>
        ) : (
          <ul className="reminder-list">
            {reminders.map((reminder) => (
              <li key={reminder._id} className="reminder-item">
                <div className="reminder-header">{reminder.titulo}</div>
                <div className="reminder-info">
                  <small><b>Descripción:</b>{reminder.descripcion}</small>
                  <small><b>Frecuencia:</b> {reminder.frecuencia}</small>

                  {/* Mostrar horarios */}
                  {reminder.horarios && reminder.horarios.length > 0 ? (
                    reminder.horarios.map((horaStr, index) => (
                      <div key={index} className="horario-item">
                        <small><b>Hora:</b> {horaStr}</small>
                        <small><b>Fecha:</b> {new Date(reminder.fecha).toLocaleDateString("es-CO")}</small>
                      </div>
                    ))
                  ) : (
                    reminder.fecha && (
                      <div className="horario-item">
                        <small><b>Hora:</b> {new Date(reminder.fecha).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</small>
                        <small><b>Fecha:</b> {new Date(reminder.fecha).toLocaleDateString("es-CO")}</small>
                      </div>
                    )
                  )}

                  {reminder.dosis && reminder.unidad && (
                    <small><b>Dosis:</b> {reminder.dosis} {reminder.unidad}</small>
                  )}
                  {reminder.cantidadDisponible !== undefined && (
                    <small><b>Cantidad disponible:</b> {reminder.cantidadDisponible}</small>
                  )}
                </div>
                <button className="delete-button" onClick={() => eliminarRecordatorio(reminder._id)}>
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <div className="fab-container">
        {showOptions && (
          <div className="fab-options">
            <button className="fab-option" onClick={irARecordatorio}>
              <FaUsers /> Recordatorio de control
            </button>
            <button className="fab-option" onClick={() => navigate("/reminder-medicine")}>
              <FaPills /> Recordatorio de medicamentos
            </button>
          </div>
        )}
        <button className="fab-main" onClick={toggleOptions}>
          {showOptions ? <FaTimes /> : <FaPlus />}
        </button>
      </div>

      <nav className="bottom-nav">
        <button className="back-button" onClick={() => navigate("/home")}><FaArrowLeft /></button>
        <h1>RECORDATORIOS</h1>
        <button className="nav-button" onClick={() => navigate("/home")}><FaCalendarAlt /> Calendar</button>
        <button className="nav-button" onClick={() => navigate("/reminder")}><FaHistory /> Records</button>
        <button className="nav-button" onClick={() => navigate("/home")}><FaArrowLeft /> Return</button>
      </nav>
    </div>
  );
};

export default Reminder;