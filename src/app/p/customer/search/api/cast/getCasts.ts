// src/app/p/customer/search/api/cast/getCasts.ts
import { fetchAPI } from "@/services/auth/axiosInterceptor";

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
    popularity?: number;
    available_at?: string;
    profile_image_url?: string;
}

export async function getCasts(limit: number, offset: number, sort: string): Promise<Cast[]> {
    return await fetchAPI("/api/v1/customer/search/", { limit, offset, sort });
}
