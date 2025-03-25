// src/app/p/customer/search/api/cast/transformFilters.ts
// API増やすには基本的にはこのファイルとFilterUIComponents.tsxの編集でOK

import { APIFilters } from "./castTypes";
import { PREFECTURE_OPTIONS } from "../../config/prefectures"; // ✅ 都道府県リストをインポート

export function transformFilters(filters?: APIFilters): Record<string, any> {
    if (!filters) return {};

    const transformed: Record<string, any> = { ...filters };

    // ✅ 年齢フィルターの変換
    if (filters.age && Array.isArray(filters.age) && filters.age.length === 2) {
        transformed.min_age = filters.age[0]; // 最小年齢
        transformed.max_age = filters.age[1]; // 最大年齢
        delete transformed.age; // `age` は API に送らない
    }

    // ✅ 身長フィルター（統一）
    if (filters.height && Array.isArray(filters.height) && filters.height.length === 2) {
        transformed.min_height = filters.height[0]; // 最小身長
        transformed.max_height = filters.height[1]; // 最大身長
        delete transformed.height; // `height` は API に送らない
    }

    // ✅ 指名料フィルター（`price` → `reservation_fee` に変更）
    if (filters.reservation_fee && Array.isArray(filters.reservation_fee) && filters.reservation_fee.length === 2) {
        transformed.min_reservation_fee = filters.reservation_fee[0]; // 最低指名料
        transformed.max_reservation_fee = filters.reservation_fee[1]; // 最高指名料
        delete transformed.reservation_fee; // `reservation_fee` は API に送らない
    }

    // ✅ "今すぐOK" フィルター
    if (filters.available_soon) {
        transformed.available_soon = true;
    }

    // ✅ 都道府県名 → ID に変換
    if (filters.location) {
        // もし `location` が数値（都道府県ID）なら、そのまま `prefecture_id` に適用
        if (typeof filters.location === "number" || /^[0-9]+$/.test(filters.location)) {
            transformed.prefecture_id = String(filters.location); // ✅ 文字列に統一して送信
        } else {
            // もし `location` が都道府県名なら、`PREFECTURE_OPTIONS` から `ID` を取得
            const prefectureId = PREFECTURE_OPTIONS[filters.location];
            if (prefectureId !== undefined) {
                transformed.prefecture_id = String(prefectureId);
            } else {
                console.warn(`⚠️ 無効な都道府県: ${filters.location}`);
            }
        }
        delete transformed.location; // `location` は API に送らない
    }

    // ✅ キャストタイプフィルター（A, B, AB）
    if (filters.cast_type) {
        transformed.cast_type = filters.cast_type; // キャストタイプをそのまま送信
    }

    console.log("📡 送信フィルター:", transformed); // ✅ デバッグ用ログ
    return transformed;
}
