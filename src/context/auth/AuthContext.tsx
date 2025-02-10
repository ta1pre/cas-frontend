import { createContext } from 'react';

export interface User {
    userId: number;
    userType: string | null;
    affiType: number | null;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (provider: 'line' | 'phone' | 'email', credentials?: any) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
