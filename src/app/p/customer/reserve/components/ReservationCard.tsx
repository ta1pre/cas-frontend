import { useState, useEffect } from "react";
import { Card, CardContent, Chip, Typography, Avatar, IconButton, Tooltip } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ShareIcon from "@mui/icons-material/Share";
import { useRouter } from "next/navigation"; // ✅ ルーターをインポート
import { ReservationListItem } from "../api/types";
import { formatDateTime } from "../utils/format";
import { fetchCustomerCast } from "../api/getCastName"; // ✅ キャスト情報を取得

interface Props {
  reservation: ReservationListItem;
  onClick: () => void;
}

export default function ReservationCard({ reservation, onClick }: Props) {
  const router = useRouter();
  const [castName, setCastName] = useState<string | null>(null);
  const [castImage, setCastImage] = useState<string | null>(null);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

  useEffect(() => {
    async function loadCastInfo() {
      if (!reservation.cast_id) return;
      const castData = await fetchCustomerCast(reservation.cast_id);
      if (castData) {
        setCastName(castData.name || "不明なキャスト");
        setCastImage(castData.profile_image_url || null);
      }
    }
    loadCastInfo();
  }, [reservation.cast_id]);

  // ✅ 3日以内の予約を判定
  const isWithin3Days = (() => {
    const now = new Date();
    const startDate = new Date(reservation.start_time);
    const diffDays = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 3;
  })();

  // 共有リンクをクリップボードにコピーする関数
  const copyShareLink = (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素のクリックイベントを停止
    
    // 現在のURLを取得し、ハッシュを追加
    const baseUrl = window.location.href.split('#')[0];
    const shareUrl = `${baseUrl}#${reservation.reservation_id}`;
    
    // クリップボードにコピー
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        // コピー成功時にツールチップを表示
        setShowCopiedTooltip(true);
        setTimeout(() => setShowCopiedTooltip(false), 2000);
      })
      .catch(err => {
        console.error('クリップボードへのコピーに失敗しました:', err);
      });
  };

  return (
    <Card
      className="cursor-pointer transition-transform transform hover:scale-[1.02] shadow-md rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg"
      onClick={onClick}
    >
      <CardContent className="p-5 bg-white flex items-center justify-between">
        <div className="w-full">
          {/* ✅ ステータス + 予約ID / コース の位置を変更 */}
          <div className="flex items-center justify-between mb-2">
            <Chip
              label={reservation.status}
              sx={{ backgroundColor: reservation.color_code, color: "white" }}
              size="small"
            />
            <div className="flex items-center">
              <Typography variant="body2" className="text-gray-600 font-medium mr-2">
                予約ID: #{reservation.reservation_id} / {reservation.course_name}
              </Typography>
            </div>
          </div>

          {/* ✅ 3日以内ラベルを日付の上に追加 */}
          {isWithin3Days && (
            <Typography
              variant="body2"
              className="text-red-600 font-semibold mb-1"
            >
              📌 3日以内
            </Typography>
          )}

          {/* ✅ 日付を強調 */}
          <Typography variant="body1" className="text-gray-900 text-lg font-bold">
            {formatDateTime(reservation.start_time)} @ {reservation.location || "未設定"}
          </Typography>

          {/* ✅ キャスト情報 (丸い画像 + 名前) */}
          <div className="flex items-center mt-3">
            <Avatar
              src={castImage || "/default-avatar.png"} // ✅ 画像 or デフォルト
              alt={castName || "キャスト"}
              className="w-10 h-10 rounded-full mr-3"
            />
            <Typography variant="body1" className="font-semibold text-gray-900">
              {castName || "不明なキャスト"}
            </Typography>
          </div>

          {/* ✅ 最新メッセージ */}
          {reservation.last_message_preview && (
            <div className="mt-3 p-2 bg-gray-100 rounded-lg text-gray-600 text-sm">
              <Typography variant="body2">
                <span className="font-medium">最新メッセージ:</span> {reservation.last_message_preview}...
              </Typography>
            </div>
          )}
        </div>

        {/* ✅ 右矢印アイコンの位置を調整 */}
        <div
          className="w-12 h-full flex items-center justify-center cursor-pointer hover:bg-gray-200 rounded-r-lg"
          onClick={() => router.push(`/p/customer/reservation/${reservation.reservation_id}`)}
        >
          <KeyboardArrowRightIcon className="text-gray-500" fontSize="large" />
        </div>
      </CardContent>
    </Card>
  );
}
