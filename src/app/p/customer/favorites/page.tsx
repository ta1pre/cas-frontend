// src/app/p/customer/favorites/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, Box, ListItemAvatar, ListItemText, Typography, Divider, Badge, ListItem, CircularProgress } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSwipeable } from "react-swipeable";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getFavorites, removeFavorite } from "./api/favoriteActions";
import { FavoriteResponse } from "./api/favoritesTypes";

export default function FavoritesPage() {
  const router = useRouter();
  const [favoriteCasts, setFavoriteCasts] = useState<FavoriteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // APIからお気に入りデータを取得
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const data = await getFavorites();
        if (data && data.favorites) {
          setFavoriteCasts(data.favorites);
        }
        setError(null);
      } catch (err) {
        console.error("お気に入り取得エラー:", err);
        setError("お気に入りの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // お気に入り削除処理
  const handleRemoveFavorite = useCallback(async (id: number) => {
    try {
      await removeFavorite(id);
      setFavoriteCasts((prevCasts) => prevCasts.filter((cast) => cast.cast_id !== id));
    } catch (err) {
      console.error("お気に入り削除エラー:", err);
    }
  }, []);

  // スワイプ処理
  const swipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      const target = eventData.event?.currentTarget as HTMLElement | null;
      if (!target) return;
      handleRemoveFavorite(Number(target.dataset.id));
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // キャストプロフィールへ遷移
  const handleItemClick = (id: number) => {
    router.push(`/p/customer/castprof/${id}`);
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <Box className="flex items-center space-x-2 text-gray-800">
        <FavoriteIcon fontSize="large" className="text-pink-500" />
        <Typography variant="h5" fontWeight="bold">
          お気に入りキャスト
        </Typography>
      </Box>

      <Typography variant="body2" className="text-gray-500 text-center mb-2">
        ※ 左にスワイプすると解除できます
      </Typography>

      {loading ? (
        <Box className="flex justify-center my-8">
          <CircularProgress color="secondary" />
        </Box>
      ) : error ? (
        <Typography className="text-red-500 text-center my-4">{error}</Typography>
      ) : favoriteCasts.length === 0 ? (
        <Typography className="text-gray-500 text-center my-8">
          お気に入りのキャストはまだありません
        </Typography>
      ) : (
        <AnimatePresence>
          {favoriteCasts.map((cast, index) => (
            <motion.div
              key={cast.id}
              data-id={cast.cast_id}
              {...swipeHandlers}
              initial={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <ListItem className="hover:bg-gray-100 cursor-pointer" onClick={() => handleItemClick(cast.cast_id)}>
                <ListItemAvatar>
                  <Badge
                    variant="dot"
                    color="error"
                    overlap="circular"
                    invisible={true} // 在籍状況は現在APIから取得できないため非表示
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <Avatar 
                      src={cast.cast_info?.profile_image_url || cast.cast_info?.images?.[0]?.file_url || "/sandbox/bg.jpg"} 
                      alt={cast.cast_info?.name || `キャスト ${cast.cast_id}`} 
                      className="w-12 h-12" 
                    />
                  </Badge>
                </ListItemAvatar>
                <ListItemText 
                  primary={`${cast.cast_info?.name || `キャスト ${cast.cast_id}`} ${cast.cast_info?.age ? `(${cast.cast_info.age}歳)` : ''}`} 
                />
                <ArrowForwardIosIcon className="text-gray-400" fontSize="small" />
              </ListItem>
              {index < favoriteCasts.length - 1 && <Divider />}
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
