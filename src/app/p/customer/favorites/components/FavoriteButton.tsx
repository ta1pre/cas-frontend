'use client';

import { useState } from 'react';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { addFavorite, removeFavorite } from '../api/favoriteActions';

interface FavoriteButtonProps {
    castId: number;
    initialFavorited?: boolean;
    size?: 'small' | 'medium' | 'large';
    color?: string;
    className?: string;
    onToggle?: (isFavorited: boolean) => void;
}

export default function FavoriteButton({
    castId,
    initialFavorited = false,
    size = 'medium',
    color = '#FF69B4',  // ピンク色をデフォルトに
    className = '',
    onToggle
}: FavoriteButtonProps) {
    const [isFavorited, setIsFavorited] = useState(initialFavorited);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleClick = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        try {
            if (isFavorited) {
                await removeFavorite(castId);
            } else {
                await addFavorite(castId);
            }
            setIsFavorited(!isFavorited);
            onToggle?.(!isFavorited);
        } catch (error) {
            console.error('お気に入り操作に失敗しました:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <IconButton
            onClick={handleClick}
            disabled={isProcessing}
            size={size}
            className={`transition-transform hover:scale-110 ${className}`}
            aria-label={isFavorited ? 'お気に入りから削除' : 'お気に入りに追加'}
        >
            {isFavorited ? (
                <FavoriteIcon sx={{ color }} />
            ) : (
                <FavoriteBorderIcon sx={{ color }} />
            )}
        </IconButton>
    );
}
