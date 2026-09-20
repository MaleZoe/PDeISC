import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

export default function StateApp() {
    const { user, loading } = useAuth();
    // En modo 'useState', todo el enrutamiento se maneja con esta variable en lugar de la URL
    const [currentView, setCurrentView] = useState('login');

    useEffect(() => {
        if (user) setCurrentView('dashboard');
    }, [user]);

    if (loading) return <div>Cargando...</div>;

    // Lógica simple de ruteo por estado
    const renderView = () => {
        if (!user) {
            if (currentView === 'register') {
                return <Register onRegisterSuccess={() => setCurrentView('dashboard')} onGoToLogin={() => setCurrentView('login')} />;
            }
            return <Login onLoginSuccess={(action) => {
                if (action === 'register') setCurrentView('register');
                else setCurrentView('dashboard');
            }} />;
        }
        
        switch (currentView) {
            case 'dashboard':
                return <Dashboard />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="container mx-auto px-6 md:px-12 py-8 max-w-6xl">
                {renderView()}
            </main>
        </div>
    );
}
