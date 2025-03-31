'use client';

/**
 * クッキーを取得する関数
 * @param name クッキー名
 * @returns クッキーの値またはnull
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

/**
 * クッキーを設定する関数
 * @param name クッキー名
 * @param value クッキーの値
 * @param days 有効期限（日数）
 */
export const setCookie = (name: string, value: string, days: number = 30): void => {
  if (typeof document === 'undefined') return;
  
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

/**
 * クッキーを削除する関数
 * @param name クッキー名
 */
export const removeCookie = (name: string): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};
