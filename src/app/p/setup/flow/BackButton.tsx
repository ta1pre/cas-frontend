'use client';

import React from 'react';
import { IconButton, Box } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

interface Props {
    onClick: () => void;
}

export default function BackButton({ onClick }: Props) {
    return (
        <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
            <IconButton
                onClick={onClick}
                sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.1)', // ✅ グレー系の背景（半透明）
                    color: '#333', // ✅ 文字色（ダークグレー）
                    width: 48,
                    height: 48,
                    borderRadius: '50%', // ✅ 丸い形
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.3s ease-in-out',
                    '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.2)', // ✅ ホバー時に少し濃く
                    },
                }}
            >
                <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
        </Box>
    );
}
