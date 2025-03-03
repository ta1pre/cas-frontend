// src/app/p/customer/search/api/cast/castTypes.ts

/** キャスト情報の型 */
export interface Cast {
    cast_id: number;
    name: string;
    age: number;
    height?: number;
    bust?: number;
    waist?: number;
    hip?: number;
    cup?: string;
    birthplace?: string;
    support_area?: string;
    blood_type?: string;
    hobby?: string;
    job?: string;
    reservation_fee?: number;
    rating?: number;
    self_introduction?: string;
    popularity?: number;
    available_at?: string;
    profile_image_url?: string;
}

/** API に送るフィルターの型（完全汎用化） */
export interface APIFilters {
    [key: string]: any; // ✅ これだけでOK
}


