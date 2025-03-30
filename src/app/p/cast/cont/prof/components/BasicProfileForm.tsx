import React, { useState, useEffect, ReactNode } from 'react';
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
  reservation_fee: '',
  self_introduction: '',
  dispatch_prefecture: '',
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
  
  // プロフィールデータの取得
  useEffect(() => {
    // データが既にロードされている場合は再取得しない
    if (dataLoaded) return;
    
    const loadProfile = async () => {
      try {
        const profileData = await fetchProfile();
        
        console.log('取得したプロフィールデータ:', profileData);
        
        // support_areaの値をdispatch_prefectureに設定
        if (profileData.support_area) {
          console.log('support_areaの値:', profileData.support_area);
          console.log('現在のdispatch_prefectureの値:', profileData.dispatch_prefecture);
          
          // support_areaの値が数値の場合、dispatch_prefectureに数値を設定
          if (!isNaN(Number(profileData.support_area))) {
            profileData.dispatch_prefecture = Number(profileData.support_area);
            console.log('dispatch_prefectureの値を数値に設定:', profileData.dispatch_prefecture);
          } else {
            profileData.dispatch_prefecture = profileData.support_area;
            console.log('dispatch_prefectureの値を文字列に設定:', profileData.dispatch_prefecture);
          }
        }
        
        setFormData(profileData);
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>, child?: ReactNode) => {
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
  };

  // 駅選択の変更ハンドラ
  const handleStationChange = (stationName: string, stationId?: number) => {
    setFormData((prev) => ({
      ...prev,
      station_name: stationName,
      dispatch_prefecture: stationId ? String(stationId) : prev.dispatch_prefecture // 駅IDをdispatch_prefectureに設定
    }));
  };

  // フォームのバリデーション
  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // 名前は必須
    if (!formData.name) {
      errors.name = '名前は必須です';
    }
    
    // 年齢は数値
    if (formData.age && isNaN(Number(formData.age))) {
      errors.age = '年齢は数値で入力してください';
    }
    
    // 身長は数値
    if (formData.height && isNaN(Number(formData.height))) {
      errors.height = '身長は数値で入力してください';
    }
    
    // バストは数値
    if (formData.bust && isNaN(Number(formData.bust))) {
      errors.bust = 'バストは数値で入力してください';
    }
    
    // ウエストは数値
    if (formData.waist && isNaN(Number(formData.waist))) {
      errors.waist = 'ウエストは数値で入力してください';
    }
    
    // ヒップは数値
    if (formData.hip && isNaN(Number(formData.hip))) {
      errors.hip = 'ヒップは数値で入力してください';
    }
    
    // 予約料金は数値
    if (formData.reservation_fee && isNaN(Number(formData.reservation_fee))) {
      errors.reservation_fee = '予約料金は数値で入力してください';
    }
    
    // 都道府県は必須
    if (!formData.dispatch_prefecture) {
      errors.dispatch_prefecture = '都道府県は必須です';
    }
    
    return errors;
  };

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // フォームデータの整形
      const submissionData = { ...formData };
      
      // 数値に変換すべきフィールドの処理
      ['age', 'height', 'bust', 'waist', 'hip', 'reservation_fee'].forEach(field => {
        const key = field as keyof ProfileData;
        if (submissionData[key]) {
          // アサーションを使用して数値に変換
          submissionData[key] = Number(submissionData[key]) as any;
        }
      });
      
      // dispatch_prefectureの値をsupport_areaにもコピー
      // dispatch_prefectureは都道府県IDなので、そのままsupport_areaにコピー
      if (submissionData.dispatch_prefecture) {
        submissionData.support_area = String(submissionData.dispatch_prefecture);
        console.log('support_areaに設定する都道府県ID:', submissionData.support_area);
      }
      
      await updateProfile(submissionData);
      setSubmitSuccess(true);
      
      // 成功メッセージを表示した後、フォームを閉じる
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
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
      {loading && !dataLoaded && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* プロフィールフォーム */}
      {(!loading || dataLoaded) && (
        <>
          {/* 基本情報 */}
          <Typography variant="h6" sx={{ mb: 2 }}>基本情報</Typography>
          <Grid container spacing={2}>
            {/* 名前 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="名前"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            
            {/* 年齢 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="年齢"
                name="age"
                type="number"
                value={formData.age || ''}
                onChange={handleChange}
                error={!!formErrors.age}
                helperText={formErrors.age}
                required
                InputProps={{ inputProps: { min: 18 } }}
              />
            </Grid>
          </Grid>
          
          {/* スリーサイズ・身長 */}
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>スリーサイズ・身長</Typography>
          <Grid container spacing={2}>
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
                helperText={formErrors.height || '例: 165'}
                InputProps={{ inputProps: { min: 140, max: 200 } }}
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
                InputProps={{ inputProps: { min: 70, max: 120 } }}
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
                helperText="例: D"
              />
            </Grid>
            
            {/* ウエスト */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ウエスト (cm)"
                name="waist"
                type="number"
                value={formData.waist || ''}
                onChange={handleChange}
                error={!!formErrors.waist}
                helperText={formErrors.waist}
                InputProps={{ inputProps: { min: 50, max: 100 } }}
              />
            </Grid>
            
            {/* ヒップ */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ヒップ (cm)"
                name="hip"
                type="number"
                value={formData.hip || ''}
                onChange={handleChange}
                error={!!formErrors.hip}
                helperText={formErrors.hip}
                InputProps={{ inputProps: { min: 70, max: 120 } }}
              />
            </Grid>
          </Grid>
          
          {/* その他の情報 */}
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>その他の情報</Typography>
          <Grid container spacing={2}>
            {/* 出身地 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="出身地"
                name="birthplace"
                value={formData.birthplace || ''}
                onChange={handleChange}
                helperText="例: 東京都"
              />
            </Grid>
            
            {/* 血液型 */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="blood-type-label">血液型</InputLabel>
                <Select
                  labelId="blood-type-label"
                  name="blood_type"
                  value={formData.blood_type || ''}
                  onChange={handleChange}
                  label="血液型"
                >
                  <MenuItem value=""><em>選択してください</em></MenuItem>
                  {BLOOD_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>{type}型</MenuItem>
                  ))}
                </Select>
                <FormHelperText>血液型を選択してください</FormHelperText>
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
                helperText="例: 映画鑑賞、料理"
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
                helperText="例: OL、学生"
              />
            </Grid>
          </Grid>
          
          {/* 料金・エリア */}
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>料金・エリア</Typography>
          <Grid container spacing={2}>
            {/* 予約料金 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="予約料金（円）"
                name="reservation_fee"
                type="number"
                value={formData.reservation_fee || ''}
                onChange={handleChange}
                error={!!formErrors.reservation_fee}
                helperText={formErrors.reservation_fee || '例: 10000'}
                InputProps={{ inputProps: { min: 0, step: 100 } }}
              />
            </Grid>
            
            {/* 都道府県選択 */}
            <Grid item xs={12} sm={6}>
              <PrefectureSelect
                value={formData.dispatch_prefecture ? String(formData.dispatch_prefecture) : ''}
                onChange={handlePrefectureChange}
                error={!!formErrors.dispatch_prefecture}
                helperText={formErrors.dispatch_prefecture}
                required
              />
            </Grid>
            
            {/* 駅検索 */}
            <Grid item xs={12} sm={6}>
              <StationAutocomplete
                value={formData.station_name || ''}
                prefectureId={formData.dispatch_prefecture && !isNaN(Number(formData.dispatch_prefecture)) ? Number(formData.dispatch_prefecture) : undefined}
                onChange={handleStationChange}
                label="最寄り駅"
              />
            </Grid>
          </Grid>
          
          {/* 自己紹介 */}
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>自己紹介</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="自己紹介"
                name="self_introduction"
                value={formData.self_introduction || ''}
                onChange={handleChange}
                multiline
                rows={6}
                helperText="あなたの魅力や特徴を書いてください"
              />
            </Grid>
          </Grid>
          
          {/* 送信ボタン */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? '保存中...' : '保存する'}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default BasicProfileForm;
