// src/app/p/customer/favorites/api/favoriteActions.ts
import { fetchAPI } from "@/services/auth/axiosInterceptor";
import axios from "axios";
import { FavoriteList } from "./favoritesTypes";

// お気に入り一覧を取得
export async function getFavorites() {
    const user = globalThis.user ?? null;

    if (!user) {
        console.error("🚨 ユーザーがログインしていません");
        return null;
    }

    try {
        console.log("📡 POST /api/v1/customer/favorites/get_favorites をリクエスト");
        // POSTメソッドでお気に入り一覧を取得
        const response = await fetchAPI(`/api/v1/customer/favorites/get_favorites`, {
            user_id: user.userId
        });
        console.log("✅ APIレスポンス:", response);
        return response as FavoriteList;
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return null;
    }
}

// お気に入りに追加
export async function addFavorite(castId: number) {
    const user = globalThis.user ?? null;

    if (!user) {
        console.error("🚨 ユーザーがログインしていません");
        return null;
    }

    try {
        console.log(`📡 POST /api/v1/customer/favorites/${castId} をリクエスト`);
        const response = await fetchAPI(`/api/v1/customer/favorites/${castId}`, {
            user_id: user.userId
        });
        console.log("✅ APIレスポンス:", response);
        return response;
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return null;
    }
}

// お気に入りから削除
export async function removeFavorite(castId: number) {
    const user = globalThis.user ?? null;

    if (!user) {
        console.error("🚨 ユーザーがログインしていません");
        return null;
    }

    try {
        console.log(`📡 DELETE /api/v1/customer/favorites/${castId} をリクエスト`);
        // fetchAPIは常にPOSTメソッドを使用するので、axiosを直接使用する
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const token = globalThis.user?.token;
        
        const response = await axios.delete(`${API_URL}/api/v1/customer/favorites/${castId}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { user_id: user.userId }
        });
        
        console.log("✅ APIレスポンス:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return null;
    }
}
