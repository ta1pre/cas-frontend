// 📂 src/app/p/cast/cont/reserve/types/reserveTypes.ts

export type ReservationStatus = 'confirmed' | 'requested' | 'adjusting' | 'completed' | 'canceled' | 'cancelled' | 'waiting_user_confirm' | 'cancelled_user' | 'cancelled_cast' | 'no_show_user' | 'no_show_cast' | 'dispute';

export interface CastReserveItem {
  reservation_id: number;
  user_id: number;
  user_name: string;
  status: ReservationStatus;
  status_key: string;
  start_time: string;  // ISOフォーマットの日時
  course_name: string;
  location?: string;
  station_name?: string;  // 最寄り駅
  course_price: number;
  traffic_fee: number;
  cast_reward_points?: number;  // キャスト報酬ポイント
  last_message_time?: string;
  last_message_preview?: string;
  color_code?: string;
  cast_label: string;
}

export interface CastReserveResponse {
  page: number;
  limit: number;
  total_count: number;
  reservations: CastReserveItem[];
}
