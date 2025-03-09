// src/app/p/customer/offer/[castId]/components/OfferHeader.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, IconButton, Avatar, CircularProgress } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { fetchCustomerCast } from "../api/getCustomerCast";

interface OfferHeaderProps {
    castId: number;
}

const OfferHeader: React.FC<OfferHeaderProps> = ({ castId }) => {
    const router = useRouter();
    const [cast, setCast] = useState<{ name?: string; profile_image_url?: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCastData() {
            const data = await fetchCustomerCast(castId);
            setCast(data);
            setLoading(false);
        }
        loadCastData();
    }, [castId]);

    const handleBack = () => {
        router.push(`/p/customer/castprof/${castId}`);
    };

    return (
        <Box className="w-full bg-white shadow-md p-4 flex items-center space-x-3">
            {/* ✅ 戻るボタン */}
            <IconButton onClick={handleBack} sx={{ color: "black" }}>
                <ArrowBackIosRoundedIcon />
            </IconButton>

            {/* ✅ ローディング状態 */}
            {loading ? (
                <CircularProgress size={24} />
            ) : (
                <>
                    {/* ✅ キャストの写真＋名前 */}
                    <Avatar src={cast?.profile_image_url || "/default-avatar.png"} alt={cast?.name || "キャスト"} sx={{ width: 36, height: 36 }} />
                    <Typography variant="h6" className="font-bold">{cast?.name || "不明なキャスト"}</Typography>
                </>
            )}
        </Box>
    );
};

export default OfferHeader;
