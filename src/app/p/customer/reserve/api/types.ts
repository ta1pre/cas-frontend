export interface ReservationListItem {
  reservation_id: number;
  cast_id: number
  cast_name: string;
  status: string;
  status_key: string;
  start_time: string;
  course_name: string;
  location?: string;
  color_code?: string;
  course_price: number;
  reservation_fee: number;
  traffic_fee: number;
  option_list: string[];
  option_price_list: number[];
  total_option_price: number;
  total_price?: number;
  last_message_time?: string | null;
  last_message_preview?: string | null;
}

export interface ReservationListResponse {
  reservations: ReservationListItem[];  // ✅ 予約データリスト
  totalCount: number;  // ✅ 総件数（「もっと見る」ボタン制御用）
}

export interface CustomerCastResponse {
    cast_id: number;
    name?: string;
    profile_image_url?: string;
}