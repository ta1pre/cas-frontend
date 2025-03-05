// src/app/p/customer/castprof/[id]/modal/CastProfileModal.tsx
import React, { useEffect, useRef } from "react";
import { Dialog, DialogContent, AppBar, Toolbar, Typography, IconButton, CircularProgress, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CastProfile from "../components/profile/CastProfile";
import { useProfile } from "../hooks/useProfile";
import ErrorMessage from "../components/common/ErrorMessage";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";


interface CastProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    castId: number;
    source?: "検索結果" | "お気に入り";
}

export default function CastProfileModal({ isOpen, onClose, castId, source }: CastProfileModalProps) {
    const dialogTitleRef = useRef<HTMLDivElement | null>(null);
    const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
    const { profile, loading, error } = useProfile(castId);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                dialogTitleRef.current?.focus();
            }, 100);
        } else {
            requestAnimationFrame(() => {
                triggerButtonRef.current?.focus();
            });
        }
    }, [isOpen]);

    return (
<Dialog 
            fullScreen 
            open={isOpen} 
            onClose={onClose} 
            disableEnforceFocus 
            disableRestoreFocus
            sx={{ backgroundColor: "green" }} // ✅ 背景色を一時的に設定して確認
        >
            <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
                <Toolbar onClick={onClose} sx={{ cursor: "pointer" }}>
                    <ArrowBackIosRoundedIcon />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {source ? ` ${source} に戻る` : " プロフィールに戻る"}
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent 
                sx={{ 
                    padding: 0, 
                    margin: 0,  // ✅ `margin` もゼロにして余白を完全になくす
                    width: "100vw", // ✅ 幅を100vwに設定
                    height: "100vh", // ✅ 高さも100vhに設定
                    display: "flex", // ✅ 縦方向のズレを防ぐ
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : profile ? (
                    <Box className="relative w-full h-full">
                        <CastProfile profile={profile} />
                    </Box>
                ) : (
                    <ErrorMessage message="キャストが見つかりません" />
                )}
            </DialogContent>
        </Dialog>
    );
}
