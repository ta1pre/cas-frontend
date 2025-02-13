"use client";

import Link from "next/link";
import { Button, Container, Typography, Box } from "@mui/material";

export default function DashboardPage() {
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
                bgcolor: "background.default" // ✅ 背景色を theme から取得
            }}
        >
            {/* タイトル */}
            <Typography 
                variant="h5" 
                component="h1" 
                sx={{ color: "text.primary", fontWeight: "bold" }} // ✅ テキストカラーを適用
            >
                ダッシュボード
            </Typography>

            {/* ボタンを中央に配置 */}
            <Box sx={{ display: "flex", flexGrow: 1, alignItems: "center", justifyContent: "center" }}>
                <Link href="/p/cast" passHref>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "primary.main", // ✅ ボタンの色を適用
                            color: "white",
                            fontSize: "1.2rem",
                            padding: "14px 32px",
                            borderRadius: "8px",
                            "&:hover": { bgcolor: "primary.dark" },
                        }}
                    >
                        📌 キャストのページへ
                    </Button>
                </Link>
            </Box>
        </Container>
    );
}
