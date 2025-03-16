'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import useUser from '@/hooks/useUser';
import SetupFlow from './flow/SetupFlow';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function SetupPage() {
    const decodedUser = useUser();  // ✅ `useUser()` を利用
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!decodedUser || !decodedUser.user_id || !decodedUser.token) return;  // ✅ `user_id` や `token` がない場合は何もしない

        const checkSetupStatus = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/api/v1/setup/status/setup_status/${decodedUser.user_id}`,
                    {
                        headers: { Authorization: `Bearer ${decodedUser.token}` } // ✅ クッキーから取得した `token` を使用
                    }
                );

                const setupStatus = response.data?.setup_status;

                if (setupStatus === 'completed') {
                    router.replace('/p');  // ✅ 完了していたらダッシュボードへリダイレクト
                } else {
                    setLoading(false); // ✅ 未完了なら SetupFlow を表示
                }
            } catch (error) {
                console.error("🔴 APIエラー:", error);
                setLoading(false);
            }
        };

        checkSetupStatus();
    }, [decodedUser, router]);

    if (loading) {
        return <p>Loading...</p>;  // ✅ ロード中の表示
    }

    return <SetupFlow />;
}
