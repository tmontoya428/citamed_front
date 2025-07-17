import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const API_URL = "http://localhost:5000/api/login";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Estilo personalizado
  useEffect(() => {
    document.body.classList.add("login-background");
    return () => {
      document.body.classList.remove("login-background");
    };
  }, []);

  // Verificar token existente al entrar a /login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload?.userId) {
          navigate("/home", { replace: true });
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        console.warn("⚠️ Token inválido en el localStorage");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        try {
          const payload = JSON.parse(atob(data.token.split('.')[1]));
          if (!payload.userId) {
            throw new Error("Token sin userId");
          }

          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);

          // Redirigir según el rol
          if (data.role === "admin") {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate("/home", { replace: true });
          }
        } catch (err) {
          console.error("❌ Token mal formado:", err.message);
          setError("Error al procesar el token de sesión.");
        }
      } else {
        setError(data.msg || "Credenciales incorrectas.");
      }

    } catch (err) {
      console.error("❌ Error de conexión:", err.message);
      setError("No se pudo conectar con el servidor.");
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su Usuario"
                required
              />
            </div>

            <div>
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>

            <button type="submit">Iniciar Sesión</button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <p>¿Olvidaste tu contraseña?</p>
          <p>¿Aún no estás registrado? <a href="/register">Registrarse</a></p>
          <p>¿Volver a la página principal? <a href="/">Inicio</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
