import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

const mockData = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  image: "/sandbox/bg.jpg",
  text: `サンプルテキスト ${i + 1} - これはミニログのテスト用テキストです。`
}));

export default function MiniLog() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const openImage = (id: number) => {
    setExpandedId(id);
    document.body.classList.add("overflow-hidden"); // スクロール禁止
  };

  const closeImage = () => {
    setExpandedId(null);
    document.body.classList.remove("overflow-hidden"); // スクロール復活
  };

  useEffect(() => {
    return () => document.body.classList.remove("overflow-hidden"); // クリーンアップ
  }, []);

  return (
    <Box className="p-4">
      {/* 画像タイル */}
      <Box className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {mockData.map((log) => (
          <Box
            key={log.id}
            className="cursor-pointer rounded-lg overflow-hidden shadow-md transition-transform duration-200 hover:scale-105"
            onClick={() => openImage(log.id)}
          >
            <img
              src={log.image}
              alt={`ミニログ ${log.id}`}
              className="w-full h-32 object-cover rounded-lg"
            />
          </Box>
        ))}
      </Box>

      {/* 全画面表示 */}
      {expandedId !== null && (
        <Box
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md z-[9999] flex items-center justify-center transition-opacity duration-300 ease-out opacity-100"
          onClick={closeImage}
        >
          {/* 拡大画像（全画面表示） */}
          <Box className="relative w-screen h-screen flex items-center justify-center">
            <img
              src={mockData[expandedId].image}
              alt="拡大表示"
              className="w-full h-full object-cover"
            />

            {/* 透過テキストエリア（左寄せ & ふわっと表示 & 白背景固定） */}
            <Box
              className="absolute bottom-12 left-4 right-4 bg-white dark:bg-white backdrop-blur-md text-black rounded-xl p-4 max-w-screen-md mx-auto text-left transition-all duration-500 ease-out opacity-0 translate-y-4 mb-6"
              style={{
                opacity: expandedId !== null ? 1 : 0,
                transform: expandedId !== null ? "translateY(0)" : "translateY(10px)",
              }}
            >
              {mockData[expandedId].text}
            </Box>
          </Box>

          {/* 閉じるボタン */}
          <Box
            className="absolute top-4 right-4 cursor-pointer text-white bg-black bg-opacity-40 rounded-full p-2 transition-opacity duration-200 hover:bg-opacity-70"
            onClick={closeImage}
          >
            ✕
          </Box>
        </Box>
      )}
    </Box>
  );
}
