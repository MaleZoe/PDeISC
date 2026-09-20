import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function Register({ onRegisterSuccess, onGoToLogin }) {
    const { register, handleSubmit } = useForm();
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Data has name, email, password, role_id
            await registerUser(data);
            
            // Auto login after register
            const success = await login(data.email, data.password);
            if (success) {
                if (onRegisterSuccess) onRegisterSuccess();
            } else {
                setError('Registro exitoso, pero falló el inicio de sesión automático.');
                setIsLoading(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar usuario');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-100px)]">
            <div className="distinctive-card p-10 w-full max-w-md animate-fade-in-up">
                
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl mb-6" style={{backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--accent)'}}>
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-3xl font-bold title-serif mb-2" style={{color: 'var(--text-main)'}}>Registro</h2>
                    <p style={{color: 'var(--text-muted)'}}>Crea una cuenta en BiblioTech</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-1" style={{color: 'var(--text-main)'}}>Nombre Completo</label>
                        <input {...register('name', { required: true })} className="input-styled" placeholder="Ej. Juan Pérez" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1" style={{color: 'var(--text-main)'}}>Correo Electrónico</label>
                        <input {...register('email', { required: true })} type="email" className="input-styled" placeholder="ejemplo@biblio.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1" style={{color: 'var(--text-main)'}}>Contraseña</label>
                        <input {...register('password', { required: true })} type="password" className="input-styled" placeholder="••••••••" />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                    
                    <button type="submit" disabled={isLoading} className="btn-primary w-full mt-4 h-[50px] flex justify-center items-center">
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Crear Cuenta'}
                    </button>

                    <div className="text-center mt-4 pt-4 border-t" style={{borderColor: 'var(--border-color)'}}>
                        <span className="text-sm" style={{color: 'var(--text-muted)'}}>¿Ya tienes cuenta? </span>
                        {/* We use a button to toggle views or trigger navigation depending on the router */}
                        <button type="button" onClick={onGoToLogin} className="text-sm font-bold" style={{color: 'var(--accent)'}}>Inicia Sesión</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
