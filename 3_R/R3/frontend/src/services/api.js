import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});
export const registerUser = (data) => api.post('/auth/register', data);
export const getUsers = () => api.get('/auth/users');
export const updateUserRole = (id, role_id) => api.put(`/auth/users/${id}/role`, { role_id });
export const deleteUser = (id) => api.delete(`/auth/users/${id}`);
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getBooks = () => api.get('/books');
export const createBook = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

export const getLoans = () => api.get('/loans');
export const requestLoan = (book_id) => api.post('/loans', { book_id });
export const updateLoanStatus = (id, status) => api.put(`/loans/${id}`, { status });
export const deleteLoan = (id) => api.delete(`/loans/${id}`);

export default api;
