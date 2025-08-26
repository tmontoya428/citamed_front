import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // 🔹 Controla si está en modo edición
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
      setIsEditing(false); // volver a modo lectura
      alert("✅ Información actualizada");
    } catch (err) {
      console.error("❌ Error al actualizar:", err);
      alert("Error al actualizar la info");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!formData) return <p>No hay información de usuario</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Mi Perfil</h2>

      <div className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block font-medium">Nombre</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          ) : (
            <p className="p-2 border rounded bg-gray-100">{formData.name}</p>
          )}
        </div>

        {/* Apellido */}
        <div>
          <label className="block font-medium">Apellido</label>
          {isEditing ? (
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          ) : (
            <p className="p-2 border rounded bg-gray-100">{formData.lastName}</p>
          )}
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <label className="block font-medium">Fecha de nacimiento</label>
          {isEditing ? (
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          ) : (
            <p className="p-2 border rounded bg-gray-100">{formData.birthdate}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block font-medium">Teléfono</label>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          ) : (
            <p className="p-2 border rounded bg-gray-100">{formData.phone}</p>
          )}
        </div>

        {/* Correo */}
        <div>
          <label className="block font-medium">Correo</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          ) : (
            <p className="p-2 border rounded bg-gray-100">{formData.email}</p>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="mt-6 flex gap-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
}
