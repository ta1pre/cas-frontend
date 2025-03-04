export interface ImageData {
    url: string;
    order_index: number;
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
}
