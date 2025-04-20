"use client";

import { useState, useEffect } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import axios from 'axios';
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// 成功/エラー時のレスポンス型を簡略化
type TestResultType = { message: string } | { error: string } | null;

export default function DemoLoginPage() {
    const [testResult, setTestResult] = useState<TestResultType>(null);
    const router = useRouter();

    useEffect(() => {
        // ページアクセス時にCookieとlocalStorageをクリア
        Object.keys(Cookies.get()).forEach(cookieName => {
            Cookies.remove(cookieName, { path: '' });
            Cookies.remove(cookieName, { path: '/' });
        });
        localStorage.clear();
    }, []);

    const handleLogin = async () => {
        try {
            // クッキーとローカルストレージをクリア
            Object.keys(Cookies.get()).forEach(cookieName => {
                Cookies.remove(cookieName, { path: '' });
                Cookies.remove(cookieName, { path: '/' });
            });
            localStorage.clear();
            setTestResult(null);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                setTestResult({ error: "API URLが設定されていません。" });
                return;
            }
            // user_id: 183 でログイン
            const response = await axios.post(
                `${apiUrl}/api/v1/admin/test-login/login_nopw`,
                { user_id: 183 }
            );
            if (response.data && response.data.refresh_token && response.data.access_token) {
                Cookies.set("refresh_token", response.data.refresh_token, { expires: 7, secure: false, sameSite: "lax" });
                Cookies.set("token", response.data.access_token, { expires: 1, secure: false, sameSite: "lax" });
                setTestResult({ message: "成功" });
                router.push("/p/cast");
            } else {
                setTestResult({ error: "APIから予期しない形式のレスポンスが返されました。" });
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || error.message || "API接続中にエラーが発生しました。";
            setTestResult({ error: errorMessage });
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
            <Typography variant="h5" component="h1" sx={{ fontWeight: "bold", textAlign: "center", color: "#FF80AB" }}>
                サービスエリア
            </Typography>
            <Box sx={{ mt: 6, textAlign: "center" }}>
                <Button
                    variant="contained"
                    onClick={handleLogin}
                    fullWidth
                    sx={{
                        background: "linear-gradient(90deg, #FF80AB 0%, #FFB6C1 100%)",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        py: 2,
                        borderRadius: "30px",
                        boxShadow: 3,
                        "&:hover": {
                            background: "linear-gradient(90deg, #FFB6C1 0%, #FF80AB 100%)",
                        },
                    }}
                >
                    予約エリアを見る
                </Button>
                <Typography variant="body2" sx={{ mt: 4, color: "#FF80AB" }}>
                    {testResult ? ('message' in testResult ? testResult.message : testResult.error) : ""}
                </Typography>
            </Box>
        </Container>
    );
}
