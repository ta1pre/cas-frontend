import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// ✅ トークンのデコード
interface DecodedToken {
    user_id: number;
    user_type: string;
    exp: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ `setup_status` をAPIから取得
export const fetchSetupStatus = async (): Promise<string | null> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await axios.get(`${API_BASE_URL}/api/v1/setup/status`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data?.setup_status || null;
    } catch (error) {
        console.error('❌ セットアップステータス取得エラー:', error);
        return null;
    }
};

// ✅ JWT から `userType` を取得
export const fetchUserTypeFromToken = (): string | null => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        return decoded.user_type;
    } catch (error) {
        console.error('❌ トークンの解析に失敗しました:', error);
        return null;
    }
};
