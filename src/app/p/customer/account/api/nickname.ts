'use client';

import { fetchAPI } from "@/services/auth/axiosInterceptor"; 

/**
 * ユーザープロフィール情報を取得する
 * @returns ユーザープロフィール情報
 */
export async function fetchUserProfile() {
  try {
    // fetchAPI関数を使用して認証付きAPIリクエストを送信
    const response = await fetchAPI('/api/v1/user/profile', {}, 'POST');
    return response;
  } catch (error) {
    console.error('ユーザープロフィールの取得に失敗しました', error);
    throw error;
  }
}

/**
 * ニックネームを更新する
 * @param nickname 新しいニックネーム
 * @returns API応答
 */
export async function updateNickname(nickname: string) {
  try {
    // fetchAPI関数を使用して認証付きAPIリクエストを送信
    const response = await fetchAPI('/api/v1/user/update_profile', {
      nick_name: nickname
    }, 'POST');
    return response;
  } catch (error) {
    console.error('ニックネームの更新に失敗しました', error);
    throw error;
  }
}
