import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Alert, CircularProgress } from '@mui/material';
import FileUploadBox from './FileUploadBox';
import { submitVerification } from '../services/identityService';

interface IdentityVerificationFormProps {
  onSubmitSuccess: () => void;
  defaultServiceType?: 'A' | 'B';
  hideServiceTypeSelection?: boolean;
}

const IdentityVerificationForm: React.FC<IdentityVerificationFormProps> = ({ 
  onSubmitSuccess,
  defaultServiceType = 'A',
  hideServiceTypeSelection = false
}) => {
  const [serviceType, setServiceType] = useState<string>(defaultServiceType);
  const [idPhotoFile, setIdPhotoFile] = useState<File | null>(null);
  const [juminhyoFile, setJuminhyoFile] = useState<File | null>(null);
  const [idPhotoUrl, setIdPhotoUrl] = useState<string | null>(null);
  const [juminhyoUrl, setJuminhyoUrl] = useState<string | null>(null);
  const [idPhotoMediaId, setIdPhotoMediaId] = useState<number | null>(null);
  const [juminhyoMediaId, setJuminhyoMediaId] = useState<number | null>(null);
  const [errors, setErrors] = useState<{idPhoto?: string, juminhyo?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  // defaultServiceTypeが変更されたらserviceTypeを更新
  useEffect(() => {
    setServiceType(defaultServiceType);
  }, [defaultServiceType]);

  const handleServiceTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServiceType(event.target.value);
  };

  // ファイルがアップロードされたかチェック
  const checkFilesUploaded = () => {
    console.log(`✅ checkFilesUploaded - serviceType=${serviceType}, idPhotoMediaId=${idPhotoMediaId}, juminhyoMediaId=${juminhyoMediaId}`);
    
    // サービスタイプとメディアIDの状態をより詳細にログ出力
    console.log('✅ 現在の状態:', {
      serviceType,
      idPhotoMediaId,
      juminhyoMediaId,
      idPhotoFile: !!idPhotoFile,
      juminhyoFile: !!juminhyoFile,
      idPhotoUrl: !!idPhotoUrl,
      juminhyoUrl: !!juminhyoUrl
    });
    
    // メディアIDが0の場合はエラーログを出力して処理を中止
    if (idPhotoMediaId === 0 || (serviceType === 'B' && juminhyoMediaId === 0)) {
      console.error('🚨 エラー: メディアIDが0です。有効なメディアIDを取得してください。');
      return;
    }
    
    // Bサービスの場合は両方の書類が必要
    if (serviceType === 'B') {
      if (idPhotoMediaId && juminhyoMediaId) {
        console.log('✅ Bサービス: 両方の書類がアップロードされました。提出処理を開始します。');
        setTimeout(() => handleSubmit(), 500);
      } else {
        console.log('⚠️ Bサービス: 必要な書類が不足しています。', {
          idPhotoMediaId: !!idPhotoMediaId,
          juminhyoMediaId: !!juminhyoMediaId
        });
      }
    } else {
      // Aサービスの場合は身分証のみでOK
      if (idPhotoMediaId) {
        console.log('✅ Aサービス: 身分証がアップロードされました。提出処理を開始します。');
        setTimeout(() => handleSubmit(), 500);
      } else {
        console.log('⚠️ Aサービス: 身分証がアップロードされていません。');
      }
    }
  };

  const handleIdPhotoChange = (file: File | null, fileUrl?: string, mediaId?: number) => {
    setIdPhotoFile(file);
    if (fileUrl) {
      setIdPhotoUrl(fileUrl);
    }
    if (mediaId) {
      console.log(`🗿️ メディアID設定: ${mediaId}`);
      // 直接変数に保存してから状態を更新
      const newMediaId = mediaId;
      setIdPhotoMediaId(newMediaId);
      
      // 遅延を長くして状態の更新が確実に反映されるようにする
      setTimeout(() => {
        console.log(`🔄 遅延チェック実行 - メディアID: ${newMediaId}`);
        // 直接newMediaIdを使用して判定
        if (serviceType === 'A') {
          console.log('✅ Aサービス: 身分証がアップロードされました。提出処理を開始します。');
          // 遅延を長くして状態の更新が確実に反映されるようにする
          setTimeout(() => {
            // 直接handleSubmitに引数としてメディアIDを渡す
            handleSubmit(newMediaId, juminhyoMediaId);
          }, 1000);
        } else if (serviceType === 'B' && juminhyoMediaId) {
          console.log('✅ Bサービス: 両方の書類がアップロードされました。提出処理を開始します。');
          setTimeout(() => {
            handleSubmit(newMediaId, juminhyoMediaId);
          }, 1000);
        }
      }, 3000);
    }
    if (file) {
      setErrors(prev => ({...prev, idPhoto: undefined}));
    }
  };

  const handleJuminhyoChange = (file: File | null, fileUrl?: string, mediaId?: number) => {
    setJuminhyoFile(file);
    if (fileUrl) {
      setJuminhyoUrl(fileUrl);
    }
    if (mediaId) {
      console.log(`🗿️ メディアID設定: ${mediaId}`);
      // 直接変数に保存してから状態を更新
      const newMediaId = mediaId;
      setJuminhyoMediaId(newMediaId);
      
      // 遅延を長くして状態の更新が確実に反映されるようにする
      setTimeout(() => {
        // 直接newMediaIdを使用して判定
        if (serviceType === 'B' && idPhotoMediaId) {
          console.log('✅ Bサービス: 両方の書類がアップロードされました。提出処理を開始します。');
          setTimeout(() => {
            handleSubmit(idPhotoMediaId, newMediaId);
          }, 1000);
        }
      }, 3000);
    }
    if (file) {
      setErrors(prev => ({...prev, juminhyo: undefined}));
    }
  };

  const validateForm = (idPhotoId?: number | null, juminhyoId?: number | null) => {
    const newErrors: {idPhoto?: string, juminhyo?: string} = {};
    
    // 引数で渡されたIDがある場合はそれを使用し、なければ状態変数を使用
    const effectiveIdPhotoMediaId = idPhotoId !== undefined ? idPhotoId : idPhotoMediaId;
    const effectiveJuminhyoMediaId = juminhyoId !== undefined ? juminhyoId : juminhyoMediaId;
    
    // メディアIDを使用して検証
    if (!effectiveIdPhotoMediaId) {
      newErrors.idPhoto = '顔写真付き身分証明書をアップロードしてください';
    }
    
    if (serviceType === 'B' && !effectiveJuminhyoMediaId) {
      newErrors.juminhyo = '本籍入り住民票をアップロードしてください';
    }
    
    // デバッグログを追加
    console.log('🔍 バリデーション詳細:', {
      idPhotoMediaId: effectiveIdPhotoMediaId,
      juminhyoMediaId: effectiveJuminhyoMediaId,
      serviceType,
      hasErrors: Object.keys(newErrors).length > 0,
      errors: newErrors
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 ? true : false; 
  };

  const handleSubmit = async (idPhotoId?: number | null, juminhyoId?: number | null) => {
    console.log('✅ handleSubmit開始');
    setIsSubmitting(true);
    setSubmitError(undefined);

    // フォームのバリデーション
    const isValid = validateForm(idPhotoId, juminhyoId);
    console.log(`✅ フォームバリデーション結果: ${isValid}`);
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      // 引数で渡されたIDがある場合はそれを使用し、なければ状態変数を使用
      const effectiveIdPhotoMediaId = idPhotoId !== undefined ? idPhotoId : idPhotoMediaId;
      const effectiveJuminhyoMediaId = juminhyoId !== undefined ? juminhyoId : juminhyoMediaId;
      
      // APIに送信するデータ
      const requestData = {
        service_type: serviceType,
        id_photo_media_id: effectiveIdPhotoMediaId || 0,
        juminhyo_media_id: serviceType === 'B' ? (effectiveJuminhyoMediaId || 0) : null
      };

      console.log('✅ 本人確認申請を送信します:', requestData);
      
      // デバッグ用にリクエストデータの詳細を表示
      console.log('✅ リクエスト詳細:', {
        url: '/api/v1/cast/identity-verification/submit',
        method: 'POST',
        data: JSON.stringify(requestData)
      });
      
      // globalThis.userが存在するかどうかを確認
      if (typeof globalThis.user === "undefined" || !globalThis.user?.token) {
        console.error('🚨 エラー: globalThis.userが存在しないか、トークンがありません');
        // トークンがない場合は、トークンをローカルストレージから取得して設定
        const token = localStorage.getItem('auth_token');
        if (token) {
          console.log('✅ ローカルストレージからトークンを取得しました');
          // globalThis.userが存在しない場合は初期化
          if (typeof globalThis.user === "undefined") {
            globalThis.user = {};
          }
          globalThis.user.token = token;
          console.log('✅ globalThis.userにトークンを設定:', token);
        } else {
          console.error('🚨 エラー: ローカルストレージにトークンがありません');
          setSubmitError('認証情報が見つかりません。再ログインしてください。');
          setIsSubmitting(false);
          return;
        }
      } else {
        console.log('✅ globalThis.userとトークンが存在します:', {
          userExists: !!globalThis.user,
          tokenExists: !!globalThis.user?.token,
          tokenLength: globalThis.user?.token?.length
        });
      }
      
      const result = await submitVerification(requestData);
      
      console.log('✅ 本人確認申請送信完了:', result);

      // 成功時の処理
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('提出エラー:', error);
      setSubmitError('書類の提出に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      {!hideServiceTypeSelection && (
        <>
          <Typography variant="h6" gutterBottom>
            サービス種別を選択してください
          </Typography>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <RadioGroup
              aria-label="service-type"
              name="service-type"
              value={serviceType}
              onChange={handleServiceTypeChange}
            >
              <FormControlLabel value="A" control={<Radio />} label="通常サービス" />
              <FormControlLabel value="B" control={<Radio />} label="風俗関連サービス" />
            </RadioGroup>
          </FormControl>
        </>
      )}

      <Typography variant="h6" gutterBottom>
        本人確認書類をアップロードしてください
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <FileUploadBox
          title="顔写真付き身分証明書"
          description="運転免許証、パスポート、マイナンバーカード等の顔写真が確認できる公的身分証明書"
          onFileChange={handleIdPhotoChange}
          error={errors.idPhoto}
          orderIndex={0}
        />
      </Box>
      
      {serviceType === 'B' && (
        <Box sx={{ mb: 4 }}>
          <FileUploadBox
            title="本籍入り住民票"
            description="本籍地が記載された住民票（発行から3ヶ月以内）"
            onFileChange={handleJuminhyoChange}
            error={errors.juminhyo}
            orderIndex={1}
          />
        </Box>
      )}

      {isSubmitting && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            書類を送信中...
          </Typography>
        </Box>
      )}
      {submitError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {submitError}
        </Alert>
      )}
    </Box>
  );
};

export default IdentityVerificationForm;
