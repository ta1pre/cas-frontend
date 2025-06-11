// File: frontapp/src/app/p/setup/hooks/storage/useSetupStorage.ts
'use client';

import { useEffect } from 'react';
import { getCookie, setCookie, removeCookie } from '../../utils/cookieUtils';

// クッキーとローカルストレージの整合性をチェックする関数（コンポーネント外で定義）
function syncStorageWithCookies() {
    if (typeof window === 'undefined') return;
    
    // StartPageクッキーがあれば、user_typeをクッキーの値に合わせる
    const startPageCookie = getCookie('StartPage');
    if (startPageCookie) {
        const [cookieType] = startPageCookie.split(':');
        const localUserType = localStorage.getItem('user_type');
        
        // 不整合があればローカルストレージを更新
        if (localUserType && ((cookieType === 'cast' && localUserType !== 'cast') || 
            (cookieType === 'customer' && localUserType !== 'customer'))) {
            localStorage.setItem('user_type', cookieType);
        }
    }
}

export function useSetupStorage() {
    // 初期化時に整合性チェックを行う
    useEffect(() => {
        syncStorageWithCookies();
    }, []);

    /**
     * ストレージから値を取得（クッキー優先）
     */
    const getStorage = (key: string): string | null => {
        // user_typeの場合は特別処理（StartPageクッキーから判断）
        if (key === 'user_type') {
            const startPageCookie = getCookie('StartPage');
            if (startPageCookie) {
                const [cookieType] = startPageCookie.split(':');
                return cookieType; // cast または customer を返す
            }
        }
        
        // まずクッキーをチェック
        const cookieValue = getCookie(key);
        // cookieValue が空文字の場合は無効とみなす（JSON.parse エラー回避）
        if (cookieValue && cookieValue.trim() !== '') return cookieValue;
        
        // クッキーになければローカルストレージをチェック
        if (typeof window !== 'undefined') {
            return localStorage.getItem(key);
        }
        return null;
    };

    /**
     * ストレージに値を保存（両方に保存）
     */
    const setStorage = (key: string, value: string): void => {
        // クッキーに保存
        setCookie(key, value);
        
        // ローカルストレージにも保存
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, value);
        }
    };

    /**
     * ストレージの値を削除
     */
    const removeStorage = (key: string): void => {
        // クッキーから削除
        removeCookie(key);
        
        // ローカルストレージからも削除
        if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
        }
    };

    return { getStorage, setStorage, removeStorage };
}
