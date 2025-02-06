// src/services/auth/types.ts

export type AuthProvider = 'line' | 'phone' | 'email';

export interface LoginCredentials {
    phone?: string;
    email?: string;
    password?: string;
}
