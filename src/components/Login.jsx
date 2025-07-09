import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const API_URL = "http://localhost:5000/api/login";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-background");
    return () => {
      document.body.classList.remove("login-background");
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (data.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      } else {
        setError(data.msg || "Error de autenticación.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error en la conexión al servidor.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-image"></div>

      <div className="login-container">
        <div className="login-box">
          <h2>INICIO DE SESIÓN</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="usuario">Usuario:</label>
              <input
                type="text"
                id="usuario"
                placeholder="Ingrese su Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Iniciar Sesión</button>
          </form>
          {error && <p className="error-message">{error}</p>}
          <p>¿Olvidaste tu contraseña?</p>
          <p>
            ¿Aún no estás registrado? <a href="/register">Registrarse</a>
          </p>
           <p>
            ¿Deseas volver a nuestra página principal? <a href="/">Inicio</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;