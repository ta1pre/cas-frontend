// File: frontapp/src/app/p/setup/hooks/storage/useSetupStorage.ts
'use client';

export function useSetupStorage() {
    /**
     * ✅ LocalStorage から値を取得
     */
    const getStorage = (key: string): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(key);
        }
        return null;
    };

    /**
     * ✅ LocalStorage に値を保存
     */
    const setStorage = (key: string, value: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, value);
        }
    };

    /**
     * ✅ LocalStorage の値を削除
     */
    const removeStorage = (key: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
        }
    };

    return { getStorage, setStorage, removeStorage };
}
