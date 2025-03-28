'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';

// メインのフックをクライアントコンポーネントとして定義
export function useTrackingId() {
    const [trackingId, setTrackingId] = useState('DEFAULT_ID');
    // try-catchで囲んでエラーハンドリングを追加
    try {
        const searchParams = useSearchParams();

        useEffect(() => {
            let currentTrackingId = 'DEFAULT_ID';

            // 1️⃣ URLから `tr` パラメータを取得
            const urlTrackingId = searchParams.get('tr');
            if (urlTrackingId) {
                currentTrackingId = urlTrackingId;
                console.log('✅ [useTrackingId] URLから取得:', urlTrackingId);

                // 2️⃣ Cookieへ保存（30日間）
                Cookies.set('tracking_id', urlTrackingId, { 
                    expires: 30,      // 30日間
                    secure: true,    // HTTPSのみ
                    sameSite: 'None'  // クロスサイト保護
                });
            } else {
                // 3️⃣ Cookieから `tracking_id` を取得
                const cookieTrackingId = Cookies.get('tracking_id');
                if (cookieTrackingId) {
                    currentTrackingId = cookieTrackingId;
                    console.log('✅ [useTrackingId] Cookieから取得:', cookieTrackingId);
                } else {
                    console.log('⚠️ [useTrackingId] tracking_idが見つからないのでDEFAULT');
                }
            }

            setTrackingId(currentTrackingId);
        }, [searchParams]);
    } catch (error) {
        console.error('[useTrackingId] エラー:', error);
        // useSearchParamsがサーバーサイドやSuspenseなしで呼ばれた場合のフォールバック
        useEffect(() => {
            // Cookieからのみtacking_idを取得
            const cookieTrackingId = Cookies.get('tracking_id');
            if (cookieTrackingId) {
                setTrackingId(cookieTrackingId);
                console.log('✅ [useTrackingId] Fallback - Cookieから取得:', cookieTrackingId);
            }
        }, []);
    }

    return trackingId;
}
