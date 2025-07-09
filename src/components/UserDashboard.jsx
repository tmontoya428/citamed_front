import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserDashboard.css';

const API_URL_HISTORY = 'http://localhost:5000/api/history'; // URL para historial
const API_URL_REGISTER_CODE = 'http://localhost:5000/api/register-code'; // URL para registrar código

function UserDashboard() {
    const [qrCode, setQrCode] = useState('');
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const response = await fetch(API_URL_HISTORY, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setHistory(data);
                } else {
                    throw new Error(data.msg || 'Error al cargar el historial');
                }
            } catch (err) {
                console.error('Error:', err);
                setMessage(err.message || 'Error al cargar el historial.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleRegisterCode = async () => {
        if (!/^\d{3}$/.test(qrCode)) {
            setMessage('Código inválido. Debe estar en el rango 000-999.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(API_URL_REGISTER_CODE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ qrCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Error al registrar el código');
            }

            setMessage(data.msg);
            setHistory((prevHistory) => [
                ...prevHistory,
                { qrCode, date: new Date().toISOString(), result: data.msg },
            ]);
        } catch (err) {
            console.error('Error:', err);
            setMessage(err.message || 'Error al registrar el código.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <h2>Registro de Código QR</h2>
            <input
                type="text"
                placeholder="Código QR (000-999)"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                aria-label="Código QR" // Atributo accesible
            />
            <button onClick={handleRegisterCode} disabled={loading}>
                {loading ? 'Registrando...' : 'registrar'}
            </button>

            {loading && <p>Cargando...</p>}
            {message && <p>{message}</p>}

            <h3>Historial de Códigos Registrados</h3>
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Código QR</th>
                        <th>Resultado</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item, index) => (
                        <tr key={index}>
                            <td>{new Date(item.date).toLocaleString()}</td>
                            <td>{item.qrCode}</td>
                            <td>{item.result}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="logout-btn" onClick={handleLogout}
            >Salir</button>
        </div>
    );
}

export default UserDashboard;