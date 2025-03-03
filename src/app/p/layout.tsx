"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/context/auth/useAuth"; 
import { setGlobalUser } from "@/context/auth/globalUser"; // ✅ `globalThis.user` にセット
import LocalTokenMake from "./components/LocalTokenMake";
import { Container, CircularProgress, Box } from "@mui/material";

interface LayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
    const [tokenRefreshed, setTokenRefreshed] = useState(false);
    const auth = useAuth();

    useEffect(() => {
        console.log("✅ LocalTokenMake が完了したら `useAuth()` を実行");

        setGlobalUser(auth.user); // ✅ `globalThis.user` に `user` をセット
        setTokenRefreshed(true);
    }, [auth.user]); // ✅ `auth.user` が更新されたら `globalThis.user` も更新

    console.log("✅ layout.tsx で取得した user:", auth.user);

    if (!tokenRefreshed || auth.loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <LocalTokenMake>
            <Container
                maxWidth={false} 
                sx={{
                    minHeight: "100vh",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    padding: 0,
                }}
            >
                {children}
            </Container>
        </LocalTokenMake>
    );
}
