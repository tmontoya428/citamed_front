import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import Login from './components/Login';
import Register from './components/Register';
import RegisterAdmin from './components/RegisterAdmin';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandinPage';
import Home from './components/Home';
import Reminder from './components/Reminder';
import './App.css';
import Followup from './components/Followup';
import Remindercontrol from './components/Remindercontrol';
import ReminderMedicine from './components/ReminderMedicine';
import ReminderFrequency from './components/ReminderFrequency';
import ReminderCreated from './components/ReminderCreated';

function App() {
    const isLoggedIn = () => {
        return !!localStorage.getItem('token');
    };

    const isAdmin = () => {
        return localStorage.getItem('role') === 'admin';
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route 
                        path="/dashboard" 
                        element={isLoggedIn() ? (isAdmin() ? <Navigate to="/admin/dashboard" /> : <Navigate to="/home" />) : <Navigate to="/" />} 
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/register-admin" element={<RegisterAdmin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/reminder" element={<Reminder />} />
                    <Route path="/follow-up" element={<Followup />} />
                    <Route path="/create-reminder" element={<Remindercontrol />} />
                    <Route path="/reminder-medicine" element={<ReminderMedicine />} />
                    <Route path="/reminder-frequency" element={<ReminderFrequency />} />
                    <Route path="/reminder-created" element={<ReminderCreated />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
