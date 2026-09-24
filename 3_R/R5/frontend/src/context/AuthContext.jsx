import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user: auth0User, loginWithRedirect, logout: auth0Logout, isLoading: auth0Loading } = useAuth0();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (isAuthenticated && auth0User && !user) {
            // Perform backend social login
            const doSocialLogin = async () => {
                try {
                    const res = await axios.post('http://localhost:3005/api/auth/social-login', { 
                        email: auth0User.email, 
                        name: auth0User.name || auth0User.nickname 
                    });
                    const { token, user: localUser } = res.data;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(localUser));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setUser(localUser);
                } catch (error) {
                    console.error('Error de login social', error);
                }
            }
            doSocialLogin();
        }
    }, [isAuthenticated, auth0User, user]);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:3005/api/auth/login', { email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
            return true;
        } catch (error) {
            console.error('Error de login', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        if (isAuthenticated) {
            auth0Logout({ logoutParams: { returnTo: window.location.origin } });
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading: loading || auth0Loading, loginWithRedirect }}>
            {children}
        </AuthContext.Provider>
    );
};
