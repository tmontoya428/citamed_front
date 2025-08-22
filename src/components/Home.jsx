import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaFileAlt, FaTrash } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "../styles/Home.css";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  // Redirige al login si no hay token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  // Evita volver atrás usando las flechitas del navegador
  useEffect(() => {
    const preventBack = () => window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBack);
    return () => window.removeEventListener("popstate", preventBack);
  }, []);

  // Traer citas del backend
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (error) {
      console.error("❌ Error al traer citas:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Eliminar cita
  const deleteAppointment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter(a => a._id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar cita:", error);
    }
  };

  // Filtrar citas por fecha seleccionada
  const filteredAppointments = appointments.filter(app => {
    const appDate = new Date(app.fecha);
    return (
      appDate.getFullYear() === selectedDate.getFullYear() &&
      appDate.getMonth() === selectedDate.getMonth() &&
      appDate.getDate() === selectedDate.getDate()
    );
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.clear();
    navigate("/login", { replace: true });
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* Encabezado */}
      <header className="flex justify-between items-center bg-blue-500 text-white p-4 rounded-lg shadow-md">
        <h1 className="text-xl font-bold">Mi Control Médico</h1>
        <button className="button-close" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </header>

      {/* Calendario */}
      <section className="bg-gray-100 p-4 my-6 rounded-lg text-center shadow-sm">
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate} 
          className="mx-auto calendar-custom"
        />
      </section>

      {/* Resumen médico */}
      <section className="resumen-container mb-6">
        <h2 className="text-lg font-semibold mb-2">Mi resumen médico</h2>
        {filteredAppointments.length === 0 ? (
          <p className="text-gray-500">No hay datos para mostrar</p>
        ) : (
          <ul className="appointment-list">
            {filteredAppointments.map(app => (
              <li key={app._id} className="appointment-item">
                <div>
                  <strong>{app.titulo}</strong> - {app.descripcion || "Sin descripción"} <br />
                  {app.hora ? `Hora: ${app.hora}` : ""}
                </div>
                <button className="delete-button" onClick={() => deleteAppointment(app._id)}>
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Herramientas */}
      <section>
        <h2 className="titulo-h2 mb-4">Herramientas y Utilidades</h2>
        <div className="grid grid-cols-2 gap-4">
          <div 
            className="bg-gray-200 hover:bg-gray-300 transition p-4 rounded-lg text-center cursor-pointer shadow"
            onClick={() => navigate("/reminder")}
          >
            <FaBell className="text-3xl mx-auto text-blue-600" />
            <h3 className="font-bold mt-2">Recordatorios</h3>
            <p className="text-sm text-gray-600">Para medicación, pastillas, etc.</p>
          </div>

          <div 
            className="bg-gray-200 hover:bg-gray-300 transition p-4 rounded-lg text-center cursor-pointer shadow"
            onClick={() => navigate("/follow-up")}
          >
            <FaFileAlt className="text-3xl mx-auto text-green-600" />
            <h3 className="font-bold mt-2">Seguimiento a paciente</h3>
            <p className="text-sm text-gray-600">Cumplimiento de tratamiento</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
