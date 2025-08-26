import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../styles/Login.css";
import loginImage from "../assets/imagencitamed.jpg";

const API_URL = "http://localhost:5000/api/login";
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const navigate = useNavigate();

  // Fondo
  useEffect(() => {
    document.body.classList.add("login-background");
    return () => {
      document.body.classList.remove("login-background");
    };
  }, []);

  // Verificar token existente
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

    if (!captchaToken) {
      setError("⚠️ Por favor resuelve el captcha.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, captcha: captchaToken }),
      });

      const data = await response.json();

      if (response.ok) {
        try {
          const payload = JSON.parse(atob(data.token.split(".")[1]));
          if (!payload.userId) throw new Error("Token sin userId");

          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);

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
    <div className="main-container">
      {/* Columna izquierda - Imagen */}
      <div className="image-container">
        <img
          src={loginImage}
          alt="Imagen de inicio de sesión"
          className="login-image"
        />
      </div>

      {/* Columna derecha - Login */}
      <div className="login-container">
        <div className="login-box">
          <h1 className="title">CITAMED</h1>
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

            {/* 🔹 CAPTCHA */}
            <ReCAPTCHA
              sitekey={SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
              className="captcha-box"
            />

            <button type="submit">Iniciar Sesión</button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <p>¿Olvidaste tu contraseña?</p>
          <p>
            ¿Aún no estás registrado? <a href="/register">Registrarse</a>
          </p>
          <p>
            ¿Volver a la página principal? <a href="/">Inicio</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
