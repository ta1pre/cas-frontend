'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
            

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
  
                <Box sx={{ width: '100%', maxWidth: '600px' }}>
                    {children}
                </Box>
          
    );
}
