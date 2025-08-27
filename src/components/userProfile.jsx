import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/userProfile.css'

export default function Profile() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); 
  const token = localStorage.getItem("token");

  // 🔹 Obtener info del usuario al cargar el componente
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/info-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error("❌ Error al traer la info:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchInfo();
  }, [token]);

  // 🔹 Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Guardar cambios en el backend
  const handleSave = async () => {
    try {
      const res = await axios.put("http://localhost:5000/api/info-user", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(res.data);
      setIsEditing(false); 
      alert("✅ Información actualizada");
    } catch (err) {
      console.error("❌ Error al actualizar:", err);
      alert("Error al actualizar la info");
    }
  };

  const navigate = useNavigate();

  if (loading) return <p>Cargando...</p>;
  if (!formData) return <p>No hay información de usuario</p>;

  return (
    <div className="profile-container">
      <h2>Mi Perfil</h2>

      {/* Nombre */}
      <div className="field">
        <label>Nombre</label>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
          />
        ) : (
          <p>{formData.name}</p>
        )}
      </div>

      {/* Apellido */}
      <div className="field">
        <label>Apellido</label>
        {isEditing ? (
          <input
            type="text"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
          />
        ) : (
          <p>{formData.lastName}</p>
        )}
      </div>

      {/* Fecha de nacimiento */}
      <div className="field">
        <label>Fecha de nacimiento</label>
        {isEditing ? (
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate || ""}
            onChange={handleChange}
          />
        ) : (
          <p>{formData.birthdate}</p>
        )}
      </div>

      {/* Teléfono */}
      <div className="field">
        <label>Teléfono</label>
        {isEditing ? (
          <input
            type="text"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
          />
        ) : (
          <p>{formData.phone}</p>
        )}
      </div>

      {/* Correo */}
      <div className="field">
        <label>Correo</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
          />
        ) : (
          <p>{formData.email}</p>
        )}
      </div>

      {/* Botones */}
      <div className="actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="btn btn-save">
              Guardar
            </button>
            <button onClick={() => setIsEditing(false)} className="btn btn-cancel">
              Cancelar
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn btn-edit">
            Editar
          </button>
        )}
        <button className="btn btn-edit" onClick={() => navigate("/home")}>
          Volver
        </button>
      </div>
    </div>
  );
}