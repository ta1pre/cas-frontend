"use client";

import { useState } from "react";
import { Button, Container, Typography, Box, TextField } from "@mui/material";
import axios from 'axios';
import Cookies from "js-cookie";
import Link from "next/link"; 

// 成功/エラー時のレスポンス型を簡略化
type TestResultType = { message: string } | { error: string } | null;

export default function DemoLoginPage() {
    const [userId, setUserId] = useState("");
    const [testResult, setTestResult] = useState<TestResultType>(null); 
    const [isLoginSuccess, setIsLoginSuccess] = useState(false); 

    const handleLogin = async () => {
        console.log("🍪 クッキーとローカルストレージをクリアします...");
        // クッキーをすべて削除
        Object.keys(Cookies.get()).forEach(cookieName => {
            // クッキー削除のオプションを指定 (パスやドメインが設定されている場合に対応)
            // 一般的なアプリケーションではパスが '/' のことが多い
            // パスなし（デフォルト）とルートパスの両方で試す
            Cookies.remove(cookieName, { path: '' });
            Cookies.remove(cookieName, { path: '/' });
            // 必要であればドメインも考慮する (通常は不要なことが多い)
            // const domainParts = window.location.hostname.split('.');
            // while (domainParts.length > 1) {
            //     const currentDomain = domainParts.join('.');
            //     Cookies.remove(cookieName, { path: '/', domain: currentDomain });
            //     Cookies.remove(cookieName, { path: '', domain: currentDomain });
            //     domainParts.shift();
            // }
        });
        // ローカルストレージをクリア
        localStorage.clear();
        console.log("✅ クッキーとローカルストレージをクリアしました。");

        setIsLoginSuccess(false); 
        setTestResult(null);     
        if (!userId) {
            console.error("⚠️ ユーザーIDを入力してください");
            setTestResult({ error: "ユーザーIDを入力してください" });
            return;
        }
        console.log("✅ demo_login/page.tsx で `POST /api/v1/admin/test-login/login_nopw` を実行", { user_id: userId });

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                console.error("❌ NEXT_PUBLIC_API_URL が設定されていません。");
                setTestResult({ error: "API URLが設定されていません。" });
                return;
            }
            const response = await axios.post(
                `${apiUrl}/api/v1/admin/test-login/login_nopw`,
                { user_id: parseInt(userId, 10) }
            );
            console.log("✅ API のレスポンス:", response.data);

            if (response.data && response.data.refresh_token && response.data.access_token) {
                Cookies.set("refresh_token", response.data.refresh_token, { expires: 7, secure: true, sameSite: "Strict" });
                Cookies.set("token", response.data.access_token, { expires: 1, secure: true, sameSite: "Strict" });
                // globalThis.user = { token: response.data.access_token, userId }; 

                setTestResult({ message: "成功" }); 
                setIsLoginSuccess(true); 
            } else {
                console.error("❌ 無効なAPIレスポンス構造:", response.data);
                setTestResult({ error: "APIから予期しない形式のレスポンスが返されました。" });
                setIsLoginSuccess(false);
            }
        } catch (error: any) {
            console.error("❌ API エラー:", error);
            const errorMessage = error.response?.data?.detail || error.message || "API接続中にエラーが発生しました。";
            setTestResult({ error: errorMessage });
            setIsLoginSuccess(false);
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
                Demo Test Login
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
                    🛠 API テスト結果:{" "}
                    {testResult ? ('message' in testResult ? testResult.message : testResult.error) : "未実行"} 
                </Typography>
                {/* ログイン成功時にリンクを表示 */}
                {isLoginSuccess && (
                    <Box sx={{ mt: 2 }}>
                        <Link href="/p/customer/search" passHref>
                            <Button variant="outlined" fullWidth>
                                ユーザーページへ
                            </Button>
                        </Link>
                    </Box>
                )}
            </Box>
        </Container>
    );
}
