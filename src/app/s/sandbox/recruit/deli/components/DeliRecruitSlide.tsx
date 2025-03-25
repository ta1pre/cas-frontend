'use client';

import { Box, Typography } from '@mui/material';
import React from 'react';

interface DeliRecruitSlideProps {
  bgGradient: string;
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  buttonAreaHeight: number;
}

export default function DeliRecruitSlide({
  bgGradient,
  title,
  subTitle,
  children,
  buttonAreaHeight,
}: DeliRecruitSlideProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: bgGradient,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 3,
        boxSizing: 'border-box',
        pb: `100px`,
      }}
    >
      <Box 
        sx={{ 
          maxWidth: '640px', 
          width: '100%', 
          px: 2, 
          boxSizing: 'border-box',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {title && (
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            {title}
            {subTitle && <Box component="span" sx={{ color: '#FF80AB' }}>{subTitle}</Box>}
          </Typography>
        )}
        {children}
      </Box>
    </Box>
  );
} 