import axios from 'axios';
import { fetchAPI } from "@/services/auth/axiosInterceptor";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_IDENTITY_URL = `${API_BASE_URL}/api/v1/cast/identity-verification`;

// 認証トークンを取得する関数
const getAuthToken = (): string | null => {
  // ブラウザ環境でなければnullを返す
  if (typeof window === 'undefined') return null;
  
  // ローカルストレージからトークンを取得
  return localStorage.getItem('auth_token');
};

// 認証ヘッダーを生成する関数
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    },
    withCredentials: true
  };
};

// 本人確認ステータスを取得する
export const getVerificationStatus = async () => {
  try {
    const response = await fetchAPI("/api/v1/cast/identity-verification/status", undefined, "GET");
    return response;
  } catch (error) {
    console.error('本人確認ステータス取得エラー:', error);
    // エラー時はデフォルト値を返す
    return {
      status: 'unsubmitted',
      message: '',
      submitted_at: null,
      reviewed_at: null,
      rejection_reason: null
    };
  }
};

// 本人確認書類を取得する
export const getVerificationDocuments = async () => {
  try {
    const response = await fetchAPI("/api/v1/cast/identity-verification/documents");
    return response;
  } catch (error) {
    console.error('本人確認書類取得エラー:', error);
    return [];
  }
};

// MIMEタイプからデータベースのファイルタイプに変換
const getFileTypeForDB = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  } else {
    return 'document';
  }
};

// メディアファイルのアップロード用のpresigned URLを取得する
export const getPresignedUrl = async (fileName: string, fileType: string, targetType: string = 'cast_identity_verification', orderIndex: number = 0) => {
  try {
    console.log(`✅ getPresignedUrl リクエスト: ${fileName}, ${fileType}, ${targetType}`);
    
    // キャストIDを取得
    const castId = typeof globalThis.user !== "undefined" ? globalThis.user?.userId : 0;
    console.log(`✅ キャストID: ${castId}`);
    
    // MIMEタイプからDBのファイルタイプに変換
    const dbFileType = getFileTypeForDB(fileType);
    console.log(`✅ ファイルタイプ変換: ${fileType} -> ${dbFileType}`);
    
    const response = await fetchAPI("/api/v1/media/upload/generate-url", {
      file_name: fileName,
      file_type: dbFileType,
      target_type: targetType,
      target_id: castId,
      order_index: orderIndex
    });
    console.log('✅ getPresignedUrl レスポンス:', response);
    return response;
  } catch (error) {
    console.error('❌ Presigned URL取得エラー:', error);
    throw error;
  }
};

// S3にファイルをアップロードする
export const uploadFileToS3 = async (presignedUrl: string, file: File) => {
  try {
    console.log(`✅ uploadFileToS3 開始: ${presignedUrl}`);
    console.log(`✅ ファイルタイプ: ${file.type}`);
    
    // Content-TypeをURLから取得
    const url = new URL(presignedUrl);
    const contentTypeParam = url.searchParams.get('content-type');
    
    console.log(`✅ URLから取得したContent-Type: ${contentTypeParam}`);
    
    const axios = (await import('axios')).default;
    await axios.put(presignedUrl, file, {
      headers: {
        // URLのContent-Typeパラメータと一致するように設定
        'Content-Type': contentTypeParam || 'application/octet-stream'
      }
    });
    
    console.log('✅ S3アップロード成功');
    return true;
  } catch (error: any) {
    console.error('S3アップロードエラー:', error);
    
    // エラー情報をログに出力
    if (error.response) {
      console.error('レスポンスデータ:', error.response.data);
      console.error('ステータスコード:', error.response.status);
      console.error('ヘッダー:', error.response.headers);
    }
    
    throw error;
  }
};

