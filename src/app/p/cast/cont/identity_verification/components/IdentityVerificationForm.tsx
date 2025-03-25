import React, { useState } from 'react';
import { Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Alert, CircularProgress } from '@mui/material';
import FileUploadBox from './FileUploadBox';
import { submitVerification } from '../services/identityService';

interface IdentityVerificationFormProps {
  onSubmitSuccess: () => void;
}

const IdentityVerificationForm: React.FC<IdentityVerificationFormProps> = ({ onSubmitSuccess }) => {
  const [serviceType, setServiceType] = useState<string>('A');
  const [idPhotoFile, setIdPhotoFile] = useState<File | null>(null);
  const [juminhyoFile, setJuminhyoFile] = useState<File | null>(null);
  const [idPhotoUrl, setIdPhotoUrl] = useState<string | null>(null);
  const [juminhyoUrl, setJuminhyoUrl] = useState<string | null>(null);
  const [idPhotoMediaId, setIdPhotoMediaId] = useState<number | null>(null);
  const [juminhyoMediaId, setJuminhyoMediaId] = useState<number | null>(null);
  const [errors, setErrors] = useState<{idPhoto?: string, juminhyo?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

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
      setIdPhotoMediaId(mediaId);
      // IDがセットされた後、ファイルがアップロードされたかチェック
      // setTimeoutを延長して、状態更新が確実に反映された後にcheckFilesUploadedが呼ばれるようにする
      setTimeout(() => checkFilesUploaded(), 1000);
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
      setJuminhyoMediaId(mediaId);
      // IDがセットされた後、ファイルがアップロードされたかチェック
      // setTimeoutを延長して、状態更新が確実に反映された後にcheckFilesUploadedが呼ばれるようにする
      setTimeout(() => checkFilesUploaded(), 1000);
    }
    if (file) {
      setErrors(prev => ({...prev, juminhyo: undefined}));
    }
  };

  const validateForm = () => {
    const newErrors: {idPhoto?: string, juminhyo?: string} = {};
    
    if (!idPhotoFile || !idPhotoUrl) {
      newErrors.idPhoto = '顔写真付き身分証明書をアップロードしてください';
    }
    
    if (serviceType === 'B' && (!juminhyoFile || !juminhyoUrl)) {
      newErrors.juminhyo = '本籍入り住民票をアップロードしてください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 ? true : false; 
  };

  const handleSubmit = async () => {
    console.log('✅ handleSubmit開始');
    setIsSubmitting(true);
    setSubmitError(undefined);

    // フォームのバリデーション
    const isValid = validateForm();
    console.log(`✅ フォームバリデーション結果: ${isValid}`);
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      // APIに送信するデータ
      const requestData = {
        service_type: serviceType,
        id_photo_media_id: idPhotoMediaId || 0,
        juminhyo_media_id: serviceType === 'B' ? juminhyoMediaId : null
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
