import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, SelectChangeEvent } from '@mui/material';
import { PREFECTURES } from '../constants/prefectures';

interface PrefectureSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  name?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  error?: boolean;
}

/**
 * 都道府県選択コンポーネント
 */
const PrefectureSelect: React.FC<PrefectureSelectProps> = ({
  value,
  onChange,
  name = 'prefecture',
  label = '都道府県',
  helperText,
  required = false,
  error = false,
}) => {
  // valueがnullまたはundefinedの場合のSelectの表示値
  const displayValue = value || '';

  return (
    <FormControl fullWidth variant="outlined" error={error} required={required}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        id={name}
        name={name}
        value={displayValue}
        onChange={onChange}
        label={label}
      >
        {/* 空選択項目 */}
        <MenuItem value="">
          <em>選択してください</em>
        </MenuItem>
        
        {/* 都道府県リスト */}
        {PREFECTURES.map((prefecture) => (
          <MenuItem key={prefecture.id} value={String(prefecture.id)}>
            {prefecture.name}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default PrefectureSelect;
