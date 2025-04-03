import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress, 
  Snackbar, 
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
import PrefectureSelect from './PrefectureSelect';
import StationAutocomplete from './StationAutocomplete';
import { prefectureMap } from '@/app/p/customer/search/config/prefectures';

// 血液型の選択肢
const BLOOD_TYPES = ['A', 'B', 'O', 'AB'];

// 基本プロフィールフォームのProps
interface BasicProfileFormProps {
  onClose: () => void;
}

const initialFormState: ProfileData = {
  name: '',
  age: '',
  height: '',
  bust: '',
  cup: '',
  waist: '',
  hip: '',
  birthplace: '',
  blood_type: '',
  hobby: '',
  job: '',
  self_introduction: '',
  dispatch_prefecture: '',
  support_area: '',
  station_name: '',
};

/**
 * 基本プロフィール編集フォームコンポーネント
 */
const BasicProfileForm: React.FC<BasicProfileFormProps> = ({ onClose }) => {
  const { fetchProfile, updateProfile, loading, error } = useProfileApi();
  const [formData, setFormData] = useState<ProfileData>(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  // サポートエリアの都道府県IDから都道府県名に変換する関数
  const formatSupportArea = (supportArea: string | undefined): string => {
    if (!supportArea) return '未設定';
    
    // カンマで区切られた都道府県IDを配列に変換
    const ids = supportArea.split(',').map(id => id.trim()).filter(Boolean);
    
    // 各IDを都道府県名に変換
    const prefectureNames = ids.map(id => {
      const numId = Number(id);
      // 1-47の範囲内の場合は都道府県IDとして扱う
      if (numId >= 1 && numId <= 47 && prefectureMap[numId]) {
        return prefectureMap[numId];
      }
      // それ以外の場合はそのまま返す（駅IDなど）
      return `ID: ${id}`;
    });
    
    return prefectureNames.join('、');
  };

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
        console.log('サポートエリア名:', profileData?.support_area_names);
        
        if (profileData) {
          setFormData(profileData);
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 都道府県選択の変更ハンドラ
  const handlePrefectureChange = (event: SelectChangeEvent<string>) => {
    // 文字列IDを数値IDに変換して設定
    const prefectureId = event.target.value ? Number(event.target.value) : '';
    setFormData((prev) => ({ ...prev, dispatch_prefecture: prefectureId }));
    
    // 都道府県が変更されたので駅検索をリセット
    setFormData((prev) => ({ ...prev, station_name: '' }));
  };

  // 駅選択の変更ハンドラ
  const handleStationChange = (stationName: string, stationId?: number) => {
    setFormData((prev) => ({
      ...prev,
      station_name: stationName,
      dispatch_prefecture: stationId ? String(stationId) : prev.dispatch_prefecture // 駅IDをdispatch_prefectureに設定
    }));
  };

  // サポートエリア都道府県選択の変更ハンドラ
  const handleSupportAreaPrefectureChange = (event: SelectChangeEvent<string>) => {
    const prefectureId = event.target.value ? event.target.value : '';
    setFormData((prev) => ({ ...prev, support_area: prefectureId }));
  };

  // フォームのバリデーション
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // 名前が必須
    if (!formData.name) {
      errors.name = '名前は必須です';
    }
    
    // 年齢のチェック（必須かつ数値）
    if (!formData.age) {
      errors.age = '年齢は必須です';
    } else if (isNaN(Number(formData.age))) {
      errors.age = '年齢は数値で入力してください';
    }
    
    // 身長のチェック（任意だが入力されている場合は数値）
    if (formData.height && isNaN(Number(formData.height))) {
      errors.height = '身長は数値で入力してください';
    }
    
    // バストのチェック（任意だが入力されている場合は数値）
    if (formData.bust && isNaN(Number(formData.bust))) {
      errors.bust = 'バストは数値で入力してください';
    }
    
    // ウエストのチェック（任意だが入力されている場合は数値）
    if (formData.waist && isNaN(Number(formData.waist))) {
      errors.waist = 'ウエストは数値で入力してください';
    }
    
    // ヒップのチェック（任意だが入力されている場合は数値）
    if (formData.hip && isNaN(Number(formData.hip))) {
      errors.hip = 'ヒップは数値で入力してください';
    }
    
    // 都道府県は必須
    if (!formData.dispatch_prefecture) {
      errors.dispatch_prefecture = '都道府県は必須です';
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
      await updateProfile(formData);
      setSubmitSuccess(true);
      
      // 成功メッセージを表示して、少し待ってから閉じる
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
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
          プロフィールを更新しました
        </Alert>
      )}
      
      {/* データ読み込み中 */}
      {!dataLoaded && loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {/* 名前 */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="名前"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              variant="outlined"
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          
          {/* 年齢 */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="年齢"
              name="age"
              type="number"
              value={formData.age || ''}
              onChange={handleChange}
              error={!!formErrors.age}
              helperText={formErrors.age}
              InputProps={{ inputProps: { min: 18 } }}
              variant="outlined"
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          
          {/* 身長 */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="身長 (cm)"
              name="height"
              type="number"
              value={formData.height || ''}
              onChange={handleChange}
              error={!!formErrors.height}
              helperText={formErrors.height}
              InputProps={{ inputProps: { min: 0 } }}
              variant="outlined"
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          
          {/* バスト */}
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="バスト (cm)"
              name="bust"
              type="number"
              value={formData.bust || ''}
              onChange={handleChange}
              error={!!formErrors.bust}
              helperText={formErrors.bust}
              InputProps={{ inputProps: { min: 0 } }}
              variant="outlined"
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          
          {/* カップ */}
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="カップ"
              name="cup"
              value={formData.cup || ''}
              onChange={handleChange}
              variant="outlined"
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          
          {/* ウエスト */}
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="ウエスト (cm)"
              name="waist"
              type="number"
              value={formData.waist || ''}
              onChange={handleChange}
              error={!!formErrors.waist}
              helperText={formErrors.waist}
              InputProps={{ inputProps: { min: 0 } }}
              variant="outlined"
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          
          {/* ヒップ */}
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="ヒップ (cm)"
              name="hip"
              type="number"
              value={formData.hip || ''}
              onChange={handleChange}
              error={!!formErrors.hip}
              helperText={formErrors.hip}
              InputProps={{ inputProps: { min: 0 } }}
              variant="outlined"
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          
          {/* 出身地 */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="出身地"
              name="birthplace"
              value={formData.birthplace || ''}
              onChange={handleChange}
              variant="outlined"
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          
          {/* 血液型 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" sx={{ backgroundColor: 'white' }}>
              <InputLabel id="blood-type-label">血液型</InputLabel>
              <Select
                labelId="blood-type-label"
                id="blood_type"
                name="blood_type"
                value={formData.blood_type || ''}
                onChange={(event) => {
                  const { name, value } = event.target as { name: string; value: string };
                  setFormData((prev) => ({ ...prev, [name]: value }));
                }}
                label="血液型"
              >
                <MenuItem value=""><em>選択してください</em></MenuItem>
                {BLOOD_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* 趣味 */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="趣味"
              name="hobby"
              value={formData.hobby || ''}
              onChange={handleChange}
              variant="outlined"
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          
          {/* 職業 */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="職業"
              name="job"
              value={formData.job || ''}
              onChange={handleChange}
              variant="outlined"
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          
          {/* サポートエリア都道府県 */}
          <Grid item xs={12} sm={6}>
            <PrefectureSelect
              value={String(formData.support_area || '')}
              onChange={handleSupportAreaPrefectureChange}
              label="サポートエリア（都道府県）"
            />
          </Grid>
          
          {/* 駅検索 */}
          <Grid item xs={12}>
            <StationAutocomplete
              value={formData.station_name || ''}
              stationId={formData.dispatch_prefecture && !isNaN(Number(formData.dispatch_prefecture)) ? Number(formData.dispatch_prefecture) : undefined}
              onChange={handleStationChange}
              label="活動拠点の駅"
            />
          </Grid>
          
          {/* 自己紹介 */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="自己紹介"
              name="self_introduction"
              value={formData.self_introduction || ''}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          
          {/* ボタン */}
          <Grid item xs={12} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ width: '48%' }}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: '48%' }}
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

export default BasicProfileForm;
