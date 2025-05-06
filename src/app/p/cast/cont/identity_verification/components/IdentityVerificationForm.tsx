import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Alert, CircularProgress, TextField, Grid, Button } from '@mui/material';
import FileUploadBox from './FileUploadBox';
import { submitVerification, updateBankAccount } from '../services/identityService';

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
  const [errors, setErrors] = useState<{idPhoto?: string, juminhyo?: string, bankInfo?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [bankInfoSubmitted, setBankInfoSubmitted] = useState(false);
  
  // 口座情報の状態
  const [bankName, setBankName] = useState<string>('');
  const [branchName, setBranchName] = useState<string>('');
  const [branchCode, setBranchCode] = useState<string>('');
  const [accountType, setAccountType] = useState<string>('普通');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountHolder, setAccountHolder] = useState<string>('');

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
    
    if (serviceType === 'B') {
      if (idPhotoMediaId && juminhyoMediaId && bankInfoSubmitted) {
        console.log('✅ Bサービス: 書類と口座情報が揃いました。本人確認申請を開始します。');
        handleSubmit();
      } else {
        console.log('⚠️ Bサービス: 書類または口座情報が不足しています。', { idPhotoMediaId, juminhyoMediaId, bankInfoSubmitted });
      }
    } else {
      if (idPhotoMediaId && bankInfoSubmitted) {
        console.log('✅ Aサービス: 身分証と口座情報が揃いました。本人確認申請を開始します。');
        handleSubmit();
      } else {
        console.log('⚠️ Aサービス: 身分証または口座情報が不足しています。', { idPhotoMediaId, bankInfoSubmitted });
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
        if (newMediaId && (serviceType === 'A' || (serviceType === 'B' && juminhyoMediaId))) {
          console.log('✅ 条件を満たしています。提出処理を開始します。');
          checkFilesUploaded();
        } else {
          console.log('⚠️ 条件を満たしていません。', {
            newMediaId,
            serviceType,
            juminhyoMediaId
          });
        }
      }, 1000);
    }
  };

  const handleJuminhyoChange = (file: File | null, fileUrl?: string, mediaId?: number) => {
    setJuminhyoFile(file);
    if (fileUrl) {
      setJuminhyoUrl(fileUrl);
    }
    if (mediaId) {
      console.log(`🗿️ 住民票メディアID設定: ${mediaId}`);
      // 直接変数に保存してから状態を更新
      const newMediaId = mediaId;
      setJuminhyoMediaId(newMediaId);
      
      // 遅延を長くして状態の更新が確実に反映されるようにする
      setTimeout(() => {
        console.log(`🔄 遅延チェック実行 - 住民票メディアID: ${newMediaId}`);
        // 直接newMediaIdを使用して判定
        if (newMediaId && idPhotoMediaId && serviceType === 'B') {
          console.log('✅ 条件を満たしています。提出処理を開始します。');
          checkFilesUploaded();
        }
      }, 1000);
    }
  };

  const validateBankInfo = () => {
    const newErrors: {bankInfo?: string} = {};
    let isValid = true;
    
    // 口座情報のバリデーション
    if (!bankName || !branchName || !branchCode || !accountType || !accountNumber || !accountHolder) {
      newErrors.bankInfo = '口座情報はすべて入力してください';
      isValid = false;
    } else if (branchCode.length !== 3 || !/^\d{3}$/.test(branchCode)) {
      newErrors.bankInfo = '支店コードは3桁の数字で入力してください';
      isValid = false;
    }
    
    setErrors(prev => ({...prev, ...newErrors}));
    return isValid;
  };

  const validateForm = (idPhotoId?: number | null, juminhyoId?: number | null) => {
    const newErrors: {idPhoto?: string, juminhyo?: string, bankInfo?: string} = {};
    let isValid = true;
    
    // 身分証明書のチェック
    if (!idPhotoId) {
      newErrors.idPhoto = '身分証明書をアップロードしてください';
      isValid = false;
    }
    
    // 風俗関連サービスの場合は住民票も必須
    if (serviceType === 'B' && !juminhyoId) {
      newErrors.juminhyo = '住民票をアップロードしてください';
      isValid = false;
    }
    
    // 口座情報のバリデーション
    if (!bankInfoSubmitted) {
      if (!bankName || !branchName || !branchCode || !accountType || !accountNumber || !accountHolder) {
        newErrors.bankInfo = '口座情報はすべて入力してください';
        isValid = false;
      } else if (branchCode.length !== 3 || !/^\d{3}$/.test(branchCode)) {
        newErrors.bankInfo = '支店コードは3桁の数字で入力してください';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // 口座情報のみを送信する関数
  const handleBankInfoSubmit = async () => {
    if (!validateBankInfo()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(undefined);
    
    try {
      // 口座情報のみのリクエストデータを構築
      const requestData = {
        service_type: serviceType,
        id_photo_media_id: idPhotoMediaId ?? 0, // nullの場合は0を使用
        juminhyo_media_id: serviceType === 'B' ? juminhyoMediaId : undefined,
        bank_name: bankName,
        branch_name: branchName,
        branch_code: branchCode,
        account_type: accountType,
        account_number: accountNumber,
        account_holder: accountHolder
      };
      
      console.log('📦 口座情報送信データ:', requestData);
      
      // APIリクエスト送信
      const result = await updateBankAccount(requestData);
      console.log('✅ 口座情報送信完了:', result);
      
      // 口座情報送信完了フラグを設定
      setBankInfoSubmitted(true);
      
      // 成功メッセージを表示
      alert('口座情報が登録されました');
      // ドキュメントがアップロード済みなら本人確認申請を実行
      if (idPhotoMediaId && (serviceType === 'A' || (serviceType === 'B' && juminhyoMediaId))) {
        console.log('✅ ドキュメントと口座情報が揃いました。本人確認申請を実行します。');
        handleSubmit();
      }
    } catch (error) {
      console.error('口座情報送信エラー:', error);
      setSubmitError('口座情報の送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (idPhotoId: number | null = idPhotoMediaId, juminhyoId: number | null = juminhyoMediaId) => {
    console.log('🚀 提出処理開始:', {
      idPhotoId,
      juminhyoId,
      serviceType,
      bankInfo: {
        bankName,
        branchName,
        branchCode,
        accountType,
        accountNumber,
        accountHolder
      },
      bankInfoSubmitted
    });
    
    // バリデーション
    if (!validateForm(idPhotoId, juminhyoId)) {
      console.error('❌ バリデーションエラー:', errors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(undefined);
    
    try {
      // リクエストデータを構築
      const requestData = {
        service_type: serviceType,
        id_photo_media_id: idPhotoId ?? 0, // nullの場合は0を使用
        juminhyo_media_id: serviceType === 'B' ? juminhyoId : undefined,
        // 口座情報を追加
        bank_name: bankName,
        branch_name: branchName,
        branch_code: branchCode,
        account_type: accountType,
        account_number: accountNumber,
        account_holder: accountHolder
      };
      
      console.log('📦 リクエストデータ:', {
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
      
      {/* 口座情報入力フォーム */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        振込先口座情報を入力してください
      </Typography>
      
      <Box sx={{ mb: 4, p: 2, bgcolor: '#FFF9FB', borderRadius: 2, border: '1px solid #FFD6E7' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="銀行名"
              placeholder="例：みずほ銀行"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              variant="outlined"
              size="small"
              required
              disabled={bankInfoSubmitted}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="支店名"
              placeholder="例：渋谷支店"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              variant="outlined"
              size="small"
              required
              disabled={bankInfoSubmitted}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="支店コード"
              placeholder="例：123（3桁）"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              variant="outlined"
              size="small"
              inputProps={{ maxLength: 3 }}
              required
              disabled={bankInfoSubmitted}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                row
                aria-label="account-type"
                name="account-type"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <FormControlLabel value="普通" control={<Radio disabled={bankInfoSubmitted} />} label="普通" />
                <FormControlLabel value="当座" control={<Radio disabled={bankInfoSubmitted} />} label="当座" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="口座番号"
              placeholder="例：1234567"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              variant="outlined"
              size="small"
              required
              disabled={bankInfoSubmitted}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="口座名義人（カタカナ）"
              placeholder="例：ヤマダ タロウ"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              variant="outlined"
              size="small"
              required
              disabled={bankInfoSubmitted}
            />
          </Grid>
        </Grid>
        
        {errors.bankInfo && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.bankInfo}
          </Alert>
        )}
        
        {/* 口座情報送信ボタン */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBankInfoSubmit}
            disabled={isSubmitting || bankInfoSubmitted}
            sx={{
              bgcolor: '#FF80AB',
              '&:hover': { bgcolor: '#F06292' },
              px: 4,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 3px 5px rgba(0,0,0,0.1)'
            }}
          >
            {bankInfoSubmitted ? '口座情報登録済み' : '口座情報を登録する'}
          </Button>
        </Box>
        
        {bankInfoSubmitted && (
          <Alert severity="success" sx={{ mt: 2 }}>
            口座情報が登録されました
          </Alert>
        )}
      </Box>

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
