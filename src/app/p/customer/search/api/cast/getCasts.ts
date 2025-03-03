// src/app/p/customer/search/api/cast/getCasts.ts
import { fetchAPI } from "@/services/auth/axiosInterceptor";
import { Cast, APIFilters } from "./castTypes";
import { transformFilters } from "./transformFilters";  // ✅ フィルター変換をimport

export async function getCasts(
    limit: number,
    offset: number,
    sort: string,
    filters?: APIFilters
): Promise<Cast[]> {
    const transformedFilters = transformFilters(filters);  // ✅ 変換処理を外部関数に

    console.log("【getCasts.ts】🚀 送信するAPIパラメータ:", { limit, offset, sort, transformedFilters });

    return await fetchAPI("/api/v1/customer/search/", {
        limit,
        offset,
        sort,
        filters: transformedFilters,  // ✅ 変換済みフィルターをAPIへ送信
    });
}