// メディアファイルをデータベースに登録する
export const registerMedia = async (fileUrl: string, fileType: string, targetType: string = 'cast_identity_verification', orderIndex: number = 0) => {
  try {
    // キャストIDを取得
    const castId = typeof globalThis.user !== "undefined" ? globalThis.user?.userId : 0;
    console.log(`✅ registerMedia - キャストID: ${castId}`);
    
    // MIMEタイプからDBのファイルタイプに変換
    const dbFileType = getFileTypeForDB(fileType);
    console.log(`✅ registerMedia - ファイルタイプ変換: ${fileType} -> ${dbFileType}`);
    
    const response = await fetchAPI("/api/v1/media/upload/register", {
      file_url: fileUrl,
      file_type: dbFileType,
      target_type: targetType,
      target_id: castId,
      order_index: orderIndex
    });
    
    // レスポンスの詳細をログ出力
    console.log('✅ registerMedia - レスポンス詳細:', {
      status: response?.status,
      id: response?.id,
      file_url: response?.file_url
    });
    
    // IDが0または存在しない場合はエラーログを出力
    if (!response.id || response.id === 0) {
      console.error('⚠️ メディアID取得エラー: IDが0または存在しません', response);
    }
    
    return response;
  } catch (error) {
    console.error('メディア登録エラー:', error);
    throw error;
  }
};

// アップロードされたメディアのIDを保管する変数
let uploadedMediaIds: number[] = [];

// ファイルをアップロードする
export const uploadFile = async (file: File, orderIndex: number) => {
  try {
    console.log(`✅ uploadFile 開始: ${file.name}, orderIndex=${orderIndex}`);
    const presignedData = await getPresignedUrl(file.name, file.type, 'cast_identity_verification', orderIndex);
    
    console.log('✅ presignedData:', presignedData);
    if (!presignedData || !presignedData.presigned_url) {
      throw new Error('presigned_urlが取得できませんでした');
    }
    
    await uploadFileToS3(presignedData.presigned_url, file);
    
    const mediaData = await registerMedia(
      presignedData.file_url || presignedData.presigned_url, 
      file.type, 
      'cast_identity_verification', 
      orderIndex
    );
    
    console.log('✅ mediaData:', mediaData);
    
    // アップロードされたメディアのIDを保管する変数
    if (!mediaData || !mediaData.id || mediaData.id === 0) {
      console.error('🚫 エラー: メディアID取得エラー: IDが0または存在しません', mediaData);
      throw new Error('メディアID取得エラー: IDが0または存在しません');
    }
    
    uploadedMediaIds.push(mediaData.id);
    console.log('✅ アップロード済みメディアIDs:', uploadedMediaIds);
    
    return {
      fileUrl: mediaData.file_url,
      mediaId: mediaData.id,
      orderIndex
    };
  } catch (error) {
    console.error('❌ ファイルアップロード処理エラー:', error);
    throw error;
  }
};

// 本人確認申請を提出する
export const submitVerification = async (data: { service_type: string, id_photo_media_id: number, juminhyo_media_id?: number | null } = { service_type: 'A', id_photo_media_id: 0, juminhyo_media_id: null }) => {
  try {
    console.log('✅ identityService: submitVerification開始');
    console.log('✅ APIリクエストデータ:', data);
    
    // globalThis.userの存在とトークンを確認
    console.log('✅ APIリクエスト詳細: globalThis.userの存在とトークン', {
      exists: typeof globalThis.user !== "undefined",
      hasToken: typeof globalThis.user !== "undefined" && !!globalThis.user.token,
      tokenLength: typeof globalThis.user !== "undefined" && globalThis.user.token ? globalThis.user.token.length : 0
    });

    if (!globalThis.user || !globalThis.user.token) {
      console.error('🚫 エラー: APIリクエスト詳細: globalThis.userの存在とトークンが不足しています');
      throw new Error('トークンの取得に失敗しました');
    }
    
    const response = await fetch('/api/v1/cast/identity-verification/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${globalThis.user.token}`
      },
      body: JSON.stringify(data)
    });

    console.log('✅ APIレスポンスステータス:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🚫 APIエラー:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`APIエラー: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ APIレスポンスデータ:', result);
    return result;
  } catch (error) {
    console.error('🚫 submitVerificationエラー:', error);
    throw error;
  }
};
