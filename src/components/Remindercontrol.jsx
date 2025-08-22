import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import '../styles/Remindercontrol.css';

const Remindercontrol = () => {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [nuevoHorario, setNuevoHorario] = useState(""); // input de hora
  const [loading, setLoading] = useState(false);

  const irAReminder = () => {
    navigate('/reminder');
  };

  const handleAddHorario = () => {
    if (nuevoHorario && !horarios.includes(nuevoHorario)) {
      setHorarios([...horarios, nuevoHorario]);
      setNuevoHorario("");
    }
  };

  const handleRemoveHorario = (index) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!frecuencia) {
      alert('Por favor selecciona una frecuencia');
      return;
    }

    if (horarios.length === 0) {
      alert('Debes agregar al menos un horario');
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión nuevamente.");
      navigate("/login", { replace: true });
      return;
    }

    const reminder = { 
      tipo: "control", 
      titulo,
      fecha,
      descripcion, 
      frecuencia, 
      horarios 
    };

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reminder),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        console.log("✅ Recordatorio creado:", data);
        setTitulo('');
        setDescripcion('');
        setFrecuencia('');
        setHorarios([]);
        navigate("/reminder-created");
      } else {
        console.error("❌ Error al guardar recordatorio:", data.message);
        alert(`Hubo un problema al guardar: ${data.message}`);
      }
    } catch (error) {
      setLoading(false);
      console.error("🚨 Error en la conexión:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <>
      <nav className="bottom">
        <button className="nav-button" onClick={irAReminder}>
          <FaArrowLeft />
        </button>
        <h1>CITAMED</h1>
      </nav>

      <main>
        <div className="remindercontrol-container">
          <div className="remindercontrol-banner">
            <h2 className="remindercontrol-subtitle">Crear recordatorio de control</h2>
          </div>

          <form className="remindercontrol-form" onSubmit={handleSubmit}>
            <label className="remindercontrol-label">Título</label>
            <input
              type="text"
              className="remindercontrol-input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
            <label className="remindercontrol-label">Fecha de control</label>
            <input
              type="date"
              className="remindercontrol-fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />


            <label className="remindercontrol-label">Descripción</label>
            <textarea
              className="remindercontrol-textarea"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />

            <p className="remindercontrol-frecuencia-label">Frecuencia</p>
            <div className="remindercontrol-frecuencia-buttons">
              {['Diaria', 'Semanal', 'Personalizada'].map((freq) => (
                <button
                  type="button"
                  key={freq}
                  className={`remindercontrol-frecuencia-btn ${frecuencia === freq ? 'selected' : ''}`}
                  onClick={() => setFrecuencia(freq)}
                >
                  {freq}
                </button>
              ))}
            </div>

            <p className="remindercontrol-label">Horarios</p>
            <div className="remindercontrol-horarios">
              <input
                type="time"
                className='time'
                value={nuevoHorario}
                onChange={(e) => setNuevoHorario(e.target.value)}
              />
              <button type="button" onClick={handleAddHorario}>➕ Agregar</button>
            </div>

            <ul  className="horarios-list">
              {horarios.map((hora, i) => (
                <li key={i}>
                  {hora} <button type="button" onClick={() => handleRemoveHorario(i)}>❌</button>
                </li>
              ))}
            </ul>

            <p className="remindercontrol-info">❗ Las notificaciones serán según los horarios establecidos</p>

            <button
              type="submit"
              className="remindercontrol-submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Remindercontrol;
