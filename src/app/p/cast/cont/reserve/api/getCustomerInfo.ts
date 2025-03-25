import { fetchAPI } from "@/services/auth/axiosInterceptor";

interface CustomerInfo {
  user_id: number;
  user_name: string;
  profile_image_url?: string;
}

export async function fetchCustomerInfo(userId: number): Promise<CustomerInfo | null> {
  try {
    const response = await fetchAPI("/api/v1/user/profile/get", {
      user_id: userId
    });
    
    return response;
  } catch (error) {
    console.error("ユーザー情報取得エラー:", error);
    return null;
  }
}
