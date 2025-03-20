// 📂 src/app/p/cast/cont/reserve/types/reserveTypes.ts

export interface CastReserveItem {
  reservation_id: number;
  user_id: number;
  user_name: string;
  status: string;
  status_key: string;
  start_time: string;  // ISOフォーマットの日時
  course_name: string;
  location?: string;
  course_price: number;
  traffic_fee: number;
  last_message_time?: string;
  last_message_preview?: string;
  color_code?: string;
}

export interface CastReserveResponse {
  page: number;
  limit: number;
  total_count: number;
  reservations: CastReserveItem[];
}
