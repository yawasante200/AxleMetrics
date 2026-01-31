import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    type: 'individual' | 'company';
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLicensed: boolean;
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    checkLicense: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'axlemetrics_auth';
const LICENSE_STORAGE_KEY = 'axlemetrics_license';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLicensed, setIsLicensed] = useState(false);

    // Check license status from localStorage
    const checkLicense = (): boolean => {
        const licenseData = localStorage.getItem(LICENSE_STORAGE_KEY);
        if (licenseData) {
            try {
                const parsed = JSON.parse(licenseData);
                return parsed.isValid === true;
            } catch {
                return false;
            }
        }
        return false;
    };

    // Load auth state from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUser(parsed.user);
                setIsAuthenticated(true);
            } catch (e) {
                localStorage.removeItem(AUTH_STORAGE_KEY);
            }
        }

        // Check license status
        setIsLicensed(checkLicense());
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: userData }));
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLicensed, user, login, logout, checkLicense }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
