import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Backend uses /view for user info and returns object directly (no .data wrapper in success)
            const res = await api.get('/view');
            if (res.data && res.data.email) {
                setUser(res.data);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            // Backend uses /signin and returns { data: "Successfully logged in" }
            const res = await api.post('/signin', { email, password });

            if (res.status === 200) {
                // Since login doesn't return user data, we fetch it immediately
                await checkAuth();
                return { success: true };
            }
            return { success: false, error: { message: 'Unexpected response' } };
        } catch (err) {
            return {
                success: false,
                error: { message: err.response?.data?.data || 'Login failed' }
            };
        }
    };

    const signup = async (firstName, lastName, email, password) => {
        try {
            // Backend uses /signup and returns { data: { insertedId: ... } }
            const res = await api.post('/signup', { firstName, lastName, email, password });
            if (res.status === 201) {
                await checkAuth();
                return { success: true };
            }
            return { success: false, error: { message: 'Signup failed' } };
        } catch (err) {
            return {
                success: false,
                error: { message: err.response?.data?.data || 'Signup failed' }
            };
        }
    };

    const logout = async () => {
        try {
            await api.get('/logout');
            setUser(null);
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
