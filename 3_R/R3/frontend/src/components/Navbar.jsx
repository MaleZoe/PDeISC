import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, LogOut, Library, Check, X } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [confirmLogout, setConfirmLogout] = useState(false);

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md border-b" style={{backgroundColor: 'color-mix(in srgb, var(--bg-card) 85%, transparent)', borderColor: 'var(--border-color)'}}>
            <div className="container mx-auto px-6 h-20 flex justify-between items-center max-w-6xl">
                
                <div className="flex items-center space-x-3 group cursor-pointer">
                    <div className="text-white p-2 rounded-xl transition-colors shadow-sm" style={{backgroundColor: 'var(--accent)'}}>
                        <Library size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold title-serif leading-tight" style={{color: 'var(--text-main)'}}>Biblio<span style={{color: 'var(--accent)'}}>Tech</span></h1>
                        <p className="text-[10px] uppercase tracking-widest font-bold" style={{color: 'var(--text-muted)'}}>Sistema Inteligente</p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-4 md:space-x-8">
                    <button 
                        onClick={toggleTheme} 
                        className="p-2.5 rounded-xl transition-all shadow-sm border hover:-translate-y-0.5"
                        style={{backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-color)', color: 'var(--text-main)'}}
                        title="Alternar Tema"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    
                    {user && (
                        <div className="flex items-center gap-4 pl-4 md:pl-6 border-l" style={{borderColor: 'var(--border-color)'}}>
                            
                            {/* User Profile Info */}
                            <div className="hidden sm:flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold leading-none" style={{color: 'var(--text-main)'}}>{user.name}</span>
                                    <span className="text-[11px] font-medium mt-1" style={{color: 'var(--text-muted)'}}>
                                        {user.role_name === 'admin' ? 'Administrador' : user.role_name === 'biblio' ? 'Bibliotecario' : user.role_name}
                                    </span>
                                </div>
                                <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm" style={{backgroundColor: 'var(--accent)', color: '#fff'}}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            {/* Logout Button */}
                            {confirmLogout ? (
                                <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-1.5 rounded-xl ml-2 transition-all">
                                    <span className="text-xs font-bold px-2 text-red-600 dark:text-red-400">¿Salir?</span>
                                    <button onClick={logout} className="p-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors" title="Sí, cerrar sesión">
                                        <Check size={14} />
                                    </button>
                                    <button onClick={() => setConfirmLogout(false)} className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors" title="Cancelar">
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setConfirmLogout(true)}
                                    className="flex items-center justify-center p-2.5 rounded-xl transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-800/50 border ml-2"
                                    style={{color: 'var(--text-muted)', borderColor: 'var(--border-color)', backgroundColor: 'transparent'}}
                                    title="Cerrar Sesión"
                                >
                                    <LogOut size={18} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
