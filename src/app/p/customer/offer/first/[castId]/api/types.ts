// src/app/p/customer/offer/[castId]/api/types.ts

export interface CustomerCastResponse {
    cast_id: number;
    name?: string;
    profile_image_url?: string;
}


//駅取得
export interface StationData {
    station_id: number;
    station_name: string;
}
// ✅ サジェスト用に `line_name` を含む
export interface SuggestedStationData extends StationData {
    line_name?: string; // ✅ 追加
}

export interface StationResponse {
    user_station?: StationData;
    cast_station?: StationData;
}


