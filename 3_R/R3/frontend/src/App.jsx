import { useState } from 'react';
import RouterApp from './pages/RouterApp';
import StateApp from './pages/StateApp';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggleButton = () => {
    const { isDark, toggleTheme } = useTheme();
    return (
        <button 
            onClick={toggleTheme} 
            className="absolute top-6 right-6 p-3 rounded-xl transition-all shadow-sm border hover:-translate-y-0.5 z-50"
            style={{backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-color)', color: 'var(--text-main)'}}
            title="Alternar Tema"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

export default function App() {
    const [mode, setMode] = useState(null);

    if (!mode) {
        return (
            <ThemeProvider>
                <div className="min-h-screen flex flex-col justify-center items-center px-4 relative" style={{backgroundColor: 'var(--bg-base)'}}>
                    <ThemeToggleButton />
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
