import { createContext, useContext, useState, useEffect }
    from 'react';
import type { ReactNode } from 'react';
import { login as loginApi, register as registerApi } from '../../../api/auth';

interface User {
    id: string;
    username: string;
    role: string;
    rol?: string; // Backward compatibility
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isAdmin: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const isAdmin = (user?.role || user?.rol)?.toLowerCase() === 'admin';

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
        }
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            // Limpiar sesión anterior antes de intentar login
            logout();
            
            const response = await loginApi(username, password);
            if (response.status === 200 && response.data.token) {
                localStorage.setItem('token', response.data.token);
                const userData = response.data.user;
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            return false;
        }
    };

    const register = async (username: string, email: string, password: string): Promise<boolean> => {
        try {
            const response = await registerApi(username, email, password);
            return response.status === 201;
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}