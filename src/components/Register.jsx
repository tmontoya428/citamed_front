import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

/*const API_URL ='http://localhost:5000/api/register';*/
function Register() {
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        birthdate: '',
        email: '',
        username: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('register-background');
        return () => {
            document.body.classList.remove('register-background');
        };
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password || !formData.name || !formData.lastName) {
            setMessage('Por favor, completa todos los campos obligatorios');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Registro exitoso. Redirigiendo a inicio de sesión...');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setMessage(data.msg || 'Error en el registro');
            }
        } catch (err) {
            console.error('Error:', err);
            setMessage('Error en la conexión con el servidor');
        }
    };

    return (
        <div className="register-page">
            <div className="back-button-container">
                <button className="back-button" onClick={() => navigate('/login')}>←</button> 
            </div>
    
            <div className="register-container">  
                <h2>REGISTRARSE</h2>
                <p>Completa todos los campos requeridos, si ya tienes una cuenta inicia sesión</p>
                {message && <p className="message">{message}</p>} 
    
                <form onSubmit={handleSubmit}>
                    <div className="half-width">
                        <label htmlFor="name">Nombres:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="half-width">
                        <label htmlFor="lastName">Apellidos:</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="half-width">
                        <label htmlFor="birthdate">Fecha de Nacimiento:</label>
                        <input
                            type="date"
                            id="birthdate"
                            name="birthdate"
                            value={formData.birthdate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="half-width">
                        <label htmlFor="email">Correo:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="full-width">
                        <label htmlFor="username">Usuario:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="full-width">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Registrarme</button>
                </form>
            </div>
        </div>
    );        
}

export default Register;