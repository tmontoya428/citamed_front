import { useState } from "react";
import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }), // 👈 usamos username
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.msg);
      } else {
        setError(data.msg || "Error al enviar la solicitud");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Error en la conexión con el servidor");
    }
  };

  return (
    <div className="forgot-container">
      <h2>Recuperar contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ingresa tu usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Enviar correo</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default ForgotPassword;
