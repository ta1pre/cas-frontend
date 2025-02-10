'use client';

import React, { useState, useEffect } from 'react';
import { AuthContext, AuthContextType, User } from './AuthContext';
import { login, logout } from './authUtils';
import { usePathname, useRouter } from 'next/navigation';
import apiClient from '@/services/auth/axiosInterceptor'; 


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (pathname?.startsWith('/auth/callback')) {
            setLoading(false);
            return;
        }
    }, [pathname]);

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            loading, 
            error, 
            login, 
            logout, 
            apiClient 
        } as AuthContextType}>
            {children}
        </AuthContext.Provider>
    );
};
