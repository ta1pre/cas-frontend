import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Typography, Box } from '@mui/material';
import { Station } from '../api/useFetchStation';
import { useStationSuggest } from '../api/useStationSuggest';

interface StationAutocompleteProps {
  value?: string;
  stationId?: number;
  onChange: (value: string, stationId?: number) => void;
  label?: string;
  helperText?: string;
  required?: boolean;
}

const StationAutocomplete: React.FC<StationAutocompleteProps> = ({
  value = '',
  stationId,
  onChange,
  label = '最寄り駅',
  helperText = '最寄り駅名を入力してください',
  required = false,
}) => {
  const {
    query,
    stations,
    loading,
    error,
    open,
    setOpen,
    handleInputChange,
    handleSelectStation,
  } = useStationSuggest('');

  // ユーザーがフィールドとインタラクションしたかどうかを追跡
  const [userInteracted, setUserInteracted] = useState(false);

  // 外部から渡されるvalueが変更されたらqueryを更新
  useEffect(() => {
    if (value !== query) {
      handleInputChange(value);
    }
  }, [value]);

  // クエリ変更時に親コンポーネントに値を通知
  const handleChange = (value: string) => {
    handleInputChange(value);
    onChange(value, undefined);
  };

  // 駅選択時の処理
  const handleSelect = (station: Station | null) => {
    if (station) {
      const stationName = station.name.includes(':') 
        ? station.name.split(':')[1].trim() 
        : station.name;
      
      onChange(stationName, station.id);
    }
  };

  return (
    <Autocomplete
      freeSolo
      open={open && userInteracted} // ユーザーが操作した場合のみサジェストを表示
      onOpen={() => {
        // ユーザーがフィールドをクリックしたことを記録
        setUserInteracted(true);
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => {
        if (typeof option === 'string' && typeof value === 'string') {
          return option === value;
        }
        if (typeof option !== 'string' && typeof value !== 'string') {
          return option.id === value.id;
        }
        return false;
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        
        const stationName = option.name.includes(':') 
          ? option.name.split(':')[1].trim() 
          : option.name;
          
        return stationName;
      }}
      options={stations}
      loading={loading}
      inputValue={query}
      onInputChange={(_, newInputValue) => handleChange(newInputValue)}
      onChange={(_, newValue) => {
        if (typeof newValue === 'string') {
          handleChange(newValue);
        } else {
          handleSelect(newValue);
        }
      }}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <li key={option.id || key} {...otherProps}>
            {typeof option === 'string' ? option : option.name}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          helperText={error ? '駅情報の取得に失敗しました' : helperText}
          error={!!error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default StationAutocomplete;
