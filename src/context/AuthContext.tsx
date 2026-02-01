import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    type: 'individual' | 'company';
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLicensed: boolean;
    login: (user: User) => void;
    logout: () => void;
    activateLicense: (key: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'axlemetrics_auth';
const LICENSE_STORAGE_KEY = 'axlemetrics_license';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLicensed, setIsLicensed] = useState(false);

    // Load auth and license state from localStorage on mount
    useEffect(() => {
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedAuth) {
            try {
                const parsed = JSON.parse(storedAuth);
                setUser(parsed.user);
                setIsAuthenticated(true);
            } catch (e) {
                localStorage.removeItem(AUTH_STORAGE_KEY);
            }
        }

        const storedLicense = localStorage.getItem(LICENSE_STORAGE_KEY);
        if (storedLicense === 'true') {
            setIsLicensed(true);
        }
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

    const activateLicense = (key: string): boolean => {
        // Dummy validation - just check if it's not empty
        if (key && key.trim().length > 0) {
            setIsLicensed(true);
            localStorage.setItem(LICENSE_STORAGE_KEY, 'true');
            return true;
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, isLicensed, login, logout, activateLicense }}>
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
