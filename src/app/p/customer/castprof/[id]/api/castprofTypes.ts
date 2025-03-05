// src/app/p/customer/castprof/[id]/api/castprofTypes.ts

export interface ImageData {
    url: string;
    order_index: number;
}

// ✅ キャストの特徴（Traits）
export interface Trait {
    id: number;
    name: string;
    category: string;
    weight: number;
}

// ✅ キャストのサービス種別（Service Types）
export interface ServiceType {
    id: number;
    name: string;
    category: string;
    weight: number;
}

export interface CastProfileResponse {
    cast_id: number;
    cast_type?: string;
    rank_id?: number | null;
    name?: string;
    age?: number | null;
    height?: number | null;
    bust?: number | null;
    cup?: string | null;
    waist?: number | null;
    hip?: number | null;
    birthplace?: string | null;
    blood_type?: string | null;
    hobby?: string | null;
    profile_image_url?: string | null;
    reservation_fee?: number | null;
    popularity: number;
    rating: number;
    self_introduction?: string | null;
    job?: string | null;
    dispatch_prefecture?: string | null;
    support_area?: string | null;
    is_active?: number | null;
    available_at?: string | null;
    images: ImageData[];
    traits: Trait[];
    service_types: ServiceType[];
}
