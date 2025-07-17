import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaFileAlt } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Home.css";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  // Redirige al login si no hay token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Evita volver atrás usando las flechitas del navegador
  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBack);

    return () => {
      window.removeEventListener("popstate", preventBack);
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
        <p className="mt-4 text-gray-600">
          No hay recordatorios pendientes para este día
        </p>
      </section>

      {/* Resumen médico */}
      <section className="resumen-container mb-6">
        <h2 className="text-lg font-semibold mb-2">Mi resumen médico</h2>
        <p className="text-gray-500">No hay datos para mostrar</p>
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

      {/* Imagen ilustrativa */}
      <div className="text-center mt-8">
        <img 
          src="/public/citas.avif" 
          alt="Seguimiento y cumplimiento" 
          className="img mx-auto max-w-xs sm:max-w-sm rounded-lg shadow" 
        />
      </div>
    </div>
  );
};

export default Home;
