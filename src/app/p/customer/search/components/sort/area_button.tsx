import React from 'react';
import { Button } from '@mui/material';

interface AreaButtonProps {
  prefectureName: string | null;
}

const AreaButton: React.FC<AreaButtonProps> = ({ prefectureName }) => {
  return (
    <Button variant="outlined" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md px-4 text-sm h-8 min-w-[80px] whitespace-nowrap">
      {prefectureName ? `${prefectureName}` : "未設定"}
    </Button>
  );
};

export default AreaButton;
