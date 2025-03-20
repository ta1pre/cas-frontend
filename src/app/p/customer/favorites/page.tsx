// src/app/p/customer/favorites/page.tsx
"use client";

import { useState, useCallback } from "react";
import { Avatar, Box, ListItemAvatar, ListItemText, Typography, Divider, Badge, ListItem } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSwipeable } from "react-swipeable";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function FavoritesPage() {
  const router = useRouter();

  const [favoriteCasts, setFavoriteCasts] = useState([
    { id: 182, name: "桜井 美咲", age: 24, image: "/sandbox/bg.jpg", available: true },
    { id: 183, name: "佐藤 玲奈", age: 26, image: "/sandbox/bg.jpg", available: false },
    { id: 184, name: "田中 美優", age: 22, image: "/sandbox/bg.jpg", available: false },
  ]);

  // ✅ 削除関数（useCallback で最適化）
  const handleRemoveFavorite = useCallback((id: number) => {
    setFavoriteCasts((prevCasts) => prevCasts.filter((cast) => cast.id !== id));
  }, []);

  // ✅ スワイプのハンドラー（リストごとに適用）
  const swipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      const target = eventData.event?.currentTarget as HTMLElement | null;
      if (!target) return;
      handleRemoveFavorite(Number(target.dataset.id));
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

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

      <AnimatePresence>
        {favoriteCasts.map((cast, index) => (
          <motion.div
            key={cast.id}
            data-id={cast.id}
            {...swipeHandlers}
            initial={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <ListItem className="hover:bg-gray-100 cursor-pointer" onClick={() => handleItemClick(cast.id)}>
              <ListItemAvatar>
                <Badge
                  variant="dot"
                  color="error"
                  overlap="circular"
                  invisible={!cast.available}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Avatar src={cast.image} alt={cast.name} className="w-12 h-12" />
                </Badge>
              </ListItemAvatar>
              <ListItemText primary={`${cast.name} (${cast.age}歳)`} />
              <ArrowForwardIosIcon className="text-gray-400" fontSize="small" />
            </ListItem>
            {index < favoriteCasts.length - 1 && <Divider />}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
