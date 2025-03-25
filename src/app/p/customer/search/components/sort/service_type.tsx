import React from 'react';
import { Button } from '@mui/material';
import { useFiltersState } from '../search_options/state/FiltersState';

interface ServiceTypeButtonProps {
  label: string;
  value: string;
  otherButtonValue: string; // もう一方のボタンのvalue
}

const ServiceTypeButton: React.FC<ServiceTypeButtonProps> = ({ label, value, otherButtonValue }) => {
  // FiltersStateから状態と更新関数を取得（directUpdateFilter新関数を使用）
  const { appliedFilters, directUpdateFilter } = useFiltersState();
  
  // 表示のための選択状態を決定（UI表示用）
  const isChecked = 
    appliedFilters['cast_type'] === value || 
    appliedFilters['cast_type'] === 'AB' || 
    (appliedFilters['cast_type'] && appliedFilters['cast_type'] !== "__no_selection__" && 
     appliedFilters['cast_type'].split(',').includes(value));
  
  // クリック時のハンドラー
  const handleClick = () => {
    // 計算すべき現在の値（適用済みフィルターから直接取得）
    const currentFilterValue = appliedFilters['cast_type'] || "__no_selection__";
    
    // 次のフィルター値を計算
    let newFilterValue;
    
    if (currentFilterValue === "__no_selection__") {
      // 何も選択されていない状態から選択する場合
      newFilterValue = value;
    } else if (currentFilterValue === value) {
      // 自分自身が選択されている場合は解除
      newFilterValue = "__no_selection__";
    } else if (currentFilterValue === otherButtonValue) {
      // 他方が選択されている場合は両方選択状態へ
      newFilterValue = "AB";
    } else if (currentFilterValue === "AB") {
      // 両方選択されている状態から自分を解除
      newFilterValue = otherButtonValue;
    } else {
      // その他の場合（カンマ区切りのリストなど）
      const values = currentFilterValue.split(',');
      if (values.includes(value)) {
        // 自分が含まれていたら除外
        const newValues = values.filter((v: string) => v !== value);
        newFilterValue = newValues.length > 0 ? newValues.join(',') : "__no_selection__";
      } else {
        // 含まれていなかったら追加
        values.push(value);
        // A と B の両方が含まれていたら AB に
        if (values.includes('A') && values.includes('B')) {
          newFilterValue = "AB";
        } else {
          newFilterValue = values.join(',');
        }
      }
    }
    
    // 新しいフィルター値をダイレクトに適用（selectedとappliedを同時に更新）
    directUpdateFilter('cast_type', newFilterValue);
  };

  return (
    <Button
      variant="contained"
      sx={{
        textTransform: 'none',
        backgroundColor: isChecked ? '#ff4081' : '#9e9e9e',
        '&:hover': {
          backgroundColor: isChecked ? '#c60055' : '#707070',
        },
        fontWeight: 'bold',
        color: 'white',
        margin: '0 4px',
        boxShadow: isChecked ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
        border: isChecked ? '2px solid #ff4081' : 'none'
      }}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};

interface ServiceTypeProps {
    castTypeOptions: { label: string; value: string }[];
}

const ServiceType: React.FC<ServiceTypeProps> = ({ castTypeOptions }) => {
    return (
        <>
            {castTypeOptions.filter(option => option.value !== 'AB').map((option) => (
                <ServiceTypeButton
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    otherButtonValue={option.value === 'A' ? 'B' : 'A'}
                />
            ))}
        </>
    )
};

export default ServiceType;
