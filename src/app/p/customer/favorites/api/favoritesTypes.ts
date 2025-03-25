// src/app/p/customer/favorites/api/favoritesTypes.ts

export interface ImageData {
    file_url: string;
    order_index: number;
}

export interface CastInfo {
    name?: string;
    profile_image_url?: string;
    age?: number;
    images: ImageData[];
}

export interface FavoriteResponse {
    id: number;
    user_id: number;
    cast_id: number;
    created_at: string;
    cast_info?: CastInfo;
}

export interface FavoriteList {
    favorites: FavoriteResponse[];
}
