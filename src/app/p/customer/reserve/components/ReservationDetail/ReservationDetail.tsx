// ReservationDetail.tsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ReservationListItem } from "../../api/types";
import { formatDateTime, formatNumberWithCommas } from "../../utils/format";
import { fetchCustomerCast } from "../../api/getCastName";
import { Chip, Typography, Avatar } from "@mui/material";
import StatusHandler from "../status/StatusHandler";
import MessageToggleButton from "../Message/MessageToggleButton"; 
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenMessage: () => void;
  onCloseMessage: () => void;
  reservation?: ReservationListItem;
  onUpdate?: () => Promise<void>;
}

export default function ReservationDetail({
  isOpen,
  onClose,
  onOpenMessage,
  onCloseMessage,
  reservation,
  onUpdate,
}: Props) {
  const [castName, setCastName] = useState<string>("不明なキャスト");
  const [castImage, setCastImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadCastInfo() {
      if (!reservation?.cast_id) return;
      const castData = await fetchCustomerCast(reservation.cast_id);
      if (castData) {
        setCastName(castData.name || "不明なキャスト");
        setCastImage(castData.profile_image_url || undefined);
      }
    }
    loadCastInfo();
  }, [reservation]);

  if (!reservation) return null;

  const totalPrice =
    reservation.course_price +
    reservation.total_option_price +
    reservation.traffic_fee +
    reservation.reservation_fee;

  return (
  <motion.div
  initial={{ x: "100%" }}
  animate={{ x: "0%" }}
  exit={{ x: "100%" }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
  drag="x"
  dragConstraints={{ left: -100, right: 0 }}
  onDragEnd={(e, info) => info.offset.x < -50 && onClose()}
  onClick={onCloseMessage}
  className="fixed top-0 right-0 z-50 h-full w-[90%] md:w-1/2 bg-white shadow-lg flex flex-col"
>
  {/* ✅ 左矢印（←）の位置はそのまま */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClose();
    }}
    className="absolute top-3 left-3 p-1"
  >
    <KeyboardArrowLeftIcon fontSize="large" className="text-gray-600" />
  </button>

  {/* ✅ ステータスと予約詳細を右にずらす */}
  <div className="flex items-center justify-between p-4 border-b bg-gray-100">
    <div className="flex items-center gap-2 ml-8"> {/* ✅ 矢印にかぶらないように `ml-8` を追加 */}
      <Chip label={reservation.status} style={{ backgroundColor: reservation.color_code, color: "#fff" }} />
<Typography 
  variant="subtitle1" 
  component="span" 
  sx={{ fontWeight: "bold" }} 
>
  📌 予約詳細 <span className="text-gray-600">#{reservation.reservation_id}</span>
</Typography>

    </div>
  </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center mb-6">
          <Avatar src={castImage || "/default-avatar.png"} alt={castName} className="w-12 h-12 mr-3" />
          <a
            href={`/p/customer/castprof/${reservation.cast_id}`}
            className="text-gray-600 hover:text-gray-400 transition-colors underline"
          >
            {castName}
          </a>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="py-2 font-bold text-gray-600">日時</td>
                <td className="py-2 text-right font-semibold">{formatDateTime(reservation.start_time)}</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-gray-600">コース</td>
                <td className="py-2 text-right font-semibold">{reservation.course_name}</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-gray-600">場所</td>
                <td className="py-2 text-right font-semibold">{reservation.location || "未設定"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <StatusHandler
          reservationId={reservation.reservation_id}
          statusKey={reservation.status_key}
          onUpdate={onUpdate}
        />

        <table className="w-full border-collapse mt-4">
          <tbody>
            <tr>
              <td className="py-2 font-bold text-gray-600">指名料</td>
              <td className="py-2 text-right font-semibold">{formatNumberWithCommas(reservation.reservation_fee)} pt</td>
            </tr>
            <tr>
              <td className="py-2 font-bold">基本料金</td>
              <td className="py-2 text-right font-semibold">{formatNumberWithCommas(reservation.course_price)} pt</td>
            </tr>
            <tr>
              <td className="py-2 font-bold text-gray-600">交通費</td>
              <td className="py-2 text-right font-semibold">{formatNumberWithCommas(reservation.traffic_fee)} pt</td>
            </tr>
            {reservation.option_list.map((option, index) => (
              <tr key={index}>
                <td className="py-2 font-bold text-gray-600">{option} (OP)</td>
                <td className="py-2 text-right font-semibold">
                  {formatNumberWithCommas(reservation.option_price_list[index])} pt
                </td>
              </tr>
            ))}
            <tr className="border-t border-gray-200 font-bold">
              <td className="py-2 text-lg">合計</td>
              <td className="py-2 text-right text-lg">{formatNumberWithCommas(totalPrice)} pt</td>
            </tr>
          </tbody>
        </table>
      </div>

<div className="p-4">
  <div onClick={(e) => { 
    e.stopPropagation(); // ✅ クリックイベントのバブリングを防ぐ
    onOpenMessage(); // ✅ メッセージパネルを開く
  }}>
    <MessageToggleButton isOpen={false} onClick={() => {}} />
  </div>
</div>
    </motion.div>
  );
}
