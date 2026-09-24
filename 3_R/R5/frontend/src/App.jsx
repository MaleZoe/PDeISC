import { useState } from 'react';
import RouterApp from './pages/RouterApp';
import StateApp from './pages/StateApp';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
    const [mode, setModeState] = useState(() => localStorage.getItem('appMode') || null);

    const setMode = (newMode) => {
        localStorage.setItem('appMode', newMode);
        setModeState(newMode);
    };

    if (!mode) {
        return (
            <ThemeProvider>
                <div className="min-h-screen flex flex-col justify-center items-center px-4" style={{backgroundColor: 'var(--bg-base)'}}>
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-bold title-serif mb-4" style={{color: 'var(--text-main)'}}>
                            BiblioTech
                        </h1>
                        <p className="text-lg md:text-xl font-light" style={{color: 'var(--text-muted)'}}>
                            Selecciona la arquitectura de enrutamiento a evaluar.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl px-4 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                        
                        <div 
                            onClick={() => setMode('router')}
                            className="flex-1 distinctive-card p-10 cursor-pointer flex flex-col justify-between group"
                        >
                            <div>
                                <h2 className="text-2xl font-semibold title-serif mb-3">React Router</h2>
                                <p className="leading-relaxed" style={{color: 'var(--text-muted)'}}>
                                    Navegación clásica y robusta por URLs dinámicas.
                                </p>
                            </div>
                            <div className="mt-8 text-sm font-semibold uppercase tracking-widest transition-colors" style={{color: 'var(--text-muted)'}}>
                                <span className="group-hover:text-indigo-500">Seleccionar →</span>
                            </div>
                        </div>

                        <div 
                            onClick={() => setMode('state')}
                            className="flex-1 distinctive-card p-10 cursor-pointer flex flex-col justify-between group"
                        >
                            <div>
                                <h2 className="text-2xl font-semibold title-serif mb-3">useState SPA</h2>
                                <p className="leading-relaxed" style={{color: 'var(--text-muted)'}}>
                                    Navegación manejada enteramente por el estado interno.
                                </p>
                            </div>
                            <div className="mt-8 text-sm font-semibold uppercase tracking-widest transition-colors" style={{color: 'var(--text-muted)'}}>
                                <span className="group-hover:text-indigo-500">Seleccionar →</span>
                            </div>
                        </div>

                    </div>
                </div>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider>
            <AuthProvider>
                {mode === 'router' ? <RouterApp /> : <StateApp />}
            </AuthProvider>
        </ThemeProvider>
    );
}
