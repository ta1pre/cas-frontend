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
 * u90fdu9053u5e9cu770cu9078u629eu30b3u30f3u30ddu30fcu30cdu30f3u30c8
 */
const PrefectureSelect: React.FC<PrefectureSelectProps> = ({
  value,
  onChange,
  name = 'prefecture',
  label = 'u90fdu9053u5e9cu770c',
  helperText,
  required = false,
  error = false,
}) => {
  // valueu304cu5fc5u305aamuiu306eSelectu306eu578bu306bu9069u5408u3059u308bu3088u3046u306bu6587u5b57u5217u5316
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
        {/* u7a7au9078u629eu9805u76ee */}
        <MenuItem value="">
          <em>u9078u629eu3057u3066u304fu3060u3055u3044</em>
        </MenuItem>
        
        {/* u90fdu9053u5e9cu770cu30eau30b9u30c8 */}
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
