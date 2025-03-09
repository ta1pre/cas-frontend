"use client";

import { Box, TextField, Typography } from "@mui/material";

interface Props {
    value: string;
    onChange: (message: string) => void;
}

export default function MessageInput({ value, onChange }: Props) {
    return (
        <Box className="w-full bg-white rounded-lg shadow">
            {/* ✅ タイトル部分（デザイン修正） */}
            <Box className="px-4 py-2 rounded-t-lg" sx={{ backgroundColor: "#fce7f3", borderBottom: "2px solid #ec4899" }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ec4899" }}>
                    一言メッセージ
                </Typography>
            </Box>

            {/* ✅ コンテンツエリア */}
            <Box className="p-4">
                {/* ✅ 説明文 */}
                <p className="text-sm text-gray-600">
                    ご希望や要望があれば自由にご記入ください。
                </p>

                {/* ✅ テキストエリア */}
                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    variant="outlined"
                    placeholder="例）長めにお願いしたい、希望オプションなど"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    sx={{ mt: 2 }}
                />
            </Box>
        </Box>
    );
}
