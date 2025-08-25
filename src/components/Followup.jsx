import React, { useEffect, useState } from "react";
import "../styles/Followup.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPills, FaUserMd } from "react-icons/fa";
import axios from "axios";

const Followup = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);

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

  // ✅ Marcar recordatorio como completado
  const handleToggleCompleted = async (id, currentState) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/reminders/${id}/completed`,
        { completed: !currentState },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizamos solo ese reminder en el estado
      setReminders((prev) =>
        prev.map((r) => (r._id === id ? { ...r, completed: res.data.completed, completedAt: res.data.completedAt } : r))
      );
    } catch (error) {
      console.error("❌ Error al marcar completado:", error);
    }
  };

  return (
    <div className="followup-container">
      {/* Barra superior */}
      <header className="followup-header">
        <button className="followup-back" onClick={() => navigate("/home")}>
          <FaArrowLeft />
        </button>
        <h1 className="followup-title">Seguimiento a paciente</h1>
      </header>

      {/* Lista de recordatorios estilo tarjeta */}
      <main className="followup-main">
        {reminders.length === 0 ? (
          <p className="followup-no-data">No hay recordatorios</p>
        ) : (
          <ul className="followup-list">
            {reminders.map((reminder) => (
              <li
                key={reminder._id}
                className={`followup-card ${reminder.completed ? "completed" : ""}`}
              >
                <div className="followup-left">
                  {/* Ícono dinámico */}
                  {reminder.tipo === "medicamento" ? (
                    <FaPills className="followup-icon" />
                  ) : (
                    <FaUserMd className="followup-icon" />
                  )}
                </div>

                <div className="followup-info">
                  <h3 className="followup-reminder-title">{reminder.titulo}</h3>
                  <p className="followup-description">{reminder.descripcion}</p>

                  {reminder.cantidadDisponible !== undefined && (
                    <p className="followup-small">
                      <b>Cantidad:</b> {reminder.cantidadDisponible} {reminder.unidad}
                    </p>
                  )}

                  {/* ✅ Mostrar horarios si existen */}
                  {reminder.horarios &&
                    reminder.horarios.length > 0 &&
                    reminder.horarios.map((horaStr, index) => (
                      <p key={index} className="followup-small">
                        ⏰ {horaStr}
                      </p>
                    ))}

                  {/* ✅ Mostrar fecha */}
                  {reminder.fecha && (
                    <p className="followup-small">
                      📅 {new Date(reminder.fecha).toLocaleDateString("es-CO")}
                    </p>
                  )}

                  {/* ✅ Mostrar frecuencia */}
                  {reminder.frecuencia && (
                    <p className="followup-frequency">{reminder.frecuencia}</p>
                  )}

                  {/* ✅ Mostrar fecha de completado si existe */}
                  {reminder.completed && reminder.completedAt && (
                    <p className="followup-completed">
                      ✔️ Completado el{" "}
                      {new Date(reminder.completedAt).toLocaleString("es-CO")}
                    </p>
                  )}
                </div>

                <div className="followup-right">
                  <p className="followup-question">
                    {reminder.tipo === "medicamento"
                      ? "¿Lo tomaste?"
                      : "¿Asistió?"}
                  </p>
                  <label className="followup-switch">
                    <input
                      type="checkbox"
                      checked={reminder.completed || false}
                      onChange={() =>
                        handleToggleCompleted(reminder._id, reminder.completed)
                      }
                    />
                    <span className="followup-slider"></span>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Followup;
