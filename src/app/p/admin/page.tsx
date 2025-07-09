"use client";

import { useEffect, useState } from "react";
import { Button, Container, Typography, Box, TextField } from "@mui/material";
import { fetchAPI } from "@/services/auth/axiosInterceptor"; // ✅ `fetchAPI()` を使う
import Cookies from "js-cookie"; // ✅ クッキー操作用ライブラリ

export default function AdminTestLoginPage() {
    const [userId, setUserId] = useState(""); // ✅ ユーザーID入力用の状態
    const [testResult, setTestResult] = useState(null);

    const handleLogin = async () => {
        if (!userId) {
            console.error("⚠️ ユーザーIDを入力してください");
            return;
        }
        console.log("✅ page.tsx で `POST /api/v1/admin/test-login/login` を実行", { user_id: userId });

        try {
            const response = await fetchAPI("/api/v1/admin/test-login/login", { user_id: parseInt(userId, 10) });
            console.log("✅ API のレスポンス:", response);
            
            // ✅ `refresh_token` を適切に保存
            Cookies.set("refresh_token", response.refresh_token, { expires: 7, secure: true, sameSite: "Strict" });
            
            // ✅ `token` を適切に保存
            Cookies.set("token", response.access_token, { expires: 1, secure: true, sameSite: "Strict" });
            
            // ✅ グローバルな認証状態を更新
            globalThis.user = { 
                token: response.access_token, 
                userId: parseInt(userId, 10),
                userType: 'admin',
                affiType: null
            };
            
            setTestResult(response);
        } catch (error) {
            console.error("❌ API エラー:", error);
        }
    };

    return (
        <Container 
            maxWidth="sm" 
            sx={{
                minHeight: "100vh", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "center",
                py: 6, 
                px: 4, 
                bgcolor: "background.default"
            }}
        >
            <Typography variant="h5" component="h1" sx={{ fontWeight: "bold", textAlign: "center" }}>
                Admin Test Login
            </Typography>

            <Box sx={{ mt: 4, textAlign: "center" }}>
                <TextField 
                    label="ユーザーID" 
                    variant="outlined" 
                    fullWidth 
                    value={userId} 
                    onChange={(e) => setUserId(e.target.value)} 
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={handleLogin} fullWidth>
                    テストログイン
                </Button>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    🛠 API テスト結果: {testResult ? JSON.stringify(testResult) : "未実行"}
                </Typography>
            </Box>
        </Container>
    );
}
