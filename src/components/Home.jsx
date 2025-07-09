import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaFileAlt } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Home.css";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  // para que no pueda ingresara  ninguna pagina sin iniciar sesion, siempre redirigido al login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Evita devolverse de las flechitas a pestañas que se muestren cuando se inicia sesion 
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.clear();
    navigate("/login", { replace: true });
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-blue-500 text-white p-4 rounded-lg">
        <h1 className="control">Mi Control Médico</h1>
        <button className="button-close" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </header>

      {/* Calendar */}
      <div className="bg-gray-100 p-4 my-4 rounded-lg text-center">
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate} 
          className="mx-auto" 
        />
        <p className="recordatorio">No hay recordatorios pendientes para este día</p>
      </div>

      {/* Resumen Médico */}
      <div className="resumen-container">
        <h2>Mi resumen médico</h2>
        <p>No hay datos para mostrar</p>
      </div>

      {/* Herramientas y Utilidades */}
      <div>
        <h2 className="titulo-h2">Herramientas y Utilidades</h2>
        <div className="grid grid-cols-2 gap-4">
          <div 
            className="bg-gray-200 p-4 rounded-lg text-center cursor-pointer relative"
            onClick={() => navigate("/reminder")}
          >
            <FaBell className="bell-icon" />
            <h3 className="font-bold mt-2">Recordatorios</h3>
            <p className="text-sm">Para medicación, pastillas, etc.</p>
          </div>

          <div 
            className="bg-gray-200 p-4 rounded-lg text-center cursor-pointer"
            onClick={() => navigate("/follow-up")}
          >
            <FaFileAlt className="text-3xl mx-auto" />
            <h3 className="font-bold mt-2">Seguimiento a paciente</h3>
            <p className="text-sm">Cumplimiento de tratamiento</p>
          </div>
        </div>
      </div>

      {/* Imagen de Seguimiento */}
      <div className="text-center mt-6">
        <img src="/public/citas.avif" alt="Seguimiento y cumplimiento" className="img" />
      </div>
    </div>
  );
};

export default Home;