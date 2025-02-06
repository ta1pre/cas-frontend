'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';

export function useTrackingId() {
    const [trackingId, setTrackingId] = useState('DEFAULT_ID');
    const searchParams = useSearchParams();

    useEffect(() => {
        let currentTrackingId = 'DEFAULT_ID';

        // 1️⃣ URLから `tr` パラメータを取得
        const urlTrackingId = searchParams.get('tr');
        if (urlTrackingId) {
            currentTrackingId = urlTrackingId;
            console.log('✅ [useTrackingId] URLから取得:', urlTrackingId);

            // 2️⃣ Cookieへ保存（7日間）
            Cookies.set('tracking_id', urlTrackingId, { 
                expires: 30,      // 🔄 7日間
                secure: true,    // 🔒 HTTPSのみ
                sameSite: 'lax'  // 🔄 クロスサイト保護
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

    return trackingId;
}
