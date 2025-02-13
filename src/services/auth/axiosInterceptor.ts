import axios from 'axios';


// ✅ APIのベースURLを環境変数から取得
const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('【axiosInterceptor】✅ 開始');

// ✅ シンプルな axios インスタンス
const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true, // 🔹 Cookie を自動送信（HttpOnly な `access_token` を含む）
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
