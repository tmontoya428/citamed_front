import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        birthdate: '',
        phone: '',
        email: '',
        username: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
        // Clear message when user starts typing
        if (message) setMessage('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setMessage('Por favor, ingresa tu nombre');
            return false;
        }
        if (!formData.lastName.trim()) {
            setMessage('Por favor, ingresa tu apellido');
            return false;
        }
        if (!formData.email.trim()) {
            setMessage('Por favor, ingresa tu correo electrónico');
            return false;
        }
        if (!formData.username.trim()) {
            setMessage('Por favor, ingresa un nombre de usuario');
            return false;
        }
        if (!formData.password.trim()) {
            setMessage('Por favor, ingresa una contraseña');
            return false;
        }
        if (formData.password.length < 6) {
            setMessage('La contraseña debe tener al menos 6 caracteres');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setMessage('');

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
                setMessage('¡Registro exitoso! Redirigiendo a inicio de sesión...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(data.msg || 'Error en el registro. Intenta nuevamente.');
            }
        } catch (err) {
            console.error('Error:', err);
            setMessage('Error en la conexión con el servidor. Verifica tu conexión.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="back-button-container">
                <Link to="/" className="back-button">← Volver</Link> 
            </div>
    
            <div className="register-container">  
                <div className="register-header">
                    <h2>Crear Cuenta</h2>
                    <p>Únete a Citamed y gestiona tus citas médicas de manera fácil y segura</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('exitoso') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
    
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Nombres *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ingresa tu nombre"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Apellidos *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Ingresa tu apellido"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="birthdate">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                id="birthdate"
                                name="birthdate"
                                value={formData.birthdate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Teléfono</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Ingresa tu teléfono"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ejemplo@correo.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Nombre de Usuario *</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Elige un nombre de usuario"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mínimo 6 caracteres"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`submit-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>

                    <div className="login-link">
                        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
                    </div>
                </form>
            </div>
        </div>
    );        
}

export default Register;