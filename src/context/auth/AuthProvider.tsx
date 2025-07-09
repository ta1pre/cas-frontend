"use client";

import React, { useState, useEffect } from "react";
import { AuthContext, AuthContextType, User } from "./AuthContext";
import { login, logout } from "./authUtils";
import { usePathname, useRouter } from "next/navigation";
import apiClient from "@/services/auth/axiosInterceptor"; 
import Cookies from "js-cookie";  
import { jwtDecode } from "jwt-decode"; 

// ✅ `jwtDecode()` の返り値の型を定義
interface DecodedUser {
    user_id: number;
    user_type: string;
    affi_type: number;
    exp: number;
}


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // SSGビルド時にはスキップ
        if (typeof window === 'undefined') {
            setLoading(false);
            return;
        }

        if (pathname?.startsWith("/auth/callback")) {
            setLoading(false);
            return;
        }

        const storedToken = Cookies.get("token"); 
        if (storedToken) {
            try {
                const decodedUser = jwtDecode<DecodedUser>(storedToken); // ✅ 型を指定
                console.log("✅ デコードされたJWT:", decodedUser);

                // ✅ `user_id` を `userId` にリネームしてセット
                const userData = {
                    userId: decodedUser.user_id, // ✅ 修正
                    userType: decodedUser.user_type,
                    affiType: decodedUser.affi_type,
                    token: storedToken
                };
                setUser(userData);
                
                // globalThis.userを設定
                globalThis.user = userData;
                console.log("✅ globalThis.user を設定:", globalThis.user);

                setIsAuthenticated(true); 
            } catch (error) {
                console.error("🔴 トークンのデコードに失敗:", error);
                setUser(null);
                setIsAuthenticated(false);
            }
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }

        setLoading(false);
    }, []);
    
    // userが変更されたらglobalThis.userも更新
    useEffect(() => {
        if (user && user.token) {
            globalThis.user = user;
            console.log("✅ globalThis.user を更新:", globalThis.user);
        } else if (!user) {
            globalThis.user = null;
            console.log("⚠️ globalThis.user をクリア");
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            loading, 
            error, 
            login, 
            logout, 
            apiClient,  // ✅ `apiClient` を維持
        } as AuthContextType}>
            {children}
        </AuthContext.Provider>
    );
};
