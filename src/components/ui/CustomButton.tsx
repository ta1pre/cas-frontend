'use client';

import React from 'react';
import { Button } from '@mui/material';

interface CustomButtonProps {
  onClick: () => void;
  label: string;
  variant?: 'contained' | 'outlined';
  color?: 'primary' | 'secondary' | 'error' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export default function CustomButton({
  onClick,
  label,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
}: CustomButtonProps) {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      sx={{
        px: 4,
        py: 1.5,
        borderRadius: '8px',
        fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
        fontWeight: 'bold',
      }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
