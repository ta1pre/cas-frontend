// src/app/p/customer/castprof/[id]/modal/CastProfileModal.tsx
import React, { useEffect, useRef } from "react";
import { Dialog, DialogContent, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CastProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    castId: number;
}

export default function CastProfileModal({ isOpen, onClose, castId }: CastProfileModalProps) {
    const dialogTitleRef = useRef<HTMLDivElement | null>(null);
    const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            // モーダルが開いたらタイトルにフォーカスを移動
            setTimeout(() => {
                dialogTitleRef.current?.focus();
            }, 100);
        } else {
            // モーダルを閉じるときに、開いたボタンにフォーカスを戻す
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
        >
            <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1 }}
                        tabIndex={-1} // フォーカス可能にする
                        ref={dialogTitleRef}
                    >
                        キャストID: {castId} のプロフィール
                    </Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                        ref={triggerButtonRef}
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <Typography variant="h5">キャストID {castId} の情報を取得</Typography>
            </DialogContent>
        </Dialog>
    );
}
