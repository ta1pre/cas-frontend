// src/app/p/customer/search/api/cast/transformFilters.ts
// API増やすには基本的にはこのファイルとFilterUIComponents.tsxの編集でOK

import { APIFilters } from "./castTypes";
import { PREFECTURE_OPTIONS } from "../../config/prefectures"; // 都道府県リストをインポート

/**
 * 文字列形式の範囲フィルター値を最小値と最大値に変換するヘルパー関数
 * @param value 例: "18-20", "-150", "5001-", ""
 * @returns { min: number | null, max: number | null } | null (無効な値の場合)
 */
const parseRangeFilter = (value: string | undefined): { min: number | null, max: number | null } | null => {
    if (!value || typeof value !== 'string' || value === "") {
        return null; // 空文字や未定義の場合はフィルターなし
    }

    const parts = value.split('-');
    let min: number | null = null;
    let max: number | null = null;

    if (parts.length === 1) {
        // "-max" または "min-" の形式
        if (value.startsWith('-')) {
            max = parseInt(parts[0].substring(1), 10);
        } else if (value.endsWith('-')) {
            min = parseInt(parts[0], 10);
        }
    } else if (parts.length === 2) {
        // "min-max" の形式
        // "-max" の場合 parts[0] は空文字
        if (parts[0] === "") {
            max = parseInt(parts[1], 10);
        } else {
            min = parseInt(parts[0], 10);
            max = parseInt(parts[1], 10);
        }
    }

    // パース結果がNaNでないかチェック
    if ((min !== null && isNaN(min)) || (max !== null && isNaN(max))) {
        console.warn(`⚠️ 無効な範囲フィルター値: ${value}`);
        return null;
    }

    return { min, max };
};

export function transformFilters(filters?: APIFilters): Record<string, any> {
    if (!filters) return {};

    const transformed: Record<string, any> = {}; // 元のfiltersをコピーせず、変換後の値だけを入れる

    // 他のフィルター（ boolean や string など直接使えるもの）をコピー
    Object.keys(filters).forEach(key => {
        if (!['age', 'height', 'reservation_fee', 'location'].includes(key)) {
            // @ts-ignore
            transformed[key] = filters[key];
        }
    });

    // 年齢フィルターの変換 (文字列対応)
    const ageRange = parseRangeFilter(filters.age as string | undefined); // 文字列としてパース
    if (ageRange) {
        if (ageRange.min !== null) transformed.min_age = ageRange.min;
        if (ageRange.max !== null) transformed.max_age = ageRange.max;
    }

    // 身長フィルターの変換 (文字列対応)
    const heightRange = parseRangeFilter(filters.height as string | undefined); // 文字列としてパース
    if (heightRange) {
        if (heightRange.min !== null) transformed.min_height = heightRange.min;
        if (heightRange.max !== null) transformed.max_height = heightRange.max;
    }

    // ✅ 指名料フィルターの変換 (文字列対応 & 顧客P → キャストfee 変換)
    const feeRange = parseRangeFilter(filters.reservation_fee as string | undefined); // 👈 文字列としてパース (顧客支払いP)
    if (feeRange) {
        // 顧客支払いPの min/max を 2 で割ってキャストの reservation_fee に変換
        const minFee = feeRange.min !== null ? Math.ceil(feeRange.min / 2) : null; // 念のため切り上げ
        const maxFee = feeRange.max !== null ? Math.floor(feeRange.max / 2) : null; // 念のため切り捨て

        if (minFee !== null) transformed.min_reservation_fee = minFee;
        if (maxFee !== null) transformed.max_reservation_fee = maxFee;
    }

    // ✅ "今すぐOK" フィルター (変更なし)
    if (filters.available_soon === true) { // booleanとして厳密にチェック
        transformed.available_soon = true;
    } else if (filters.available_soon === false || filters.available_soon === undefined) {
        // false または undefined の場合はパラメータを送らない (もしくはAPI仕様に合わせて false を送る)
         delete transformed.available_soon; // 送らない場合
        // transformed.available_soon = false; // false を送る場合
    }

    // 都道府県名 → ID に変換 (変更なし)
    if (filters.location && filters.location !== "") { // 空文字チェック追加
        // もし `location` が数値（都道府県ID）なら、そのまま `prefecture_id` に適用
        if (typeof filters.location === "number" || /^[0-9]+$/.test(filters.location)) {
            transformed.prefecture_id = String(filters.location); // 文字列に統一して送信
        } else {
            // もし `location` が都道府県名なら、`PREFECTURE_OPTIONS` から `ID` を取得
            const prefectureId = PREFECTURE_OPTIONS[filters.location];
            if (prefectureId !== undefined) {
                transformed.prefecture_id = String(prefectureId);
            } else {
                console.warn(`⚠️ 無効な都道府県: ${filters.location}`);
            }
        }
        // `location` は API に送らない（ transformed には最初から入れていない）
    }

    // ✅ キャストタイプフィルター (変更なし)
    if (filters.cast_type && filters.cast_type !== "") { // 空文字チェック追加
        transformed.cast_type = filters.cast_type; // キャストタイプをそのまま送信
    }

    console.log("📡 送信フィルター:", transformed); // ✅ デバッグ用ログ
    return transformed;
}
