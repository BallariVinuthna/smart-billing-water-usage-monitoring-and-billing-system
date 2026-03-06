import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsedUser = JSON.parse(userInfo);
            // Critical Fix: If resident has no assignedApartment (stale data), force logout
            if (parsedUser.role === 'resident' && !parsedUser.assignedApartment) {
                console.warn('Found stale user data (missing apartment). Logging out...');
                localStorage.removeItem('userInfo');
                setUser(null);
            } else {
                setUser(parsedUser);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password }, config);

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.message };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role }, config);

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
