'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export function useTrackingId() {
    const [trackingId, setTrackingId] = useState('DEFAULT_ID');
    
    // デバッグログ追加
    console.log('🔄 useTrackingId re-render:', { trackingId });

    useEffect(() => {
        // サーバーサイドでは実行しない
        if (typeof window === 'undefined') return;

        let currentTrackingId = 'DEFAULT_ID';

        // 1️⃣ URLから `tr` パラメータを取得（useSearchParamsを使わない）
        console.log('🔍 [useTrackingId] 現在のURL:', window.location.href);
        console.log('🔍 [useTrackingId] URLパラメータ:', window.location.search);
        
        const urlParams = new URLSearchParams(window.location.search);
        const urlTrackingId = urlParams.get('tr');
        
        console.log('🔍 [useTrackingId] trパラメータ:', urlTrackingId);
        console.log('🔍 [useTrackingId] URLパラメータ一覧:', Object.fromEntries(urlParams.entries()));
        
        if (urlTrackingId) {
            currentTrackingId = urlTrackingId;
            console.log('✅ [useTrackingId] URLから取得:', urlTrackingId);

            // 2️⃣ Cookieへ保存（30日間）
            Cookies.set('tracking_id', urlTrackingId, { 
                expires: 30,      // 🔄 30日間
                secure: true,    // 🔒 HTTPSのみ
                sameSite: 'None'  // 🔄 クロスサイト保護
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
    }, []); // 依存配列を空にして初回のみ実行

    return trackingId;
}
