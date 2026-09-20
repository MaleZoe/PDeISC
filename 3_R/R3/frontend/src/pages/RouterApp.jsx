import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Cargando...</div>;
    return user ? children : <Navigate to="/login" />;
};

export default function RouterApp() {
    return (
        <Router>
            <div className="min-h-screen">
                <Navbar />
                <main className="container mx-auto px-6 md:px-12 py-8 max-w-6xl">
                    <Routes>
                        <Route path="/login" element={<Login onLoginSuccess={(action) => {
                            if (action === 'register') window.location.href = '/register';
                            else window.location.href = '/';
                        }} />} />
                        <Route path="/register" element={<Register onRegisterSuccess={() => window.location.href = '/'} onGoToLogin={() => window.location.href = '/login'} />} />
                        <Route path="/" element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
