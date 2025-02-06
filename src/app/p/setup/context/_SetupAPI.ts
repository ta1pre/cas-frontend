// ✅ SetupAPI.ts - サーバー連携
import axios from 'axios';
import { SetupState } from './SetupState';

export const saveProgressToServer = async (state: SetupState) => {
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/setup-progress`, {
            setupStatus: state.setupStatus,
            gender: state.gender,
            profileData: state.profileData,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('✅ 進捗状況をサーバーに保存しました');
    } catch (error) {
        console.error('❌ 進捗状況の保存に失敗しました:', error);
    }
};
