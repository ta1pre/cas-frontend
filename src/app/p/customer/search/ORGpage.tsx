"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Box, Card, CardContent, CardMedia } from "@mui/material";
import { fetchAPI } from "@/services/auth/axiosInterceptor";

export default function SearchPage() {
    const [casts, setCasts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const limit = 12;

    // offset の更新時にデータ取得を実施
useEffect(() => {
    console.log("【現在の offset】:", offset); // ✅ offset の値をログに出す

    async function fetchCasts() {
        if (loading) return;

        console.log("【API リクエスト】", { limit, offset }); // ✅ API に送る `offset` を確認

        const user = globalThis.user ?? null;
        if (!user) {
            setError("ログインしてください");
            return;
        }

        try {
            setLoading(true);
            const response = await fetchAPI("/api/v1/customer/search/", { limit, offset });
            console.log("【API Response】:", response); // ✅ API のレスポンスを確認

            if (!response) throw new Error("キャスト情報の取得に失敗しました。");

            // 既存の cast_id を保持して重複を排除
            setCasts((prev) => {
                const existingIds = new Set(prev.map((cast) => cast.cast_id));
                const newCasts = response.filter((cast: any) => !existingIds.has(cast.cast_id));
                return [...prev, ...newCasts];
            });
        } catch (err) {
            setError("キャスト情報の取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    }

    fetchCasts();
}, [offset]); // ✅ offset が変わるたびに API を呼ぶ

// スクロールイベントで offset を更新
useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const handleScroll = () => {
        if (loading) return;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollY + windowHeight >= documentHeight * 0.8) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                setOffset((prevOffset) => {
                    console.log("【offset 更新前】:", prevOffset); // ✅ offset 更新前の値を確認
                    return prevOffset + limit;
                });
            }, 300); // 300ms の遅延を入れる
        }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
        if (timer) clearTimeout(timer);
        window.removeEventListener("scroll", handleScroll);
    };
}, [loading]); // ✅ loading を監視してスクロール処理を制御


    return (
        <Container>
            <Typography variant="h4" gutterBottom>キャスト検索</Typography>
            {error && <Typography color="error">{error}</Typography>}

            <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mt={2}>
                {casts.map((cast: any) => (
                    <Box key={cast.cast_id} width="calc(33.333% - 16px)" maxWidth={300}>
                        <Card>
                            {cast.profile_image_url ? (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={cast.profile_image_url}
                                    alt={cast.name}
                                />
                            ) : (
                                <Box height="140" display="flex" alignItems="center" justifyContent="center" bgcolor="grey.300">
                                    <Typography>画像なし</Typography>
                                </Box>
                            )}
                            <CardContent>
                                <Typography variant="h6">{cast.name} ({cast.age}歳)</Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            {loading && <Typography>ロード中...</Typography>}
        </Container>
    );
}
