import { useState } from "react";
import { fetchAPI } from "@/services/auth/axiosInterceptor";
import { Dialog, DialogTitle, DialogContent, Button, MenuItem, Select, Typography } from "@mui/material";
import { PREFECTURE_OPTIONS } from "../../config/prefectures"; // ✅ 都道府県リストをインポート

interface GetPrefectureModalProps {
    userId: number | null;
    open: boolean;
    onClose: (selectedPrefecture: number | null) => void;
}

export default function GetPrefectureModal({ userId, open, onClose }: GetPrefectureModalProps) {
    const [prefecture, setPrefecture] = useState<number | "">("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegisterPrefecture = async () => {
        if (!userId || prefecture === "") {
            console.warn("⚠️ ユーザーIDまたは都道府県が無効です");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log("📡 `POST /api/v1/customer/area/prefecture/register` を実行", { user_id: userId, prefecture_id: prefecture });

            const response = await fetchAPI("/api/v1/customer/area/prefecture/register", {
                user_id: userId,
                prefecture_id: Number(prefecture), // ✅ 数値に変換
            });

            console.log("✅ API レスポンス:", response);

            // 成功時はモーダルを閉じる
            onClose(Number(prefecture));
        } catch (err) {
            console.error("🚨 都道府県の登録エラー:", err);
            setError("都道府県の登録に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(null)} fullWidth maxWidth="sm">
            <DialogTitle>都道府県を選択</DialogTitle>
            <DialogContent>
                {error && <Typography color="error">{error}</Typography>}
                <Typography gutterBottom>検索初期値に使用します</Typography>
                <Select
                    value={prefecture}
                    onChange={(e) => setPrefecture(Number(e.target.value))}
                    fullWidth
                >
                    {Object.entries(PREFECTURE_OPTIONS).map(([key, value]) => (
                        <MenuItem key={key} value={value}>{key}</MenuItem>
                    ))}
                </Select>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleRegisterPrefecture}
                    disabled={loading}
                >
                    {loading ? "登録中..." : "決定"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
