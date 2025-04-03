import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  useTheme,
  SelectChangeEvent
} from '@mui/material';
import { ProfileData, useProfileApi } from '../api/useProfileApi';

// ギャラ設定フォームのProps
interface FeeSettingFormProps {
  onClose: () => void;
}

const initialFormState: Partial<ProfileData> = {
  reservation_fee: '',
  reservation_fee_deli: '', // デリバリー用予約料金を追加
};

/**
 * ギャラ設定フォームコンポーネント
 */
const FeeSettingForm: React.FC<FeeSettingFormProps> = ({ onClose }) => {
  const { fetchProfile, updateProfile, loading, error } = useProfileApi();
  const [formData, setFormData] = useState<Partial<ProfileData>>(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const theme = useTheme();

  // 報酬額の選択肢
  const feeOptions = [
    { value: '3000', label: '3,000' },
    { value: '4000', label: '4,000' },
    { value: '5000', label: '5,000' },
  ];
  
  const deliOptions = [
    { value: '4000', label: '4,000' },
    { value: '5000', label: '5,000' },
    { value: '6000', label: '6,000' },
    { value: '7000', label: '7,000' },
    { value: '8000', label: '8,000' },
    { value: '9000', label: '9,000' },
    { value: '10000', label: '10,000' },
  ];

  // プロフィールデータの取得
  useEffect(() => {
    // データが既にロードされている場合は再取得しない
    if (dataLoaded) return;
    
    const loadProfile = async () => {
      try {
        // ユーザーIDを取得
        const userId = globalThis.user?.userId;
        
        if (!userId) {
          console.error('ユーザーIDの取得に失敗しました');
          setDataLoaded(true);
          return;
        }
        
        const profileData = await fetchProfile(userId);
        console.log('取得したプロフィールデータ:', profileData);
        
        if (profileData) {
          // ギャラ設定に関連するデータのみを設定
          setFormData({
            reservation_fee: profileData.reservation_fee || '',
            reservation_fee_deli: profileData.reservation_fee_deli || '', // デリバリー用予約料金を追加
          });
        }
        setDataLoaded(true);
      } catch (error) {
        console.error('プロフィールデータの取得に失敗しました', error);
        // エラーが発生した場合もフラグを立てて再取得を防止
        setDataLoaded(true);
      }
    };

    loadProfile();
  }, []); // 空の依存配列で初回のみ実行

  // 入力フィールドの変更ハンドラ
  const handleChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      // エラーをクリア
      if (formErrors[name]) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  // フォームのバリデーション
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // 報酬額のチェック（必須）
    if (!formData.reservation_fee) {
      errors.reservation_fee = '報酬額は必須です';
    }
    
    // デリバリー用報酬額のチェック（必須）
    if (!formData.reservation_fee_deli) {
      errors.reservation_fee_deli = 'デリバリー用報酬額は必須です';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // ユーザーIDを取得
      const userId = globalThis.user?.userId;
      
      if (!userId) {
        console.error('ユーザーIDの取得に失敗しました');
        return;
      }
      
      // 更新するデータを準備（ユーザーIDと予約料金のみ）
      const updateData: Partial<ProfileData> = {
        cast_id: userId,
        reservation_fee: formData.reservation_fee,
        reservation_fee_deli: formData.reservation_fee_deli, // デリバリー用予約料金を追加
      };
      
      await updateProfile(updateData);
      setSubmitSuccess(true);
      
      // 成功メッセージを表示して、少し待ってから閉じる
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('ギャラ設定更新エラー:', error);
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      {/* エラーメッセージ */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* 成功メッセージ */}
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ギャラ設定を更新しました
        </Alert>
      )}
      
      {/* データ読み込み中 */}
      {!dataLoaded && loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
              ギャラ設定
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              1時間あたりの報酬額を設定してください。
            </Typography>
          </Grid>
          
          {/* 報酬額 */}
          <Grid item xs={12} sx={{ mb: 2 }}>
            <FormControl fullWidth required error={!!formErrors.reservation_fee}>
              <InputLabel id="reservation-fee-label">1時間あたりの報酬額</InputLabel>
              <Select
                labelId="reservation-fee-label"
                name="reservation_fee"
                value={formData.reservation_fee?.toString() || ''}
                onChange={handleChange}
                label="1時間あたりの報酬額"
                sx={{ backgroundColor: 'white' }}
              >
                {feeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label} P
                  </MenuItem>
                ))}
              </Select>
              {formErrors.reservation_fee && (
                <FormHelperText>{formErrors.reservation_fee}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          {/* デリバリー用報酬額 */}
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!formErrors.reservation_fee_deli}>
              <InputLabel id="reservation-fee-deli-label">デリバリー時の1時間あたり報酬額</InputLabel>
              <Select
                labelId="reservation-fee-deli-label"
                name="reservation_fee_deli"
                value={formData.reservation_fee_deli?.toString() || ''}
                onChange={handleChange}
                label="デリバリー時の1時間あたり報酬額"
                sx={{ backgroundColor: 'white' }}
              >
                {deliOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label} P
                  </MenuItem>
                ))}
              </Select>
              {formErrors.reservation_fee_deli && (
                <FormHelperText>{formErrors.reservation_fee_deli}</FormHelperText>
              )}
            </FormControl>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              ※ 報酬額は税込み表示となります
            </Typography>
          </Grid>
          
          {/* ボタン */}
          <Grid item xs={12} display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ 
                width: '48%',
                borderColor: theme.palette.grey[300],
                color: theme.palette.text.primary
              }}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ 
                width: '48%',
                backgroundColor: '#FF80AB',
                '&:hover': {
                  backgroundColor: '#FF4081',
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : '保存'}
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default FeeSettingForm;
