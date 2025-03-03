"use client";

import { useEffect, useState } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { fetchAPI } from "@/services/auth/axiosInterceptor"; // ✅ `fetchAPI()` を使う

export default function DashboardPage() {
    const user = globalThis.user ?? null; // ✅ `globalThis.user` から取得！
    const [testResult, setTestResult] = useState(null);

    useEffect(() => {
        const testAPI = async () => {
            console.log("✅ page.tsx で `POST /api/v1/setup/status/test` を実行");

            const response = await fetchAPI("/api/v1/setup/status/test", { user_id: user?.userId });

            console.log("✅ API のレスポンス:", response);
            setTestResult(response);
        };

        if (user) {
            testAPI();
        }
    }, [user]);

    console.log("✅ page.tsx で受け取った user:", user);

    return (
        <Container 
            maxWidth="sm" 
            sx={{
                minHeight: "100vh", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between",
                py: 6, 
                px: 4, 
                bgcolor: "background.default"
            }}
        >
            <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
                ダッシュボード
            </Typography>

            <Box sx={{ mt: 4, textAlign: "center" }}>
                {user ? (
                    <>
                        <Typography variant="body1">👤 ユーザーID: {user.userId}</Typography>
                        <Typography variant="body1">🔑 トークン: {user.token || "N/A"}</Typography>
                        <Typography variant="body1">🛠 API テスト結果: {testResult ? JSON.stringify(testResult) : "取得中..."}</Typography>
                    </>
                ) : (
                    <Typography variant="body1" color="error">ログインしていません</Typography>
                )}
            </Box>
        </Container>
    );
}
