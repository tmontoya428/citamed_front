import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaFileAlt, FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Home.css";
import axios from "axios";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // 🔐 Redirige al login si no hay token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // 🚫 Evita volver atrás con el navegador
  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBack);
    return () => window.removeEventListener("popstate", preventBack);
  }, []);

  // 📱 Detectar cambio de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Cerrar menú al cambiar a desktop
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 📥 Traer recordatorios desde el backend
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reminders", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setReminders(res.data || []);
      } catch (err) {
        console.error("❌ Error al traer recordatorios:", err);
      }
    };
    fetchReminders();
  }, []);

  // ✅ Helpers para comparar SOLO la fecha local (YYYY-MM-DD)
  const toLocalDateString = (date) => {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const getReminderDate = (rem) => {
    const raw = rem.fecha || rem.Fecha;
    if (!raw) return null;
    const d = new Date(raw);
    if (isNaN(d)) return null;
    return toLocalDateString(d);
  };

  // 📌 Filtrar recordatorios por fecha seleccionada
  const selectedISO = toLocalDateString(selectedDate);
  const filteredReminders = reminders.filter((rem) => {
    const remISO = getReminderDate(rem);
    return remISO === selectedISO;
  });

  // 🔑 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.clear();
    navigate("/login", { replace: true });
    window.location.reload();
  };

  // 📱 Toggle del menú hamburguesa
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Encabezado */}
      <header className="flex justify-between items-center bg-blue-500 text-white p-4 rounded-lg shadow-md main-header">
        <h1 className="text-xl font-bold control">Mi Control Médico</h1>
        
        {/* Botón de menú hamburguesa (solo móviles) */}
        {isMobile && (
          <button className="hamburger-btn" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}
        
        {/* Grupo de botones (escritorio) */}
        {!isMobile && (
          <div className="button-group desktop-buttons">
            <button className="button-profile" onClick={() => navigate("/profile")}>
              <FaUserCircle size={24} />
            </button>
            <button className="button-close" onClick={handleLogout}>
              <FaSignOutAlt size={28} />
            </button>
          </div>
        )}
      </header>
      
      {/* Menú móvil (solo se muestra en móviles cuando está abierto) */}
      {isMobile && (
        <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
          <button 
            className="mobile-menu-btn" 
            onClick={() => { navigate("/profile"); setIsMenuOpen(false); }}
          >
            Mi Perfil
          </button>
          <button 
            className="mobile-menu-btn" 
            onClick={() => { handleLogout(); setIsMenuOpen(false); }}
          >
            Cerrar Sesión
          </button>
        </div>
      )}

      {/* Calendario */}
      <section className="bg-gray-100 p-4 my-6 rounded-lg text-center shadow-sm">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="mx-auto calendar-custom"
        />
      </section>

      {/* Recordatorios filtrados */}
      <section className="resumen-container mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Recordatorios del {selectedDate.toLocaleDateString()}
        </h2>
        {filteredReminders.length > 0 ? (
          <ul className="space-y-2">
            {filteredReminders.map((rem) => (
              <li
                key={rem._id}
                className="bg-white p-3 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{rem.titulo}</h3>
                  <p className="text-sm text-gray-600">
                    Descripción: {rem.descripcion}
                  </p>
                  <span className="text-xs text-blue-500">
                    Frecuencia: {rem.frecuencia}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  ⏰{Array.isArray(rem.horarios) ? rem.horarios.join(", ") : "—"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay recordatorios para este día</p>
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
            <FaBell className="text-3xl mx-auto text-blue-600 bell-icon" />
            <h3 className="font-bold mt-2">Recordatorios</h3>
            <p className="text-sm text-gray-600">
              Para medicación, pastillas, etc.
            </p>
          </div>

          <div
            className="bg-gray-200 hover:bg-gray-300 transition p-4 rounded-lg text-center cursor-pointer shadow"
            onClick={() => navigate("/follow-up")}
          >
            <FaFileAlt className="text-3xl mx-auto text-green-600" />
            <h3 className="font-bold mt-2">Seguimiento a paciente</h3>
            <p className="text-sm text-gray-600">
              Cumplimiento de tratamiento
            </p>
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