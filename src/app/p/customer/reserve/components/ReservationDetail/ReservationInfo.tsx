import { ReservationListItem } from "../../api/types";
import { formatDateTime } from "../../utils/format";

interface Props {
  reservation: ReservationListItem;
}

export default function ReservationInfo({ reservation }: Props) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">{reservation.cast_name} の予約詳細</h2>
      <p>
        📅 {reservation.start_time.startsWith("7777-07-07")
          ? `最速調整中@${reservation.location || "未設定"}`
          : formatDateTime(reservation.start_time)}
      </p>
      <p>💆‍♀️ コース: {reservation.course_name} - {reservation.course_price.toLocaleString()}円</p>
      <p>📍 場所: {reservation.location || "未設定"}</p>
      <p>💰 予約料金: {reservation.reservation_fee.toLocaleString()}円</p>
      <p>🚕 交通費: {reservation.traffic_fee.toLocaleString()}円</p>

      {reservation.option_list.length > 0 && (
        <div className="mt-2">
          <h3 className="font-bold">🛠 オプション:</h3>
          <ul className="list-disc pl-4">
            {reservation.option_list.map((option, index) => (
              <li key={index}>
                {option} ({reservation.option_price_list[index].toLocaleString()}円)
              </li>
            ))}
          </ul>
          <p className="font-bold">💳 オプション合計: {reservation.total_option_price.toLocaleString()}円</p>
        </div>
      )}

      {reservation.total_price !== null && (
       <p className="text-lg font-bold mt-2">
  💵 総額: {reservation.total_price !== undefined ? reservation.total_price.toLocaleString() + "円" : "未定"}
</p>

      )}

      {reservation.last_message_preview && (
        <p className="mt-2 text-gray-500">
          💬 最新メッセージ: {reservation.last_message_preview}
        </p>
      )}
    </div>
  );
}
