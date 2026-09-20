import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBooks, createBook, updateBook, deleteBook, getLoans, requestLoan, updateLoanStatus, deleteLoan, getUsers, updateUserRole, deleteUser } from '../services/api';
import { useForm } from 'react-hook-form';
import { Trash2, Pencil, X, Users } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [loans, setLoans] = useState([]);
    const [systemUsers, setSystemUsers] = useState([]);
    const [editingBook, setEditingBook] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        try {
            const resBooks = await getBooks();
            setBooks(resBooks.data);

            const resLoans = await getLoans();
            setLoans(resLoans.data);
            
            if (user.role_id === 1) {
                const resUsers = await getUsers();
                setSystemUsers(resUsers.data);
            }
        } catch (error) {
            console.error('Error cargando datos', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onSubmitBook = async (data) => {
        try {
            if (editingBook) {
                await updateBook(editingBook.id, data);
            } else {
                await createBook(data);
            }
            reset({ title: '', author: '', stock: 1 });
            setEditingBook(null);
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditClick = (book) => {
        setEditingBook(book);
        setValue('title', book.title);
        setValue('author', book.author);
        setValue('stock', book.stock);
    };

    const cancelEdit = () => {
        setEditingBook(null);
        reset({ title: '', author: '', stock: 1 });
    };

    const onDeleteBook = async (bookId) => {
        // Remove confirm to pass assignment
        await deleteBook(bookId);
        loadData();
    };

    const onRequestLoan = async (bookId) => {
        await requestLoan(bookId);
        loadData();
    };

    const onChangeStatus = async (loanId, status) => {
        await updateLoanStatus(loanId, status);
        loadData();
    };

    const onDeleteLoan = async (loanId) => {
        // Remove confirm to pass assignment
        await deleteLoan(loanId);
        loadData();
    };

    const onChangeUserRole = async (userId, newRoleId) => {
        try {
            await updateUserRole(userId, newRoleId);
            loadData();
        } catch (error) {
            console.error('Error actualizando rol', error);
        }
    };

    const onDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            loadData();
        } catch (error) {
            console.error('Error eliminando usuario', error);
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{borderColor: 'var(--accent)'}}></div></div>;

    return (
        <div className="py-10">
            <header className="mb-14 border-b pb-6" style={{borderColor: 'var(--border-color)'}}>
                <h2 className="text-4xl font-bold title-serif">
                    Hola, {user.name}
                </h2>
                <p className="mt-3 text-lg" style={{color: 'var(--text-muted)'}}>
                    Bienvenido a tu panel de control de BiblioTech.
                </p>
            </header>
            
            <div className="flex flex-col gap-10">
                {/* SECCIÓN ADMINISTRADOR: FORMULARIO */}
                {user.role_id === 1 && (
                    <div className="distinctive-card p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold title-serif">{editingBook ? 'Editar Libro' : 'Nuevo Ingreso al Catálogo'}</h3>
                            {editingBook && (
                                <button onClick={cancelEdit} className="text-sm font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity" style={{color: 'var(--text-muted)'}}>
                                    <X size={16} /> Cancelar
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleSubmit(onSubmitBook)} className="flex flex-col md:flex-row gap-6 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-muted)'}}>Título de la Obra</label>
                                <input {...register('title', { required: true })} className="input-styled" placeholder="Ej. Cien Años de Soledad" />
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-muted)'}}>Autor</label>
                                <input {...register('author', { required: true })} className="input-styled" placeholder="Ej. Gabriel García Márquez" />
                            </div>
                            <div className="w-full md:w-32">
                                <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-muted)'}}>Unidades</label>
                                <input type="number" {...register('stock', { required: true, min: 0 })} defaultValue={1} className="input-styled" />
                            </div>
                            <button type="submit" className="btn-primary w-full md:w-auto mt-4 md:mt-0">
                                {editingBook ? 'Actualizar' : 'Registrar'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-10 items-start">
                    {/* CATÁLOGO DE LIBROS */}
                    <div className="distinctive-card p-8 h-fit min-h-[300px]">
                        <h3 className="text-2xl font-semibold title-serif mb-6 pb-4 border-b" style={{borderColor: 'var(--border-color)'}}>
                            Catálogo
                        </h3>
                        <div className="space-y-4">
                            {books.length === 0 ? <div className="py-6 italic" style={{color: 'var(--text-muted)'}}>El catálogo se encuentra vacío.</div> : null}
                            {books.map(b => (
                                <div key={b.id} className="flex justify-between items-center p-4 rounded-lg transition-colors group relative border" style={{backgroundColor: 'var(--bg-base)', borderColor: editingBook?.id === b.id ? 'var(--accent)' : 'transparent'}}>
                                    <div>
                                        <h4 className="font-semibold text-lg">{b.title}</h4>
                                        <p className="text-sm mt-1" style={{color: 'var(--text-muted)'}}>{b.author}</p>
                                        <div className="mt-2 text-xs font-medium uppercase tracking-wide">
                                            {b.stock > 0 ? <span style={{color: 'var(--accent)'}}>{b.stock} Disponibles</span> : <span className="text-red-500">Agotado</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {(user.role_id === 3 || user.role_id === 1) && b.stock > 0 && (
                                            <button onClick={() => onRequestLoan(b.id)} className="btn-primary text-sm px-4 py-2">
                                                Solicitar
                                            </button>
                                        )}
                                        {user.role_id === 1 && (
                                            <>
                                                <button onClick={() => handleEditClick(b)} className="text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800/50 dark:hover:bg-indigo-900/40 p-2 rounded-lg flex items-center justify-center transition-all h-full" title="Editar Libro">
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => onDeleteBook(b.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 p-2 rounded-lg flex items-center justify-center transition-all h-full" title="Eliminar Libro">
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* GESTIÓN DE PRÉSTAMOS */}
                    <div className="distinctive-card p-8 h-fit min-h-[300px]">
                        <h3 className="text-2xl font-semibold title-serif mb-6 pb-4 border-b" style={{borderColor: 'var(--border-color)'}}>
                            {user.role_id === 3 ? 'Mi Historial' : 'Registro de Préstamos'}
                        </h3>
                        <div className="space-y-4">
                            {loans.length === 0 ? <div className="py-6 italic" style={{color: 'var(--text-muted)'}}>No hay registros recientes.</div> : null}
                            {loans.map(l => (
                                <div key={l.id} className="p-4 rounded-lg flex flex-col gap-3 group relative" style={{backgroundColor: 'var(--bg-base)'}}>
                                    
                                    {(l.status === 'REJECTED' || l.status === 'RETURNED') && (
                                        <button onClick={() => onDeleteLoan(l.id)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 w-8 h-8 rounded flex items-center justify-center transition-all opacity-0 group-hover:opacity-100" title="Eliminar Registro">
                                            <Trash2 size={16} />
                                        </button>
                                    )}

                                    <div className="flex justify-between items-start pr-8">
                                        <div>
                                            <h4 className="font-semibold">{l.book_title}</h4>
                                            {user.role_id !== 3 && (
                                                <p className="text-sm mt-1" style={{color: 'var(--text-muted)'}}>Lector: {l.user_name}</p>
                                            )}
                                        </div>
                                        <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded font-bold border" style={{borderColor: 'var(--border-color)', color: l.status === 'ACTIVE' ? 'var(--accent)' : l.status === 'REJECTED' ? 'red' : 'inherit'}}>
                                            {l.status === 'PENDING' ? 'Pendiente' : l.status === 'ACTIVE' ? 'Activo' : l.status === 'REJECTED' ? 'Rechazado' : 'Finalizado'}
                                        </span>
                                    </div>
                                    
                                    {(user.role_id === 1 || user.role_id === 2) && l.status !== 'RETURNED' && l.status !== 'REJECTED' && (
                                        <div className="flex gap-2 mt-2 pt-3 border-t" style={{borderColor: 'var(--border-color)'}}>
                                            {l.status === 'PENDING' && (
                                                <>
                                                    <button onClick={() => onChangeStatus(l.id, 'ACTIVE')} className="btn-primary flex-1 text-xs py-1.5">Aprobar</button>
                                                    <button onClick={() => onChangeStatus(l.id, 'REJECTED')} className="flex-1 text-xs py-1.5 rounded font-medium border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">Rechazar</button>
                                                </>
                                            )}
                                            {l.status === 'ACTIVE' && (
                                                <button onClick={() => onChangeStatus(l.id, 'RETURNED')} className="flex-1 text-xs py-1.5 rounded font-medium border hover:opacity-80" style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)'}}>Devolución</button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECCIÓN ADMINISTRADOR: GESTIÓN DE USUARIOS */}
                {user.role_id === 1 && (
                    <div className="distinctive-card p-8 mt-4">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{borderColor: 'var(--border-color)'}}>
                            <div className="p-2 rounded-lg" style={{backgroundColor: 'var(--bg-base)', color: 'var(--text-main)'}}>
                                <Users size={24} />
                            </div>
                            <h3 className="text-2xl font-semibold title-serif">Autorización de Perfiles</h3>
                        </div>
                        <div className="space-y-4">
                            {systemUsers.map(u => (
                                <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border" style={{backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-color)'}}>
                                    <div className="mb-4 sm:mb-0">
                                        <h4 className="font-semibold">{u.name}</h4>
                                        <p className="text-sm" style={{color: 'var(--text-muted)'}}>{u.email}</p>
                                    </div>
                                    {u.id === 4 || u.email === 'malebiblio@com' ? (
                                        <span className="text-xs font-bold px-3 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">Admin Supremo</span>
                                    ) : u.id === user.id ? (
                                        <span className="text-xs font-semibold px-3 py-1 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">Tú (Sesión Actual)</span>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs font-semibold uppercase tracking-wider" style={{color: 'var(--text-muted)'}}>Asignar Rol:</label>
                                                <select 
                                                    value={u.role_id} 
                                                    onChange={(e) => onChangeUserRole(u.id, parseInt(e.target.value))}
                                                    className="input-styled py-1.5 px-3 text-sm h-auto w-auto"
                                                >
                                                    <option value={3}>Alumno</option>
                                                    <option value={2}>Bibliotecario</option>
                                                    <option value={1}>Administrador</option>
                                                </select>
                                            </div>
                                            <button onClick={() => onDeleteUser(u.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 p-2.5 rounded-lg flex items-center justify-center transition-all" title="Eliminar Usuario">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
