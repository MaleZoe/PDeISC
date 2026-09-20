import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
    const { register, handleSubmit } = useForm();
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);
        
        const success = await login(data.email, data.password);
        if (success) {
            if (onLoginSuccess) onLoginSuccess();
        } else {
            setError('Credenciales inválidas');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-100px)]">
            <div className="distinctive-card p-10 w-full max-w-md animate-fade-in-up">
                
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl mb-6" style={{backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--accent)'}}>
                        <BookOpen size={32} />
                    </div>
                    <h2 className="text-3xl font-bold title-serif mb-2" style={{color: 'var(--text-main)'}}>Acceso</h2>
                    <p style={{color: 'var(--text-muted)'}}>Ingresa tus credenciales para continuar</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{color: 'var(--text-main)'}}>Correo Electrónico</label>
                        <input 
                            {...register('email')} 
                            type="email"
                            className="input-styled" 
                            placeholder="ejemplo@biblio.com" 
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{color: 'var(--text-main)'}}>Contraseña</label>
                        <input 
                            {...register('password')} 
                            type="password" 
                            className="input-styled" 
                            placeholder="••••••••" 
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                    
                    <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2 h-[50px] flex justify-center items-center">
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Ingresar al Sistema'}
                    </button>

                    <div className="text-center mt-4 pt-4 border-t" style={{borderColor: 'var(--border-color)'}}>
                        <span className="text-sm" style={{color: 'var(--text-muted)'}}>¿No tienes cuenta? </span>
                        <button type="button" onClick={() => onLoginSuccess && onLoginSuccess('register')} className="text-sm font-bold" style={{color: 'var(--accent)'}}>Regístrate</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
